---
name: submit
description: Prepares a competition or hackathon submission — runs the submit gate (rules recorded, shipped, live URL answering, video link, public repo reviewed, every form field answered), writes paste-ready answers for every field within its limit, checks every link, writes the new-work statement and judge notes. Use when the user says "submit", "fill the form", "submission answers", "what do I paste here", or shares a submission form screenshot. The user presses submit; never submit on their behalf.
---

# Submit

## Gate
`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" submit`. Blocked → show what's missing; most often the video link or the public-repo review.

## Process
1. Re-read `docs/RULES.md`; if the user shares the live form (screenshot or text), compare every field with RULES and add any missing.
2. For **each field**, write the answer in `docs/SUBMISSION.md` under its exact name: within the character limit (count it), in the judges' language, every claim backed by something shown in the demo or repo. Typical: description (short + long), how the sponsor's tech is used (concrete, per model/service), why it matters, what was built during the event (with dated evidence: first commit, LOG.md), team, links.
3. **Survey-style fields** (ratings, "biggest obstacle"): give an honest default from the project's LOG/FEEDBACK and mark it as the user's call.
4. **Links**: open each (repo public? video plays and is public/unlisted as required? live URL works without login, or the access path is in the judge notes?).
5. **Judge notes**: how to try it in 2 minutes, any access code, known limits, device advice.
6. **Final red-team pass** on SUBMISSION.md (`red-team`: "unsupported claims, missing required items, anything a judge could call fake").
7. Hand the user the paste-ready text, field by field. They submit.

## Next
`check.mjs --record submit pass` after the user confirms they submitted. Then `/forge:retro`.
