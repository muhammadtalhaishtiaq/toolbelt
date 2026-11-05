---
name: make
description: Makes a complete demo or launch film for a live product in ten stages — brief, story, playable board (you approve), 2x captures of real flows, voiceover, music and sound, composition, QA, draft review rounds (you approve), and the publish kit — stopping at the two approval gates. Use when the user says "make a demo video", "launch video", "film this", "hackathon video", "promo", "a 30-second vertical cut". Works standalone with any URL; reads forge's STATUS/TASKS/RULES if present.
argument-hint: "[url] [length e.g. 3:00 | 1:30 | 0:35 vertical]"
---

# reel: make

Read `${CLAUDE_PLUGIN_ROOT}/playbooks/FILM-GUIDE.md` once per session; it holds the rules that made the Showhow film work.

## Gate (checks real evidence)
- The product URL answers (`curl -sI <url>` → 2xx/3xx). No URL → ask. (A film of features that don't work live is not allowed.)
- Tools: `ffmpeg`, `node` ≥ 20, Chrome/Chromium; Python + Kokoro for voice (offer the install line); HyperFrames for composition (`npx hyperframes --version`; the `hyperframes` skills if installed). Missing pieces: say which stage is affected and the fallback.
- Hackathon: length limit and "new work only" rules from `docs/RULES.md` if present.

## Project folder
`film/` in the project (or `~/Movies/<name>-film/` if there's no project). Add `film/**/*.mp4`, `*.wav`, `*-frames/` to `.gitignore` — media never goes into Git.
```
film/BRIEF.md  SCRIPT.md  APPROVALS.md  board/  capture/  vo/  audio/  art/  comp/  out/
```

## Stages
| # | Skill | Output | Stop? |
|---|---|---|---|
| 1 | `/reel:brief` | BRIEF.md | — |
| 2 | `/reel:story` | SCRIPT.md (beats, VO lines, timings, shot list) | — |
| 3 | `/reel:board` | `board/index.html` playable with temp voice | **you approve** (APPROVALS.md) |
| 4 | `/reel:capture` | `capture/*.mp4` + marks | — |
| 5 | `/reel:voice` | `vo/*.wav` | — |
| 6 | `/reel:sound` | `audio/` + CREDITS.md | — |
| 7 | `/reel:compose` | `comp/` project, draft render | — |
| 8 | `/reel:qa` | sheet, loudness, sharpness, claims table | — |
| 9 | review rounds | `out/draft-N.mp4` + your notes | **you approve** ("love it") |
| 10 | `/reel:publish` | final render, poster, YouTube/X copy, vertical cut | — |

Draft renders are cheap; final renders happen only after approval. Each round: fix every note, re-run QA, render the next draft, show it.

## Never
Fake a product result, show a feature that doesn't exist live, use unlicensed music, or upload/post anything for the user.
