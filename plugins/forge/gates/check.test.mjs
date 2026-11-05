// node --test gates/check.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { runGate, record, openTasks, tasksMissingVerify, pickField } from './check.mjs'

function project(files = {}, cfg = { profile: 'hackathon', ui: false }) {
  const r = mkdtempSync(join(tmpdir(), 'forge-'))
  const sh = (...a) => execFileSync('git', a, { cwd: r, stdio: 'ignore' })
  sh('init', '-q'); sh('config', 'user.email', 't@t'); sh('config', 'user.name', 't')
  mkdirSync(join(r, '.forge'), { recursive: true }); mkdirSync(join(r, 'docs'), { recursive: true })
  writeFileSync(join(r, '.forge/config.json'), JSON.stringify(cfg))
  for (const [p, c] of Object.entries(files)) { mkdirSync(join(r, p, '..'), { recursive: true }); writeFileSync(join(r, p), c) }
  sh('add', '-A'); sh('commit', '-qm', 'init')
  return { r, sh }
}
const green = { ci: () => ({ pass: true, why: 'test' }), url: async () => ({ pass: true, why: '200' }) }

test('open tasks ignore done and [later]', () => {
  assert.equal(openTasks('- [x] T1\n- [ ] T2 a\n- [ ] T3 b [later]').length, 1)
})
test('tasks need a Verify step in their block', () => {
  const md = '## Slice 1\n- [ ] T1 build a\n  Verify: run x\n- [ ] T2 build b\n  Files: y\n- [x] T3 done'
  assert.deepEqual(tasksMissingVerify(md), ['- [ ] T2 build b'])
})
test('plan is blocked while [NEEDS CLARIFICATION] remains', async () => {
  const { r } = project({ 'docs/PRD.md': 'Auth: [NEEDS CLARIFICATION: which providers?]' })
  const res = await runGate(r, 'plan', green)
  assert.equal(res.pass, false)
  assert.ok(res.results.find(x => x.id === 'no-open-questions' && !x.pass))
})
test('quick profile skips spec gates that only apply to bigger profiles', async () => {
  const { r } = project({}, { profile: 'quick' })
  assert.equal((await runGate(r, 'plan', green)).pass, true)
})
test('ship blocked when code changed after the last secure pass', async () => {
  const { r, sh } = project({ 'docs/TASKS.md': '- [x] T1\n', 'docs/DEPLOY.md': 'Caps sized for demo day', 'src/a.js': '1' })
  record(r, { cmd: 'secure', result: 'pass' }); record(r, { cmd: 'ui', scope: 'audit', result: 'pass' })
  writeFileSync(join(r, '.forge/findings.json'), '[]')
  assert.equal((await runGate(r, 'ship', green)).pass, true)
  writeFileSync(join(r, 'src/a.js'), '2'); sh('commit', '-qam', 'change')
  const res = await runGate(r, 'ship', green)
  assert.equal(res.pass, false)
  assert.match(res.results.find(x => x.id === 'secure-fresh').why, /code changed/)
})
test('docs-only change keeps the secure pass fresh', async () => {
  const { r, sh } = project({ 'docs/TASKS.md': '- [x] T1\n', 'docs/DEPLOY.md': 'caps set', 'src/a.js': '1' })
  record(r, { cmd: 'secure', result: 'pass' }); writeFileSync(join(r, '.forge/findings.json'), '[]')
  writeFileSync(join(r, 'docs/LOG.md'), 'note'); sh('add', '-A'); sh('commit', '-qm', 'docs')
  assert.equal((await runGate(r, 'ship', green)).results.find(x => x.id === 'secure-fresh').pass, true)
})
test('open high finding blocks ship; a skip with reason opens it for this commit only', async () => {
  const { r, sh } = project({ 'docs/TASKS.md': '- [x] T1\n', 'docs/DEPLOY.md': 'caps reviewed', 'src/a.js': '1' })
  record(r, { cmd: 'secure', result: 'pass' })
  writeFileSync(join(r, '.forge/findings.json'), JSON.stringify([{ id: 'R3', severity: 'high', status: 'open' }]))
  assert.equal((await runGate(r, 'ship', green)).pass, false)
  record(r, { type: 'skip', gate: 'ship', req: 'no-high-findings', reason: 'accepted risk for demo' })
  assert.equal((await runGate(r, 'ship', green)).pass, true)
  writeFileSync(join(r, 'docs/x.md'), 'y'); sh('add', '-A'); sh('commit', '-qm', 'next')
  assert.equal((await runGate(r, 'ship', green)).pass, false)
})
test('red CI blocks ship', async () => {
  const { r } = project({ 'docs/TASKS.md': '- [x] T1\n' })
  const res = await runGate(r, 'ship', { ...green, ci: () => ({ pass: false, why: 'CI red: typecheck' }) })
  assert.equal(res.results.find(x => x.id === 'ci-green').pass, false)
})
test('UI project needs an approved mockup before build', async () => {
  const { r } = project({ 'docs/TASKS.md': '- [ ] T1 page\n  Verify: open it' }, { profile: 'product', ui: true })
  assert.equal((await runGate(r, 'build', green)).pass, false)
  const { r: r2 } = project({ 'docs/TASKS.md': '- [ ] T1 page\n  Verify: open it', 'docs/DECISIONS.md': '## 2026-11-05 — Home mockup approved' }, { profile: 'product', ui: true })
  assert.equal((await runGate(r2, 'build', green)).pass, true)
})
test('STATUS fields parse with or without bold', () => {
  assert.equal(pickField('**Stage:** 3 Build\n**Next:** /forge:build T7', 'Stage'), '3 Build')
  assert.equal(pickField('**Stage:** 3 Build\n**Next:** /forge:build T7', 'Next'), '/forge:build T7')
  assert.equal(pickField('Stage: 1 Shape', 'Stage'), '1 Shape')
  assert.equal(pickField('**Stage**: 2 Spec', 'Stage'), '2 Spec')
})
