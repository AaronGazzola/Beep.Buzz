# ROBOTS.md

This file provides guidance to AI assistants when working with code in this repository.

### Tech stack

- **Next.js 15** with App Router architecture
- **TypeScript** for type safety
- **TailwindCSS & Shadcn** for styling

- **Postgres & Prisma** for database and ORM
- **Supabase** for authentication and real-time features

# Database Architecture

Use Supabase as the primary database and authentication provider.

- **Postgres & Prisma** for database and ORM
- **NeonDB** for serverless Postgres
- **Better-Auth** for authentication

# Database Architecture

Use NeonDB for serverless Postgres with Prisma ORM and Better-Auth for authentication.

- **Postgres & Prisma** for database and ORM
- **Supabase** for real-time features
- **NeonDB** for serverless Postgres
- **Better-Auth** for authentication

# Database Architecture

Use both Supabase and NeonDB based on feature requirements. Use Better-Auth for authentication with NeonDB as the primary database.

# General rules:

- Don't include any comments in any files.
- All errors should be thrown - no "fallback" functionality
- Import "cn" from "@/lib/utils" to concatenate classes.

# File Organization and Naming Conventions

- Types and store files alongside ancestor files
- Actions and hooks files alongside descendent files

```

# Hook, action, store and type patterns

DB <-> Supabase Client <-> hook <-> store

- Supabase client queries are called directly in react-query hooks.
- Data returned in the onSuccess function of react-query hooks is used to update the corresponding zustand store (if applicable).
- Loading and error state is managed via the react-query hooks, NOT the zustand store.
- All db types should be defined from `@/integrations/supabase/types`.

## Example of file patterns - [`util.md`](util.md)

Follow the examples outlined in [`util.md`](util.md) when working on hook, store or type files.

# Console.logging

All logging should be performed using the `conditionalLog` function exported from `lib/log.utils.ts`
The `NEXT_PUBLIC_LOG_LABELS` variable in `.env.local` stores a comma separated string of log labels. Logs are returned if `NEXT_PUBLIC_LOG_LABELS="all"`, or if `NEXT_PUBLIC_LOG_LABELS` includes the label arg in `conditionalLog`.

```
