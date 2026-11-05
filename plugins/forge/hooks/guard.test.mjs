// node --test hooks/guard.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pre, post, isEnvFile } from './guard.mjs'
const root = mkdtempSync(join(tmpdir(), 'guard-'))
const denied = o => o?.hookSpecificOutput?.permissionDecision === 'deny'

test('.env files are secret, examples are not', () => {
  assert.ok(isEnvFile('.env') && isEnvFile('app/.env.local') && isEnvFile('.env.production'))
  assert.ok(!isEnvFile('.env.example') && !isEnvFile('src/env.ts'))
})
test('blocks reading .env, allows .env.example', () => {
  assert.ok(denied(pre({ tool_name: 'Read', tool_input: { file_path: '/p/.env.local' } }, root)))
  assert.equal(pre({ tool_name: 'Read', tool_input: { file_path: '/p/.env.example' } }, root), null)
})
test('blocks shell reads and git add of .env', () => {
  assert.ok(denied(pre({ tool_name: 'Bash', tool_input: { command: 'cat .env.local' } }, root)))
  assert.ok(denied(pre({ tool_name: 'Bash', tool_input: { command: 'git add .env' } }, root)))
  assert.equal(pre({ tool_name: 'Bash', tool_input: { command: 'cp .env.example .env.local' } }, root), null)
  assert.ok(denied(pre({ tool_name: 'Bash', tool_input: { command: 'cp .env.local /tmp/x' } }, root)))
  assert.equal(pre({ tool_name: 'Bash', tool_input: { command: 'npm test' } }, root), null)
})
test('blocks writing a real-looking key, allows CI canaries', () => {
  assert.ok(denied(pre({ tool_name: 'Write', tool_input: { file_path: 'src/a.ts', content: 'const k = "AKIAABCDEFGHIJKLMNOP"' } }, root)))
  assert.ok(denied(pre({ tool_name: 'Edit', tool_input: { file_path: 'src/a.ts', old_string: 'x', new_string: 'key: "sk-ant-abcdefghijklmnopqrstuvwxyz123456"' } }, root)))
  assert.equal(pre({ tool_name: 'Write', tool_input: { file_path: 'ci.yml', content: 'META_API_KEY: ci-canary-meta-3f9a1c7e' } }, root), null)
})
test('warns on dangerous patterns only when newly added', () => {
  const r = post({ tool_input: { file_path: 'src/a.ts', old_string: 'el.textContent = x', new_string: 'el.innerHTML = x' } }, root)
  assert.match(r.reason, /innerHTML/)
  assert.equal(post({ tool_input: { file_path: 'src/a.ts', old_string: 'el.innerHTML = x', new_string: 'el.innerHTML = y' } }, root), null)
  assert.match(post({ tool_input: { file_path: 'api/q.ts', content: 'db.query(`SELECT * FROM u WHERE id = ${id}`)' } }, root).reason, /SQL/)
})
test('warns on a weakened bar', () => {
  assert.match(post({ tool_input: { file_path: 'src/a.ts', old_string: 'f(x)', new_string: '// @ts-ignore\nf(x)' } }, root).reason, /ts-ignore/)
  assert.match(post({ tool_input: { file_path: 'src/a.test.ts', old_string: "test('a', () => {})", new_string: "test.skip('a', () => {})" } }, root).reason, /skipped/)
  assert.match(post({ tool_input: { file_path: 'src/a.test.ts', old_string: 'expect(a).toBe(1)\nexpect(b).toBe(2)', new_string: 'expect(a).toBe(1)' } }, root).reason, /assertions were removed/)
})
test('project rules from /forge:rule block or warn', () => {
  mkdirSync(join(root, '.forge/rules'), { recursive: true })
  writeFileSync(join(root, '.forge/rules/no-client-api.md'), '---\nname: no-client-api\non: edit\naction: block\npaths: ^src/\npattern: fetch\\([\'"]https://api\\.provider\n---\nCall the provider from api/ routes, never from the browser.')
  assert.ok(denied(pre({ tool_name: 'Write', tool_input: { file_path: 'src/x.ts', content: "fetch('https://api.provider.com/v1')" } }, root)))
  assert.equal(pre({ tool_name: 'Write', tool_input: { file_path: 'api/x.ts', content: "fetch('https://api.provider.com/v1')" } }, root), null)
})
