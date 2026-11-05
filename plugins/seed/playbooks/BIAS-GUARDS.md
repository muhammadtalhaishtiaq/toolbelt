# Bias guards

Studies of LLM personas find synthetic respondents are **too positive** (more "strongly satisfied" answers than real people), **too alike** (answers regress to the mean), and that **free-form persona stories make both worse**. seed is designed against this:

1. **Structured personas** — table fields only (segment, attitude, age band, tech, budget, current solution, pain). No backstories.
2. **Quotas** — ≥ 30% skeptic + indifferent, ≤ 15% enthusiasts, segment shares from research.
3. **Default is ignore** — a persona must have a reason to react.
4. **Commitment is costly** — "would pay" needs an accepted price and a named alternative they'd drop; otherwise it counts as "try".
5. **Rivals in the same crowd** — verify mode always adds a realistic rival and "do nothing".
6. **Neutral posts** — every idea gets the same post template, length and tone.
7. **Counting in code** — the model never computes rates or verdicts.
8. **Two runs** — a verdict that flips between runs becomes "unclear".
9. **A built-in skeptic** — every report carries the strongest argument against itself.
10. **Always a real check** — five real people, past behaviour, a real commitment, a kill signal.

Treat every seed result as a rehearsal that tells you **what to ask real people**, not whether they will buy.
