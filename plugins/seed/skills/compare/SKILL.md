---
name: compare
description: Compares ideas or two seed runs side by side — funnel per segment, objections, stability, and what changed between a first and a revised idea — and updates the idea board. Use when the user says "which is better", "compare these ideas", "did my change help", "A vs B".
argument-hint: "<run-a> [run-b]"
---

# seed: compare

1. One run: use `tally.json` ranking; table of ideas × (stopped, engaged, tried, pay, top objection, verdict, stable).
2. Two runs (before/after a change): for the same idea ID, show deltas per segment and per objection; flag changes smaller than the run-to-run difference as noise.
3. Recommend which to take forward and why in two sentences; regenerate the board for the chosen run (`/seed:brief`).
