---
name: spec
description: Writes or updates docs/PRD.md — objective, users, core flows with failure states, scope in/out, testable requirements, always/ask/never boundaries, data and privacy, dependencies, measurable success criteria — marking every gap as [NEEDS CLARIFICATION] instead of guessing, then gets it red-teamed. Use when the user says "write the spec", "what exactly are we building", "requirements", "PRD", or a feature needs defining. For the quick profile it writes a 10-line spec in CLAUDE.md instead.
argument-hint: "[feature name for a feature spec]"
---

# Spec

## Gate
`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" spec`.

## Process
1. Inputs: DECISIONS (idea chosen), API-NOTES (verified facts only), RULES, IDEA-BRIEF, the user's words.
2. Fill `docs/PRD.md` (template sections 1–10). The spec says **what and why**, not how — no file names, frameworks or schemas here (those go in `docs/ARCHITECTURE.md` if needed).
3. **Never guess.** Any detail the user hasn't given and you can't derive → `[NEEDS CLARIFICATION: <specific question>]`. Typical: auth method, who can see what, retention, limits, error behaviour, offline, languages, accessibility needs.
4. Every requirement has a **testable** acceptance criterion ("rejects photos over 8 MB with 'Photo too large (max 8 MB)'", not "handles big photos").
5. Boundaries: Always / Ask first / Never — include privacy and claims the product must not make.
6. Ask the user all open questions in one message; fold answers in; remove markers only when answered.
7. **Review**: run `/forge:review spec` (red-team on the PRD). Resolve findings.
8. Record a DECISIONS entry summarising scope in/out.

Quick profile: write `## Spec` (problem, user, 3–5 requirements with acceptance, out of scope) into CLAUDE.md and skip the review.

## Common rationalizations
| Excuse | Reality |
|---|---|
| "It's obvious" | Then writing it takes 10 minutes and nobody builds the wrong thing. |
| "I'll assume email login" | Mark it. Assumptions in specs become bugs in code. |

## Verification
- [ ] No `[NEEDS CLARIFICATION` left (`grep`), or the user explicitly deferred each.
- [ ] Each requirement has a testable criterion; success criteria have numbers.
- [ ] Spec review logged.

## Next
`check.mjs --record spec pass`. STATUS Stage `2 Spec`; Next `/forge:design` if `ui: true`, else `/forge:plan`.
