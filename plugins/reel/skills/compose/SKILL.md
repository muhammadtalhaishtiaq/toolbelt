---
name: compose
description: Assembles the film — real captures cut to the voiceover, motion-graphic titles, callouts, cursor highlights, captions burned in, wait cuts marked "⏩ N s", music and SFX — as a HyperFrames (HTML to video) project with one composition per scene, then renders a draft. Use as stage 7 of /reel:make or when the user asks to edit or animate the video. Falls back to a simpler ffmpeg edit if HyperFrames isn't available.
---

# reel: compose

## With HyperFrames (preferred)
If the `hyperframes` skills are installed, load `/hyperframes` and follow its contract (it owns timing attributes, seekable animation and media playback). Otherwise `npx hyperframes init film/comp` and read its CLAUDE.md.
1. One composition per scene from SCRIPT.md (`hook`, `problem`, `create`, `magic`, …), each timed to its VO WAV.
2. Footage: place capture clips with `data-media-start` at the mark times; cut waits and overlay a small "⏩ 60 s" chip; never speed up footage that shows a result being produced without saying so.
3. Motion: follow `${CLAUDE_PLUGIN_ROOT}/playbooks/MOTION-RULES.md` — one idea per scene, punch-ins ≤ 1.25× on footage, callouts that point at the real UI element, text on screen long enough to read.
4. Captions: burned in, 2 lines max, high contrast, safe area respected; always on for vertical cuts.
5. Audio: VO on its own track, music ducked under it, SFX on clicks/reveals.
6. Brand: the product's own colours and fonts (read its tokens); no stock AI looks (`ANTI-SLOP` rules apply to graphics too if forge is installed).
7. Render a draft at 1080p into `film/out/draft-N.mp4`; run `/reel:qa`.

## Fallback (no HyperFrames)
ffmpeg concat of trimmed clips + `drawtext` titles + VO/music mix. Say plainly the motion graphics will be simpler.
