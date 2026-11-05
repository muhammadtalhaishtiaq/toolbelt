#!/usr/bin/env node
// forge gate checker. No dependencies. Run from anywhere inside the project.
//   node check.mjs <gate>                      → evaluate a gate; exit 0 pass, 1 blocked
//   node check.mjs --record <cmd> <result> [--scope s] [--note "..."]   → append to .forge/ledger.jsonl
//   node check.mjs --skip <gate> <req> "<reason>"                        → conscious skip for this commit (logged + DECISIONS)
//   node check.mjs --status                    → one-screen summary (used by the SessionStart hook and /forge:where)
//   add --json for machine output
import { readFileSync, existsSync, appendFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const CODE_IGNORE = /^(docs\/|design\/|\.forge\/|README|CHANGELOG|LICENSE|STATUS\.md|.*\.md$)/

export function root(cwd = process.cwd()) {
  try { return execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() } catch { return cwd }
}
const read = (r, p) => { try { return readFileSync(join(r, p), 'utf8') } catch { return null } }
const git = (r, args) => { try { return execFileSync('git', args, { cwd: r, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() } catch { return null } }
export const head = r => git(r, ['rev-parse', '--short', 'HEAD'])

export function config(r) { try { return JSON.parse(read(r, '.forge/config.json') ?? '{}') } catch { return {} } }
export function ledger(r) {
  const t = read(r, '.forge/ledger.jsonl'); if (!t) return []
  return t.split('\n').filter(Boolean).flatMap(l => { try { return [JSON.parse(l)] } catch { return [] } })
}
function rx(pattern) { // supports a leading (?i) flag
  const i = pattern.startsWith('(?i)'); return new RegExp(i ? pattern.slice(4) : pattern, i ? 'im' : 'm')
}
export function openTasks(md) {
  // "- [ ] T7 …" lines; tasks tagged [later] are excluded
  return (md ?? '').split('\n').filter(l => /^\s*[-*] \[ \]/.test(l) && !/\[later\]/i.test(l))
}
export function tasksMissingVerify(md) {
  // a task block = its checkbox line + indented lines below it, until the next checkbox or heading
  const lines = (md ?? '').split('\n'); const missing = []
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*[-*] \[ \]/.test(lines[i]) || /\[later\]/i.test(lines[i])) continue
    let block = lines[i]; for (let j = i + 1; j < lines.length && !/^\s*[-*] \[[ x]\]|^#/.test(lines[j]); j++) block += '\n' + lines[j]
    if (!/verify\s*:/i.test(block)) missing.push(lines[i].trim())
  }
  return missing
}
function codeChangedSince(r, commit) {
  if (!commit) return true
  const files = git(r, ['diff', '--name-only', `${commit}..HEAD`]); if (files === null) return true
  return files.split('\n').filter(Boolean).some(f => !CODE_IGNORE.test(f))
}

export function evaluate(r, req, ctx) {
  const L = ctx.ledger
  switch (req.check) {
    case 'file_exists': return existsSync(join(r, req.path)) ? ok() : no(`${req.path} is missing`)
    case 'file_contains': { const t = read(r, req.path); return t && rx(req.pattern).test(t) ? ok() : no(t === null ? `${req.path} is missing` : `${req.path} has no ${req.pattern.replace('(?i)', '')}`) }
    case 'file_not_contains': { const t = read(r, req.path); if (t === null) return no(`${req.path} is missing`); const m = t.match(rx(req.pattern)); return m ? no(`${req.path} still has "${m[0]}"`) : ok() }
    case 'any': { const res = req.of.map(x => evaluate(r, x, ctx)); return res.some(x => x.pass) ? ok() : no(res.map(x => x.why).join(' / ')) }
    case 'ledger_has': { const e = L.filter(x => x.cmd === req.cmd && (!req.result || x.result === req.result) && (!req.scope || x.scope === req.scope)); return e.length ? ok(`last ${e.at(-1).at}`) : no(`no ${req.cmd}${req.scope ? ' ' + req.scope : ''}${req.result ? ' (' + req.result + ')' : ''} recorded`) }
    case 'ledger_fresh': { const e = L.filter(x => x.cmd === req.cmd && x.result === 'pass').at(-1); if (!e) return no(`no passing ${req.cmd} recorded`); return codeChangedSince(r, e.commit) ? no(`code changed since the last passing ${req.cmd} (${e.commit})`) : ok(`${e.commit}`) }
    case 'tasks_done': { const t = read(r, 'docs/TASKS.md'); if (t === null) return no('docs/TASKS.md is missing'); const o = openTasks(t); return o.length ? no(`${o.length} open task(s): ${o.slice(0, 3).map(s => s.replace(/^\s*[-*] \[ \]\s*/, '')).join('; ')}`) : ok() }
    case 'tasks_have_verify': { const m = tasksMissingVerify(read(r, 'docs/TASKS.md')); return m.length ? no(`${m.length} open task(s) without a Verify step`) : ok() }
    case 'ui_mockup_approved': { if (!ctx.config.ui) return ok('no UI in this project'); const d = read(r, 'docs/DECISIONS.md') ?? ''; return /mockup[^\n]*approved|approved[^\n]*mockup/i.test(d) ? ok() : no('no approved mockup in docs/DECISIONS.md') }
    case 'ui_audit_logged': { if (!ctx.config.ui) return ok('no UI in this project'); const e = L.filter(x => x.cmd === 'ui' && x.scope === 'audit' && x.result === 'pass').at(-1); if (!e) return no('no passing UI audit recorded'); return codeChangedSince(r, e.commit) && ctx.uiChangedSince(e.commit) ? no(`UI changed since the last audit (${e.commit})`) : ok() }
    case 'git_has_commits': return head(r) ? ok() : no('no commits yet')
    case 'no_open_findings': { let f = []; try { f = JSON.parse(read(r, '.forge/findings.json') ?? '[]') } catch { return no('.forge/findings.json is not valid JSON') } const open = f.filter(x => req.severity.includes(x.severity) && x.status === 'open'); return open.length ? no(`${open.length} open: ${open.map(x => x.id).join(', ')}`) : ok() }
    case 'ci_green': return ctx.ci()
    case 'url_ok': return ctx.url(ctx.config[req.configKey])
    default: return no(`unknown check ${req.check}`)
  }
}
const ok = (why = '') => ({ pass: true, why })
const no = why => ({ pass: false, why })

function ciStatus(r) {
  const sha = git(r, ['rev-parse', 'HEAD']); if (!sha) return no('no commits')
  let out; try { out = execFileSync('gh', ['run', 'list', '--commit', sha, '--json', 'conclusion,status,name', '--limit', '20'], { cwd: r, stdio: ['ignore', 'pipe', 'ignore'], timeout: 15000 }).toString() } catch { return no('cannot read CI (gh missing, not logged in, or no remote): run the checks locally and skip with a reason, or push and retry') }
  const runs = JSON.parse(out); if (!runs.length) return no(`no CI run for ${sha.slice(0, 7)} (push it?)`)
  if (runs.some(x => x.status !== 'completed')) return no('CI still running')
  const bad = runs.filter(x => x.conclusion !== 'success' && x.conclusion !== 'skipped'); return bad.length ? no(`CI red: ${bad.map(x => x.name).join(', ')}`) : ok(sha.slice(0, 7))
}
async function urlStatus(u) {
  if (!u) return no('no liveUrl in .forge/config.json')
  try { const res = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(15000) }); return res.ok ? ok(`${res.status}`) : no(`${u} answered ${res.status}`) } catch (e) { return no(`${u} unreachable (${e.cause?.code ?? e.name})`) }
}

