---
description: Read this before implementing or modifying UI components in the project.
---

## UI Component Rule

- Use shadcn/ui components for all user-facing UI elements in this app.
- Prefer composing existing shadcn/ui primitives from `components/ui` instead of creating bespoke visual components.
- Do not add custom presentational components when an equivalent shadcn/ui component already exists.
- If a needed interaction is not covered by the current shadcn/ui set, build the smallest possible wrapper around shadcn/ui primitives rather than introducing a parallel component system.
- Keep styling consistent with the existing Tailwind-based shadcn/ui patterns.

## Practical Expectation

- Buttons, inputs, dialogs, cards, dropdowns, alerts, tabs, forms, tables, and navigation should come from shadcn/ui or be assembled from shadcn/ui primitives.
- Any new reusable UI should first be checked against the existing shadcn/ui component inventory before adding new code.