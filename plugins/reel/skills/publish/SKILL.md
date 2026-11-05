---
name: publish
description: Produces the publish kit after the user approves the draft — final render, a poster frame, a simple YouTube title and description with credits, an X post under 280 characters (video ≤ 2:20), LinkedIn text, optional vertical 0:35 cut with captions, and an upload checklist. Use as stage 10 of /reel:make or when the user asks for the YouTube description, tweet, thumbnail or a short version. The user uploads and posts; never post for them.
---

# reel: publish

1. **Final render** at the approved settings (1080p H.264, AAC 48 kHz; 4K only if captures were 2× and the platform benefits). Re-run `qa.sh` on it.
2. **Poster**: the magic-moment frame with the product name — 1920×1080 (YouTube thumbnail 1280×720 copy), and 1200×675 for X/LinkedIn. Large, legible, no tiny UI text.
3. **YouTube**: title ≤ 60 chars (product + promise), a **simple** description: one-line promise, two lines of what it does, built-with line, links (try it, code), "Every product shot is the live app with real model calls; waits are shortened and marked ⏩" if true, and the credits from `audio/CREDITS.md` + "Voiceover: Kokoro (AI voice)". Unlisted vs public per the event's rules. Not "made for kids".
4. **X**: one post ≤ 280 characters with the hook, the magic moment in words, the link, the event tag/handles; video attached directly (≤ 2:20 for most accounts — use the vertical or a short cut if longer). Optional 3–5 post thread.
5. **LinkedIn**: 3 short paragraphs (problem, what it does, what you learned) + links.
6. **Vertical cut** (if asked): 1080×1920, opens on the magic moment, captions always on, one line of text per beat, ends on a loop-friendly frame.
7. Write everything to `film/out/PUBLISH.md`, and to forge `docs/SUBMISSION.md` (video link field) if present once the user has the URL.
