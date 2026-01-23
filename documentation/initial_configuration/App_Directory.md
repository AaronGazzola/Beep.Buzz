# App Directory

```txt
App Directory Structure:

└── app/
    ├── layout.tsx
    ├── layout.hooks.tsx
    ├── layout.actions.ts
    ├── page.tsx
    ├── page.hooks.tsx
    ├── page.actions.ts
    ├── page.types.ts
    ├── sign-in/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   ├── page.actions.ts
    │   └── page.types.ts
    ├── welcome/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   ├── page.actions.ts
    │   ├── page.stores.ts
    │   └── page.types.ts
    ├── [username]/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   ├── page.actions.ts
    │   ├── page.stores.ts
    │   └── page.types.ts
    ├── edit/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   ├── page.actions.ts
    │   ├── page.stores.ts
    │   └── page.types.ts
    ├── admin/
    │   ├── layout.tsx
    │   ├── layout.hooks.tsx
    │   ├── layout.actions.ts
    │   ├── layout.stores.ts
    │   ├── layout.types.ts
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   ├── page.actions.ts
    │   ├── page.stores.ts
    │   └── page.types.ts
    └── settings/
        ├── page.tsx
        ├── page.hooks.tsx
        ├── page.actions.ts
        ├── page.stores.ts
        └── page.types.ts

```

```txt
Route Map (Generated from App Structure):

├── /
├── /sign-in
├── /welcome
├── /[username]
├── /edit
├── /admin
└── /settings

```

## Feature and Function Map

### /app/layout.tsx
**Feature: Sign Out User**
- Hook: `useSignOutUser` → `/app/layout.hooks.tsx`
- Action: `signOutUserAction` → `/app/layout.actions.ts`

### /app/layout.hooks.tsx
- `useSignOutUser` (used by: `/app/layout.tsx` → Sign Out User)

### /app/layout.actions.ts
- `signOutUserAction` (used by: `/app/layout.tsx` → Sign Out User)

### /app/page.tsx
**Feature: Fetch Featured Sections**
- Hook: `useFeaturedSections` → `/app/page.hooks.tsx`
- Action: `fetchFeaturedSectionsAction` → `/app/page.actions.ts`
- Type: `FeaturedSectionsData` → `/app/page.types.ts`

### /app/page.hooks.tsx
- `useFeaturedSections` (used by: `/app/page.tsx` → Fetch Featured Sections)

### /app/page.actions.ts
- `fetchFeaturedSectionsAction` (used by: `/app/page.tsx` → Fetch Featured Sections)

### /app/page.types.ts
- `FeaturedSectionsData` (used by: `/app/page.tsx` → Fetch Featured Sections)

### /app/sign-in/page.tsx
**Feature: Send Magic Link**
- Hook: `useMagicLink` → `/app/sign-in/page.hooks.tsx`
- Action: `sendMagicLinkAction` → `/app/sign-in/page.actions.ts`
- Type: `MagicLinkData` → `/app/sign-in/page.types.ts`

### /app/sign-in/page.hooks.tsx
- `useMagicLink` (used by: `/app/sign-in/page.tsx` → Send Magic Link)

### /app/sign-in/page.actions.ts
- `sendMagicLinkAction` (used by: `/app/sign-in/page.tsx` → Send Magic Link)

### /app/sign-in/page.types.ts
- `MagicLinkData` (used by: `/app/sign-in/page.tsx` → Send Magic Link)

### /app/welcome/page.tsx
**Feature: Validate Username**
- Hook: `useUsernameValidation` → `/app/welcome/page.hooks.tsx`
- Store: `useUsernameValidationStore` → `/app/welcome/page.stores.ts`
- Action: `validateUsernameAction` → `/app/welcome/page.actions.ts`
- Type: `UsernameValidationData` → `/app/welcome/page.types.ts`

**Feature: Customize Sticker Identity**
- Hook: `useStickerIdentity` → `/app/welcome/page.hooks.tsx`
- Store: `useStickerIdentityStore` → `/app/welcome/page.stores.ts`
- Action: `customizeStickerIdentityAction` → `/app/welcome/page.actions.ts`
- Type: `StickerIdentityData` → `/app/welcome/page.types.ts`

### /app/welcome/page.hooks.tsx
- `useUsernameValidation` (used by: `/app/welcome/page.tsx` → Validate Username)
- `useStickerIdentity` (used by: `/app/welcome/page.tsx` → Customize Sticker Identity)

