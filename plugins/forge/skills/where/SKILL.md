---
name: where
description: Answers "where am I and what's next" for a forge project — reads STATUS, TASKS, the ledger, findings, git and CI, then names the stage, blockers and the exact next command. Use when the user asks "what now", "where were we", "status", "what's left", "how far are we", or after a long break. Read-only.
---

# Where am I?

## Process
1. `node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" --status` for the summary.
2. Read `STATUS.md`, the open tasks in `docs/TASKS.md` (first open slice), `.forge/findings.json` (open items), the last 5 ledger lines (`tail -5 .forge/ledger.jsonl`), `git log --oneline -5`, `git status --short`.
3. If `gh` works: `gh run list --limit 3` for CI on HEAD.
4. If a deadline is set: time left, and whether the remaining open tasks plausibly fit (be honest; suggest a cut if not).
5. Work out the next command from the stage and the gate of that command: run `check.mjs <next> --json`. If it's blocked, the real next step is the first failing requirement's fix.

## Output (keep to this shape)
```
Project   <name> · <profile> · due <date> (<time left>)
Stage     <stage> · slice <n> of <m> (<name>)
Done      <recent ticks> · CI <state> on <sha>
Open      <tasks> · <findings> · <uncommitted changes?>
Blockers  <none | list>
Next →    <exact command>   then <following command>
```
Then at most three lines of advice (e.g. a scope cut if the deadline is at risk).

## Rules
- Read-only. Do not fix things here; name them.
- If STATUS.md disagrees with the evidence (e.g. says "Build" but all tasks are done), say so and propose the corrected Stage/Next; update STATUS.md only if the user agrees.
