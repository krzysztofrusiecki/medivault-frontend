# ADR-0007: Layered module boundaries enforced by ESLint

## Status

Accepted

## Context

The app will grow role-specific surfaces (USER, LAB_ADMIN, SUPER_ADMIN), each with its own data fetching and UI. Without an enforced structure, features tend to import each other's internals and shared code starts depending on app code. Convention alone doesn't hold up once several areas are in flight.

## Decision

Organise `src/` into layers. Each layer may only import from itself or the layers below it. `eslint-plugin-boundaries` (`boundaries/dependencies`, default `disallow`) enforces the rules in `eslint.config.js`.

| Layer        | Path                          | May import                                          |
| ------------ | ----------------------------- | --------------------------------------------------- |
| `app`        | `src/routes/**`               | everything                                          |
| `feature`    | `src/features/<name>/**`      | its own feature, `components`, `ui`, `hooks`, `lib` |
| `components` | `src/components/*` (not `ui`) | `components`, `ui`, `hooks`, `lib`                  |
| `ui`         | `src/components/ui/**`        | `ui`, `lib`                                         |
| `hooks`      | `src/hooks/**`                | `hooks`, `lib`                                      |
| `lib`        | `src/lib/**`                  | `lib`                                               |

`src/main.tsx` is the composition root and is exempt. `boundaries/no-unknown-files` fails any file under `src/` that doesn't belong to a layer.

## Consequences

- Features can't import each other. Code that two features need moves down into `components`, `hooks` or `lib`. Wiring that spans features happens in routes.
- `ui` stays a pure design-system layer (shadcn), safe to regenerate.
- Adding a new top-level folder under `src/` means adding an element to the ESLint config, which is a deliberate step.
- Revisit if per-feature public entry points (`index.ts` only, via `boundaries/entry-point`) become worth the ceremony.
