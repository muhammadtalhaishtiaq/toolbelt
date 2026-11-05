#!/usr/bin/env node
// Fails if any server-only value reaches the built output. In CI, set fake canaries (ci-canary-<name>-<8hex>)
// for every secret env var, build, then run: node scripts/scan-bundle.mjs [dist]
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
const dir = process.argv[2] ?? 'dist'
const canaries = Object.entries(process.env).filter(([, v]) => /^ci-canary-[a-z]+-[0-9a-f]{8}$/.test(v ?? ''))
if (!canaries.length) { console.error('scan-bundle: no ci-canary-* env values set; nothing to check (set them in CI).'); process.exit(1) }
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p] })
let hits = 0
for (const f of walk(dir)) { const t = readFileSync(f, 'latin1'); for (const [k, v] of canaries) if (t.includes(v)) { console.error(`LEAK: ${k} found in ${f}`); hits++ } }
if (hits) process.exit(1)
console.log(`scan-bundle: ${canaries.length} canaries, 0 leaks in ${dir}/`)