export async function runGate(r, gate, opts = {}) {
  const gates = JSON.parse(readFileSync(join(HERE, 'gates.json'), 'utf8'))
  const g = gates[gate]; if (!g) return { gate, pass: false, results: [{ id: 'gate', pass: false, why: `unknown gate "${gate}"` }] }
  const cfg = config(r); const profile = cfg.profile ?? 'product'
  const L = ledger(r); const sha = head(r)
  const ctx = { ledger: L, config: cfg, ci: opts.ci ?? (() => ciStatus(r)), url: opts.url ?? urlStatus,
    uiChangedSince: c => { const f = git(r, ['diff', '--name-only', `${c}..HEAD`]) ?? ''; return f.split('\n').some(x => /\.(css|scss|tsx|jsx|vue|svelte|html)$/.test(x)) } }
  const results = []
  for (const req of g.requires) {
    if (req.profiles && !req.profiles.includes(profile)) continue
    let res = await evaluate(r, req, ctx)
    if (!res.pass) { const s = L.find(x => x.type === 'skip' && x.gate === gate && x.req === req.id && x.commit === sha); if (s) res = { pass: true, why: `skipped: ${s.reason}`, skipped: true } }
    results.push({ id: req.id, fix: req.fix, ...res })
  }
  return { gate, profile, commit: sha, pass: results.every(x => x.pass), results }
}

