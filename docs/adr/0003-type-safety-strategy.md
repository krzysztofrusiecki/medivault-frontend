# ADR-0003: Hand-written types, no OpenAPI codegen, no shared package

## Status

Accepted

## Context

The backend exposes an OpenAPI spec at `/api/docs` and its `pnpm-workspace.yaml` is single-package (`packages: ["."]`) — there's no existing shared-types infrastructure between the two repos. Options considered: generate a typed client from the OpenAPI spec (e.g. `openapi-typescript`), set up a real workspace/shared `@medivault/types` package spanning both repos, or hand-write and manually sync types.

## Decision

Hand-write frontend types mirroring backend DTOs, named per the shared domain vocabulary in `CONTEXT.md`. No codegen, no cross-repo workspace.

## Consequences

- Zero setup/coupling cost between the two repos' release cycles.
- Accepted risk: frontend types can drift from the backend's actual DTOs if either side changes without the other noticing. Mitigate by re-checking against `/api/docs` when touching an endpoint's shape, and by keeping frontend types thin and close to their usage site rather than a single monolithic types file.
- Revisit (codegen, or a real shared package) if drift becomes a recurring source of bugs.
