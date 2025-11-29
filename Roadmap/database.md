# Database

## Database Configuration

### Generated Files

#### `prisma/schema.prisma`
- Provider: PostgreSQL with multiSchema preview feature
- Schemas: public
- Models:
  - CreatorProfile (public schema) - id, userId, username, youtubeChannelId, stripeAccountId, ...
  - PageComponent (public schema) - id, creatorId, type, configuration, position, ...
  - Donation (public schema) - id, creatorId, amount, message, status, ...

#### `prisma/migrations/RLS_init.sql`
- Enables RLS on: CreatorProfile, PageComponent, Donation
- Policies:
  - CreatorProfile:
    - user: SELECT: own; INSERT: own; UPDATE: own; DELETE: own
    - admin: SELECT: global; INSERT: none; UPDATE: global; DELETE: global
    - super-admin: SELECT: global; INSERT: global; UPDATE: global; DELETE: global
  - PageComponent:
    - user: SELECT: own; INSERT: own; UPDATE: own; DELETE: own
    - admin: SELECT: global; INSERT: none; UPDATE: global; DELETE: global
    - super-admin: SELECT: global; INSERT: global; UPDATE: global; DELETE: global
  - Donation:
    - user: SELECT: own; INSERT: global; UPDATE: own; DELETE: none
    - admin: SELECT: global; INSERT: global; UPDATE: global; DELETE: global
    - super-admin: SELECT: global; INSERT: global; UPDATE: global; DELETE: global

#### `lib/prisma-rls.ts`
- TypeScript RLS policy definitions
- Policy count: 12

#### `lib/prisma-rls-client.ts`
- Prisma client extension for RLS
- Sets user context for database queries
