---
name: crowd
description: Builds the simulated crowd from world.json — structured personas (segment, attitude, age band, tech comfort, monthly budget, current solution, pain) with fixed quotas that guarantee skeptics and indifferent people — using a deterministic script, not free-form stories. Use as step 3 of /seed:run, or when the user wants to see or change who is in the crowd.
argument-hint: "[--size N]"
---

# seed: crowd

## Process
1. `node "${CLAUDE_PLUGIN_ROOT}/scripts/graph.mjs" <run-dir> --size <30|120> --seed <n>` → `crowd.json`.
   Quotas (in the script): segment sizes follow `share`; attitudes 20% indifferent · 15% skeptic · 30% pragmatic · 22% curious · 13% enthusiast (≥ 30% skeptic+indifferent, ≤ 15% enthusiasts).
2. Show the user a 5-line summary (count per segment and attitude). They can change shares in `world.json` and re-run.
3. Do **not** rewrite personas into long stories. Research shows free-text persona descriptions make synthetic crowds more uniform and more positive. Table fields only.
