---
name: run
description: Runs the whole seed pipeline in one go — from a theme or an idea to ideas, real-world research, a structured simulated crowd, a three-round simulation with a shock, counted results, a go/pivot/kill verdict, an IDEA-BRIEF.md and a visual IDEA-BOARD.html that opens in the browser. Use when the user says "test my idea", "is this worth building", "validate this", "give me ideas for…", "would people use…", "simulate the market". Works on its own; forge picks up the brief if installed.
argument-hint: "\"<theme or idea>\" [quick|deep]"
---

# seed: run

seed rehearses an idea on a simulated crowd so you find the objections before you build. It is a rehearsal, not proof — every output says so, and it always ends with a real-world check.

Method and guards: `${CLAUDE_PLUGIN_ROOT}/playbooks/CROWD-METHOD.md`, `${CLAUDE_PLUGIN_ROOT}/playbooks/BIAS-GUARDS.md`. Read both before the first run in a session.

## Setup
1. Mode: **verify** (the user gave an idea) or **generate** (a theme, problem or event brief). If unclear, ask one question with a default ("I'll treat this as one idea to test").
2. Profile: **quick** (≈30 personas, rounds 1–2, 2 runs, light research; a few minutes) or **deep** (≈120 personas, rounds 1–3 with a shock, 2 runs, full research). Default quick for hackathons and brainstorming, deep for product bets. Tell the user the approximate number of helper calls before a deep run.
3. Create the run folder `seed/<YYYY-MM-DD>-<slug>/` and write `brief.json`: `{id, date, mode, question, profile, shock?, rulesPath?}`. If `docs/RULES.md` exists (a forge project), aim ideas at its criteria.

## Pipeline (each step is its own skill; run them in order)
| Step | Skill | Writes |
|---|---|---|
| 1 | `/seed:generate` (generate mode) → 10 ideas, quick sift to top 3 | `ideas.json` |
| 1 | verify mode: write the one idea (plus a rival and "do nothing") | `ideas.json` |
| 2 | `/seed:research` | `world.json` (segments, rivals, evidence with links) |
| 3 | `/seed:crowd` | `crowd.json` |
| 4 | `/seed:simulate` | `actions.jsonl` |
| 5 | `/seed:report` (tally in code, explain, verdict) | `tally.json`, `summary.json`, `realcheck.json` |
| 6 | `/seed:brief` | `IDEA-BRIEF.md`, `IDEA-BOARD.html` (opened) |
| — | `/seed:interview`, `/seed:compare` | on demand, after the board |

## Gate between steps
Don't start a step until the previous file exists and parses. If a helper returns invalid JSON lines, re-ask only that batch (tally reports skipped lines).

## End
Show the verdict in one line, the top objection, and the path of `IDEA-BOARD.html` (open it with `open`/`xdg-open`/`start`). Offer: interview the crowd, change the idea and re-run, or hand to forge (`/forge:start` picks up `IDEA-BRIEF.md`).
