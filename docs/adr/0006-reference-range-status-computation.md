# ADR-0006: Frontend owns ResultStatus computation

## Status

Accepted

## Context

Backend ADR-0003 (`medivault-backend`) is explicit that reference-range matching is "a frontend responsibility" — the backend only serves raw `ReferenceRange` bands (optionally scoped by gender and/or age) per Analyte; it never computes LOW/NORMAL/HIGH. Two edge cases needed a decision:

1. What happens when a value matches multiple overlapping bands (e.g. both a gender-scoped and an age-scoped band apply)?
2. What happens when no band matches at all?

## Decision

Introduce **ResultStatus** (`LOW` / `NORMAL` / `HIGH` / `NO_REFERENCE_RANGE`) as a frontend-owned derived value, computed from a TestResult's value against the ReferenceRanges available for its Analyte.

- **Overlap rule**: most-specific band wins — a band scoped by both gender and age outranks one scoped by gender only, which outranks an unscoped band.
- **No-match rule**: an explicit `NO_REFERENCE_RANGE` status, always shown to the user — never silently hidden or defaulted to `NORMAL`.

## Consequences

- This is real domain logic living in the frontend, not just a display concern — it should be a pure, unit-tested function (`value + Analyte + ReferenceRange[] → ResultStatus`) per the project's TDD standard, independent of any UI component.
- If the backend later adds its own status computation, this logic either gets deleted in favor of a served field, or is kept as a client-side cross-check — a decision for whenever that happens, not now.
