---
name: constraints
description: Sets the project's quality bar as written numbers and articles in CONSTRAINTS.md — tests, coverage, types and lint, bundle size, accessibility, latency, security — supplying sane defaults when the user has none, and wiring each bar to a check. Use when the user says "set the quality bar", "standards", "what coverage", "quality gates", or when an agent keeps skipping tests or silencing checks. Not for one-off scripts.
---

# Constraints

## Gate
`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" constraints`.

## Process
1. **Detect** before asking: stack, test runner, linters, current coverage (run once if cheap), CI checks, bundle size from the last build. Report in two lines.
2. **Ask four questions, each with a default** (an "I don't know" still gives a working bar):
   1. Which matter most: correctness, speed, accessibility, cost? (default: correctness + accessibility)
   2. Coverage floor for pure logic (default 70%).
   3. Performance budget (default: JS ≤ 200 KB gzip first load, API p95 ≤ 500 ms excluding model calls).
   4. Anything that must never ship? (e.g. a fabricated result, personal data in logs).
3. Write `CONSTRAINTS.md` from the template: articles + numbers + how each is checked.
4. **Wire the checks**: coverage threshold in the test config, a bundle-size check in CI if cheap, lint rule for no new suppressions where the linter supports it. Never lower an existing threshold without a DECISIONS entry.
5. The forge guard already warns on new suppressions, skipped tests and removed assertions. Mention it.

## Non-interactive runs
Don't interview in CI or unattended loops; apply the defaults, note that you did, and flag them for the user.

## Next
`check.mjs --record constraints pass`. Next per STATUS.
