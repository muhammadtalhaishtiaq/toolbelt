#!/usr/bin/env bash
# Starts a separate Chrome profile with DevTools on port 9333 for rec.mjs. Your normal Chrome profile is not touched.
# usage: scripts/chrome.sh [url]
set -euo pipefail
PORT="${REEL_CDP_PORT:-9333}"; PROFILE="${REEL_PROFILE:-$HOME/.cache/reel-chrome}"
for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" google-chrome chromium chromium-browser; do
  if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then CHROME="$c"; break; fi
done
[ -z "${CHROME:-}" ] && { echo "Chrome/Chromium not found"; exit 1; }
mkdir -p "$PROFILE"
"$CHROME" --remote-debugging-port="$PORT" --user-data-dir="$PROFILE" --no-first-run --no-default-browser-check \
  --autoplay-policy=no-user-gesture-required --window-size=1920,1080 "${1:-about:blank}" >/dev/null 2>&1 &
echo "Chrome on :$PORT (profile $PROFILE). Log in to the product here if the flow needs it."
