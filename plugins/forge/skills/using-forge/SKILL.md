---
name: using-forge
description: Routes any software request to the right forge workflow. Use at the start of any development task, or whenever the request is vague or you are unsure what to do next — "let's build…", "add…", "it's broken", "make it better", "is this ready", "ship it", "clean this up", "what now", "where were we", "is it safe", "I tested it and…". Reads what the user said plus the project stage and picks the lane and command. Not for non-software questions.
---

# Using forge

forge runs projects through lanes of commands. Each command checks a **gate** (real evidence that earlier steps happened) before doing work. This skill decides which command to run.

Core rules for everything below: `${CLAUDE_PLUGIN_ROOT}/references/CORE-BEHAVIOURS.md`. Read it once per session.

## Step 1 — know where the project is

```bash
node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" --status
```

If `${CLAUDE_PLUGIN_ROOT}` is not set in your shell, find the script once: `ls ~/.claude/plugins/cache/*/forge/*/gates/check.mjs` (or the local plugin path) and use that path for the session.

- "No STATUS.md here" → this is not a forge project yet. New work → `/forge:start`. Existing repo the user wants managed → `/forge:start` (it adopts existing code).
- Otherwise note **Stage**, **Next**, open tasks and findings.

## Step 2 — pick the lane

| The user's request is about… | Lane | First command |
|---|---|---|
| a new product/app/tool, or no forge files yet | **Project** | `/forge:start` |
| adding or changing behaviour in an existing project ("add X", "support Y", "change how Z works") | **Feature** | explore → clarify → designs → `/forge:plan` (feature) |
| something not working ("broken", "error", "fails", "crash", "wrong result", a stack trace, a red test) | **Fix** | `/forge:debug` |
| upkeep with no behaviour change ("update deps", "rename", "bump", "clean up", "refactor X") | **Chore** | scope check → change → checks → commit |
| UI look/feel ("make it look better", "redesign", "this looks like AI", a new page) | **UI** | `/forge:ui` |

## Step 3 — map common phrases (with the stage)

| User says | Do |
|---|---|
| "what now?", "where were we", "status" | `/forge:where` |
| "let's build …", "new idea", "start a project" | `/forge:start` (if `IDEA-BRIEF.md` exists it is used) |
| "is this a good idea?", "should I build …", "ideas for …" | `/forge:idea`; suggest `/seed:run` if the seed plugin is installed and the stakes are high |
| "here are the rules / hackathon link / form" | `/forge:rules` |
| "will this API work?", "can X do Y?" | `/forge:spike` |
| "write the spec", "what exactly are we building" | `/forge:spec` |
| "show me how it would look", "mockup" | `/forge:design` |
| "plan it", "break it down" | `/forge:plan` |
| "continue", "next task", "keep going", "build it" | `/forge:build` (add `auto` only if the user asks to keep going unattended) |
| "add tests", "is this tested" | `/forge:test` |
| "review this", "check my code", milestone reached | `/forge:review` |
| "I tested it and …", screenshots of problems, a list of complaints | `/forge:feedback` |
| "is it safe?", "security", "before I make it public" | `/forge:secure <stage>` |
| "make it production ready" | run the `ship` gate as a checklist, show what's missing, turn it into tasks. **Do not deploy.** |
| "deploy", "ship it", "go live" | `/forge:ship` (gate first; ask before deploying) |
| "merge this", "open a PR", "done with this branch" | `/forge:finish` |
| "submit", "fill the form" | `/forge:submit` |
| "never let it …", "always …" (a standing rule) | `/forge:rule` |
| "set the quality bar", "standards", "coverage target" | `/forge:constraints` |
| "make a demo video" | `/reel:make` if installed; otherwise say it's not installed |
| "what did we learn", project over | `/forge:retro` |
| "skip the tests / review / gate" | Push back once with the concrete cost; offer the smallest version that counts; if the user still insists, record it with `check.mjs --skip <gate> <id> "<reason>"`. |

## Step 4 — when it is still unclear

1. If one answer would change the lane or waste > 30 minutes if wrong, ask **one** question with a default: "Is this a new feature or a bug in the existing upload? I'll treat it as a bug unless you say otherwise."
2. Otherwise write an ASSUMPTIONS block (see CORE-BEHAVIOURS) and proceed.
3. Never start a lifecycle command without its gate. Never skip a gate silently.

## Lane recipes

**Feature lane** (inside an existing project):
1. Explore: read the code paths involved (use an Explore helper for wide searches) and summarise how it works today, with file paths.
2. Clarify: list every underspecified detail (edge cases, error handling, data, permissions, UX). Ask them together; do not design until answered. Write gaps as `[NEEDS CLARIFICATION]` in a short feature section of `docs/PRD.md`.
3. Design: 2–3 approaches (smallest change · cleanest · most robust) with trade-offs and your recommendation. Wait for the user's pick.
4. `/forge:plan` adds the feature as a slice; then the build loop; then `/forge:review`; then `/forge:finish`.

**Chore lane:** state the exact scope (files, what will not change) → make the change → run lint, types, tests, build → one commit. If behaviour changes after all, switch to the feature lane.

## After any command
Each command updates `STATUS.md` ("Stage:", "Next:") and the ledger. End your reply with the next command in one line.

## Red flags (you are skipping forge)
- Writing code before a gate check on a forge project.
- "This is too small for the process" on something that touches money, auth, user data or model output.
- Saying "done" without evidence. Saying "reviewed" when no agent ran.
