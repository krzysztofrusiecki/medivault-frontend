# ADR-0002: In-memory access token + backend httpOnly refresh cookie + idle timeout

## Status

Accepted

## Context

The backend issues a short-lived (15 min) JWT access token plus a DB-backed, rotated refresh token delivered as an httpOnly cookie scoped to `Path=/api/auth` (backend ADR-0004). This app handles real health data (PHI), so token handling on the frontend needs to hold up to "production standard," not just "works."

`localStorage`/`sessionStorage` are readable by any script that runs on the page (XSS), which is a real risk for a health-data app.

## Decision

- Keep the access token **in memory only** (a module-level variable / context, never persisted to storage).
- On app load or full page refresh, silently re-acquire an access token via the backend's httpOnly refresh cookie before rendering protected routes.
- Enforce a **30-minute idle-session timeout** independent of the access token's own expiry, logging the user out client-side and clearing in-memory state after inactivity.

## Consequences

- No XSS-readable long-lived credential in browser storage.
- A hard page refresh always costs one round-trip to re-acquire an access token — acceptable for this app's usage pattern.
- Idle timeout duration (30 min) is a starting default; revisit if it proves annoying or too lax in practice.
