---
name: review
description: Runs an independent review at a milestone — red-team, code-reviewer and security-auditor agents in parallel on the exact scope, then validates every finding before acting, filters to high-confidence items, records them in .forge/findings.json and docs/LOG.md, and fixes or rejects each with a reason. Use when the user says "review this", "check my code", "is this good", after a slice, before ship or submit, or with "review spec" for the PRD. Never claims a review that did not run.
argument-hint: "[spec | plan | slice | diff <range> | demo | submission]"
---

# Review

## Gate
`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" review` (needs commits; for `spec`/`plan` only the doc).

## Scope
Exact and written down: a doc (`docs/PRD.md`), a diff range (`git diff <last-review-commit>..HEAD` — find it in the ledger), a demo script, or the submission pack.

## Process
1. **Fan out** in one message (parallel):
   - `red-team` — always.
   - `code-reviewer` — for code scopes.
   - `security-auditor` — for code scopes touching input, auth, data, files, network, secrets, or before ship/public.
   - `judge` — for demo or submission scopes.
   - `design-critic` — when the diff touches UI (with fresh screenshots).
   Give each the scope, the paths of CLAUDE.md/DECISIONS/PRD/CONSTRAINTS, and the instruction: "findings only, ranked, with evidence and confidence; do not rubber-stamp".
2. **Merge**: de-duplicate; drop anything below 80% confidence, pre-existing outside the scope, or style a linter already enforces.
3. **Validate each remaining finding** before acting: read the cited code/doc yourself, or for subtle claims send one focused check ("Is `x` really unvalidated on the path from `api/a.ts:12` to `db.ts:40`? Answer with evidence."). Facts about external APIs/terms → `scout`.
4. **Record**: write/update `.forge/findings.json` entries `{id, severity, status, source, where, summary}`. Status `open` → `fixed` (commit) or `rejected` (reason).
5. **Resolve**: fix critical/high now (via `/forge:build`-style cycle or `/forge:debug`), or reject with a reason, or defer as a task with the user's agreement. Medium/low → tasks or rejected.
6. **Log** in `docs/LOG.md`: date, scope, which agents ran, key findings, decisions. If an agent could not run, say so and do a distinct self-review labelled as such.

## Rules
- The reviewer advises; the main session decides and stays accountable.
- Never edit a finding's severity down to pass the ship gate; reject with a reason or fix it.

## Next
`check.mjs --record review pass --scope <scope>`. Next: fixes, else the next slice / `/forge:secure` / `/forge:ship`.
