---
name: capture
description: Records real product flows at 2x (3840x2160 for 1080p films) with a scripted Chrome DevTools screencast — clicks, typing, file uploads, waits for real results — saving an MP4 and beat marks per flow, using only real model and API calls. Use as stage 4 of /reel:make or when the user asks to "record the app", "capture the flow".
argument-hint: "[flow]"
---

# reel: capture

## Setup
1. `bash "${CLAUDE_PLUGIN_ROOT}/scripts/chrome.sh" <url>` — a separate Chrome profile with DevTools on :9333. The user logs in there if needed (never handle their password).
2. Prepare demo state: a clean demo account or public demo data; no personal data, emails, keys or notifications on screen. Use realistic content — never lorem ipsum.

## Each flow
1. Write `film/capture/<flow>.json` (see the header of `scripts/rec.mjs` for the format): `size` 1920×1080 (or 1080×1920 vertical), `dpr: 2`, steps with `mark`s at every beat the script references, `untilJs` waits for real results (never fixed sleeps for model calls).
2. Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/rec.mjs" film/capture <flow> film/capture/<flow>.json`.
3. Check: open the MP4 at a few marks (or `scripts/qa.sh film/capture/<flow>.mp4` for a contact sheet). Re-record if text is blurry, the cursor is lost, a toast covers the action or the result isn't real.
4. Note real wait times (e.g. "steps took 61 s") — the edit cuts them and labels "⏩ 60 s".

## Rules
- Real calls only for product claims. If a model is down, wait or reschedule — never mock it on camera. Fixtures, if ever shown, are labelled "TEST FIXTURE" on screen.
- Record at 2× even for a 1080p film: punch-ins stay sharp (keep zoom ≤ 1.25 on footage).
- Mobile flows: `mobile: true`, size 390×844, dpr 3.
- Capturing exposes real product bugs — log them for the product (forge `/forge:feedback` if installed) and fix before final capture.
