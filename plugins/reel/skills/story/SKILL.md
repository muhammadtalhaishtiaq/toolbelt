---
name: story
description: Writes the film script to time — picks a story shape (3-minute hackathon, 90-second launch, 35-second vertical, 20-second feature reveal), writes voiceover lines at about 2.5 words per second, a shot list mapping every beat to a real capture or a motion graphic, and on-screen text. Use as stage 2 of /reel:make or when the user asks for a video script or storyboard.
---

# reel: story

1. Pick the shape from `${CLAUDE_PLUGIN_ROOT}/playbooks/STORY-SHAPES.md` that fits BRIEF length and platform.
2. Write `film/SCRIPT.md` as a table, one row per beat:
   | # | Time | Beat | VO line | On screen | Source |
   Source is `capture:<flow>#<mark>`, `art:<file>`, or `motion:<graphic>`. **Every product claim's source is a capture.**
3. Timing: ~2.5 spoken words per second; leave 0.4–0.8 s of breathing room between beats; on-screen text ≥ 1.5 s + 0.3 s per word.
4. Write `vo/script.json` (`[{id, text}]`) from the VO column — short sentences, active voice, no jargon the audience doesn't know, questions sparingly (each adds a 0.3 s pause).
5. Send the `director` agent the brief and the script: "Where does attention drop? Is the magic moment early enough? What would you cut?" Apply what's right.
6. Read the VO aloud in your head at time: if a beat runs over, cut words, never speed the voice past 1.0.
