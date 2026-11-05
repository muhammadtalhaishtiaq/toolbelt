---
name: idea
description: Chooses what to build — turns a rough idea, theme or problem into three concrete directions, scores them against the rules or success criteria, has the red-team and judge agents attack them, and records the chosen direction. Use when the user says "is this a good idea", "what should we build", "help me pick", "ideas for…", or right after /forge:start. If IDEA-BRIEF.md exists it confirms instead of regenerating. For a deep crowd simulation use /seed:run (separate plugin). Not for writing the spec.
argument-hint: "[idea or theme]"
---

# Idea

## Gate
`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" idea`.

## If an idea brief exists
Read `docs/IDEA-BRIEF.md` (and note `IDEA-BOARD.html`). Summarise it in 5 lines, ask the user to confirm or adjust, record "Idea chosen" in DECISIONS, and skip to Next. Re-run the agents only if the user changed the idea.

## Process
1. **Frame**: the user, their painful moment, today's workaround, and (for hackathons) the criteria from `docs/RULES.md`.
2. **Three directions** that differ in kind, not wording (e.g. a tool for creators · a tool for learners · an API). For each: one-line pitch, the **magic moment** (the 10 seconds a demo would show), riskiest assumption, the external tech it needs, and the size (S/M/L) against the deadline.
3. **Attack in parallel** (one message, two agents):
   - `red-team`: "For each direction: likeliest failure, unsupported claim, terms/privacy risk, smallest viable cut."
   - `judge`: "Score each direction against docs/RULES.md (or the PRD success criteria) and name the memorable moment."
4. **Verify findings** that change the choice (e.g. "API X can't take video") with `scout` or a 10-minute spike before trusting them.
5. **Recommend** one direction with the reason, the cut list, and the riskiest assumption to spike first. The user decides.
6. Record in `docs/DECISIONS.md`: `## <date> — Idea chosen: <name>` with why, what was rejected and why, and the riskiest assumption. Log the agent runs in `docs/LOG.md` (what each said, one line).

## Common rationalizations
| Excuse | Reality |
|---|---|
| "I already know what I want" | Then this takes five minutes — and the red team still finds the demo-killer before you build around it. |
| "Pivoting later is fine" | Showhow's pivot on day 2 cost a day. Pivots belong here, when they are free. |

## Next
`check.mjs --record idea pass`. STATUS Stage `1 Shape`, Next `/forge:spike`.
