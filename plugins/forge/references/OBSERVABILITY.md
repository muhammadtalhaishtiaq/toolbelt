# Observability guide

- One structured log line per request on critical paths: `{route, status, ms, request_id, user_hash?}`. No personal data, no secrets, no raw prompts or media.
- Count what costs money (model calls, storage) per day; alert before caps are hit.
- Health check route for the deploy; a smoke script (`scripts/smoke.*`) that hits the critical path on the live URL.
- Errors: capture with an ID shown to the user ("Error ref 7F3A") so reports can be traced without personal data.
- Alerts on symptoms users feel (error rate, latency, cap reached), not on every exception.
