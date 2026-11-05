---
name: design
description: Creates the visual direction, design tokens and a clickable HTML mockup of the key screens with real content, for approval before any UI code — following the anti-slop rules and using UI UX Pro Max, Impeccable or frontend-design skills when installed. Use when the user says "show me how it would look", "mockup", "design it", "wireframe", or before building a UI in a new project. For restyling or auditing existing UI use /forge:ui.
argument-hint: "[screens]"
---

# Design (mockup before code)

## Gate
`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" design`.

## Process
1. **Respect what exists**: the user's words → the project's design system (tokens, CSS variables, UI docs) → these rules. Read `${CLAUDE_PLUGIN_ROOT}/references/ANTI-SLOP.md`.
2. **Direction** (skip if a design system exists): propose 2–3 directions grounded in the product's world — each with a name, palette (4–6 tokens, light + dark), type pair, layout idea and one signature detail. If `ui-ux-pro-max` is available, use it to search styles, palettes and font pairs for this product type. The user picks one.
3. **Tokens**: write them to the project (`src/styles/tokens.css` or the stack's equivalent) and `docs/UI-DESIGN.md` (rationale, contrast ratios computed for text/background pairs).
4. **Mockup**: `design/mockup.html` — one self-contained file, the key screens of the core flow with **real copy**, at 390 / 1024 / 1440 px, light and dark, including empty, loading and error states. Clickable between screens. If `frontend-design` is available, follow it for craft.
5. **Self-check**: take screenshots (browser tool if available) and run the `design-critic` agent once; fix the high items.
6. **Show the user** and ask for approval. Iterate on their notes.
7. On approval, record in DECISIONS: `## <date> — <screens> mockup approved` (the build gate looks for this).

## Rules
- Never start UI code before approval on hackathon/product profiles.
- Copy is part of design: active voice, buttons say what happens.
- If Impeccable is available, run its critique/audit command on the mockup as a second opinion.

## Next
`check.mjs --record design pass`. STATUS Next `/forge:plan`.