### /app/welcome/page.actions.ts
- `validateUsernameAction` (used by: `/app/welcome/page.tsx` → Validate Username)
- `customizeStickerIdentityAction` (used by: `/app/welcome/page.tsx` → Customize Sticker Identity)

### /app/welcome/page.stores.ts
- `useUsernameValidationStore` (used by: `/app/welcome/page.tsx` → Validate Username)
- `useStickerIdentityStore` (used by: `/app/welcome/page.tsx` → Customize Sticker Identity)

### /app/welcome/page.types.ts
- `UsernameValidationData` (used by: `/app/welcome/page.tsx` → Validate Username)
- `StickerIdentityData` (used by: `/app/welcome/page.tsx` → Customize Sticker Identity)

### /app/[username]/page.tsx
**Feature: Place Stickers**
- Hook: `usePlaceStickers` → `/app/[username]/page.hooks.tsx`
- Store: `usePlaceStickersStore` → `/app/[username]/page.stores.ts`
- Action: `placeStickersAction` → `/app/[username]/page.actions.ts`
- Type: `PlaceStickersData` → `/app/[username]/page.types.ts`

### /app/[username]/page.hooks.tsx
- `usePlaceStickers` (used by: `/app/[username]/page.tsx` → Place Stickers)

### /app/[username]/page.actions.ts
- `placeStickersAction` (used by: `/app/[username]/page.tsx` → Place Stickers)

### /app/[username]/page.stores.ts
- `usePlaceStickersStore` (used by: `/app/[username]/page.tsx` → Place Stickers)

### /app/[username]/page.types.ts
- `PlaceStickersData` (used by: `/app/[username]/page.tsx` → Place Stickers)

### /app/edit/page.tsx
**Feature: Add Content Elements**
- Hook: `useContentElements` → `/app/edit/page.hooks.tsx`
- Store: `useContentElementsStore` → `/app/edit/page.stores.ts`
- Action: `addContentElementsAction` → `/app/edit/page.actions.ts`
- Type: `ContentElementsData` → `/app/edit/page.types.ts`

**Feature: Manipulate Elements**
- Hook: `useElementManipulation` → `/app/edit/page.hooks.tsx`
- Store: `useElementManipulationStore` → `/app/edit/page.stores.ts`
- Action: `manipulateElementsAction` → `/app/edit/page.actions.ts`
- Type: `ElementManipulationData` → `/app/edit/page.types.ts`

**Feature: Delete Elements**
- Hook: `useDeleteElements` → `/app/edit/page.hooks.tsx`
- Action: `deleteElementsAction` → `/app/edit/page.actions.ts`
- Type: `DeleteElementsData` → `/app/edit/page.types.ts`

### /app/edit/page.hooks.tsx
- `useContentElements` (used by: `/app/edit/page.tsx` → Add Content Elements)
- `useElementManipulation` (used by: `/app/edit/page.tsx` → Manipulate Elements)
- `useDeleteElements` (used by: `/app/edit/page.tsx` → Delete Elements)

### /app/edit/page.actions.ts
- `addContentElementsAction` (used by: `/app/edit/page.tsx` → Add Content Elements)
- `manipulateElementsAction` (used by: `/app/edit/page.tsx` → Manipulate Elements)
- `deleteElementsAction` (used by: `/app/edit/page.tsx` → Delete Elements)

### /app/edit/page.stores.ts
- `useContentElementsStore` (used by: `/app/edit/page.tsx` → Add Content Elements)
- `useElementManipulationStore` (used by: `/app/edit/page.tsx` → Manipulate Elements)

### /app/edit/page.types.ts
- `ContentElementsData` (used by: `/app/edit/page.tsx` → Add Content Elements)
- `ElementManipulationData` (used by: `/app/edit/page.tsx` → Manipulate Elements)
- `DeleteElementsData` (used by: `/app/edit/page.tsx` → Delete Elements)

### /app/admin/layout.tsx
**Feature: Fetch Moderation Queue**
- Hook: `useModerationQueue` → `/app/admin/layout.hooks.tsx`
- Store: `useModerationQueueStore` → `/app/admin/layout.stores.ts`
- Action: `fetchModerationQueueAction` → `/app/admin/layout.actions.ts`
- Type: `ModerationQueueData` → `/app/admin/layout.types.ts`

