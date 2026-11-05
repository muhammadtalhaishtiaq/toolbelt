---
name: brief
description: Writes the final outputs of a seed run — IDEA-BRIEF.md (a plain file other tools such as forge read) and IDEA-BOARD.html (a self-contained, offline visual page with the verdict stamp, finalists side by side, reaction funnels per group, a clickable crowd map, objections with quotes, evidence links, the real-check checklist and run stability) — and opens the board. Use as the last step of /seed:run or when the user says "show me the results", "make the board", "write it up".
---

# seed: brief

## 1. The board (for people)
```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/board.mjs" <run-dir>
```
It reads brief, ideas, world, crowd, tally, summary and realcheck JSON and writes `<run-dir>/IDEA-BOARD.html`. Every chart is computed from `tally.json`, so it always matches the numbers. It works offline, in light and dark mode, at phone width.
Open it (`open` on macOS, `xdg-open` on Linux, `start` on Windows). If a browser tool is available, take one screenshot and check nothing is clipped; if the forge `design-critic` agent exists, you may ask it for a quick pass.

## 2. The brief (for tools)
Write `<run-dir>/IDEA-BRIEF.md` from `${CLAUDE_PLUGIN_ROOT}/templates/IDEA-BRIEF.md`, then copy it (and the board) to the project root as `IDEA-BRIEF.md` / `IDEA-BOARD.html` if the user wants to build it. Fill every section from the run files; numbers exactly as tallied; mark what is still unverified.

## 3. Tell the user
One line verdict, top objection, the smallest change, the kill signal, and the board path. Next: interview, change and re-run, or `/forge:start`.
