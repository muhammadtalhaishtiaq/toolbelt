---
name: finish
description: Closes a feature or fix branch on purpose — runs the full checks, summarises the change, then lets the user choose merge, open a pull request, keep the branch, or discard it, and cleans up any worktree. Use when the user says "merge this", "open a PR", "I'm done with this branch", "wrap this up". Pushing and opening PRs require the user's explicit yes.
---

# Finish a branch

## Gate
`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" finish` (CI green, or local checks if CI can't be read — say which).

## Process
1. Run lint, types, tests and build locally on the branch; all green or stop.
2. Summarise: what changed (by task/F-id), tests added, docs updated, open follow-ups.
3. Offer four options and wait for the choice:
   - **Merge** into the base branch locally (fast-forward or merge commit as the repo does).
   - **Pull request**: push the branch and open a PR with the summary, the test evidence and the linked tasks — only after the user says yes to pushing.
   - **Keep** the branch as is.
   - **Discard** — only after showing what would be lost and getting a second explicit yes.
4. Clean up: remove the worktree (`git worktree remove`) if one was used; delete merged local branches.
5. Update STATUS and TASKS.

## Next
`check.mjs --record finish pass`.
