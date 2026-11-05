---
name: ui
description: The frontend lane for any UI work — new pages, components, restyles, "make it look better", "this looks like AI", design audits — applying the project's tokens and the anti-slop rules, using UI UX Pro Max, Impeccable and frontend-design skills when installed, then auditing real screenshots (390/1024/1440 px, light and dark) with the design-critic agent before the task counts as done. Use with "audit" to run only the audit. Not for back-end work.
argument-hint: "[audit | page/component]"
---

# UI lane

## Gate
`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" ui` (none). New screens on hackathon/product profiles still need an approved mockup (`/forge:design`) — the build gate checks it.

## Read first
`${CLAUDE_PLUGIN_ROOT}/references/ANTI-SLOP.md`, the project's tokens and `docs/UI-DESIGN.md`, the approved mockup.

## Companion skills (use when present in this session's skill list)
| Step | Companion | How |
|---|---|---|
| Direction, palettes, font pairs, product-type patterns | **ui-ux-pro-max** | search its style/palette/typography data for this product type before choosing |
| Craft of new components/pages | **frontend-design** | follow its guidance while building |
| Audit, critique, polish, typography | **impeccable** | run its audit/critique on screenshots or the page, then its polish suggestions |
If none are installed, say so once and use the built-in rules — the lane still works.

## Build rules
1. Only tokens: no literal colours, font sizes or spacing values in components.
2. Semantic HTML first (button, nav, main, label); keyboard focus visible; touch targets ≥ 44 px; `prefers-reduced-motion` respected.
3. Layout with grid/flex and `gap`; content-sized hero; text containers `min-width: 0`.
4. Design every state: empty (what will appear + how to add the first), loading (words, not a bare spinner), error (cause + fix), long text, many items.
5. Copy: the user's words, active voice; buttons say what happens.
6. Match the mockup; deviations need a reason.

## Audit (always before a UI task is done; alone with `/forge:ui audit`)
1. Run the app; capture screenshots at **390, 1024, 1440 px × light and dark** of each changed screen and its states (browser tool, Playwright, or the user's screenshots).
2. Send the `design-critic` agent the screenshot paths, the mockup and the ANTI-SLOP checklist. If Impeccable is available, run its audit too and merge the findings.
3. Fix the high-ranked items; re-capture and re-check once (max 2 rounds — then list what remains).
4. Record: `check.mjs --record ui pass --scope audit` (or `fail`), with the findings summary in `docs/LOG.md`. The ship gate needs a passing audit after the last UI change.

## Red flags
A purple gradient, emoji icons, the same card on every block, centred everything, lorem ipsum, or a dark mode that is just inverted. Any one of these fails the audit.