### /app/admin/layout.hooks.tsx
- `useModerationQueue` (used by: `/app/admin/layout.tsx` → Fetch Moderation Queue)

### /app/admin/layout.actions.ts
- `fetchModerationQueueAction` (used by: `/app/admin/layout.tsx` → Fetch Moderation Queue)

### /app/admin/layout.stores.ts
- `useModerationQueueStore` (used by: `/app/admin/layout.tsx` → Fetch Moderation Queue)

### /app/admin/layout.types.ts
- `ModerationQueueData` (used by: `/app/admin/layout.tsx` → Fetch Moderation Queue)

### /app/admin/page.tsx
**Feature: Fetch and Filter Flagged Content**
- Hook: `useFlaggedContent` → `/app/admin/page.hooks.tsx`
- Store: `useFlaggedContentStore` → `/app/admin/page.stores.ts`
- Action: `fetchFlaggedContentAction` → `/app/admin/page.actions.ts`
- Type: `FlaggedContentData` → `/app/admin/page.types.ts`

**Feature: Moderate Content**
- Hook: `useModerateContent` → `/app/admin/page.hooks.tsx`
- Action: `moderateContentAction` → `/app/admin/page.actions.ts`
- Type: `ModerateContentData` → `/app/admin/page.types.ts`

**Feature: Manage Users**
- Hook: `useUserManagement` → `/app/admin/page.hooks.tsx`
- Action: `manageUsersAction` → `/app/admin/page.actions.ts`
- Type: `UserManagementData` → `/app/admin/page.types.ts`

### /app/admin/page.hooks.tsx
- `useFlaggedContent` (used by: `/app/admin/page.tsx` → Fetch and Filter Flagged Content)
- `useModerateContent` (used by: `/app/admin/page.tsx` → Moderate Content)
- `useUserManagement` (used by: `/app/admin/page.tsx` → Manage Users)

### /app/admin/page.actions.ts
- `fetchFlaggedContentAction` (used by: `/app/admin/page.tsx` → Fetch and Filter Flagged Content)
- `moderateContentAction` (used by: `/app/admin/page.tsx` → Moderate Content)
- `manageUsersAction` (used by: `/app/admin/page.tsx` → Manage Users)

### /app/admin/page.stores.ts
- `useFlaggedContentStore` (used by: `/app/admin/page.tsx` → Fetch and Filter Flagged Content)

### /app/admin/page.types.ts
- `FlaggedContentData` (used by: `/app/admin/page.tsx` → Fetch and Filter Flagged Content)
- `ModerateContentData` (used by: `/app/admin/page.tsx` → Moderate Content)
- `UserManagementData` (used by: `/app/admin/page.tsx` → Manage Users)

### /app/settings/page.tsx
**Feature: Update Sticker Identity**
- Hook: `useUpdateStickerIdentity` → `/app/settings/page.hooks.tsx`
- Store: `useStickerIdentityStore` → `/app/settings/page.stores.ts`
- Action: `updateStickerIdentityAction` → `/app/settings/page.actions.ts`
- Type: `StickerIdentityData` → `/app/settings/page.types.ts`

**Feature: Fetch Sticker Activity**
- Hook: `useStickerActivity` → `/app/settings/page.hooks.tsx`
- Action: `fetchStickerActivityAction` → `/app/settings/page.actions.ts`
- Type: `StickerActivityData` → `/app/settings/page.types.ts`

### /app/settings/page.hooks.tsx
- `useUpdateStickerIdentity` (used by: `/app/settings/page.tsx` → Update Sticker Identity)
- `useStickerActivity` (used by: `/app/settings/page.tsx` → Fetch Sticker Activity)

### /app/settings/page.actions.ts
- `updateStickerIdentityAction` (used by: `/app/settings/page.tsx` → Update Sticker Identity)
- `fetchStickerActivityAction` (used by: `/app/settings/page.tsx` → Fetch Sticker Activity)

### /app/settings/page.stores.ts
- `useStickerIdentityStore` (used by: `/app/settings/page.tsx` → Update Sticker Identity)

### /app/settings/page.types.ts
- `StickerIdentityData` (used by: `/app/settings/page.tsx` → Update Sticker Identity)
- `StickerActivityData` (used by: `/app/settings/page.tsx` → Fetch Sticker Activity)

