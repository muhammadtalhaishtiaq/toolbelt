#!/usr/bin/env node
// forge guard. `pre`: blocks secret leaks and the project's block-rules. `post`: warns (back to Claude) on dangerous patterns,
// a weakened quality bar, and the project's warn-rules. Reads the hook JSON on stdin. Fails open on its own errors.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'

export const SECRET_PATTERNS = [
  ['AWS access key', /AKIA[0-9A-Z]{16}/],
  ['Anthropic/OpenAI-style key', /\bsk-(?:ant-|proj-|live-)?[A-Za-z0-9_-]{24,}/],
  ['Stripe live key', /\b[rs]k_live_[A-Za-z0-9]{20,}/],
  ['GitHub token', /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{60,}/],
  ['Slack token', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['private key', /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/],
  ['JWT (e.g. a service-role key)', /\beyJ[A-Za-z0-9_-]{15,}\.eyJ[A-Za-z0-9_-]{30,}\.[A-Za-z0-9_-]{20,}/],
]
const SAFE_ENV = /\.env\.(example|sample|template|defaults)$/
export const isEnvFile = p => /(^|\/)\.env(\.[\w.-]+)?$/.test(p) && !SAFE_ENV.test(p)

export const DANGER = [
  ['raw innerHTML (XSS risk; render as text or sanitise)', /\.innerHTML\s*=(?!=)|dangerouslySetInnerHTML/],
  ['eval / new Function on dynamic input', /\beval\s*\(|new\s+Function\s*\(/],
  ['shell command built from a string (use execFile with an args array)', /\bexec(?:Sync)?\s*\(\s*`[^`]*\$\{|subprocess\.\w+\([^)]*shell\s*=\s*True|os\.system\s*\(/],
  ['SQL built by string concatenation or interpolation (use parameters)', /\b(SELECT|INSERT|UPDATE|DELETE)\b[^;\n]*(\$\{[^}]+\}|['"]\s*\+\s*\w)/i],
  ['unsafe deserialisation', /pickle\.loads?\s*\(|yaml\.load\s*\((?![^)]*SafeLoader)|torch\.load\s*\((?![^)]*weights_only\s*=\s*True)/],
  ['TLS verification disabled', /rejectUnauthorized\s*:\s*false|verify\s*=\s*False|NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['"]?0/],
  ['wildcard CORS', /Access-Control-Allow-Origin['"]?\s*[:,]\s*['"]\*['"]|cors\(\s*\{\s*origin\s*:\s*['"]\*['"]/],
  ['secret in a public env variable', /\b(VITE|NEXT_PUBLIC|PUBLIC|EXPO_PUBLIC)_\w*(SECRET|SERVICE_ROLE|PRIVATE|API_KEY|TOKEN)\w*/],
]
export const WEAKENED = [
  ['@ts-ignore / @ts-nocheck', /@ts-(ignore|nocheck)/],
  ['eslint-disable', /eslint-disable/],
  ['oxlint/biome ignore', /(oxlint|biome)-ignore/],
  ['# noqa / type: ignore', /#\s*noqa|#\s*type:\s*ignore/],
  ['skipped or focused test', /\b(it|test|describe)\.(skip|only|todo)\s*\(|\bx(it|describe|test)\s*\(|@pytest\.mark\.skip|t\.Skip\(/],
  ['--passWithNoTests', /--passWithNoTests/],
]
const isTest = p => /(\.|_|\/)(test|spec)s?\.|__tests__|\/tests?\//.test(p)
const count = (s, re) => (s.match(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')) ?? []).length

function parts(input) {
  if (Array.isArray(input.edits)) return { before: input.edits.map(e => e.old_string ?? '').join('\n'), after: input.edits.map(e => e.new_string ?? '').join('\n') }
  if ('new_string' in input) return { before: input.old_string ?? '', after: input.new_string ?? '' }
  return { before: '', after: input.content ?? input.new_source ?? '' }
}
const newly = (before, after, re) => count(after, re) > count(before, re)

export function loadRules(root) {
  const dir = join(root, '.forge/rules'); if (!existsSync(dir)) return []
  return readdirSync(dir).filter(f => f.endsWith('.md')).flatMap(f => {
    const t = readFileSync(join(dir, f), 'utf8'); const m = t.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/); if (!m) return []
    const fm = Object.fromEntries(m[1].split('\n').map(l => l.match(/^(\w+):\s*(.*)$/)).filter(Boolean).map(x => [x[1], x[2].replace(/^['"]|['"]$/g, '')]))
    if (fm.enabled === 'false' || !fm.pattern) return []
    try { return [{ name: fm.name ?? basename(f, '.md'), on: (fm.on ?? 'edit').split(/,\s*/), pattern: new RegExp(fm.pattern, fm.flags ?? 'i'), action: fm.action === 'block' ? 'block' : 'warn', paths: fm.paths ? new RegExp(fm.paths) : null, message: m[2].trim() || fm.name }] } catch { return [] }
  })
}

export function pre(ev, root) {
  const t = ev.tool_name, i = ev.tool_input ?? {}
  const path = i.file_path ?? i.notebook_path ?? ''
  if (t === 'Read' && isEnvFile(path)) return deny(`forge guard: ${path} holds secrets and is never read. Use .env.example for variable names.`)
  if (t === 'Bash') {
    const c = i.command ?? ''
    const envRef = c.match(/(?:^|[\s'"=<>|;&])((?:[\w./-]*\/)?\.env(?:\.[\w.-]+)?)(?=$|[\s'"|;&>])/g)?.map(s => s.trim().replace(/^[\s'"=<>|;&]+/, '')) ?? []
    const bad = envRef.filter(isEnvFile)
    if (bad.length && /\b(cat|less|more|head|tail|bat|grep|rg|awk|sed|source|xxd|strings|curl|base64)\b|^\.\s/.test(c)) return deny(`forge guard: this command would read ${bad[0]} (secrets). Not allowed.`)
    const src = c.match(/\b(?:cp|scp|rsync|mv)\s+(?:-\w+\s+)*['"]?([^\s'"]+)/)?.[1]
    if (src && isEnvFile(src)) return deny(`forge guard: copying ${src} would spread secrets. Not allowed.`)
    if (/\bgit\s+add\b/.test(c) && bad.length) return deny(`forge guard: ${bad[0]} must never be committed. Add it to .gitignore instead.`)
    for (const r of loadRules(root)) if (r.action === 'block' && r.on.includes('bash') && r.pattern.test(c)) return deny(`forge rule "${r.name}": ${r.message}`)
    return null
  }
  if (['Edit', 'Write', 'MultiEdit', 'NotebookEdit'].includes(t)) {
    const { after } = parts(i)
    if (!/ci-canary-/.test(after)) for (const [name, re] of SECRET_PATTERNS) if (re.test(after)) return deny(`forge guard: this edit to ${path || 'a file'} contains what looks like a real ${name}. Put the value in the host's env settings or .env.local and reference it by name.`)
    for (const r of loadRules(root)) if (r.action === 'block' && r.on.includes('edit') && (!r.paths || r.paths.test(path)) && r.pattern.test(after)) return deny(`forge rule "${r.name}": ${r.message}`)
  }
  return null
}

export function post(ev, root) {
  const i = ev.tool_input ?? {}; const path = i.file_path ?? ''
  if (/\.(md|txt|lock)$|(^|\/)(node_modules|dist|build|vendor)\//.test(path)) return null
  const { before, after } = parts(i); const notes = []
  for (const [name, re] of DANGER) if (newly(before, after, re)) notes.push(`security: ${name}`)
  for (const [name, re] of WEAKENED) if (newly(before, after, re)) notes.push(`quality bar: new ${name} — fix the cause instead, or record why in docs/DECISIONS.md`)
  if (isTest(path) && before) { const a = /\b(expect|assert\w*)\s*[.(]/; if (count(after, a) < count(before, a)) notes.push('quality bar: assertions were removed from a test — tests must not be weakened to pass') }
  for (const r of loadRules(root)) if (r.action === 'warn' && r.on.includes('edit') && (!r.paths || r.paths.test(path)) && r.pattern.test(after)) notes.push(`rule "${r.name}": ${r.message}`)
  return notes.length ? { decision: 'block', reason: `forge guard on ${path}:\n- ${notes.join('\n- ')}\nPlease correct this now (the edit was applied).` } : null
}
const deny = reason => ({ hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason } })

if (process.argv[1]?.endsWith('guard.mjs') && process.argv[2]) {
  try {
    const ev = JSON.parse(readFileSync(0, 'utf8') || '{}'); const root = ev.cwd ?? process.cwd()
    const out = process.argv[2] === 'pre' ? pre(ev, root) : post(ev, root)
    if (out) process.stdout.write(JSON.stringify(out))
  } catch { /* fail open: a broken guard must not stop work; CI is the backstop */ }
}
