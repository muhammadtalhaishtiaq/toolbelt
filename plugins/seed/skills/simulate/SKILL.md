---
name: simulate
description: Runs the crowd simulation — round 1 everyone sees a neutral launch post per idea, round 2 they also see a feed of others' replies, round 3 a shock (a free rival, a price rise, a bad review) — with personas played in parallel batches by the persona-batch agent, twice, writing one JSON line per reaction to actions.jsonl. Use as step 4 of /seed:run or to re-run with a different shock.
argument-hint: "[--rounds 1-3] [--shock \"…\"]"
---

# seed: simulate

## Inputs
`crowd.json`, `ideas.json`, `brief.json` (profile, shock).

## 1. Launch posts (one per idea, same template, no hype)
Write `posts.json`: for each idea a 60–90-word post as a real launch would read — what it is, who it's for, what it costs (state a realistic price; free tier if any), one screenshot description. Same tone and length for every idea, including the rival and "do nothing" options in verify mode. The post must not argue for the idea.

## 2. Rounds
| Round | Each persona sees | Purpose |
|---|---|---|
| 1 | the posts | first reaction |
| 2 | the posts + a feed of 8 real replies from round 1 (`node "${CLAUDE_PLUGIN_ROOT}/scripts/tally.mjs" <run> --feed 1`) | social influence |
| 3 (deep) | the posts + feed + the **shock** (`brief.shock`, default: "a free competitor launches the same core feature") | resilience |

## 3. Batches (parallel)
Split the crowd into batches of 15 (quick) or 20 (deep). For each round, send one `persona-batch` agent per batch **in a single message** (parallel). Prompt each with: the batch's persona JSON, the posts, the round, the feed/shock if any, the run number, and the output contract below. Rounds run in order; batches within a round run in parallel.

## 4. Two runs
Repeat the rounds as run 2 with batches shuffled (different grouping) — same crowd. Stability between runs is part of the verdict.

## Output contract (one line per persona × idea × round)
```json
{"run":1,"round":1,"idea":"leafcheck","persona":"renter-004","action":"try","objection":null,"price_ok":null,"alternative":null,"quote":"I'd try it on the fern that keeps dying"}
```
- `action` ∈ ignore · scroll · like · reply · share · try · pay · object
- `object` needs `objection` ∈ price · trust · privacy · effort · no-need · already-solved · quality · other
- `pay` counts only with `price_ok: true` **and** `alternative` (what they'd drop or stop paying for); otherwise tally downgrades it to `try`.
- `quote` ≤ 25 words, in the persona's voice; required for reply/object/try/pay.
Append every batch's lines to `actions.jsonl`. Check line counts: personas × ideas per round per run.
