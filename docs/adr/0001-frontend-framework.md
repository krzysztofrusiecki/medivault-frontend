# ADR-0001: Vite + TanStack Router + TanStack Query over Next.js

## Status

Accepted

## Context

MediVault Frontend is an authenticated dashboard (results, filtering, graphs, admin/lab tooling) sitting entirely behind login, talking to a separate NestJS API. It has no public, indexable pages. Next.js's main differentiators — SSR/SSG for SEO, RSC for cutting client JS on public content — don't apply to this shape of app. TanStack Query, already chosen for server state, is itself a client-fetching pattern, so pairing it with Next would mostly use Next's routing conventions without its actual strengths — close to a prior Next.js project (Pages Router, fully client-side) that didn't exercise SSR/SSG either.

Given a medium timeline and an already broad v1 scope (three roles, full unit/integration/e2e test pyramid), minimizing framework overhead matters.

## Decision

Use Vite + TanStack Router + TanStack Query. Plain React SPA talking to a separate REST API — a common, well-regarded architecture in its own right, not a fallback.

TanStack Router over React Router: the app needs list filters (analyte, date range, batch) held in the URL, which TanStack Router treats as typed, validated search-param state; `beforeLoad` guards fit the three-role setup with a typed auth context; loaders integrate with the TanStack Query client; and route paths/params/links are compile-time checked, matching the strict-TypeScript bar. Tradeoff: React Router is more widely known and has a larger ecosystem.

## Consequences

- Faster iteration, less framework-specific plumbing to learn/debug.
- No SSR/RSC available if a future requirement needs it (e.g. a public marketing page) — would need a separate static page or a framework migration.
- Deployable as a static build to any host (see `CONTEXT.md` — deployment is deliberately not an architectural commitment).
