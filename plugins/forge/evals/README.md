# forge evals

`claude plugin eval plugins/forge` runs every case here (each folder = `prompt.md` + `graders/`).

- **route-*** — a vague user request must fire the right forge skill (or the `using-forge` router) and, where a `behaviour.md` grader exists, behave correctly (ask before deploying, clarify before coding, find the cause before patching).
- **quiet-*** — non-software prompts must not fire lifecycle skills.
- **pressure-*** — the workflow must hold under time pressure, authority pressure and requests to fake results or read secrets.

Add a case whenever a real conversation routed wrongly: copy the user's exact words into `prompt.md`. Grow toward ~60 routing cases. A routing failure usually means *fix the skill's description*, not the case.

Deterministic tests (no tokens): `node --test plugins/forge/gates/check.test.mjs plugins/forge/hooks/guard.test.mjs`.
