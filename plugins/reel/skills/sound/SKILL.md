---
name: sound
description: Chooses licensed music and sound effects for the film — CC0 or CC-BY tracks with exact attribution, interface SFX for clicks and reveals — and sets the mix targets (voice-led, music ducked under speech, −14 to −16 LUFS, true peak ≤ −1 dB). Use as stage 6 of /reel:make or when the user asks for background music or sound effects. Never uses commercial or unclear-licence tracks.
---

# reel: sound

1. Read `${CLAUDE_PLUGIN_ROOT}/playbooks/LICENSES.md`.
2. **Music**: offer 3–5 candidates that fit the one feeling and the tempo of the cut (calm-confident 90–110 BPM is a safe default for product demos). Download into `film/audio/` with the licence page URL. Save `film/audio/CREDITS.md` with the exact attribution line each licence requires.
3. **SFX**: soft clicks/ticks for cursor clicks, a short whoosh for transitions, a gentle chime for results (Kenney packs, CC0). Keep them quiet (−24 to −18 dB under the voice).
4. **Mix plan** in SCRIPT.md: music −20 to −24 dB under voice, rising in gaps and on the end card; cues change on scene changes, never mid-sentence; silence or a hit at the magic moment.
5. If HyperFrames is used, its audio skills handle ducking and fades; otherwise ffmpeg `sidechaincompress`/`volume` with keyframes.
