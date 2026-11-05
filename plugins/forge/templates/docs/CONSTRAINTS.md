# Constraints — the quality bar

Decided once, checked mechanically. Lowering a number needs a dated entry in docs/DECISIONS.md.

## Articles
1. **Test-first** for logic that can mislead a user or burn money (see forge TESTING.md).
2. **Simplicity** — the smallest design that meets the PRD; no speculative features or abstractions. Any exception is written under "Complexity tracking" below.
3. **Use the framework directly** — no wrappers around platform or framework features.
4. **Real boundaries in integration tests** — a real local DB/emulator over mocks where possible.
5. **Validate at every trust boundary** with a schema, including model output.
6. **Honest failures** — never a fabricated result; every failure has a message and a retry.

## Numbers
| Dimension | Bar | Checked by |
|---|---|---|
| Tests | all pass; new logic covered | CI |
| Types / lint | 0 errors, 0 new suppressions | CI + forge guard |
| Coverage (lib/) | ≥ {{COVERAGE}}% lines | CI |
| JS on first load | ≤ {{BUNDLE_KB}} KB gzip | build report |
| Accessibility | WCAG 2.2 AA (contrast ≥ 4.5:1, focus, labels) | design-critic + manual |
| API p95 | ≤ {{P95_MS}} ms (excl. model calls) | logs |
| Security | no open high findings; secure gate fresh | forge gates |

## Complexity tracking
| Date | What breaks an article | Why it's worth it |
|---|---|---|
