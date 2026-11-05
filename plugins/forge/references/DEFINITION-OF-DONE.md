# Definition of Done

The same bar for every task. A task is done only when its own acceptance criteria (in `TASKS.md`) **and** this list are satisfied. `/forge:build` checks it before ticking a task; `/forge:review` checks it per slice.

## Correct
- [ ] Every acceptance criterion and the task's **Verify** step pass, with the evidence written in `docs/LOG.md`.
- [ ] Behaviour checked at runtime (test, script, browser or live call), not only "it compiles".
- [ ] New behaviour has a test that fails without the change and passes with it.
- [ ] Existing tests still pass; no test was skipped, deleted or weakened to get green.
- [ ] Error paths and edge cases handled: empty, too big, slow, offline, unauthorised, model/API failure.

## Clean
- [ ] Names and structure explain the code; comments explain *why*, not *what*.
- [ ] No debug output, dead code, commented-out blocks, TODOs without a task ID.
- [ ] Change limited to the task's scope.
- [ ] Lint, format and typecheck pass with no new suppressions (`@ts-ignore`, `eslint-disable`, `# noqa`).

## Safe
- [ ] Untrusted input validated at the boundary (request bodies, URL params, files, model output).
- [ ] No secret in client code, logs, Git or screenshots.
- [ ] Auth and access control checked server-side for anything that reads or writes user data.
- [ ] Costly or abusable paths have a limit (rate, size, daily cap).
- [ ] Failures show an honest message and a retry, never a made-up result.

## Usable (UI tasks)
- [ ] Matches the approved mockup; design audit passed (`/forge:ui` step 5).
- [ ] Keyboard reachable, visible focus, labels, contrast ≥ 4.5:1, touch targets ≥ 44 px.
- [ ] Works at 390 px and 1440 px, light and dark; empty, loading, error and long-text states designed.

## Operable
- [ ] Logs for new critical paths carry IDs and timings, never personal data or secrets.
- [ ] Database/config changes have a migration and a way back.
- [ ] Docs that describe behaviour (PRD, ARCHITECTURE, README) still match the code.

## Recorded
- [ ] `TASKS.md` ticked, `docs/LOG.md` entry with what ran and the result, `STATUS.md` "Next:" updated, one focused commit.
