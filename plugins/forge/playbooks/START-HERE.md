# Start here

You only need to remember four commands. Everything else is suggested to you.

| Command | When |
|---|---|
| `/seed:run "<idea or theme>"` | You want ideas, or want to test one before building (separate plugin, optional). |
| `/forge:start` | Any new project or a repo you want forge to manage. |
| `/forge:where` | Any time you're lost: stage, blockers, the exact next command. |
| `/reel:make` | The product is live and you need a demo film (separate plugin). |

You can also just talk: "it's broken", "add login", "ship it", "is this safe?" — the `using-forge` router picks the right step and every lifecycle step checks its gate first.

## Install once per machine
```
/plugin marketplace add muhammadtalhaishtiaq/toolbelt
/plugin install forge@toolbelt
/plugin install seed@toolbelt
/plugin install reel@toolbelt
```
Optional design companions (forge uses them in the UI lane when present): UI UX Pro Max, Impeccable, frontend-design.
Tools the plugins call when available: `git`, `gh` (CI status), `node` ≥ 20, `gitleaks`, `ffmpeg` (reel), Python 3 + Kokoro (reel voice).

## The path of a project
```
start → rules → idea → spike → spec → design → plan → [build ↺ test] → review → secure → ship → (reel) → submit → retro
```
Profiles trim this (see PROFILES.md). Lanes for work inside a project: feature, fix, chore, UI.

## The files every project gets
`CLAUDE.md` · `STATUS.md` (one "Next:" line) · `docs/DECISIONS.md` (wins when docs disagree) · `docs/PRD.md` · `docs/TASKS.md` (each task has Verify) · `docs/LOG.md` (evidence) · `docs/FEEDBACK.md` · `docs/API-NOTES.md` · `CONSTRAINTS.md` · `.forge/` (config, ledger, findings, rules) · security baseline + CI.

## Gates
Every lifecycle command runs `gates/check.mjs <command>` first. It checks real evidence (files, git, CI, the live URL, the ledger) and names the exact fix when something is missing. To go anyway you must give a reason; it's written to DECISIONS and only holds for the current commit.
