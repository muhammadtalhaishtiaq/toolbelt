# Crowd method

seed borrows the shape of swarm-simulation engines such as MiroFish — graph building, environment setup, simulation, report, interaction — and implements it with plain files, a deterministic crowd builder, parallel helper agents and code-side counting. No code or text is copied from those projects.

| Stage | seed | File |
|---|---|---|
| Seed material + question | the idea or theme, the rules, the user's question | brief.json, ideas.json |
| Graph building | research: segments, rivals, evidence — each with a source | world.json |
| Environment setup | structured personas with quotas | crowd.json |
| Simulation | neutral launch posts; round 1 first look, round 2 + social feed, round 3 + shock; 2 runs | posts.json, actions.jsonl |
| Report | counts in code, verdict by fixed rules, explanation and counter-argument | tally.json, summary.json |
| Interaction | interview personas or segments, test a changed pitch | interviews.md |
| Hand-off | brief for tools, board for people, real check plan | IDEA-BRIEF.md, IDEA-BOARD.html, realcheck.json |

## Verdict rules (tally.mjs, editable per run in rules.json)
- **unclear** if fewer than 20 simulated people, or the two runs disagree.
- **kill** if fewer than 15% stop for it.
- **go** if ≥ 20% would try and ≥ 6% would pay (with a price and an alternative they'd drop).
- **pivot** otherwise — interest without commitment.
The verdict uses round 2 (after social influence); round 3 shows resilience to the shock.

## Cost
Each round × run sends one helper per batch. Quick (30 people, 2 rounds, 2 runs, batch 15): ~8 helper calls. Deep (120 people, 3 rounds, 2 runs, batch 20): ~36 calls. The persona helper uses a small model.

## Scale-up option (not built)
For thousands of agents with follow graphs and recommendation feeds, an adapter to the open-source OASIS simulator (Apache-2.0) could replace the simulate step. Add it only when a project needs it.
