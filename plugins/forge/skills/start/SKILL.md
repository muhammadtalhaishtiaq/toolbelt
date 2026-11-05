---
name: start
description: Starts or adopts a project with forge — asks up to five questions, picks a profile (hackathon, product, experiment, quick tool), writes CLAUDE.md, STATUS.md, docs/, the quality bar, the security baseline and CI, then makes a scanned first commit. Use when the user says "let's build…", "new project", "start", "set this repo up", or there is no STATUS.md yet. Picks up IDEA-BRIEF.md if one exists. Not for adding a feature to a project that already uses forge.
argument-hint: "[one-line idea]"
---

# Start a project

## Purpose
Give every project the same skeleton from minute one, so the next step is always obvious and secrets are protected before the first commit.

## Gate
None. If `STATUS.md` and `.forge/` already exist, stop: say this is already a forge project and run `/forge:where`.

## Process

### 1. Detect before asking
- Is this an empty folder or an existing repo? (`git status`, list top-level files, package manifests, existing docs.) For an existing repo: summarise the stack, scripts, tests and CI you found in 3 lines; do not overwrite existing files — merge into them.
- Is there an `IDEA-BRIEF.md` (from seed or elsewhere)? If yes, read it and pre-fill answers 1, 2 and 5.
- Is git initialised? If not, `git init`.

### 2. Ask (one message, max five questions, each with a default)
1. **What is it?** One sentence and who it's for.
2. **Kind:** hackathon · product · experiment · quick tool. (Sets the profile; see `${CLAUDE_PLUGIN_ROOT}/playbooks/PROFILES.md`.)
3. **Deadline** as an absolute date, time and time zone (or "none"); solo or team.
4. **Stack:** suggest one from the kind (default for web: Vite + React + TypeScript, plain CSS tokens, Vercel functions, Supabase). Does it have a UI? (Sets `ui: true`.)
5. **External rules:** links to an event guide, judging criteria, submission form, API terms (or "none").

### 3. Write the skeleton (from `${CLAUDE_PLUGIN_ROOT}/templates/`)
Fill every `{{…}}` placeholder; never leave one in place. Use absolute dates.

| Template | Goes to | Profiles |
|---|---|---|
| `docs/CLAUDE.md` | `CLAUDE.md` (merge if one exists) | all |
| `docs/STATUS.md` | `STATUS.md` | all |
| `docs/config.json` | `.forge/config.json` | all |
| `docs/DECISIONS.md`, `docs/LOG.md`, `docs/TASKS.md`, `docs/FEEDBACK.md` | `docs/` | all |
| `docs/PRD.md`, `docs/API-NOTES.md`, `docs/DEPLOY.md` | `docs/` | hackathon, product, experiment |
| `docs/RULES.md`, `docs/SUBMISSION.md` | `docs/` | hackathon |
| `docs/CONSTRAINTS.md` | `CONSTRAINTS.md` (defaults: coverage 70, bundle 200, p95 500) | hackathon, product |
| `security/settings.json` | `.claude/settings.json` (merge permission lists) | all |
| `security/gitignore` | `.gitignore` (merge) | all |
| `security/env.example` | `.env.example` (rename vars to the stack's real ones) | all |
| `security/gitleaks.toml` | `.gitleaks.toml` | all |
| `security/SECURITY.md` | `SECURITY.md` | hackathon, product |
| `security/scan-bundle.mjs` | `scripts/scan-bundle.mjs` | if there is a client bundle |
| `ci/ci.yml`, `ci/dependabot.yml` | `.github/workflows/ci.yml`, `.github/dependabot.yml` (adapt scripts and canary names to the stack) | all except quick (quick: ci.yml only) |

If there is an `IDEA-BRIEF.md`, add a DECISIONS entry "Idea chosen: …" citing it, and move it to `docs/IDEA-BRIEF.md` (keep a copy of `IDEA-BOARD.html` next to it if present).

### 4. UI companions (only if `ui: true`)
Check which design skills are available in this session (look for `ui-ux-pro-max`, `impeccable`, `frontend-design` in the skill list). Tell the user which are present; for missing ones, offer the install command once (ask before installing). forge's built-in rules (`references/ANTI-SLOP.md`) apply either way.

### 5. First commit, scanned
1. `git add -A` then confirm no `.env*` (except `.env.example`) is staged.
2. If `gitleaks` is installed: `gitleaks detect --no-banner --redact` (or `gitleaks git .`). If not installed, say so and rely on CI.
3. Commit: `chore: start project with forge (<profile>)`.
4. `node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" --record start pass --note "<profile>"`.

### 6. Next
Set `STATUS.md`: Stage `0 Start`; Next: hackathon/product → `/forge:rules` (if links given) else `/forge:idea`; experiment → `/forge:idea`; quick → `/forge:spec`.

## Outputs
CLAUDE.md, STATUS.md, .forge/config.json, docs/*, CONSTRAINTS.md, .claude/settings.json, .gitignore, .env.example, .gitleaks.toml, CI, first commit, ledger entry.

## Common rationalizations
| Excuse | Reality |
|---|---|
| "It's just a quick script, skip the skeleton" | Use the quick profile — it is five files. The .gitignore and guard still stop a key leak on day one. |
| "We'll add CI later" | Later never comes before the first leak. The template takes a minute to adapt. |
| "I'll fill the placeholders later" | A `{{PLACEHOLDER}}` left in CLAUDE.md misleads every future session. |

## Verification
- [ ] No `{{` left in any written file (`grep -r "{{" CLAUDE.md docs .forge`).
- [ ] `.env` patterns ignored (`git check-ignore .env.local` succeeds).
- [ ] First commit exists, scan result recorded in `docs/LOG.md`.
- [ ] `check.mjs --status` prints the project.
