# {{NAME}}

{{ONE_LINER}}

- **Profile:** {{PROFILE}} · **Deadline:** {{DEADLINE}} · **Owner:** {{OWNER}}
- **Stack:** {{STACK}}
- **Live:** {{LIVE_URL}} · **Repo:** {{REPO_URL}}

## Read before substantive work
1. `STATUS.md` — stage, blockers, the one "Next:" line.
2. `docs/DECISIONS.md` — dated ledger; it wins when docs disagree.
3. `docs/PRD.md` — the spec. 4. `docs/TASKS.md` — the plan with Verify steps. 5. `CONSTRAINTS.md` — the quality bar.
6. `docs/RULES.md` — external rules (event, API terms) if present.

## How we work
This project uses the **forge** plugin. Route every request through `forge:using-forge`; lifecycle commands check their gate first (`/forge:where` shows the stage). Never claim a review, test or run that did not happen.

## Commands
```bash
{{COMMANDS}}
```

## Product rules
{{PRODUCT_RULES}}
<!-- Examples: what the product must never do, what data it may store, claims it must not make. -->

## Keys and privacy
- Secrets live only in the host's env settings and `.env.local`; never in client code, public env prefixes, Git, logs or screenshots.
- Ask before: push, deploy, publish, repo visibility changes, sending data to new services.

## Code style
{{CODE_STYLE}}
<!-- e.g. TypeScript strict; named exports; pure logic in src/lib (no framework); schema validation at every boundary; match existing formatting. -->
