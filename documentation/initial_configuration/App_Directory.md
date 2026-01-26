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
    ├── studio/
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
├── /studio
├── /[username]
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
- `useStickerIdentityStore` (used by: `/app/welcome/page.tsx` → Customize Sticker Identity)

### /app/welcome/page.types.ts
- `UsernameValidationData` (used by: `/app/welcome/page.tsx` → Validate Username)
- `StickerIdentityData` (used by: `/app/welcome/page.tsx` → Customize Sticker Identity)

### /app/studio/page.tsx
**Feature: Add and Edit Content Blocks**
- Hook: `useContentBlocks` → `/app/studio/page.hooks.tsx`
- Store: `useContentBlocksStore` → `/app/studio/page.stores.ts`
- Action: `contentBlocksAction` → `/app/studio/page.actions.ts`
- Type: `ContentBlockData` → `/app/studio/page.types.ts`

**Feature: Drag and Reorder Elements**
- Hook: `useElementDrag` → `/app/studio/page.hooks.tsx`
- Store: `useElementDragStore` → `/app/studio/page.stores.ts`
- Action: `elementDragAction` → `/app/studio/page.actions.ts`
- Type: `ElementDragData` → `/app/studio/page.types.ts`

**Feature: Resize Elements**
- Hook: `useElementResize` → `/app/studio/page.hooks.tsx`
- Store: `useElementResizeStore` → `/app/studio/page.stores.ts`
- Action: `elementResizeAction` → `/app/studio/page.actions.ts`
- Type: `ElementResizeData` → `/app/studio/page.types.ts`

### /app/studio/page.hooks.tsx
- `useContentBlocks` (used by: `/app/studio/page.tsx` → Add and Edit Content Blocks)
- `useElementDrag` (used by: `/app/studio/page.tsx` → Drag and Reorder Elements)
- `useElementResize` (used by: `/app/studio/page.tsx` → Resize Elements)

### /app/studio/page.actions.ts
- `contentBlocksAction` (used by: `/app/studio/page.tsx` → Add and Edit Content Blocks)
- `elementDragAction` (used by: `/app/studio/page.tsx` → Drag and Reorder Elements)
- `elementResizeAction` (used by: `/app/studio/page.tsx` → Resize Elements)

### /app/studio/page.stores.ts
- `useContentBlocksStore` (used by: `/app/studio/page.tsx` → Add and Edit Content Blocks)
- `useElementDragStore` (used by: `/app/studio/page.tsx` → Drag and Reorder Elements)
- `useElementResizeStore` (used by: `/app/studio/page.tsx` → Resize Elements)

### /app/studio/page.types.ts
- `ContentBlockData` (used by: `/app/studio/page.tsx` → Add and Edit Content Blocks)
- `ElementDragData` (used by: `/app/studio/page.tsx` → Drag and Reorder Elements)
- `ElementResizeData` (used by: `/app/studio/page.tsx` → Resize Elements)

### /app/[username]/page.tsx
**Feature: Place Stickers**
- Hook: `useStickerPlacement` → `/app/[username]/page.hooks.tsx`
- Store: `useStickerPlacementStore` → `/app/[username]/page.stores.ts`
- Action: `placeStickerAction` → `/app/[username]/page.actions.ts`
- Type: `StickerPlacementData` → `/app/[username]/page.types.ts`

**Feature: Toggle Sticker Visibility**
- Store: `useStickerVisibilityStore` → `/app/[username]/page.stores.ts`

### /app/[username]/page.hooks.tsx
- `useStickerPlacement` (used by: `/app/[username]/page.tsx` → Place Stickers)

### /app/[username]/page.actions.ts
- `placeStickerAction` (used by: `/app/[username]/page.tsx` → Place Stickers)

### /app/[username]/page.stores.ts
- `useStickerPlacementStore` (used by: `/app/[username]/page.tsx` → Place Stickers)
- `useStickerVisibilityStore` (used by: `/app/[username]/page.tsx` → Toggle Sticker Visibility)

