---
name: board
description: Builds a playable HTML storyboard of the film — every beat as a frame with its timing, VO text and a temporary voice, playing in sequence with real still frames from the product where available — so the user can approve the story before any capture or render. Use as stage 3 of /reel:make or when the user says "show me the storyboard". The cheapest place to change the film.
---

# reel: board

1. Build `film/board/index.html` (self-contained): a 16:9 (or 9:16) stage; each beat shows a still (a screenshot of the live product at that state, an art file, or a simple layout sketch for motion graphics), the on-screen text, and a caption with the VO line; a timeline bar with beat names; **Play** runs beats in order with their durations and plays the temp voice (`vo/*.wav` if already made, otherwise the browser's speech synthesis). Keyboard: space play/pause, ←/→ beat.
2. Take product stills with the same Chrome profile (`scripts/chrome.sh`, then a one-step `rec.mjs` plan or a screenshot) at 2× so they are sharp.
3. Make sure it actually plays (open it; if a browser tool is available, check for console errors). A board that doesn't play is not a board.
4. Show it; collect notes; iterate. On approval write `film/APPROVALS.md`: `<date> board approved` (+ notes). Capture does not start without this line.
