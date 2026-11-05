# Security baseline (human guide)

The short version of `references/SECURITY-CHECKLIST.md`, for reading once.

1. **Day 0:** the `.gitignore`, `.env.example`, `.claude/settings.json` and CI templates go in before the first commit. Secrets live in the host's env settings and `.env.local` — nowhere else, ever.
2. **While building:** validate every input at the boundary (including model output); the browser never talks to paid providers directly; parameterised queries; server-side permission checks on every read and write of user data; uploads checked and private; RLS on every table; logs without personal data.
3. **On every push:** CI runs lint, types, tests, build, a canary scan that proves no server secret reached the browser bundle, a full-history secret scan and a dependency audit — with SHA-pinned actions and a read-only token.
4. **Before deploy:** security headers, explicit CORS, rate limits and caps sized for the real peak, auth on costly paths, a failure drill (break the key → honest error, no leak), a privacy page that matches the code.
5. **Before going public:** scan the **whole history**; rotate any key that ever touched Git; clean screenshots and READMEs.
6. **After launch:** dependency alerts, rotate demo keys, lower demo caps, cleanup jobs.

The forge guard hook blocks reading `.env` files and writing real-looking keys, and warns on innerHTML, eval, string-built SQL/shell, unsafe deserialisation, disabled TLS, wildcard CORS and secrets in public env variables.
