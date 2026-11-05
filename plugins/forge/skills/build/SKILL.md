---
name: build
description: Builds the next task from docs/TASKS.md the disciplined way — gate check, fresh helper with the task's full context, failing test first, smallest code to pass, lint/types/tests/build, a spec-compliance check then a code-quality check, the task's Verify step, Definition of Done, one commit. "build auto" keeps looping through the slice until it ends or a gate fails. Use when the user says "continue", "next task", "keep going", "build it", "implement T7". Not for bugs (use /forge:debug) or UI restyles (use /forge:ui).
argument-hint: "[T-id | auto]"
---

# Build (one task, or a bounded loop)

## Gate
`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" build` — TASKS exist, every open task has a Verify step, UI mockup approved (UI projects).

## Pick the task
The given ID, else the first open task in the first open slice whose dependencies are done. Read its Files/Acceptance/Verify. If it's ambiguous, stop and ask (one question) — don't guess.

## Baseline
`git status` clean (or ask), tests green before you start (`npm test` or the project's command). If the baseline is red, stop: that's a `/forge:debug` first. For bigger features prefer a branch or worktree (`git worktree add ../<repo>-<task> -b <task>`).

## The cycle
1. **Red** — write the failing test(s) for the acceptance criteria (yourself, or the `tester` agent with the task text pasted in). Run; it must fail for the right reason. Code written before its test is thrown away and rewritten test-first.
2. **Green** — the smallest change that passes. Touch only the task's files; anything else goes to STATUS "Noticed".
3. **Refactor** — clean up with tests green. No new abstractions without a second real use.
4. **Checks** — lint, typecheck, full tests, build. Fix causes; never suppress (the guard will flag `@ts-ignore`, `.skip`, removed asserts).
5. **UI tasks** — follow `/forge:ui` build rules; screenshot at 390 and 1440 px light/dark; fix obvious drift from the mockup.
6. **Two-stage check** on the diff (`git diff`):
   - *Spec compliance*: does it do exactly what Acceptance says — nothing missing, nothing extra?
   - *Code quality*: the `code-reviewer` agent for non-trivial diffs (≥ ~80 lines or touching auth/money/data); otherwise self-review against `references/DEFINITION-OF-DONE.md`.
   Fix blocking items and repeat the checks.
7. **Verify** — run the task's Verify step exactly; paste the result into `docs/LOG.md`.
8. **Commit** — one focused commit: `<type>: <what> (T7)`; tick the task in TASKS.md; update STATUS Next.
9. `node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" --record build pass --scope T7`.

## Helpers for larger tasks
Give a fresh helper (general-purpose agent) the full task block, the relevant file contents or paths, CONSTRAINTS articles, and the commands to run; ask it to return the diff summary and test output. The main session still runs steps 6–9 itself — a helper's "done" is a claim until you've checked it.

## `build auto` (bounded loop)
Repeat the cycle for each open task in the current slice. Stop when **any** of these happen, and report why:
- the slice is complete (then suggest `/forge:review`);
- a gate or check fails and the same fix attempt has failed **3 times** (switch to `/forge:debug`, don't keep patching);
- a task needs a decision from the user;
- 8 tasks done or the user's turn budget is reached.
Never push, deploy or change secrets inside the loop.

## Common rationalizations
| Excuse | Reality |
|---|---|
| "Too small to test" | If it can mislead a user or burn money, it gets a test. Otherwise say why in one line. |
| "Tests after, it's faster" | Tests written after pass by construction and prove nothing. |
| "I'll just disable this lint rule" | The guard flags it; fix the cause or record why in DECISIONS. |
| "It works on my machine" | Verify step or it isn't done. |

## Red flags
Multiple tasks in one commit · files outside the task changed · test edited to match new behaviour without a spec change · "done" without a Verify result in LOG.md.
