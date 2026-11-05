#!/usr/bin/env node
// SessionStart: if this is a forge project, put its stage and next step into context (short; skills do the routing).
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const here = dirname(fileURLToPath(import.meta.url))
let root = process.cwd()
try { root = execFileSync('git', ['rev-parse', '--show-toplevel'], { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() } catch {}
if (!existsSync(join(root, 'STATUS.md')) || !existsSync(join(root, '.forge'))) process.exit(0)
let summary = ''
try { summary = execFileSync('node', [join(here, '../gates/check.mjs'), '--status'], { cwd: root, timeout: 8000 }).toString().trim() } catch { process.exit(0) }
const context = `forge project detected.\n${summary}\nFor any development request (even a vague one), follow the forge:using-forge router: pick the lane from what the user said and the stage above, and run the gate before any lifecycle command.`
process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: context } }))
