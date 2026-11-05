---
name: generate
description: Generates ten distinct product ideas from a theme, problem, hackathon brief or constraint set, each with its user, painful moment, magic moment and riskiest assumption, then sifts them to the top three with a small quick crowd. Use when the user says "give me ideas", "what could I build for…", "brainstorm", "ideas for this hackathon". Part of /seed:run.
argument-hint: "\"<theme>\""
---

# seed: generate

## Process
1. Read the theme and any constraints: `docs/RULES.md` (criteria, required tech), time available, the user's skills and interests if known. Ask at most one question.
2. Write **10 ideas that differ in kind** — vary the user (creator vs consumer vs business), the form (app, API, physical, service), the moment (before / during / after the problem) and the business model. No near-duplicates.
   For each: `{id, name, pitch (one sentence), user, painful_moment, magic (the 10 seconds a demo shows), riskiest_assumption, needs (tech/data), size: S|M|L}`.
3. Filter out ideas that break the rules (terms, required tech, age limits, safety) — say why.
4. **Quick sift**: build a 20-person crowd (`node "${CLAUDE_PLUGIN_ROOT}/scripts/graph.mjs" <run> --size 20` after a minimal `world.json` from the theme), run **one round** of `/seed:simulate` across all ideas, tally, and keep the top 3 by tried/stopped rate. Keep one "wildcard" if the user asked for bold options.
5. Write `ideas.json` with the 3 finalists (keep all 10 in `ideas-all.json`).

## Rules
- Ideas must be buildable in the time available; label L ideas honestly.
- No idea that depends on claims you can't verify (e.g. medical outcomes) without saying so.
