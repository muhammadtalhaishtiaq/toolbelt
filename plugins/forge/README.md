# forge

Run any project from first idea to launch with Claude Code — and always know the next step.

- **A router for vague requests.** Say "it's broken", "add login", "ship it", "is this safe?" — `using-forge` reads what you said plus the project's stage and picks the lane (project · feature · fix · chore · UI) and the command.
- **Gates on real evidence.** Every lifecycle command checks that earlier steps really happened (files, git, CI on HEAD, the live URL, the ledger) and names the exact fix. Skipping needs a reason and lasts one commit.
- **Agents with narrow jobs.** red-team, judge, code-reviewer, security-auditor, tester, scout, design-critic. Findings are validated before anyone acts on them.
- **Bounded loops.** Build loop (test-first, two-stage check, commit), review loop, feedback loop, ship watch, and a retro loop that improves this plugin.
- **Security from commit one.** Guard hooks, a stage-by-stage checklist, CI templates with canary secrets and full-history scanning.
- **No AI-looking UI.** A UI lane with anti-slop rules and a screenshot audit; uses UI UX Pro Max, Impeccable and frontend-design when installed.

## Install
```
/plugin install forge --marketplace muhammadtalhaishtiaq/toolbelt
```

Start with [`playbooks/START-HERE.md`](playbooks/START-HERE.md).

## Commands (skills)
| | |
|---|---|
| Route | `using-forge` (automatic), `where` |
| Start & shape | `start`, `rules`, `idea`, `spike` |
| Define | `spec`, `design`, `constraints`, `plan` |
| Build | `build [T-id\|auto]`, `test`, `debug`, `ui [audit]` |
| Check | `review [scope]`, `feedback`, `secure [stage]` |
| Release | `ship`, `finish`, `submit` |
| Learn & teach | `retro`, `rule "<plain words>"` |

## Layout
```
skills/      22 workflows (SKILL.md each)
agents/      7 helpers
hooks/       status (SessionStart) · guard (PreToolUse/PostToolUse)
gates/       gates.json + check.mjs (+ tests)
references/  core behaviours, definition of done, security/testing/perf/observability, anti-slop, skill anatomy, orchestration
templates/   docs, security baseline, CI
playbooks/   START-HERE, PROFILES, SECURITY-BASELINE, LESSONS
evals/       routing, quiet and pressure cases for `claude plugin eval`
```

## Tests
```
node --test gates/check.test.mjs hooks/guard.test.mjs   # deterministic, free
claude plugin eval .                                    # routing + behaviour, uses tokens
```
