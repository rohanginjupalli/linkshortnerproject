# LinkShortener Project - Agent Instructions

## Overview

This is a **Next.js 16 URL Shortener** application with user authentication via Clerk and database management via Drizzle ORM. These instructions define coding standards, project structure, and best practices for LLMs working on this codebase.

## Quick Start for Agents

1. **Read the relevant guide** in `/docs` before implementing features
2. **Follow the code standards** in [docs/code-standards.md](docs/code-standards.md)
3. **Understand the project structure** in [docs/project-structure.md](docs/project-structure.md)
4. **Use proper patterns** from [docs/component-patterns.md](docs/component-patterns.md)
5. **Check troubleshooting** in [docs/troubleshooting.md](docs/troubleshooting.md) if you encounter issues

## Documentation Index

All project documentation is in the `/docs` directory. Read the most relevant guide before making changes, and keep new instructions split into focused markdown files under `/docs`.

- [docs/authentication-guide.md](docs/authentication-guide.md) - Clerk-only auth rules and route protection for this app
- [docs/component-patterns.md](docs/component-patterns.md) - shadcn/ui-only UI component usage and composition rules

## Key Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.2.6 | App Router framework |
| **React** | 19.2.4 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Drizzle ORM** | ^0.45.2 | Database ORM |
| **Clerk** | ^7.3.3 | Authentication |
| **Tailwind CSS** | ^4 | Styling |
| **shadcn/ui** | ^4.7.0 | UI components |

## Critical Rules for Agents

### ❌ DO NOT

- Use string concatenation for SQL queries (always use parameterized queries)
- Add `any` types without explanation
- Create routes with Pages Router (`/pages`) - use App Router only
- Forget to check user authentication before database operations
- Skip error handling in async operations
- Deploy without running `npm run build` first
- Modify `proxy.ts` without understanding Clerk middleware
- Use client components by default (server components are preferred)
- Ignore TypeScript errors

### ✅ DO

- Use Server Components by default, add `'use client'` only when needed
- Always type component props explicitly
- Verify user authentication with `auth()` in server operations
- Wrap database operations in try-catch blocks
- Use `eq()`, `and()`, `or()` from drizzle-orm for type-safe queries
- Check authorization before database mutations
- Run `npm run lint` before committing
- Follow naming conventions (kebab-case for files, PascalCase for components)
- Add JSDoc comments to public functions
- Use Tailwind utilities instead of custom CSS

## Project Structure

```
linkshortnerproject/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with ClerkProvider
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # Reusable UI components
├── db/                   # Database layer
│   ├── index.ts         # Database client
│   └── schema.ts        # Drizzle schema
├── lib/                 # Utilities
│   └── utils.ts        # Helper functions
├── docs/               # **Agent instructions (THIS FOLDER)**
├── public/             # Static assets
└── Configuration files (next.config.ts, tsconfig.json, etc.)
```

## Development Commands

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Build for production (check for errors first)
npm start         # Start production server
npm run lint      # Check code quality with ESLint

# Database
npx drizzle-kit generate:pg    # Generate migration
npx drizzle-kit migrate:pg     # Apply migrations
npx drizzle-kit studio         # View database (browser UI)
```

## Environment Setup

Create `.env.local` in project root:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://user:password@host/dbname

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Common Patterns

### Authentication Check (Server Actions)

```typescript
'use server';

import { auth } from '@clerk/nextjs/server';

export async function protectedAction() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('User must be authenticated');
  }

  // Safe to proceed with user-specific operations
}
```

### Database Query (Server Component)

```typescript
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function UserLinks() {
  const { userId } = await auth();
  
  try {
    const userLinks = await db
      .select()
      .from(links)
      .where(eq(links.userId, userId));
    
    return <div>{/* Render links */}</div>;
  } catch (error) {
    console.error('Database error:', error);
    return <div>Error loading links</div>;
  }
}
```

### Interactive Component (Client)

```typescript
'use client';

import { useState } from 'react';

interface MyComponentProps {
  onSubmit: (value: string) => Promise<void>;
}

export function MyComponent({ onSubmit }: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(value: string) {
    setIsLoading(true);
    setError(null);
    
    try {
      await onSubmit(value);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {error && <div className="text-red-600">{error}</div>}
      {/* Component JSX */}
    </div>
  );
}
```

## Agent Workflow

When implementing a feature, follow this workflow:

1. **Read the relevant guide** from `/docs` for the area you're working in
2. **Check existing patterns** in [component-patterns.md](docs/component-patterns.md)
3. **Plan the implementation** based on standards in [code-standards.md](docs/code-standards.md)
4. **Create/modify files** following [project-structure.md](docs/project-structure.md)
5. **Test with** `npm run build` and `npm run lint`
6. **Check console for errors** in the dev server
7. **Review the code** against the standards one more time

## Important Notes

### Next.js Breaking Changes

This project uses **Next.js 16** which has breaking changes from older versions. Always check the guide in `node_modules/next/dist/docs/` before implementing features that seem unusual.

### Clerk Authentication

- Authentication middleware runs in `proxy.ts` (root level)
- Root layout must wrap app in `<ClerkProvider>`
- Use Clerk for all authentication and authorization behavior in this app; do not introduce any alternate auth provider or custom auth flow
- Use `auth()` from `@clerk/nextjs/server` in Server Components/Actions
- Use `useUser()` hook in Client Components when user state is needed
- Protect `/dashboard` so unauthenticated users cannot access it
- Redirect authenticated users visiting the homepage to `/dashboard`
- Sign-in and sign-up entry points should open Clerk modals, not standalone pages, unless the user explicitly requests a different flow

### Drizzle ORM

- Schema defined in `/db/schema.ts`
- Client created in `/db/index.ts`
- All queries must use parameterized queries (Drizzle handles this)
- Always check user ownership before modifications

### Type Safety

- This project uses strict TypeScript - no `any` types
- All component props must be typed
- All function return types must be explicit
- Database queries are type-safe via Drizzle inference

## Testing & Validation

Before claiming a task is complete:

```bash
# 1. Check TypeScript compilation
npm run build

# 2. Check linting
npm run lint

# 3. Test in development
npm run dev
# - Test the feature manually
# - Check console for errors

# 4. Verify database operations (if applicable)
npx drizzle-kit studio
```

## Getting Help

1. Check the relevant guide in `/docs` directory
2. Search [troubleshooting.md](docs/troubleshooting.md) for your issue
3. Review examples in [component-patterns.md](docs/component-patterns.md)
4. Check the Next.js, Drizzle, or Clerk documentation links in the guides

## Summary

- **Code Standards**: [docs/code-standards.md](docs/code-standards.md)
- **Project Structure**: [docs/project-structure.md](docs/project-structure.md)
- **Authentication**: [docs/authentication-guide.md](docs/authentication-guide.md)
- **Database**: [docs/database-guide.md](docs/database-guide.md)
- **Components**: [docs/component-patterns.md](docs/component-patterns.md)
- **Troubleshooting**: [docs/troubleshooting.md](docs/troubleshooting.md)

All agent work should adhere to these standards and follow the patterns documented in `/docs`.
