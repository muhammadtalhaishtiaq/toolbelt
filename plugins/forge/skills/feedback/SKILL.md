---
name: feedback
description: Turns the user's hands-on testing — messy notes, screenshots, voice-typed complaints — into numbered FEEDBACK rows with a likely cause, then into tasks or fixes, and tracks each to a commit. Use when the user says "I tested it and…", "this feels slow", "the button is cut off", shares screenshots of problems, or lists issues. Not for a single clear crash (use /forge:debug).
---

# Feedback

## Process
1. Split the input into separate findings. Quote the user's words (lightly edited) — never reinterpret away their point.
2. For each: next F-id, date, area, the finding, status 🆕.
3. **Triage** each quickly: reproduce or inspect (screenshots, code) → likely cause with evidence → size (S/M/L) → type (bug → `/forge:debug`; change of behaviour → feature lane task; UI → `/forge:ui`; question → answer it).
4. Ask only where the intent is unclear ("Should the review grid replace the list on phones too?"). Mockup first for visible UI changes.
5. Add tasks to `docs/TASKS.md` linked to F-ids; set status 🔍/🔨.
6. When fixed: ✅ with commit hash and the docs updated.

## Rule
User feedback is product evidence: if it contradicts the PRD, raise it ("PRD says X; you're asking for Y — update the spec?") and record the decision.

## Next
`check.mjs --record feedback pass`. Next: the first fix task.
