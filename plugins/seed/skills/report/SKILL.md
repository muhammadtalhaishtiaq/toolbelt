---
name: report
description: Turns the simulation into results — counts every reaction in code (tally.mjs), applies the fixed verdict rules (go, pivot, kill, or unclear when runs disagree or the crowd is too small), then explains why with quotes, writes the summary and a real-world check plan with one kill signal. Use as step 5 of /seed:run or after re-running a simulation. The model explains numbers; it never makes them up.
---

# seed: report

## Process
1. `node "${CLAUDE_PLUGIN_ROOT}/scripts/tally.mjs" <run-dir>` → `tally.json` and a one-line result per idea. Report skipped lines if any.
2. Send the `report-analyst` agent the tally, crowd summary, world.json and a sample of quotes; ask for: why the top idea won or lost per segment, the objection behind each drop, what changed after the shock, and the **smallest change to the idea** that would fix the top objection.
3. Send the `skeptic` agent the same inputs: "Argue this result is wrong. Which persona groups are missing or mis-weighted? Where would real people behave differently from these personas? What evidence in world.json contradicts the verdict?" Include its strongest point in the summary.
4. Write `summary.json`: `{ "reason": one sentence a person would say, "change": the smallest change, "skeptic": strongest counterpoint, "killSignal": the one real-world result that would kill it }`.
5. Write `realcheck.json`: 4–6 steps to test with **5 real people this week** — who to find and where, what to ask (past behaviour, not hypotheticals), what to show, the commitment to ask for (pre-order, sign-up, time), and the kill signal. See `${CLAUDE_PLUGIN_ROOT}/playbooks/REAL-CHECK.md`.

## Rules
- Quote numbers exactly as `tally.json` has them. Never round up a verdict.
- Say "simulated people", never "users" or "customers".
