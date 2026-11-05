#!/usr/bin/env node
// Counts simulated reactions in code (the model only explains them) and decides the verdict by fixed rules.
//   node tally.mjs <run-dir>            → writes <run-dir>/tally.json
//   node tally.mjs <run-dir> --feed 1   → prints a round-1 feed (replies other personas will see in round 2)
// actions.jsonl lines: { run, round, idea, persona, action, objection?, price_ok?, alternative?, quote? }
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ACTIONS = ['ignore', 'scroll', 'like', 'reply', 'share', 'try', 'pay', 'object']
export const OBJECTIONS = ['price', 'trust', 'privacy', 'effort', 'no-need', 'already-solved', 'quality', 'other']
// funnel stages: saw (everyone) → stopped (anything but ignore/scroll) → engaged (like/reply/share/try/pay) → tried (try/pay) → pay
const STOP = new Set(['like', 'reply', 'share', 'try', 'pay', 'object'])
const ENGAGE = new Set(['like', 'reply', 'share', 'try', 'pay'])
export const DEFAULT_RULES = { killAttention: 0.15, goTry: 0.2, goPay: 0.06, minCrowd: 20 }

export function parseActions(text) {
  const out = [], bad = []
  for (const [i, line] of text.split('\n').entries()) {
    if (!line.trim()) continue
    try {
      const a = JSON.parse(line)
      if (!ACTIONS.includes(a.action) || !a.persona || !a.idea) { bad.push(i + 1); continue }
      // "would pay" only counts with an accepted price AND a named alternative they'd drop (bias guard)
      if (a.action === 'pay' && !(a.price_ok === true && a.alternative)) a.action = 'try'
      if (a.action === 'object' && !OBJECTIONS.includes(a.objection)) a.objection = 'other'
      out.push({ run: a.run ?? 1, round: a.round ?? 1, ...a })
    } catch { bad.push(i + 1) }
  }
  return { actions: out, bad }
}

const rate = (n, d) => (d ? Math.round((n / d) * 1000) / 1000 : 0)
function funnel(list) {
  const people = new Map() // last action per persona wins within a round
  for (const a of list) people.set(a.persona, a)
  const v = [...people.values()], n = v.length
  const c = s => v.filter(a => s.has(a.action)).length
  return { n, stopped: rate(c(STOP), n), engaged: rate(c(ENGAGE), n), tried: rate(c(new Set(['try', 'pay'])), n), pay: rate(c(new Set(['pay'])), n), objected: rate(c(new Set(['object'])), n) }
}

export function verdictFor(f, rules = DEFAULT_RULES) {
  if (f.n < rules.minCrowd) return 'unclear'
  if (f.stopped < rules.killAttention) return 'kill'
  if (f.tried >= rules.goTry && f.pay >= rules.goPay) return 'go'
  return 'pivot'
}

export function tally(actions, crowd, rules = DEFAULT_RULES) {
  const seg = Object.fromEntries(crowd.map(p => [p.id, p.segment]))
  const ideas = [...new Set(actions.map(a => a.idea))]
  const runs = [...new Set(actions.map(a => a.run))].sort()
  const result = { rules, ideas: {} }
  for (const idea of ideas) {
    const A = actions.filter(a => a.idea === idea)
    const rounds = [...new Set(A.map(a => a.round))].sort()
    const last = Math.max(...rounds)
    const perRun = runs.map(r => { const f = funnel(A.filter(a => a.run === r && a.round === Math.min(last, 2))); return { run: r, ...f, verdict: verdictFor(f, rules) } })
    const main = funnel(A.filter(a => a.run === runs[0] && a.round === Math.min(last, 2)))
    let verdict = verdictFor(main, rules)
    const stable = perRun.every(p => p.verdict === perRun[0].verdict)
    if (!stable) verdict = 'unclear'
    const segments = {}
    for (const s of [...new Set(crowd.map(p => p.segment))]) segments[s] = funnel(A.filter(a => a.run === runs[0] && a.round === Math.min(last, 2) && seg[a.persona] === s))
    const objections = OBJECTIONS.map(o => ({ tag: o, count: A.filter(a => a.run === runs[0] && a.action === 'object' && a.objection === o).length, quotes: A.filter(a => a.run === runs[0] && a.action === 'object' && a.objection === o && a.quote).slice(0, 3).map(a => ({ persona: a.persona, quote: a.quote })) })).filter(o => o.count).sort((a, b) => b.count - a.count)
    const fans = A.filter(a => a.run === runs[0] && (a.action === 'pay' || a.action === 'try') && a.quote).slice(0, 4).map(a => ({ persona: a.persona, quote: a.quote, action: a.action }))
    result.ideas[idea] = {
      verdict, stable, runs: perRun,
      rounds: Object.fromEntries(rounds.map(r => [r, funnel(A.filter(a => a.run === runs[0] && a.round === r))])),
      segments, objections, fans,
      people: Object.fromEntries([...new Map(A.filter(a => a.run === runs[0] && a.round === Math.min(last, 2)).map(a => [a.persona, a])).values()].map(a => [a.persona, { action: a.action, quote: a.quote ?? '' }])),
    }
  }
  const order = { go: 0, pivot: 1, unclear: 2, kill: 3 }
  result.ranking = Object.entries(result.ideas).sort((a, b) => order[a[1].verdict] - order[b[1].verdict] || b[1].runs[0].tried - a[1].runs[0].tried).map(([k]) => k)
  return result
}

export function feed(actions, round = 1, n = 8) { // the replies personas see next round: real replies and objections, mixed
  const pool = actions.filter(a => a.round === round && a.quote && ['reply', 'object', 'share', 'pay', 'try'].includes(a.action))
  const pos = pool.filter(a => a.action !== 'object'), neg = pool.filter(a => a.action === 'object'), out = []
  while (out.length < n && (pos.length || neg.length)) { if (neg.length) out.push(neg.shift()); if (pos.length && out.length < n) out.push(pos.shift()) }
  return out.map(a => ({ idea: a.idea, from: a.persona, said: a.quote }))
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [dir] = process.argv.slice(2); if (!dir) { console.error('usage: tally.mjs <run-dir> [--feed <round>]'); process.exit(2) }
  const { actions, bad } = parseActions(readFileSync(join(dir, 'actions.jsonl'), 'utf8'))
  if (bad.length) console.error(`skipped ${bad.length} invalid line(s): ${bad.slice(0, 10).join(', ')}`)
  const fi = process.argv.indexOf('--feed')
  if (fi > 0) { console.log(JSON.stringify(feed(actions, Number(process.argv[fi + 1] ?? 1)), null, 1)); process.exit(0) }
  const crowd = JSON.parse(readFileSync(join(dir, 'crowd.json'), 'utf8'))
  const rules = existsSync(join(dir, 'rules.json')) ? { ...DEFAULT_RULES, ...JSON.parse(readFileSync(join(dir, 'rules.json'), 'utf8')) } : DEFAULT_RULES
  const t = tally(actions, crowd, rules); writeFileSync(join(dir, 'tally.json'), JSON.stringify(t, null, 1))
  for (const k of t.ranking) { const x = t.ideas[k], f = x.runs[0]; console.log(`${k}: ${x.verdict.toUpperCase()}${x.stable ? '' : ' (runs disagree)'} · stopped ${f.stopped} · tried ${f.tried} · pay ${f.pay} · n ${f.n}`) }
}
