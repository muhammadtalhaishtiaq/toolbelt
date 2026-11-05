# Security

## Reporting
Please report vulnerabilities privately to the maintainer (see the repo profile). Do not open a public issue.

## What this project does
- Secrets only in host environment settings; none in the client bundle (checked in CI with canary values).
- Full-history secret scanning (gitleaks) on every push; dependency audit; actions pinned by SHA with read-only tokens.
- Input validated at every boundary; server-side authorization; rate limits and daily caps on costly paths.
- See `docs/DECISIONS.md` for dated security decisions.
