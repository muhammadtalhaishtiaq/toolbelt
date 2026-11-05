---
name: test
description: Fills test gaps and runs the real-device matrix — finds untested logic that can mislead users or burn money, adds tests (via the tester agent), checks the critical path on phone and desktop browsers, and records results. Use when the user says "add tests", "is this tested", "test it on my phone", "coverage", or before review on a slice. Not for fixing a specific bug (use /forge:debug).
---

# Test

## Gate
`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" test`.

## Process
1. Read `${CLAUDE_PLUGIN_ROOT}/references/TESTING.md`.
2. **Risk map**: list code that decides verdicts/permissions/prices, parses external or model output, does unit/date/geometry maths, enforces caps/limits, validates input. Mark which have tests.
3. Send the `tester` agent with the risk list and test conventions; review what it adds (tests must fail without the code — spot-check by reverting one line mentally or with `git stash` on a copy).
4. Run the full suite and coverage; compare with CONSTRAINTS.md.
5. **Device matrix** (UI projects, before ship): critical path on iOS Safari, Android Chrome, desktop Chrome, desktop Safari or Firefox — at least file pickers, camera/mic permissions, uploads of real phone formats (HEIC, MOV), slow network. Use a browser tool for desktop; ask the user to run phone checks and report (give them a 5-step script).
6. Log results (pass/fail per item, device, date) in `docs/LOG.md`; failures become FEEDBACK rows and tasks.

## Next
`check.mjs --record test pass` (or `fail` with note). Next `/forge:review` or the fix tasks.
