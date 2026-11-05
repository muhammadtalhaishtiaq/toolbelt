---
name: interview
description: Lets the user question the simulated crowd after a run — ask one persona "why didn't you try it?", ask a whole segment a follow-up, or test a changed pitch on the people who objected — staying in each persona's recorded profile and reactions. Use when the user says "ask the skeptics…", "why did renters say no", "talk to persona X", "what would change their mind".
argument-hint: "<persona-id | segment | objectors> \"<question>\""
---

# seed: interview

## Process
1. Resolve who: a persona ID, a segment, an attitude, or "objectors of <idea>" (from `actions.jsonl`).
2. For ≤ 5 people answer directly; for more, send `persona-batch` agents with the persona JSON, their own past actions and quotes from this run, the question, and "answer as this person, consistent with your profile and past reactions; say 'I don't know' when the profile doesn't say".
3. Show answers with persona IDs; summarise the pattern in two lines.
4. If the user is testing a changed pitch, record it as a new idea variant and offer to re-run `/seed:simulate` on the objectors plus a fresh random sample (to avoid only asking the unhappy).
5. Append Q&A to `<run>/interviews.md`.

Always remind: these are simulated people; the real check decides.
