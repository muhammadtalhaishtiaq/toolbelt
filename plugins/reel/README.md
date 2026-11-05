# reel

Make a demo film of any live product from one command.

```
/plugin install reel --marketplace muhammadtalhaishtiaq/toolbelt
/reel:make https://your-app.example 3:00
```

Ten stages with two approval gates: brief → story → **playable board (you approve)** → 2× captures of real flows → Kokoro voiceover → licensed music + SFX → HyperFrames composition → QA (contact sheet, loudness, sharpness, every claim traced to a capture) → **draft rounds (you approve)** → publish kit (final, poster, YouTube/X/LinkedIn copy, vertical cut).

Built from the Showhow hackathon film. Rules in `playbooks/FILM-GUIDE.md`, `MOTION-RULES.md`, `STORY-SHAPES.md`, `LICENSES.md`, `PLATFORMS.md`.

Needs: `ffmpeg`, `node` ≥ 20, Chrome/Chromium; Python 3 + Kokoro (voice); HyperFrames (composition; falls back to a simpler ffmpeg edit).

Scripts: `scripts/chrome.sh` (separate Chrome with DevTools) · `scripts/rec.mjs` (scripted 2× capture with beat marks) · `scripts/vo.py` (Kokoro lines with natural pauses) · `scripts/qa.sh` (contact sheet, LUFS, sharpness).
