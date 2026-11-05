# Profiles

Chosen in `/forge:start`, stored in `.forge/config.json` → `profile`. Gates only apply the requirements listed for the profile.

| Step | hackathon | product | experiment | quick |
|---|:-:|:-:|:-:|:-:|
| start | ✓ | ✓ | ✓ | ✓ |
| rules (event/API terms) | ✓ | ✓ if terms matter | – | – |
| idea (+ red team, judge) | ✓ | ✓ | ✓ | – |
| spike | ✓ | ✓ | ✓ | – |
| spec (PRD + review) | ✓ | ✓ | short PRD | 10 lines in CLAUDE.md |
| design (mockup approved) | ✓ if UI | ✓ if UI | optional | – |
| constraints | ✓ | ✓ | – | – |
| plan | ✓ day-by-day | ✓ | ✓ | ✓ |
| build loop + test | ✓ | ✓ | ✓ | ✓ |
| review agents | every slice | every slice | at the end | – |
| feedback | ✓ | ✓ | ✓ | ✓ |
| secure | all stages | all stages | build + push | day0 + push + ship |
| ship (gate + drill + devices) | ✓ | ✓ | only if it works | ✓ light |
| reel | ✓ | launch film | optional | – |
| submit | ✓ | – | – | – |
| retro | ✓ | per milestone | ✓ | optional |

**Hackathon** — deadline-driven: rules on day 0, the memorable moment in slice 1, the film and submission at the end with ≥ 15% buffer.
**Product** — no submission; review and security gates matter most; caps sized for launch.
**Experiment** — prove or kill a hypothesis fast: idea, spike, build, retro.
**Quick tool** — the minimum that still protects you: guard hooks, .gitignore, CI, secure gate before ship.
