# App Structure

The app directory provides a site map, a UI layout heirarchy, and a data management strategy.

```txt
App Directory Structure:

└── app/
    ├── layout.tsx
    ├── page.tsx
    ├── page.stores.ts
    ├── page.hooks.tsx
    ├── (auth)/
    │   ├── layout.tsx
    │   └── signup/
    │       ├── page.tsx
    │       ├── page.stores.ts
    │       └── page.hooks.tsx
    ├── (dashboard)/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── page.stores.ts
    │   └── page.hooks.tsx
    └── [username]/
        ├── page.tsx
        ├── page.stores.ts
        └── page.hooks.tsx

```

```txt
Route Map (Generated from App Structure):

├── /
├── /signup
├── /
└── /[username]

```

## Feature and Function Map

### /app/layout.tsx
**Feature: Navigation**
- Hook: `useNavigation` → `/app/page.hooks.tsx`
- Store: `useNavigationStore` → `/app/page.stores.ts`

### /app/page.tsx
**Feature: Landing Page**
- Hook: `useLandingPage` → `/app/page.hooks.tsx`
- Store: `useLandingPageStore` → `/app/page.stores.ts`

### /app/page.stores.ts
- `useNavigationStore` (used by: `/app/layout.tsx` → Navigation)
- `useLandingPageStore` (used by: `/app/page.tsx` → Landing Page)

### /app/page.hooks.tsx
- `useNavigation` (used by: `/app/layout.tsx` → Navigation)
- `useLandingPage` (used by: `/app/page.tsx` → Landing Page)

### /app/(auth)/layout.tsx
*No features defined*

### /app/(auth)/signup/page.tsx
**Feature: Creator Signup**
- Hook: `useCreatorSignup` → `/app/(auth)/signup/page.hooks.tsx`
- Store: `useCreatorSignupStore` → `/app/(auth)/signup/page.stores.ts`

### /app/(auth)/signup/page.stores.ts
- `useCreatorSignupStore` (used by: `/app/(auth)/signup/page.tsx` → Creator Signup)

### /app/(auth)/signup/page.hooks.tsx
- `useCreatorSignup` (used by: `/app/(auth)/signup/page.tsx` → Creator Signup)

### /app/(dashboard)/layout.tsx
*No features defined*

### /app/(dashboard)/page.tsx
**Feature: Creator Dashboard**
- Hook: `useCreatorDashboard` → `/app/(dashboard)/page.hooks.tsx`
- Store: `useCreatorDashboardStore` → `/app/(dashboard)/page.stores.ts`

### /app/(dashboard)/page.stores.ts
- `useCreatorDashboardStore` (used by: `/app/(dashboard)/page.tsx` → Creator Dashboard)

### /app/(dashboard)/page.hooks.tsx
- `useCreatorDashboard` (used by: `/app/(dashboard)/page.tsx` → Creator Dashboard)

### /app/[username]/page.tsx
**Feature: Creator Page**
- Hook: `useCreatorPage` → `/app/[username]/page.hooks.tsx`
- Store: `useCreatorPageStore` → `/app/[username]/page.stores.ts`

### /app/[username]/page.stores.ts
- `useCreatorPageStore` (used by: `/app/[username]/page.tsx` → Creator Page)

### /app/[username]/page.hooks.tsx
- `useCreatorPage` (used by: `/app/[username]/page.tsx` → Creator Page)

