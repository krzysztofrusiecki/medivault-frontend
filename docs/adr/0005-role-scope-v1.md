# ADR-0005: All three backend roles in scope for v1, USER-first sequencing

## Status

Accepted

## Context

The backend models three roles: `USER` (patient), `LAB_ADMIN` (staff, scoped to one Lab, attached only manually by a `SUPER_ADMIN` per backend ADR-0002 — no self-serve lab onboarding), and `SUPER_ADMIN`. Building for a single role would be simpler, but this project is also a portfolio piece, and RBAC-aware UI + admin tooling + a multi-actor workflow (lab-verified batches) is meaningful breadth to demonstrate. The tradeoff: with one person building and testing, there's no real external lab to exercise the `LAB_ADMIN` flow against.

## Decision

All three roles are in scope for v1. Build order is `USER` → `SUPER_ADMIN` → `LAB_ADMIN` (see `CONTEXT.md` build priority), since `USER` is both the actual personal-use value and the simplest role, and `LAB_ADMIN`'s flow requires seed data to even test (see the backend seed script item in the build priority list).

## Consequences

- Solo testing of the `LAB_ADMIN`/`SUPER_ADMIN` flows depends on a backend seed script creating a `Lab`, a `LAB_ADMIN`, and a `SUPER_ADMIN` account — this is a real dependency, not optional polish.
- Scope is larger than a single-role app; sequencing (not parallel building) is the mitigation, not cutting a role.
