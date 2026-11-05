---
name: spike
description: Proves risky external dependencies with the smallest live calls before the spec depends on them — request and response shapes, limits, latency, cost, failure modes — using synthetic data only, and records verified facts in docs/API-NOTES.md. Use when the user asks "will this API work", "can X do Y", "how fast/expensive is it", before building on any unfamiliar API, model, SDK or platform feature, or when a doc claim matters. Not for building features.
argument-hint: "[api or question]"
---

# Spike

## Gate
`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" spike`.

## Why
In Showhow the exact shapes for image/video input and outline boxes were only knowable by calling the API. A spike turns "docs say" into "we measured".

## Process
1. **List the risks**: every external dependency in the chosen idea, and for each the single question that would sink the project if the answer were bad (format? size limit? latency? price? terms?).
2. **Read first**: `scout` returns the documented request/response shape, limits, auth and terms with URLs.
3. **Call second** (ask the user before the first paid call; use their key only via env — never print it):
   - Write a throwaway script in `scripts/spikes/<name>.(mjs|py)` that reads the key from the environment.
   - Use **synthetic inputs** (generated images/audio/text), never personal data.
   - Measure: success shape, one deliberate failure (bad input), latency (3 runs, report each), payload size limits if relevant, cost per call if reported.
4. **Record** in `docs/API-NOTES.md` under the API: `status: verified YYYY-MM-DD` (or `status: failed` with why), shapes, limits, latency, cost, gotchas, and the spike script path. If no external APIs exist, write `no external APIs` and why.
5. **Decide**: if a risk failed, go back to `/forge:idea` with the evidence, or cut the feature. Record in DECISIONS.

## Rules
- Spike scripts must not log secrets or full responses that might contain personal data; log shapes and timings.
- A fixture saved from a spike is labelled `TEST FIXTURE` wherever it is used.

## Next
`check.mjs --record spike pass`. STATUS Next `/forge:spec`.
