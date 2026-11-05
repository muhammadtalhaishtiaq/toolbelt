# Anti-slop design rules

Applied by `/forge:design`, `/forge:ui`, the `design-critic` agent and any HTML a toolbelt plugin generates (seed's IDEA-BOARD, reel's boards). The user's own words and the project's existing design system always win over these defaults.

## Never by default
1. Purple-to-blue gradient hero on white.
2. Warm cream background + serif display + terracotta accent.
3. Near-black background with a single neon/acid accent.
4. Inter, Space Grotesk or Roboto chosen "because it's safe".
5. Emoji as icons, bullets or section markers.
6. The same `rounded-lg` + shadow card on every block; accent rails on rounded cards.
7. 01 / 02 / 03 numbering on things that are not a real sequence.
8. Everything centred; giant 100vh hero that pushes content below the fold.
9. Lorem ipsum, "Lorem Corp", fake testimonials or invented metrics.
10. Glassmorphism, glow blobs and gradients as decoration with no meaning.
11. Stock "Get started" / "Learn more" copy; vague buttons.
12. Dark mode made by inverting colours.

## Always
- **Ground it in the subject.** Pick palette, type and one signature detail from the product's own world (its materials, units, documents, tools).
- **Tokens first.** 4–6 colour tokens, 2–3 type roles, a spacing scale, a radius scale; light and dark both designed; every colour used comes from a token.
- **Type pairs on purpose.** A characterful display face used with restraint + a readable body face (+ mono for data). Body ~65 characters per line. `text-wrap: balance` on headings.
- **Layout with a grid and `gap`**, aligned edges and baselines, consistent inner padding in repeated items.
- **Cards only where an object is separate**; hierarchy through type, space and rule lines first.
- **One bold move per page**, everything around it quiet.
- **Real states:** empty (says what will appear and how to add the first one), loading (skeleton or progress with words), error (what happened + how to fix), long text, many items.
- **Copy:** user's words, active voice, buttons say exactly what happens ("Publish guide"), errors explain the fix.
- **Accessibility:** semantic HTML, visible focus, labels, contrast ≥ 4.5:1 (3:1 for large text and UI parts), touch targets ≥ 44 px, `prefers-reduced-motion` respected.
- **Motion:** one orchestrated moment beats scattered effects; 150–300 ms UI transitions; ease-out in, ease-in out.

## Audit checklist (design-critic)
For each screenshot (390 / 1024 / 1440 px × light / dark):
- [ ] Does anything match a "Never" item?
- [ ] Could this page belong to any other product? (If yes, it lacks a subject detail.)
- [ ] Is the primary action obvious within 3 seconds?
- [ ] Alignment: do edges line up? Is any element orphaned or stretched over empty space?
- [ ] Type: scale consistent? Too many sizes/weights? Line length OK?
- [ ] Contrast and focus visible in both themes?
- [ ] Horizontal scroll at 390 px? Clipped text?
- [ ] States designed (empty/loading/error/long)?
Rank fixes by how visible they are to a first-time user.
