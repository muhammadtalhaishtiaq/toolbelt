---
name: plan
description: Breaks the spec (or a feature) into vertical slices of small tasks ordered by risk, each carrying Files, Acceptance and a Verify step so a fresh helper can build it, with a day-by-day schedule when there is a deadline. Use when the user says "plan it", "break it down", "what are the tasks", "how long will it take", or after the spec or mockup is approved. Not for doing the work.
argument-hint: "[feature]"
---

# Plan

## Gate
`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" plan` — PRD complete, no open clarification markers, spec reviewed (by profile).

## Process
1. **Plan gates** (from CONSTRAINTS.md articles) before tasks:
   - Simplicity: is this the smallest design that meets the PRD? Any speculative feature?
   - Use the framework directly: any wrapper or custom layer that the platform already provides?
   - Integration first: are contracts (API shapes, DB schema) defined before code that depends on them?
   Any "no" → either simplify, or write the justification under CONSTRAINTS "Complexity tracking".
2. **Slices**: each slice is a thin end-to-end path a user could try (UI → API → data), riskiest first (the thing most likely to fail goes in slice 1). Typical: walking skeleton → core loop → secondary flow → hardening → polish.
3. **Tasks** (≤ half a day each; aim for 1–3 hours), written so a helper with no conversation history could do it:
   ```
   - [ ] T7 Verdict gate for photo checks
     Files: src/lib/verdict.ts, src/lib/verdict.test.ts, api/check.ts
     Acceptance: unclear when confidence < 0.6; differs only with a box; never "safe"
     Verify: npm test -- verdict  → 6 passing; POST /api/check with fixture → {"verdict":"unclear"}
     Depends on: T5
   ```
   Test-first tasks (logic that can mislead or burn money) say so.
4. **Hardening tasks** are real tasks: limits/caps, failure messages, security headers, a11y pass, real-device check, smoke script.
5. **Schedule** (deadline): days × slices, with the demo/submission work and a buffer of ≥ 15% at the end. Say plainly if it doesn't fit and propose cuts.
6. Write `docs/TASKS.md`. For a feature, append a new slice.
7. Optional: `judge` agent on the plan ("does slice 1 produce the memorable moment early enough?").

## Verification
- [ ] Every open task has Files, Acceptance, Verify (`check.mjs build` checks Verify).
- [ ] Slice 1 is demoable end to end.
- [ ] Each PRD requirement maps to at least one task.

## Next
`check.mjs --record plan pass`. STATUS Stage `3 Build`; Next `/forge:build T1`.