export function record(r, entry) {
  mkdirSync(join(r, '.forge'), { recursive: true })
  appendFileSync(join(r, '.forge/ledger.jsonl'), JSON.stringify({ at: new Date().toISOString(), commit: head(r), ...entry }) + '\n')
}

function status(r) {
  const s = read(r, 'STATUS.md'); if (s === null) return null
  const pick = k => (s.match(new RegExp(`^\\**${k}\\**\\s*:\\s*(.+)$`, 'im')) ?? [])[1]?.trim()
  const cfg = config(r); const t = read(r, 'docs/TASKS.md'); let f = []; try { f = JSON.parse(read(r, '.forge/findings.json') ?? '[]') } catch {}
  let due = ''; if (cfg.deadline) { const ms = Date.parse(cfg.deadline) - Date.now(); due = Number.isNaN(ms) ? '' : ms < 0 ? ' · deadline passed' : ` · due in ${Math.floor(ms / 864e5)}d ${Math.floor(ms % 864e5 / 36e5)}h` }
  return { project: cfg.name ?? '', profile: cfg.profile ?? 'product', due, stage: pick('Stage') ?? 'unknown', next: pick('Next') ?? 'run /forge:where', openTasks: t ? openTasks(t).length : null, openFindings: f.filter(x => x.status === 'open').length, last: ledger(r).filter(x => !x.type).slice(-3).map(x => `${x.cmd}${x.scope ? ' ' + x.scope : ''} ${x.result}`) }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const a = process.argv.slice(2); const r = root(); const json = a.includes('--json')
  const flag = n => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : undefined }
  if (a[0] === '--record') { record(r, { cmd: a[1], result: a[2], ...(flag('--scope') && { scope: flag('--scope') }), ...(flag('--note') && { note: flag('--note') }) }); console.log(`recorded ${a[1]} ${a[2]}`) }
  else if (a[0] === '--skip') {
    if (!a[3]) { console.error('a reason is required: --skip <gate> <req> "<reason>"'); process.exit(2) }
    record(r, { type: 'skip', gate: a[1], req: a[2], reason: a[3] })
    const d = join(r, 'docs/DECISIONS.md'); if (existsSync(d)) appendFileSync(d, `\n## ${new Date().toISOString().slice(0, 10)} — Skipped gate ${a[1]}/${a[2]}\n\n${a[3]} (commit ${head(r)}; valid for this commit only)\n`)
    console.log(`skip recorded for ${a[1]}/${a[2]} at ${head(r)}`)
  } else if (a[0] === '--status') {
    const s = status(r); if (json) console.log(JSON.stringify(s)); else if (!s) console.log('No STATUS.md here. Start with /forge:start.'); else console.log(`Project ${s.project} · ${s.profile}${s.due}\nStage   ${s.stage}\nOpen    ${s.openTasks ?? '?'} task(s) · ${s.openFindings} finding(s)\nLast    ${s.last.join(' · ') || '—'}\nNext →  ${s.next}`)
  } else if (a[0]) {
    const res = await runGate(r, a[0])
    if (json) console.log(JSON.stringify(res, null, 1))
    else {
      const bad = res.results.filter(x => !x.pass)
      console.log(res.pass ? `✓ Gate "${a[0]}" open (${res.profile}).` : `✗ Not ready for "${a[0]}". ${bad.length} thing(s) missing:`)
      for (const x of res.results) console.log(`  ${x.pass ? (x.skipped ? '↷' : '✓') : '✗'} ${x.id}: ${x.why || 'ok'}${x.pass ? '' : `  → ${x.fix}`}`)
      if (!res.pass) console.log(`To go anyway, give a reason: node check.mjs --skip ${a[0]} <id> "<reason>" (valid for this commit only).`)
    }
    process.exit(res.pass ? 0 : 1)
  } else { console.log('usage: check.mjs <gate> | --record <cmd> <result> | --skip <gate> <req> "<reason>" | --status [--json]'); process.exit(2) }
}
