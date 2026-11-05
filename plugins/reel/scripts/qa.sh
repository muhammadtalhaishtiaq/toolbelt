#!/usr/bin/env bash
# Film QA: contact sheet (a frame every 2 s), loudness (integrated LUFS, true peak), blur score, duration and size.
# usage: scripts/qa.sh film.mp4 [max_seconds]
set -euo pipefail
F="$1"; MAX="${2:-0}"; B="${F%.*}"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$F"); RES=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of csv=p=0 "$F")
echo "duration ${DUR}s · video ${RES}"
if [ "$MAX" != "0" ] && awk "BEGIN{exit !($DUR > $MAX)}"; then echo "FAIL: longer than ${MAX}s"; fi
ffmpeg -loglevel error -y -i "$F" -vf "fps=1/2,scale=480:-1,tile=6x$(awk "BEGIN{print int(($DUR/2+5)/6)+1}")" -frames:v 1 "${B}-sheet.jpg" && echo "contact sheet ${B}-sheet.jpg"
ffmpeg -hide_banner -nostats -i "$F" -af loudnorm=print_format=summary -f null - 2>&1 | grep -E "Input Integrated|Input True Peak" | sed 's/^/loudness /'
echo "target: −14 to −16 LUFS integrated, true peak ≤ −1 dBTP"
if ffmpeg -hide_banner -filters 2>/dev/null | grep -q blurdetect; then
  ffmpeg -hide_banner -nostats -i "$F" -vf "fps=1,blurdetect=block_width=32:block_height=32" -f null - 2>&1 | grep -o "blur mean:[0-9.]*" | tail -1 | sed 's/^/sharpness /'
  echo "blur mean: lower is sharper; compare scenes, investigate any scene far above the rest"
fi
ls -lh "$F" | awk '{print "size " $5}'
