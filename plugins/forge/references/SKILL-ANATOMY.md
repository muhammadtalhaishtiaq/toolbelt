# How a forge skill is written

Every `skills/<name>/SKILL.md` follows this shape so behaviour is predictable.

```markdown
---
name: <name>                    # matches the folder; invoked as /forge:<name>
description: <What it does, third person>. Use when <the words people actually say> … Not for <the near-miss that belongs to another skill>.
argument-hint: <optional>
---

# Title

## Purpose            one or two sentences
## Gate               what must be true first (gates/gates.json id) and what to say if not
## When to use / not  bullets
## Process            numbered steps, each with an output
## Outputs            the files it writes or updates
## Common rationalizations   | excuse | reality |
## Red flags          signs the skill is being skipped or faked
## Verification       checklist; evidence required
## Next               how it picks the next command and writes STATUS "Next:"
```

Rules:

1. The **description** decides routing. Put user vocabulary in it ("it's broken", "is this ready", "ship it"), plus one "Not for …" clause to stop collisions. Do not summarise the steps there; the model may follow the summary instead of the skill. Max ~1000 characters.
2. Every skill begins with the gate check (`node "${CLAUDE_PLUGIN_ROOT}/gates/check.mjs" <id>`) unless it has no prerequisites.
3. Every skill ends by updating `STATUS.md` (Stage, Next) and appending to `.forge/ledger.jsonl` through `check.mjs --record <id> <result>`.
4. Long reference material goes in `references/` and is linked, not pasted.
5. Agents are given a narrow job and full context in the prompt; they never call other agents.
