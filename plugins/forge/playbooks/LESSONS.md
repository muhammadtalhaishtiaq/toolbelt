# Lessons (from real projects)

Each lesson changed a forge default. Newest last.

## 2026-11-04 — Showhow (Meta AI hackathon, solo, 9 days)
- **Keep:** a dated decisions ledger that wins over other docs; red-team review at every milestone; live spikes before the spec; test-first for logic that can mislead users or burn credits; one task per build run; mockups approved before UI work; a feedback table for hands-on testing; CI canaries + bundle scan + full-history gitleaks.
- **Hurt → became:**
  - Day-2 pivot → `/forge:idea` with red-team and judge before anything else.
  - "Where am I?" spread over four files → `STATUS.md` "Next:" + SessionStart hook + `/forge:where`.
  - Phone-only bugs (stills hung, `.mov` greyed out, 4:3 overlay offset) found while filming → real-device matrix in `/forge:test` and `/forge:ship`.
  - Test-sized caps blocked the demo (429s) → ship gate requires caps sized for the peak.
  - Submission fields discovered on the last day → `/forge:rules` fetches the form on day 0; submit gate checks every field.
  - Blurry, slow demo footage → reel captures at 2×, zoom ≤ 1.25, waits cut and marked.
