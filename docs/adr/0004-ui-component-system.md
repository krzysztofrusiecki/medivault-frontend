# ADR-0004: shadcn/ui + Tailwind over a component library

## Status

Accepted

## Context

For a portfolio-facing project, the choice of UI foundation is also a skills signal. A batteries-included library (MUI, Mantine) ships fully-owned components with less setup; shadcn/ui ships accessible Radix-based primitives as source code copied into the repo, meant to be read, composed, and modified.

## Decision

Use shadcn/ui + Tailwind CSS.

## Consequences

- Component source lives in this repo — demonstrates real component-architecture and composition skill rather than "imported a library."
- Accessible primitives (Radix) out of the box, so accessibility isn't being built from scratch.
- More initial setup/decisions per component than a batteries-included library; acceptable given the portfolio goal.
