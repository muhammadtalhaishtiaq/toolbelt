---
name: debug
description: Fixes bugs by root cause — reproduce, localise, understand, fix where all callers route through, and leave a test that guards it; stops guess-patching after three failed attempts. Use when something is broken, errors, crashes, hangs, shows a wrong result, a test or CI is red, or the user pastes a stack trace or says "it doesn't work", "it's stuck", "why does…". Not for new features.
argument-hint: "[symptom]"
---

# Debug

## Gate
None — but record the issue: add a FEEDBACK row (🔍) if it came from the user.

## Process
1. **Reproduce**: write down exact steps, input, environment (device/browser/version), expected vs actual. Make it fail on demand — ideally as a failing automated test. If you cannot reproduce, gather evidence (logs, network, console) before changing anything.
2. **Localise**: binary-search the path (input → boundary → logic → output). Use logs, a debugger, `git bisect` for regressions. Read the code; don't skim.
3. **Explain the cause** in one or two sentences before fixing. If you can't explain it, you haven't found it.
4. **Fix at the root**: the function every caller routes through, not the one call site in the report. Grep all callers of what you change.
5. **Guard**: the reproduction test now passes; keep it. Add the case to similar code paths if the same bug class can recur.
6. **Checks**: lint, types, full tests, build; the original reproduction steps manually.
7. Log in `docs/LOG.md` (symptom, cause, fix, test) and FEEDBACK (✅ + commit). Commit `fix: <what> (<F-id>)`.

## Three-strike rule
If three fix attempts fail, stop patching. Re-read the code path end to end, list your assumptions and test each one, or ask the user for the missing evidence. Never stack workarounds.

## Common rationalizations
| Excuse | Reality |
|---|---|
| "Add a retry/timeout and move on" | That hides the cause; it returns later, worse. (A timeout as a *fallback* after the real fix is fine.) |
| "Can't reproduce, so add a guard" | Get evidence first. Unreproduced fixes are guesses. |

## Next
`check.mjs --record debug pass --scope <F-id>`. Next per STATUS.
