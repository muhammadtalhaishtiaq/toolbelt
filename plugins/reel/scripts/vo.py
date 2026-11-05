#!/usr/bin/env python3
"""Kokoro voiceover, one WAV per script line, with human pauses between sentences.
usage: python vo.py <dir-with-script.json> [--voice am_onyx] [--speed 0.97] [ids…]
script.json: [{"id": "hook", "text": "YouTube can't see you're stuck. This can.", "voice": "am_onyx?"}]
Pauses: 0.3 s after "?" (never more), 0.15 s after "." or "!". Edge silence trimmed so only our pauses remain.
Pronunciations: put respellings in pron.json {"Showhow": "Show how"} next to script.json.
Install once: python3 -m venv ~/.cache/kv && ~/.cache/kv/bin/pip install kokoro soundfile numpy  (needs espeak-ng)
"""
import argparse, json, re, os
import numpy as np, soundfile as sf
from kokoro import KPipeline

ap = argparse.ArgumentParser(); ap.add_argument('dir'); ap.add_argument('ids', nargs='*')
ap.add_argument('--voice', default='am_onyx'); ap.add_argument('--speed', type=float, default=0.97)
args = ap.parse_args(); d, voice, speed, only = args.dir, args.voice, args.speed, set(args.ids)
pron = json.load(open(os.path.join(d, 'pron.json'))) if os.path.exists(os.path.join(d, 'pron.json')) else {}
SR = 24000
pipes = {}
def pipe(v):
    lang = v[0]  # 'a' American, 'b' British, … (first letter of the voice id)
    if lang not in pipes: pipes[lang] = KPipeline(lang_code=lang, repo_id='hexgrad/Kokoro-82M')
    return pipes[lang]

for line in json.load(open(os.path.join(d, 'script.json'))):
    if only and line['id'] not in only: continue
    v = line.get('voice', voice); text = line['text']
    for k, r in pron.items(): text = re.sub(rf'\b{re.escape(k)}\b', r, text)
    parts = re.findall(r'[^.?!]+[.?!]+|[^.?!]+$', text)
    out = []
    for i, s in enumerate(p.strip() for p in parts if p.strip()):
        a = np.concatenate([x for _, _, x in pipe(v)(s, voice=v, speed=line.get('speed', speed))])
        nz = np.where(np.abs(a) > 0.01)[0]
        a = a[max(0, nz[0] - 600): nz[-1] + 1800] if len(nz) else a
        out.append(a)
        if i < len(parts) - 1: out.append(np.zeros(int(SR * (0.3 if s.endswith('?') else 0.15)), dtype=a.dtype))
    a = np.concatenate(out); sf.write(os.path.join(d, f"{line['id']}.wav"), a, SR)
    print(f"{line['id']}\t{len(a) / SR:.2f}s\t{v}")
