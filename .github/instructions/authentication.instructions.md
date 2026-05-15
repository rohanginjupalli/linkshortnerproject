---
description: Read this before implementing or modifying authentication in the project.
---

## Scope

All authentication and authorization in this application must use Clerk. Do not add, mix in, or suggest any alternate auth provider, custom session system, or hand-rolled login flow.

## Required Rules

- Use Clerk for all sign-in, sign-up, session, and user identity behavior.
- Do not introduce any non-Clerk auth method.
- Protect `/dashboard` so unauthenticated users cannot access it.
- Redirect authenticated users who visit the homepage to `/dashboard`.
- Sign-in and sign-up entry points must open Clerk modals, not full standalone pages, unless the user explicitly asks for a different flow.

## Implementation Expectations

### Protected Route

Treat `/dashboard` as a protected route. Server-side protection is preferred, and the route should redirect unauthenticated users away before rendering private content.

### Homepage Redirect

If a logged-in user lands on `/`, redirect them to `/dashboard` so the homepage acts as the unauthenticated entry point.

### Clerk Modals

Use Clerk modal flows for sign-in and sign-up triggers. Navigation or CTA buttons should open the modal experience instead of routing to separate auth pages.

## Preferred Pattern

- Use `auth()` from `@clerk/nextjs/server` in server components, route handlers, and server actions.
- Use `useUser()` in client components only when client-side user state is required.
- Keep auth checks close to the route or action that needs protection.

## Examples

### Protecting `/dashboard`

```typescript
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return <main>Dashboard</main>;
}
```

### Redirecting authenticated users from `/`

```typescript
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return <main>Home</main>;
}
```

### Clerk modal sign-in / sign-up

```typescript
'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';

export function AuthActions() {
  return (
    <div>
      <SignInButton mode="modal">Sign in</SignInButton>
      <SignUpButton mode="modal">Sign up</SignUpButton>
    </div>
  );
}
```

## Review Checklist

Before changing auth-related code, confirm:

- The change still uses Clerk only.
- `/dashboard` is protected.
- Logged-in users are redirected away from `/`.
- Sign-in and sign-up launch in modal mode.
