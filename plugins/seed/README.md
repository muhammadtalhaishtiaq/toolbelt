# seed

Test an idea on a simulated crowd before you build it.

```
/plugin install seed --marketplace muhammadtalhaishtiaq/toolbelt
/seed:run "a plant-care helper that checks a photo of your plant" quick
```

You get:
- a **go / pivot / kill** verdict (or "unclear" when the runs disagree), counted in code with fixed rules;
- **IDEA-BOARD.html** — opens in your browser, offline: verdict stamp, finalists side by side, funnels per group, a clickable crowd map, objections with quotes, evidence links, a real-check checklist;
- **IDEA-BRIEF.md** — the same results as a plain file that forge (or any tool) can read.

How it works: research the real world → build a structured crowd with quotas → three rounds (first look, social feed, a shock) played by parallel helpers, twice → count → explain → argue against it → plan a five-person real check. See `playbooks/CROWD-METHOD.md` and `playbooks/BIAS-GUARDS.md`.

**A simulation is a rehearsal, not proof.** Every output says so.

Commands: `run` · `generate` · `research` · `crowd` · `simulate` · `report` · `interview` · `compare` · `brief`.
Example board: `templates/example-run/` (EXAMPLE DATA) — `node templates/example-run/make-example.mjs` from that folder regenerates it.
Tests: `node --test scripts/seed.test.mjs`.
