# MediVault Frontend — Context

## Purpose

A tool to track and compare your own blood test results over time. Also built to production standard as a portfolio piece for a fullstack role — real auth, real data model, real test coverage, not a toy.

Talks to `medivault-backend` (NestJS + Prisma + PostgreSQL, REST API under `/api`, OpenAPI docs at `/api/docs`) as a separate service. No shared package between the two repos — types are hand-written on the frontend side and kept in sync manually; this is an accepted tradeoff for simplicity, not an oversight.

## Domain vocabulary

Inherited from `medivault-backend`'s `CONTEXT.md` — use these terms exactly, don't drift to the "avoid" synonyms:

- **Analyte** — a measurable lab value type (e.g. Glucose, Prolactin).
- **TestBatch** — a group of TestResults from one sample date + one lab. Status is `PENDING_ACCEPTANCE` / `ACCEPTED` / `DECLINED`. Avoid: "panel", "order", "report".
- **Self-reported batch** — created by the patient (`USER`) with a free-text lab label; always starts `ACCEPTED`. Avoid: "manual batch", "patient batch".
- **Lab-verified batch** — created by a `LAB_ADMIN` for an existing patient (found by email); starts `PENDING_ACCEPTANCE`, the patient accepts or declines it.
- **Declined batch** — a rejected lab-verified batch, kept as an audit trail.
- **Lab** — a registered lab organization; owns `LAB_ADMIN` accounts.
- **LAB_ADMIN** — staff role scoped to exactly one Lab, attached manually by a `SUPER_ADMIN` (no self-serve lab onboarding exists).
- **ReferenceRange** — a labeled min/max band per Analyte, optionally scoped by gender/age. The backend only serves the raw bands; it never computes a status. Avoid: "normal range", "threshold", "panic value".
- **Session** / **RefreshToken** — one login's lineage; the refresh token is a DB-backed, rotated, httpOnly-cookie-delivered credential the frontend never reads or stores directly.

New term, owned by this repo:

- **ResultStatus** — the derived `LOW` / `NORMAL` / `HIGH` / `NO_REFERENCE_RANGE` classification for a TestResult, computed client-side against the ReferenceRanges available for its Analyte. See [ADR-0006](docs/adr/0006-reference-range-status-computation.md).

## Roles in scope

All three backend roles are in scope for v1: `USER`, `LAB_ADMIN`, `SUPER_ADMIN`. See [ADR-0005](docs/adr/0005-role-scope-v1.md) for sequencing and why `LAB_ADMIN` is demoed via seed data rather than a real external lab.

## Architecture decisions

See `docs/adr/` — framework and routing choice, auth token storage, type-safety strategy, UI component system, role scope, and reference-range status computation.

Deployment is deliberately **not** an architectural decision here: the app should build and deploy to any static host without platform-specific coupling. Vercel is today's pick for convenience, not a commitment.

## Build priority (living backlog, not yet filed as tickets)

Tickets get created in Linear (team **MV**) as each topic is picked up, not all upfront.

1. Project scaffold — Vite + React + TS, Tailwind + shadcn/ui, TanStack Router, TanStack Query, ESLint/Prettier/Husky, Vitest + RTL + Playwright, CI (lint/typecheck/test) on PRs.
2. Auth — login, signup, in-memory access token + silent refresh via the backend's httpOnly cookie, logout, 30-min idle timeout, role-aware route guarding.
3. USER: results & comparison core — list of test results/batches, filtering, trend graphs over time.
4. Reference-range status logic — the `ResultStatus` computation, including the multi-band-overlap and no-match rules.
5. USER: self-reported batch creation.
6. Backend seed script (filed against `medivault-backend`) — a `SUPER_ADMIN`, a `Lab` + its `LAB_ADMIN`, a sample `USER` with batches, so all three roles are testable solo.
7. SUPER_ADMIN: admin surface — manage labs, analytes, reference ranges, attach lab admins.
8. LAB_ADMIN: lab-verified batch flow — create a batch for a patient by email; USER-side accept/decline.
9. Security hardening pass — PHI-safe logging/error-tracking, CSP coordination with the backend now that a real frontend origin exists, secrets review.
10. Deployment setup — natural point is once topics 1–4 land and there's a real flow worth showing live. Not tied to any specific host (see above).
