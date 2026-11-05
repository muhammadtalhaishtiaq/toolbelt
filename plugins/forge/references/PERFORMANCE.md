# Performance guide

Measure first; optimise only what a measurement shows matters.

## Budgets (defaults — set real ones in CONSTRAINTS.md)
- Web: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 on a mid phone over 4G; JS shipped on first load ≤ 200 KB gzip.
- API: p95 ≤ 500 ms for reads, ≤ 1.5 s for writes, excluding third-party model calls (stream or show progress for those).
- Long jobs (> 3 s): show real progress stages in words, not a bare spinner; allow cancel/retry.

## Common wins
- Lazy-load routes and heavy libraries; images sized and in modern formats; `loading="lazy"` below the fold.
- Cache static assets immutably; avoid waterfalls (parallel fetches); index the columns you filter by.
- Do heavy media work on the device when possible (and say so), or in a queue with progress.

## Check
Lighthouse/WebPageTest for web, a timing log line per API route (`route`, `ms`, `status`), and one load test of the costliest path sized to the expected peak.
