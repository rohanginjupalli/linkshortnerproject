---
description: Read this before implementing data mutations with server actions.
---

## Scope

These rules apply to all create, update, and delete operations in the app.

## Required Rules

- Perform all data mutations via Server Actions only.
- Invoke Server Actions from Client Components.
- Place each Server Action file as `action.ts`, co-located with the Client Component that calls it.
- Do not use `FormData` as a TypeScript type for Server Action inputs.
- Define explicit TypeScript types for all data passed to Server Actions.
- Validate all Server Action inputs with Zod before running business logic.
- In every Server Action, check for a logged-in user first using Clerk auth before any database operation.
- Do not run Drizzle queries directly inside Server Actions.
- Use helper functions in `/data` for all database access.

## Preferred Pattern

- Client Component gathers typed input and calls a co-located Server Action.
- Server Action (`action.ts`) authenticates user, validates with Zod, then calls a `/data` helper.
- `/data` helper performs the Drizzle query and returns typed results.

## Review Checklist

Before merging mutation-related changes, confirm:

- Mutation is implemented as a Server Action.
- Action is called from a Client Component.
- File is named `action.ts` and co-located with its caller.
- No `FormData` type is used for inputs.
- Input schema validation with Zod is present.
- Auth check happens before DB access.
- DB operations are delegated to `/data` helpers only.
