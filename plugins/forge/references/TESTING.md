# Testing guide

## What must be tested first (test-first, always)
Logic that can **mislead a user** or **burn money/credits**:
- verdicts, scores, eligibility, pricing, permissions;
- parsers of model or third-party output (schema + "junk in → null");
- geometry/units/currency/date maths;
- limits and caps (rate, size, daily), access codes, consent resets;
- anything security-relevant (authorization checks, input validation).

## The cycle (strict)
1. **Red** — write the test from the acceptance criterion. Run it. It must fail for the right reason (paste the failure in the log).
2. **Green** — the smallest code that passes.
3. **Refactor** — clean up with tests green.
Code written before its test is thrown away and rewritten test-first. "I'll add tests after" is not allowed for the categories above.

## Bug fixes: prove it
Write a test that reproduces the bug (fails) → fix → it passes → keep it as a guard.

## Shape
- Many small unit tests on pure logic (put that logic in `src/lib/` with no framework imports).
- Some integration tests across real boundaries — prefer a real local DB/emulator over mocks.
- A few end-to-end or smoke checks on the critical path, including one against the deployed URL.
- Name tests by behaviour: `rejects a photo over 8 MB`, not `test3`.
- Arrange–Act–Assert; one concept per test; test state, not internal calls.
- Synthetic data and fake keys only (`ci-canary-*`); never real user media or real secrets.

## Real devices (UI)
Before ship, run the critical path on: phone Safari (iOS), phone Chrome (Android), desktop Chrome, desktop Safari/Firefox. Record results in `docs/LOG.md`. (Showhow lesson: phone stills hung and `.mov` files were greyed out — found only on real devices.)

## Never
- Skip, delete or loosen a test to get green.
- Snapshot-test whole pages as the only check.
- Claim a test run that did not happen.
