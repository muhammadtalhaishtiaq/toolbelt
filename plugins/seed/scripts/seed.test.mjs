// node --test plugins/seed/scripts/seed.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildCrowd, allocate } from './graph.mjs'
import { parseActions, tally, verdictFor, feed } from './tally.mjs'
import { render, esc } from './board.mjs'

const world = { segments: [{ id: 'a', name: 'Parents', share: 2, budget: [0, 20] }, { id: 'b', name: 'Students', share: 1, budget: [0, 5] }] }

test('allocate always sums to the total', () => {
  assert.equal(allocate(61, [2, 1, 1]).reduce((x, y) => x + y), 61)
  assert.deepEqual(allocate(3, [1, 1, 1]), [1, 1, 1])
})
test('crowd keeps quotas: size, segment shares, ≥30% skeptic+indifferent, ≤15% enthusiasts, deterministic', () => {
  const c = buildCrowd(world, 60, 3)
  assert.equal(c.length, 60)
  assert.equal(c.filter(p => p.segment === 'a').length, 40)
  const share = k => c.filter(p => k.includes(p.attitude)).length / c.length
  assert.ok(share(['skeptic', 'indifferent']) >= 0.3)
  assert.ok(share(['enthusiast']) <= 0.15)
  assert.deepEqual(buildCrowd(world, 60, 3), c)
})
test('"would pay" without a price and an alternative is downgraded to "try"; junk lines are reported', () => {
  const { actions, bad } = parseActions('{"persona":"a-001","idea":"x","action":"pay"}\nnot json\n{"persona":"a-002","idea":"x","action":"pay","price_ok":true,"alternative":"paper list"}')
  assert.deepEqual(actions.map(a => a.action), ['try', 'pay'])
  assert.deepEqual(bad, [2])
})
test('verdict rules: kill on low attention, go needs try and pay, small crowds are unclear', () => {
  assert.equal(verdictFor({ n: 50, stopped: 0.1, tried: 0, pay: 0 }), 'kill')
  assert.equal(verdictFor({ n: 50, stopped: 0.5, tried: 0.3, pay: 0.08 }), 'go')
  assert.equal(verdictFor({ n: 50, stopped: 0.5, tried: 0.3, pay: 0.01 }), 'pivot')
  assert.equal(verdictFor({ n: 10, stopped: 0.9, tried: 0.9, pay: 0.9 }), 'unclear')
})
function sim(crowd, run, payShare) {
  return crowd.map((p, i) => ({ run, round: 2, idea: 'x', persona: p.id, ...(i < crowd.length * payShare ? { action: 'pay', price_ok: true, alternative: 'notes app', quote: 'I would pay' } : i < crowd.length * 0.5 ? { action: 'try', quote: 'maybe' } : { action: 'object', objection: 'price', quote: 'too pricey' }) }))
}
test('runs that disagree make the verdict unclear', () => {
  const crowd = buildCrowd(world, 40, 1)
  assert.equal(tally(sim(crowd, 1, 0.1), crowd).ideas.x.verdict, 'go')
  assert.equal(tally([...sim(crowd, 1, 0.1), ...sim(crowd, 2, 0)], crowd).ideas.x.verdict, 'unclear')
})
test('feed mixes objections and positive replies', () => {
  const f = feed([{ round: 1, idea: 'x', persona: 'p1', action: 'object', quote: 'no' }, { round: 1, idea: 'x', persona: 'p2', action: 'reply', quote: 'yes' }])
  assert.deepEqual(f.map(x => x.said), ['no', 'yes'])
})
test('board escapes persona text and shows the verdict and the simulation warning', () => {
  const crowd = buildCrowd(world, 30, 2)
  const acts = sim(crowd, 1, 0.1); acts[0].quote = '<script>alert(1)</script>'
  const html = render({ brief: { id: 't' }, ideas: [{ id: 'x', name: 'Plant <b>Pal</b>', pitch: 'p' }], world, crowd, tally: tally(acts, crowd) })
  assert.ok(!html.includes('<script>alert(1)'))
  assert.ok(html.includes('Plant &lt;b&gt;Pal&lt;/b&gt;'))
  assert.match(html, /simulation of AI personas, not evidence/)
  assert.match(html, /class="bigstamp">Go</)
  assert.equal(esc('"&'), '&quot;&amp;')
})
