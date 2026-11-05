# Security checklist by stage

`/forge:secure <stage>` walks the matching section. **auto** = enforced by CI or a hook (verify it actually ran); **check** = confirm by reading code/config and record the evidence in `docs/LOG.md`.

## day0 — scaffold (before the first commit)
- [auto] `.gitignore` covers `.env*` (keeps `.env.example`), `*.pem`, `*.key`, `*.p12`, `dist/`, `build/`, `coverage/`, `.DS_Store`, `.vercel`, `.forge/cache`.
- [auto] `.claude/settings.json` deny list (read `.env*`), ask list (push, deploy, publish, install, visibility); forge guard hook active.
- [check] `.env.example` lists every variable with a fake value and a comment saying where the real one lives.
- [check] Public vs secret naming: only values safe for the world use `VITE_`/`NEXT_PUBLIC_`/`PUBLIC_`/`EXPO_PUBLIC_`.
- [auto] gitleaks on the first commit (`templates/ci/ci.yml` job `secrets`).

## build — every task
- [check] Every trust boundary validates input with a schema (zod, valibot, pydantic): HTTP bodies, query/URL params, headers you rely on, uploaded files, webhooks, **model output**.
- [check] Server-only secrets. The browser calls your API; your API calls providers. No provider key in client bundles.
- [check] Model calls: fixed prompts, allowlisted model IDs, user text passed as delimited data, output schema-validated; no "prompt passthrough".
- [check] Injection: parameterised SQL / query builders only; no string-built shell commands (`execFile` with an args array); no `eval`/`new Function` on input; HTML from users rendered as text or sanitised.
- [check] AuthN/AuthZ on the server for every read/write of user data; object-level checks (no IDOR: `where id = ? and owner = ?`).
- [check] Uploads: type sniffed server-side, size limits, private bucket, signed URLs with short expiry, files renamed (no user-controlled paths).
- [check] Database: Row Level Security on every table (deny by default), service key only in server code, migrations reviewed.
- [check] SSRF: server-side fetch of user-supplied URLs only to an allowlist; block private IP ranges.
- [check] Errors: user gets an honest message + retry; stack traces only in server logs.
- [check] Logs: IDs, timings, status codes. Never secrets, tokens, passwords, raw prompts with personal data, photos, emails.

## push — CI (every push and PR)
- [auto] lint · typecheck · tests · build.
- [auto] Canary scan: CI sets fake secrets (`ci-canary-<name>-<8 hex>`), builds, and fails if any canary appears in the output bundle.
- [auto] gitleaks over full history, pinned version, checksum verified.
- [auto] `npm audit --audit-level=high --omit=dev` (or `pip-audit`, `cargo audit`).
- [auto] Actions pinned by commit SHA; `permissions: contents: read`; `persist-credentials: false`; secrets only in jobs that never run for pull requests from forks.

## ship — before deploy
- [check] Headers: Content-Security-Policy (`default-src 'self'` + named hosts), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `frame-ancestors 'none'` (or a list), `Permissions-Policy` for camera/mic/geo.
- [check] CORS: explicit origins, never `*` with credentials.
- [check] Abuse limits: per-IP throttle, per-user and global daily caps on anything that costs money; sized for the expected peak (demo day, launch), not for testing.
- [check] Auth or access codes on create/paid paths; anonymous paths are read-only by design.
- [check] Failure drill: in a preview build, break the provider key → app shows honest errors, no secret or stack in the response, no fake success.
- [check] Privacy page matches what the code stores and for how long.
- [check] Backups/rollback: previous deploy can be restored; DB migration has a way back.

## public — before making a repo public
- [check] Review the **full history** (`git log --all --stat`, gitleaks full scan), not just HEAD: old projects, personal files, keys.
- [check] Any key that ever touched Git is **rotated** at the provider, then the history entry noted; never only deleted or ignored.
- [check] README has no internal URLs or credentials; screenshots free of keys, emails, tokens, personal data.
- [check] `.gitleaksignore` entries are reviewed fingerprints, each with a dated reason.
- [check] LICENSE present; third-party assets credited.

## live — after launch
- [auto] Dependency alerts (Dependabot) and a weekly audit job.
- [check] Rotate keys after an event or demo; lower demo caps back.
- [check] Scheduled cleanup for temporary data; storage lifecycle rules.
- [check] Incident note template ready: what leaked, when rotated, who was told.
