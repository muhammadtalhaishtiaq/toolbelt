---
name: ship
description: Ships to production safely — runs the ship gate (CI green at HEAD, tasks done, a fresh security pass, no open high findings, UI audit, caps sized), asks before deploying, then runs a live smoke test, a failure drill, the real-device check, a rollback note and a CI/deploy watch loop. Use when the user says "deploy", "ship it", "go live", "launch", "push to prod". For "make it production ready" run only the gate as a checklist and turn gaps into tasks. Not for merging a branch (use /forge:finish).
---

# Ship

## Gate
`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" ship`. If blocked, show the output as-is and stop. Offer the fixes; a skip needs the user's reason (`--skip ship <id> "<reason>"`).

## Before deploying
1. **Caps for the peak**: list every rate limit, daily cap and quota and size them for the expected peak (demo day, launch traffic), not testing. Write "Caps sized for <peak> on <date>" in `docs/DEPLOY.md`. (Showhow lesson: test-sized image caps returned 429s during filming.)
2. **Env**: every variable in `.env.example` exists in the host (names only — ask the user to confirm; never read values).
3. **Rollback**: how to restore the previous deploy and undo the last migration — write it in DEPLOY.md.
4. **Ask the user** for a go-ahead to deploy, naming the target and what will change.

## Deploy and watch
5. Deploy the way the project does (CI on push to main, host CLI, etc.). Then watch CI and the deploy at the pace they change — use `/loop` with ~5-minute checks (or a background wait) until done; report red steps with the failing log lines.

## After deploying
6. **Smoke test** the critical path on the live URL (script in `scripts/smoke.*` if present; otherwise a scripted request plus one browser pass). Record timings.
7. **Failure drill** (preview or staging, never prod data): break the provider key or block the provider host → the app shows an honest error with a retry, leaks no secret or stack trace, and never shows a fake success.
8. **Headers**: `curl -sI <url>` — CSP, HSTS, nosniff, Referrer-Policy, frame-ancestors present.
9. **Real devices** (UI): ask the user to run the 5-step phone script (iOS Safari + Android Chrome) and report.
10. Set `liveUrl` in `.forge/config.json`. Log everything in `docs/LOG.md` with absolute dates.

## Next
`check.mjs --record ship pass` (or `fail`). Next: hackathon → `/reel:make` then `/forge:submit`; product → `/forge:secure live` and `/forge:retro` later.
