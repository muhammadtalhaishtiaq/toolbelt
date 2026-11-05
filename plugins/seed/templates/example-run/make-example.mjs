// Generates EXAMPLE actions for the demo board (no model calls). node make-example.mjs && node ../../scripts/tally.mjs . && node ../../scripts/board.mjs .
import { writeFileSync, readFileSync } from 'node:fs'
import { buildCrowd, rng } from '../../scripts/graph.mjs'
const world = JSON.parse(readFileSync('world.json', 'utf8')); const crowd = buildCrowd(world, 60, 11); writeFileSync('crowd.json', JSON.stringify(crowd, null, 1))
const like = { leafcheck: { renter: 0.75, hobby: 0.45, gift: 0.6 }, plantswap: { renter: 0.2, hobby: 0.7, gift: 0.1 }, waterbot: { renter: 0.25, hobby: 0.1, gift: 0.3 } }
const q = { pay: ['Worth a few dollars if it saves my monstera', 'I would drop my reminder app for this'], try: ['I would try it on the fern that is dying', 'Curious if it gets light right'], object: { price: 'Not paying for this, the free app is fine', trust: 'How would a photo know about root rot?', 'no-need': 'I just water on Sundays', privacy: 'Photos of my flat? no' } }
const att = { indifferent: -0.35, skeptic: -0.25, pragmatic: 0, curious: 0.1, enthusiast: 0.25 }
const out = []
for (const run of [1, 2]) { const r = rng(run * 97)
  for (const idea of Object.keys(like)) for (const round of [1, 2, 3]) for (const p of crowd) {
    const s = like[idea][p.segment] + att[p.attitude] + (round === 2 ? 0.05 : 0) - (round === 3 && idea !== 'plantswap' ? 0.12 : 0) + (r() - 0.5) * 0.3
    let a
    if (s < 0.2) a = { action: r() < 0.6 ? 'ignore' : 'scroll' }
    else if (s < 0.35) { const o = ['price', 'trust', 'no-need', 'privacy'][Math.floor(r() * 4)]; a = { action: 'object', objection: o, quote: q.object[o] } }
    else if (s < 0.55) a = { action: ['like', 'reply', 'share'][Math.floor(r() * 3)] }
    else if (s < 0.82 || p.monthly_budget < 2) a = { action: 'try', quote: q.try[Math.floor(r() * 2)] }
    else a = { action: 'pay', price_ok: true, alternative: p.current, quote: q.pay[Math.floor(r() * 2)] }
    out.push(JSON.stringify({ run, round, idea, persona: p.id, ...a }))
  } }
writeFileSync('actions.jsonl', out.join('\n') + '\n'); console.log('example actions', out.length)
