# ADR-0008: The frontend calls a same-origin `/api`, proxied to the backend

## Status

Accepted

## Context

The refresh token cookie (ADR-0002, backend ADR-0004) is `SameSite=Lax` and scoped to `Path=/api/auth`. The browser only sends it when the page and the API are on the same site. Calling the backend's own origin directly works in local dev (both on `localhost`) but breaks as soon as the two are deployed on different sites (e.g. a `*.vercel.app` frontend and a `*.up.railway.app` backend): the cookie is silently dropped and every refresh fails. It also makes it impossible to run the local dev frontend against the production API.

Alternatives considered:

- **`SameSite=None; Secure` on the backend cookie** — works cross-site, but weakens CSRF protection on the refresh endpoint and would require allowing `localhost` in production CORS to support local-against-prod.
- **A shared custom domain** (`app.example.com` + `api.example.com`) — works in production, but couples the app to owning a domain and still doesn't cover local-against-prod.

## Decision

The frontend always calls `/api` on its own origin. Something in front of it forwards `/api/*` to the backend:

- **Local dev and `vite preview`**: Vite's `proxy`, targeting `API_PROXY_TARGET` (default `http://localhost:3000`). This is a build-tool setting, not a `VITE_`-prefixed variable, so it never reaches the client bundle.
- **Production**: the static host's rewrite rule (`/api/*` → backend), configured as part of deployment.

## Consequences

- The browser only ever sees one origin, so the refresh cookie is always same-site and CORS stops mattering for the frontend.
- All three setups work with no backend changes: prod frontend → prod API, local frontend → prod API (`API_PROXY_TARGET=https://<prod-api>`), local frontend → local API.
- Any static host works as long as it supports path rewrites. This is a small, host-specific config file, not an architectural dependency (see "Deployment" in `CONTEXT.md`).
- Pointing local dev at the production API means real health data on the developer's machine. That's acceptable for a single-owner app, but don't make it the default.
