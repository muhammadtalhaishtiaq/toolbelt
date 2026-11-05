---
name: qa
description: Checks a film draft before the user sees it — contact sheet every 2 seconds, duration against the limit, loudness and true peak, sharpness per scene, captions in the safe area, every on-screen product claim traced to a real capture, licence credits present — and has the viewer agent watch it cold. Use as stage 8 of /reel:make or when the user asks "is the video ready", "check the video".
argument-hint: "<film.mp4>"
---

# reel: qa

1. `bash "${CLAUDE_PLUGIN_ROOT}/scripts/qa.sh" <film.mp4> <max_seconds>` → duration, resolution, contact sheet, loudness, sharpness.
2. Read the contact sheet image. Look for: blurry text, zoom past 1.25 on footage, empty frames, a cursor lost off-screen, captions overlapping UI, personal data or keys visible, unreadable small text, dead waits not cut.
3. **Claims table** in `film/QA.md`: every on-screen or spoken product claim → the capture file and mark that proves it. Any claim without a capture is cut or re-captured.
4. Audio targets: integrated −14 to −16 LUFS, true peak ≤ −1 dBTP; voice always intelligible over music.
5. Send the `viewer` agent the contact sheet, SCRIPT.md and BRIEF.md: "You've never seen this product. What do you understand at 0:10, 0:40 and the end? Where did you get lost or bored?"
6. Fix, re-render, repeat once. Then show the user the draft with a short QA summary.
