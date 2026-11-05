#!/usr/bin/env node
// Builds a structured crowd from world.json with fixed quotas (no model, deterministic with a seed).
//   node graph.mjs <run-dir> [--size 60] [--seed 7]   → writes <run-dir>/crowd.json
// world.json: { segments: [{ id, name, share, budget: [lo, hi], tech: "low|mid|high", current: ["…"], pains: ["…"] }], ... }
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ATTITUDES = ['indifferent', 'skeptic', 'pragmatic', 'curious', 'enthusiast']
// Quota guard: at least 30% skeptic+indifferent, at most 15% enthusiast (synthetic crowds skew positive).
export const ATTITUDE_MIX = { indifferent: 0.2, skeptic: 0.15, pragmatic: 0.3, curious: 0.22, enthusiast: 0.13 }
const AGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']

export function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32) }

export function allocate(total, shares) { // largest remainder; always sums to total
  const sum = shares.reduce((a, b) => a + b, 0) || 1
  const raw = shares.map(s => (s / sum) * total), base = raw.map(Math.floor)
  let left = total - base.reduce((a, b) => a + b, 0)
  raw.map((r, i) => [r - base[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left-- > 0) base[i]++ })
  return base
}

export function buildCrowd(world, size = 60, seed = 7) {
  if (!world?.segments?.length) throw new Error('world.json needs at least one segment')
  const r = rng(seed), pick = a => a[Math.floor(r() * a.length)]
  const perSeg = allocate(size, world.segments.map(s => s.share ?? 1))
  const crowd = []
  world.segments.forEach((seg, si) => {
    const att = allocate(perSeg[si], ATTITUDES.map(a => ATTITUDE_MIX[a]))
    const pool = ATTITUDES.flatMap((a, i) => Array(att[i]).fill(a))
    for (let k = pool.length - 1; k > 0; k--) { const j = Math.floor(r() * (k + 1)); [pool[k], pool[j]] = [pool[j], pool[k]] }
    pool.forEach((attitude, n) => {
      const [lo, hi] = seg.budget ?? [0, 20]
      crowd.push({
        id: `${seg.id}-${String(n + 1).padStart(3, '0')}`, segment: seg.id, attitude,
        age: pick(seg.ages ?? AGES), tech: seg.tech ?? pick(['low', 'mid', 'high']),
        monthly_budget: Math.round(lo + r() * (hi - lo)),
        current: pick(seg.current?.length ? seg.current : ['nothing / does without']),
        pain: pick(seg.pains?.length ? seg.pains : ['none stated']),
        time_poor: r() < 0.5,
      })
    })
  })
  return crowd
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [dir] = process.argv.slice(2); if (!dir) { console.error('usage: graph.mjs <run-dir> [--size N] [--seed S]'); process.exit(2) }
  const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? Number(process.argv[i + 1]) : d }
  const world = JSON.parse(readFileSync(join(dir, 'world.json'), 'utf8'))
  const crowd = buildCrowd(world, arg('--size', 60), arg('--seed', 7))
  writeFileSync(join(dir, 'crowd.json'), JSON.stringify(crowd, null, 1))
  const by = crowd.reduce((m, p) => (m[p.attitude] = (m[p.attitude] ?? 0) + 1, m), {})
  console.log(`crowd: ${crowd.length} personas · ${JSON.stringify(by)}`)
}
