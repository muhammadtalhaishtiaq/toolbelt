---
name: voice
description: Generates the voiceover locally with Kokoro — one WAV per script line, natural pauses (0.3 s after questions, 0.15 s between sentences), a pronunciation map for product names, consistent loudness — and reports each line's real duration so the edit can be timed to it. Use as stage 5 of /reel:make or when the user asks for an AI voiceover or narration.
argument-hint: "[--voice id] [line ids]"
---

# reel: voice

## Setup (once per machine)
```bash
python3 -m venv ~/.cache/kv && ~/.cache/kv/bin/pip install kokoro soundfile numpy
# needs espeak-ng: brew install espeak-ng  |  apt install espeak-ng
```
Ask before installing.

## Process
1. Pick voices: narrator default `am_onyx` (calm, authoritative); a second voice for a "user" line, e.g. `af_heart`. Play 2–3 short samples if the user hasn't chosen: `~/.cache/kv/bin/python "${CLAUDE_PLUGIN_ROOT}/scripts/vo.py" film/vo --voice <id> hook`.
2. Product names: add respellings to `film/vo/pron.json` (e.g. `{"Showhow": "Show how"}`) and re-render the affected lines.
3. Render all: `~/.cache/kv/bin/python "${CLAUDE_PLUGIN_ROOT}/scripts/vo.py" film/vo` → prints each line's duration. Put the durations into SCRIPT.md and adjust beat timings to the voice (not the other way round).
4. Listen for: wrong stress, swallowed words, pauses too long (keep ≤ 0.3 s; users notice more), and lines that run over their beat — fix by rewriting the line.

The voice is AI; the publish kit credits it ("Voiceover: Kokoro (AI voice)").
