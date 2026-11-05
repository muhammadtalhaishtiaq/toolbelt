---
name: retro
description: Runs a project autopsy — what to keep, what hurt, what each lesson becomes — from the project's LOG, FEEDBACK, DECISIONS and git history, writes docs/LESSONS.md, and proposes concrete edits to the toolbelt plugins themselves (skills, gates, templates) on a branch for the user to approve. Use when a project, milestone or hackathon ends, or the user asks "what did we learn", "post-mortem", "retro". Can run any time, even on a failed project.
---

# Retro (the toolbelt loop)

## Process
1. **Evidence**: read `docs/LOG.md`, `docs/FEEDBACK.md`, `docs/DECISIONS.md`, `.forge/ledger.jsonl` (gates skipped, loops that hit the 3-strike rule), `git log --stat`, and time per stage (ledger timestamps).
2. **Three columns**, each item with evidence:
   - **Keep** — what worked and should be default next time.
   - **Hurt** — where time, quality or trust was lost (pivots, late discoveries, bugs found only on devices, caps, skipped gates and what they cost).
   - **Becomes** — the concrete change: a new gate requirement, a checklist item, a template field, a rule, a skill step.
3. Write `docs/LESSONS.md` (dated).
4. **Improve the toolbelt**: for each "Becomes" that is general (not project-specific), draft the edit to the forge/seed/reel plugin files. If the toolbelt repo is available locally (ask for the path; default `~/Documents/Me/Projects/toolbelt`), create a branch `retro/<project>-<date>`, apply the edits, run the plugin tests (`node --test plugins/*/gates/*.test.mjs plugins/*/hooks/*.test.mjs plugins/*/scripts/*.test.mjs`), and commit. Ask before pushing.
5. Also append the general lessons to `${CLAUDE_PLUGIN_ROOT}/playbooks/LESSONS.md` in that branch.

## Next
`check.mjs --record retro pass`.