### /app/[username]/page.types.ts
- `StickerPlacementData` (used by: `/app/[username]/page.tsx` → Place Stickers)

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
- Hook: `useContentModeration` → `/app/admin/page.hooks.tsx`
- Action: `moderateContentAction` → `/app/admin/page.actions.ts`
- Type: `ContentModerationData` → `/app/admin/page.types.ts`

**Feature: Approve Sticker Designs**
- Hook: `useStickerApproval` → `/app/admin/page.hooks.tsx`
- Action: `approveStickerAction` → `/app/admin/page.actions.ts`
- Type: `StickerApprovalData` → `/app/admin/page.types.ts`

### /app/admin/page.hooks.tsx
- `useFlaggedContent` (used by: `/app/admin/page.tsx` → Fetch and Filter Flagged Content)
- `useContentModeration` (used by: `/app/admin/page.tsx` → Moderate Content)
- `useStickerApproval` (used by: `/app/admin/page.tsx` → Approve Sticker Designs)

### /app/admin/page.actions.ts
- `fetchFlaggedContentAction` (used by: `/app/admin/page.tsx` → Fetch and Filter Flagged Content)
- `moderateContentAction` (used by: `/app/admin/page.tsx` → Moderate Content)
- `approveStickerAction` (used by: `/app/admin/page.tsx` → Approve Sticker Designs)

### /app/admin/page.stores.ts
- `useFlaggedContentStore` (used by: `/app/admin/page.tsx` → Fetch and Filter Flagged Content)

### /app/admin/page.types.ts
- `FlaggedContentData` (used by: `/app/admin/page.tsx` → Fetch and Filter Flagged Content)
- `ContentModerationData` (used by: `/app/admin/page.tsx` → Moderate Content)
- `StickerApprovalData` (used by: `/app/admin/page.tsx` → Approve Sticker Designs)

### /app/settings/page.tsx
**Feature: Update Sticker Identity**
- Hook: `useIdentityUpdate` → `/app/settings/page.hooks.tsx`
- Store: `useIdentityStore` → `/app/settings/page.stores.ts`
- Action: `updateIdentityAction` → `/app/settings/page.actions.ts`
- Type: `IdentityUpdateData` → `/app/settings/page.types.ts`

**Feature: Manage Placed Stickers**
- Hook: `useStickerManagement` → `/app/settings/page.hooks.tsx`
- Action: `manageStickerAction` → `/app/settings/page.actions.ts`
- Type: `StickerManagementData` → `/app/settings/page.types.ts`

**Feature: Fetch Sticker Analytics**
- Hook: `useStickerAnalytics` → `/app/settings/page.hooks.tsx`
- Action: `fetchAnalyticsAction` → `/app/settings/page.actions.ts`
- Type: `StickerAnalyticsData` → `/app/settings/page.types.ts`

### /app/settings/page.hooks.tsx
- `useIdentityUpdate` (used by: `/app/settings/page.tsx` → Update Sticker Identity)
- `useStickerManagement` (used by: `/app/settings/page.tsx` → Manage Placed Stickers)
- `useStickerAnalytics` (used by: `/app/settings/page.tsx` → Fetch Sticker Analytics)

### /app/settings/page.actions.ts
- `updateIdentityAction` (used by: `/app/settings/page.tsx` → Update Sticker Identity)
- `manageStickerAction` (used by: `/app/settings/page.tsx` → Manage Placed Stickers)
- `fetchAnalyticsAction` (used by: `/app/settings/page.tsx` → Fetch Sticker Analytics)

### /app/settings/page.stores.ts
- `useIdentityStore` (used by: `/app/settings/page.tsx` → Update Sticker Identity)

### /app/settings/page.types.ts
- `IdentityUpdateData` (used by: `/app/settings/page.tsx` → Update Sticker Identity)
- `StickerManagementData` (used by: `/app/settings/page.tsx` → Manage Placed Stickers)
- `StickerAnalyticsData` (used by: `/app/settings/page.tsx` → Fetch Sticker Analytics)

