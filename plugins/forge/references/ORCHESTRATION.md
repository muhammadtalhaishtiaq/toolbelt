# Skills, agents and loops: who does what

## Skills decide, agents execute
- A **skill** is a workflow the main session follows. Skills choose the route, keep state, talk to the user and stay accountable.
- An **agent** (`agents/*.md`) is a fresh helper with one narrow job and a restricted tool list. It reports back; the main session verifies and decides.

## Patterns forge uses
| Pattern | Where | Rule |
|---|---|---|
| Single helper with full context | `/forge:build` (one task), `/forge:spike` (scout) | Paste the task, acceptance criteria, file list and constraints into the prompt. The helper must not need the conversation. |
| Parallel fan-out, then merge | `/forge:review` (red-team ∥ code-reviewer ∥ security-auditor), `/forge:idea` (red-team ∥ judge) | Send all calls in one message. Merge by de-duplicating, then **validate each finding** with a separate check before acting. |
| Research isolation | `scout` | Keeps large docs out of the main context; returns quotes + URLs. |
| Bounded loop | `/forge:build auto`, ship watch (`/loop`) | Every loop has an exit: slice done, a red gate, 3 failed attempts, or a turn limit. |

## Anti-patterns forge refuses
- A "boss" agent that routes work to other agents (routing belongs to skills).
- Agents calling agents; persona trees deeper than one level.
- A sequential chain where each agent paraphrases the last (information is lost each hop; pass the files instead).
- Treating an agent's finding as fact without checking it.
- More than ~5 agents at once for a small change (cost without benefit).

## Cost sense
Agents cost tokens. Quick-tool profile: no review agents, only CI + secure gate. Use the cheapest model that does the job for mechanical checks; keep the strongest model for bug-finding and security.
