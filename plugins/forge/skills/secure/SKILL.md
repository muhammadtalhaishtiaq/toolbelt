---
name: secure
description: Runs the security gate for a stage — day0, build, push, ship, public or live — walking the checklist, verifying "auto" items actually ran, sending the security-auditor agent through trust boundaries and data flow, recording findings and evidence. Use when the user asks "is it safe", "security check", "before we go live", "before making the repo public", "did we leak anything", or when the ship/submit gate asks for it. Not a substitute for fixing findings.
argument-hint: "[day0 | build | push | ship | public | live]"
---

# Secure

## Gate
`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" secure` (needs commits).

## Stage
Use the argument; otherwise infer: before first deploy → `ship`; repo about to go public → `public`; after launch → `live`; else `build`.

## Process
1. Open `${CLAUDE_PLUGIN_ROOT}/references/SECURITY-CHECKLIST.md` at the stage (and every earlier stage not yet passed in the ledger).
2. **auto items**: prove they ran — CI job logs (`gh run view`), gitleaks output, the bundle canary scan, `npm audit` result. A configured-but-never-run check is a fail.
3. **check items**: read the code/config; quote the evidence (`file:line`, header output from `curl -sI <url>`, RLS policy SQL).
4. Send the `security-auditor` agent with the stage, the diff since the last secure pass (or the whole repo for `public`), and the entry-point list. Merge its findings into `.forge/findings.json`.
5. For `public`: full-history scan (`gitleaks git . --redact`), review `git log --all --stat` for personal or old-project files, check screenshots in the repo, and list every key that has ever appeared — **rotate** each at its provider (ask the user to do it; never handle the values).
6. Write the result to `docs/LOG.md`: stage, items passed with evidence, findings, what's open.

## Pass rule
Pass only with no open critical/high findings for this stage. Otherwise fail and list the fixes as tasks.

## Next
`check.mjs --record secure <pass|fail> --scope <stage>`. Next: fixes, or `/forge:ship` / make public (ask the user).
