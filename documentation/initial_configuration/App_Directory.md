# App Directory

```txt
App Directory Structure:

└── app/
    ├── layout.tsx
    ├── layout.hooks.tsx
    ├── layout.actions.ts
    ├── layout.stores.ts
    ├── layout.types.ts
    ├── page.tsx
    ├── sign-in/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   ├── page.actions.ts
    │   ├── page.stores.ts
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
    ├── editor/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   ├── page.actions.ts
    │   ├── page.stores.ts
    │   └── page.types.ts
    ├── admin/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   ├── page.actions.ts
    │   ├── page.stores.ts
    │   └── page.types.ts
    ├── settings/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   ├── page.actions.ts
    │   ├── page.stores.ts
    │   └── page.types.ts
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
├── /editor
├── /admin
└── /settings

```

## Feature and Function Map

### /app/layout.tsx
**Feature: Sign out user**
- Hook: `useSignOut` → `/app/layout.hooks.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `signOutAction` → `/app/layout.actions.ts`
- Type: `SignOutType` → `/app/layout.types.ts`

**Feature: Sign out user**
- Hook: `useSignOut` → `/app/layout.hooks.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `signOutAction` → `/app/layout.actions.ts`
- Type: `SignOutType` → `/app/layout.types.ts`

**Feature: Get user profile menu**
- Hook: `useProfileMenu` → `/app/layout.hooks.tsx`
- Store: `useProfileStore` → `/app/layout.stores.ts`
- Action: `getProfileMenuAction` → `/app/layout.actions.ts`
- Type: `ProfileMenuType` → `/app/layout.types.ts`

**Feature: Get user profile menu**
- Hook: `useProfileMenu` → `/app/layout.hooks.tsx`
- Store: `useProfileStore` → `/app/layout.stores.ts`
- Action: `getProfileMenuAction` → `/app/layout.actions.ts`
- Type: `ProfileMenuType` → `/app/layout.types.ts`

### /app/layout.hooks.tsx
- `useSignOut` (used by: `/app/layout.tsx` → Sign out user)
- `useSignOut` (used by: `/app/layout.tsx` → Sign out user)
- `useProfileMenu` (used by: `/app/layout.tsx` → Get user profile menu)
- `useProfileMenu` (used by: `/app/layout.tsx` → Get user profile menu)

### /app/layout.actions.ts
- `signOutAction` (used by: `/app/layout.tsx` → Sign out user)
- `signOutAction` (used by: `/app/layout.tsx` → Sign out user)
- `getProfileMenuAction` (used by: `/app/layout.tsx` → Get user profile menu)
- `getProfileMenuAction` (used by: `/app/layout.tsx` → Get user profile menu)

### /app/layout.stores.ts
- `useAuthStore` (used by: `/app/layout.tsx` → Sign out user)
- `useAuthStore` (used by: `/app/layout.tsx` → Sign out user)
- `useProfileStore` (used by: `/app/layout.tsx` → Get user profile menu)
- `useProfileStore` (used by: `/app/layout.tsx` → Get user profile menu)

### /app/layout.types.ts
- `SignOutType` (used by: `/app/layout.tsx` → Sign out user)
- `SignOutType` (used by: `/app/layout.tsx` → Sign out user)
- `ProfileMenuType` (used by: `/app/layout.tsx` → Get user profile menu)
- `ProfileMenuType` (used by: `/app/layout.tsx` → Get user profile menu)

### /app/page.tsx
**Feature: Search pages**
- Hook: `useSearch` → `/app/page.hooks.tsx`
- Store: `useSearchStore` → `/app/page.stores.ts`
- Action: `searchAction` → `/app/page.actions.ts`
- Type: `SearchType` → `/app/page.types.ts`

**Feature: Filter by category**
- Hook: `useFilter` → `/app/page.hooks.tsx`
- Store: `useFilterStore` → `/app/page.stores.ts`
- Action: `filterAction` → `/app/page.actions.ts`
- Type: `FilterType` → `/app/page.types.ts`

**Feature: Get random page**
- Hook: `useRandomPage` → `/app/page.hooks.tsx`
- Store: `usePageStore` → `/app/page.stores.ts`
- Action: `getRandomPageAction` → `/app/page.actions.ts`
- Type: `RandomPageType` → `/app/page.types.ts`

**Feature: Get featured pages**
- Hook: `useFeaturedPages` → `/app/page.hooks.tsx`
- Store: `usePageStore` → `/app/page.stores.ts`
- Action: `getFeaturedPagesAction` → `/app/page.actions.ts`
- Type: `FeaturedPagesType` → `/app/page.types.ts`

### /app/sign-in/page.tsx
**Feature: Send magic link email**
- Hook: `useMagicLink` → `/app/sign-in/page.hooks.tsx`
- Store: `useAuthStore` → `/app/sign-in/page.stores.ts`
- Action: `sendMagicLinkAction` → `/app/sign-in/page.actions.ts`
- Type: `MagicLinkType` → `/app/sign-in/page.types.ts`

### /app/sign-in/page.hooks.tsx
- `useMagicLink` (used by: `/app/sign-in/page.tsx` → Send magic link email)

### /app/sign-in/page.actions.ts
- `sendMagicLinkAction` (used by: `/app/sign-in/page.tsx` → Send magic link email)

### /app/sign-in/page.stores.ts
- `useAuthStore` (used by: `/app/sign-in/page.tsx` → Send magic link email)

### /app/sign-in/page.types.ts
- `MagicLinkType` (used by: `/app/sign-in/page.tsx` → Send magic link email)

### /app/welcome/page.tsx
**Feature: Create username**
- Hook: `useUsername` → `/app/welcome/page.hooks.tsx`
- Store: `useUserStore` → `/app/welcome/page.stores.ts`
- Action: `createUsernameAction` → `/app/welcome/page.actions.ts`
- Type: `UsernameType` → `/app/welcome/page.types.ts`

**Feature: Customize beep icon**
- Hook: `useBeepIcon` → `/app/welcome/page.hooks.tsx`
- Store: `useIconStore` → `/app/welcome/page.stores.ts`
- Action: `customizeBeepAction` → `/app/welcome/page.actions.ts`
- Type: `BeepIconType` → `/app/welcome/page.types.ts`

**Feature: Customize buzz icon**
- Hook: `useBuzzIcon` → `/app/welcome/page.hooks.tsx`
- Store: `useIconStore` → `/app/welcome/page.stores.ts`
- Action: `customizeBuzzAction` → `/app/welcome/page.actions.ts`
- Type: `BuzzIconType` → `/app/welcome/page.types.ts`

### /app/welcome/page.hooks.tsx
- `useUsername` (used by: `/app/welcome/page.tsx` → Create username)
- `useBeepIcon` (used by: `/app/welcome/page.tsx` → Customize beep icon)
- `useBuzzIcon` (used by: `/app/welcome/page.tsx` → Customize buzz icon)

### /app/welcome/page.actions.ts
- `createUsernameAction` (used by: `/app/welcome/page.tsx` → Create username)
- `customizeBeepAction` (used by: `/app/welcome/page.tsx` → Customize beep icon)
- `customizeBuzzAction` (used by: `/app/welcome/page.tsx` → Customize buzz icon)

### /app/welcome/page.stores.ts
- `useUserStore` (used by: `/app/welcome/page.tsx` → Create username)
- `useIconStore` (used by: `/app/welcome/page.tsx` → Customize beep icon)
- `useIconStore` (used by: `/app/welcome/page.tsx` → Customize buzz icon)

### /app/welcome/page.types.ts
- `UsernameType` (used by: `/app/welcome/page.tsx` → Create username)
- `BeepIconType` (used by: `/app/welcome/page.tsx` → Customize beep icon)
- `BuzzIconType` (used by: `/app/welcome/page.tsx` → Customize buzz icon)

### /app/[username]/page.tsx
**Feature: Toggle sticker visibility**
- Hook: `useStickersVisibility` → `/app/[username]/page.hooks.tsx`
- Store: `useStickerStore` → `/app/[username]/page.stores.ts`
- Action: `toggleStickersAction` → `/app/[username]/page.actions.ts`
- Type: `StickerVisibilityType` → `/app/[username]/page.types.ts`

**Feature: Add beep sticker**
- Hook: `useBeepSticker` → `/app/[username]/page.hooks.tsx`
- Store: `useStickerStore` → `/app/[username]/page.stores.ts`
- Action: `addBeepStickerAction` → `/app/[username]/page.actions.ts`
- Type: `BeepStickerType` → `/app/[username]/page.types.ts`

**Feature: Add buzz sticker**
- Hook: `useBuzzSticker` → `/app/[username]/page.hooks.tsx`
- Store: `useStickerStore` → `/app/[username]/page.stores.ts`
- Action: `addBuzzStickerAction` → `/app/[username]/page.actions.ts`
- Type: `BuzzStickerType` → `/app/[username]/page.types.ts`

**Feature: Get sticker details**
- Hook: `useStickerDetails` → `/app/[username]/page.hooks.tsx`
- Store: `useStickerStore` → `/app/[username]/page.stores.ts`
- Action: `getStickerDetailsAction` → `/app/[username]/page.actions.ts`
- Type: `StickerDetailsType` → `/app/[username]/page.types.ts`

### /app/[username]/page.hooks.tsx
- `useStickersVisibility` (used by: `/app/[username]/page.tsx` → Toggle sticker visibility)
- `useBeepSticker` (used by: `/app/[username]/page.tsx` → Add beep sticker)
- `useBuzzSticker` (used by: `/app/[username]/page.tsx` → Add buzz sticker)
- `useStickerDetails` (used by: `/app/[username]/page.tsx` → Get sticker details)

### /app/[username]/page.actions.ts
- `toggleStickersAction` (used by: `/app/[username]/page.tsx` → Toggle sticker visibility)
- `addBeepStickerAction` (used by: `/app/[username]/page.tsx` → Add beep sticker)
- `addBuzzStickerAction` (used by: `/app/[username]/page.tsx` → Add buzz sticker)
- `getStickerDetailsAction` (used by: `/app/[username]/page.tsx` → Get sticker details)

### /app/[username]/page.stores.ts
- `useStickerStore` (used by: `/app/[username]/page.tsx` → Toggle sticker visibility)
- `useStickerStore` (used by: `/app/[username]/page.tsx` → Add beep sticker)
- `useStickerStore` (used by: `/app/[username]/page.tsx` → Add buzz sticker)
- `useStickerStore` (used by: `/app/[username]/page.tsx` → Get sticker details)

### /app/[username]/page.types.ts
- `StickerVisibilityType` (used by: `/app/[username]/page.tsx` → Toggle sticker visibility)
- `BeepStickerType` (used by: `/app/[username]/page.tsx` → Add beep sticker)
- `BuzzStickerType` (used by: `/app/[username]/page.tsx` → Add buzz sticker)
- `StickerDetailsType` (used by: `/app/[username]/page.tsx` → Get sticker details)

### /app/editor/page.tsx
**Feature: Add text block**
- Hook: `useTextBlock` → `/app/editor/page.hooks.tsx`
- Store: `useEditorStore` → `/app/editor/page.stores.ts`
- Action: `addTextBlockAction` → `/app/editor/page.actions.ts`
- Type: `TextBlockType` → `/app/editor/page.types.ts`

**Feature: Add shape**
- Hook: `useShape` → `/app/editor/page.hooks.tsx`
- Store: `useEditorStore` → `/app/editor/page.stores.ts`
- Action: `addShapeAction` → `/app/editor/page.actions.ts`
- Type: `ShapeType` → `/app/editor/page.types.ts`

**Feature: Add divider**
- Hook: `useDivider` → `/app/editor/page.hooks.tsx`
- Store: `useEditorStore` → `/app/editor/page.stores.ts`
- Action: `addDividerAction` → `/app/editor/page.actions.ts`
- Type: `DividerType` → `/app/editor/page.types.ts`

**Feature: Add YouTube embed**
- Hook: `useYouTubeEmbed` → `/app/editor/page.hooks.tsx`
- Store: `useEditorStore` → `/app/editor/page.stores.ts`
- Action: `addYouTubeEmbedAction` → `/app/editor/page.actions.ts`
- Type: `YouTubeEmbedType` → `/app/editor/page.types.ts`

**Feature: Edit element**
- Hook: `useElementEditor` → `/app/editor/page.hooks.tsx`
- Store: `useEditorStore` → `/app/editor/page.stores.ts`
- Action: `editElementAction` → `/app/editor/page.actions.ts`
- Type: `ElementEditorType` → `/app/editor/page.types.ts`

**Feature: Delete element**
- Hook: `useElementDelete` → `/app/editor/page.hooks.tsx`
- Store: `useEditorStore` → `/app/editor/page.stores.ts`
- Action: `deleteElementAction` → `/app/editor/page.actions.ts`
- Type: `ElementDeleteType` → `/app/editor/page.types.ts`

**Feature: Toggle preview mode**
- Hook: `usePreviewMode` → `/app/editor/page.hooks.tsx`
- Store: `useEditorStore` → `/app/editor/page.stores.ts`
- Action: `togglePreviewAction` → `/app/editor/page.actions.ts`
- Type: `PreviewModeType` → `/app/editor/page.types.ts`

### /app/editor/page.hooks.tsx
- `useTextBlock` (used by: `/app/editor/page.tsx` → Add text block)
- `useShape` (used by: `/app/editor/page.tsx` → Add shape)
- `useDivider` (used by: `/app/editor/page.tsx` → Add divider)
- `useYouTubeEmbed` (used by: `/app/editor/page.tsx` → Add YouTube embed)
- `useElementEditor` (used by: `/app/editor/page.tsx` → Edit element)
- `useElementDelete` (used by: `/app/editor/page.tsx` → Delete element)
- `usePreviewMode` (used by: `/app/editor/page.tsx` → Toggle preview mode)

### /app/editor/page.actions.ts
- `addTextBlockAction` (used by: `/app/editor/page.tsx` → Add text block)
- `addShapeAction` (used by: `/app/editor/page.tsx` → Add shape)
- `addDividerAction` (used by: `/app/editor/page.tsx` → Add divider)
- `addYouTubeEmbedAction` (used by: `/app/editor/page.tsx` → Add YouTube embed)
- `editElementAction` (used by: `/app/editor/page.tsx` → Edit element)
- `deleteElementAction` (used by: `/app/editor/page.tsx` → Delete element)
- `togglePreviewAction` (used by: `/app/editor/page.tsx` → Toggle preview mode)

### /app/editor/page.stores.ts
- `useEditorStore` (used by: `/app/editor/page.tsx` → Add text block)
- `useEditorStore` (used by: `/app/editor/page.tsx` → Add shape)
- `useEditorStore` (used by: `/app/editor/page.tsx` → Add divider)
- `useEditorStore` (used by: `/app/editor/page.tsx` → Add YouTube embed)
- `useEditorStore` (used by: `/app/editor/page.tsx` → Edit element)
- `useEditorStore` (used by: `/app/editor/page.tsx` → Delete element)
- `useEditorStore` (used by: `/app/editor/page.tsx` → Toggle preview mode)

### /app/editor/page.types.ts
- `TextBlockType` (used by: `/app/editor/page.tsx` → Add text block)
- `ShapeType` (used by: `/app/editor/page.tsx` → Add shape)
- `DividerType` (used by: `/app/editor/page.tsx` → Add divider)
- `YouTubeEmbedType` (used by: `/app/editor/page.tsx` → Add YouTube embed)
- `ElementEditorType` (used by: `/app/editor/page.tsx` → Edit element)
- `ElementDeleteType` (used by: `/app/editor/page.tsx` → Delete element)
- `PreviewModeType` (used by: `/app/editor/page.tsx` → Toggle preview mode)

### /app/admin/page.tsx
**Feature: Review flagged content**
- Hook: `useContentReview` → `/app/admin/page.hooks.tsx`
- Store: `useAdminStore` → `/app/admin/page.stores.ts`
- Action: `reviewContentAction` → `/app/admin/page.actions.ts`
- Type: `ContentReviewType` → `/app/admin/page.types.ts`

**Feature: Approve sticker design**
- Hook: `useStickerApproval` → `/app/admin/page.hooks.tsx`
- Store: `useAdminStore` → `/app/admin/page.stores.ts`
- Action: `approveStickerAction` → `/app/admin/page.actions.ts`
- Type: `StickerApprovalType` → `/app/admin/page.types.ts`

**Feature: Remove content**
- Hook: `useContentRemoval` → `/app/admin/page.hooks.tsx`
- Store: `useAdminStore` → `/app/admin/page.stores.ts`
- Action: `removeContentAction` → `/app/admin/page.actions.ts`
- Type: `ContentRemovalType` → `/app/admin/page.types.ts`

**Feature: Warn user**
- Hook: `useUserWarning` → `/app/admin/page.hooks.tsx`
- Store: `useAdminStore` → `/app/admin/page.stores.ts`
- Action: `warnUserAction` → `/app/admin/page.actions.ts`
- Type: `UserWarningType` → `/app/admin/page.types.ts`

**Feature: Ban user**
- Hook: `useUserBan` → `/app/admin/page.hooks.tsx`
- Store: `useAdminStore` → `/app/admin/page.stores.ts`
- Action: `banUserAction` → `/app/admin/page.actions.ts`
- Type: `UserBanType` → `/app/admin/page.types.ts`

**Feature: Get moderation log**
- Hook: `useModerationLog` → `/app/admin/page.hooks.tsx`
- Store: `useAdminStore` → `/app/admin/page.stores.ts`
- Action: `getModerationLogAction` → `/app/admin/page.actions.ts`
- Type: `ModerationLogType` → `/app/admin/page.types.ts`

### /app/admin/page.hooks.tsx
- `useContentReview` (used by: `/app/admin/page.tsx` → Review flagged content)
- `useStickerApproval` (used by: `/app/admin/page.tsx` → Approve sticker design)
- `useContentRemoval` (used by: `/app/admin/page.tsx` → Remove content)
- `useUserWarning` (used by: `/app/admin/page.tsx` → Warn user)
- `useUserBan` (used by: `/app/admin/page.tsx` → Ban user)
- `useModerationLog` (used by: `/app/admin/page.tsx` → Get moderation log)

### /app/admin/page.actions.ts
- `reviewContentAction` (used by: `/app/admin/page.tsx` → Review flagged content)
- `approveStickerAction` (used by: `/app/admin/page.tsx` → Approve sticker design)
- `removeContentAction` (used by: `/app/admin/page.tsx` → Remove content)
- `warnUserAction` (used by: `/app/admin/page.tsx` → Warn user)
- `banUserAction` (used by: `/app/admin/page.tsx` → Ban user)
- `getModerationLogAction` (used by: `/app/admin/page.tsx` → Get moderation log)

### /app/admin/page.stores.ts
- `useAdminStore` (used by: `/app/admin/page.tsx` → Review flagged content)
- `useAdminStore` (used by: `/app/admin/page.tsx` → Approve sticker design)
- `useAdminStore` (used by: `/app/admin/page.tsx` → Remove content)
- `useAdminStore` (used by: `/app/admin/page.tsx` → Warn user)
- `useAdminStore` (used by: `/app/admin/page.tsx` → Ban user)
- `useAdminStore` (used by: `/app/admin/page.tsx` → Get moderation log)

### /app/admin/page.types.ts
- `ContentReviewType` (used by: `/app/admin/page.tsx` → Review flagged content)
- `StickerApprovalType` (used by: `/app/admin/page.tsx` → Approve sticker design)
- `ContentRemovalType` (used by: `/app/admin/page.tsx` → Remove content)
- `UserWarningType` (used by: `/app/admin/page.tsx` → Warn user)
- `UserBanType` (used by: `/app/admin/page.tsx` → Ban user)
- `ModerationLogType` (used by: `/app/admin/page.tsx` → Get moderation log)

### /app/settings/page.tsx
**Feature: Update beep icon**
- Hook: `useBeepUpdate` → `/app/settings/page.hooks.tsx`
- Store: `useSettingsStore` → `/app/settings/page.stores.ts`
- Action: `updateBeepAction` → `/app/settings/page.actions.ts`
- Type: `BeepUpdateType` → `/app/settings/page.types.ts`

**Feature: Update buzz icon**
- Hook: `useBuzzUpdate` → `/app/settings/page.hooks.tsx`
- Store: `useSettingsStore` → `/app/settings/page.stores.ts`
- Action: `updateBuzzAction` → `/app/settings/page.actions.ts`
- Type: `BuzzUpdateType` → `/app/settings/page.types.ts`

**Feature: Get sticker activity**
- Hook: `useStickerActivity` → `/app/settings/page.hooks.tsx`
- Store: `useSettingsStore` → `/app/settings/page.stores.ts`
- Action: `getStickerActivityAction` → `/app/settings/page.actions.ts`
- Type: `StickerActivityType` → `/app/settings/page.types.ts`

**Feature: Remove placed sticker**
- Hook: `useStickerRemoval` → `/app/settings/page.hooks.tsx`
- Store: `useSettingsStore` → `/app/settings/page.stores.ts`
- Action: `removeStickerAction` → `/app/settings/page.actions.ts`
- Type: `StickerRemovalType` → `/app/settings/page.types.ts`

**Feature: Get sticker analytics**
- Hook: `useStickerAnalytics` → `/app/settings/page.hooks.tsx`
- Store: `useSettingsStore` → `/app/settings/page.stores.ts`
- Action: `getStickerAnalyticsAction` → `/app/settings/page.actions.ts`
- Type: `StickerAnalyticsType` → `/app/settings/page.types.ts`

### /app/settings/page.hooks.tsx
- `useBeepUpdate` (used by: `/app/settings/page.tsx` → Update beep icon)
- `useBuzzUpdate` (used by: `/app/settings/page.tsx` → Update buzz icon)
- `useStickerActivity` (used by: `/app/settings/page.tsx` → Get sticker activity)
- `useStickerRemoval` (used by: `/app/settings/page.tsx` → Remove placed sticker)
- `useStickerAnalytics` (used by: `/app/settings/page.tsx` → Get sticker analytics)

### /app/settings/page.actions.ts
- `updateBeepAction` (used by: `/app/settings/page.tsx` → Update beep icon)
- `updateBuzzAction` (used by: `/app/settings/page.tsx` → Update buzz icon)
- `getStickerActivityAction` (used by: `/app/settings/page.tsx` → Get sticker activity)
- `removeStickerAction` (used by: `/app/settings/page.tsx` → Remove placed sticker)
- `getStickerAnalyticsAction` (used by: `/app/settings/page.tsx` → Get sticker analytics)

### /app/settings/page.stores.ts
- `useSettingsStore` (used by: `/app/settings/page.tsx` → Update beep icon)
- `useSettingsStore` (used by: `/app/settings/page.tsx` → Update buzz icon)
- `useSettingsStore` (used by: `/app/settings/page.tsx` → Get sticker activity)
- `useSettingsStore` (used by: `/app/settings/page.tsx` → Remove placed sticker)
- `useSettingsStore` (used by: `/app/settings/page.tsx` → Get sticker analytics)

### /app/settings/page.types.ts
- `BeepUpdateType` (used by: `/app/settings/page.tsx` → Update beep icon)
- `BuzzUpdateType` (used by: `/app/settings/page.tsx` → Update buzz icon)
- `StickerActivityType` (used by: `/app/settings/page.tsx` → Get sticker activity)
- `StickerRemovalType` (used by: `/app/settings/page.tsx` → Remove placed sticker)
- `StickerAnalyticsType` (used by: `/app/settings/page.tsx` → Get sticker analytics)

### /app/page.hooks.tsx
- `useSearch` (used by: `/app/page.tsx` → Search pages)
- `useFilter` (used by: `/app/page.tsx` → Filter by category)
- `useRandomPage` (used by: `/app/page.tsx` → Get random page)
- `useFeaturedPages` (used by: `/app/page.tsx` → Get featured pages)

### /app/page.actions.ts
- `searchAction` (used by: `/app/page.tsx` → Search pages)
- `filterAction` (used by: `/app/page.tsx` → Filter by category)
- `getRandomPageAction` (used by: `/app/page.tsx` → Get random page)
- `getFeaturedPagesAction` (used by: `/app/page.tsx` → Get featured pages)

### /app/page.stores.ts
- `useSearchStore` (used by: `/app/page.tsx` → Search pages)
- `useFilterStore` (used by: `/app/page.tsx` → Filter by category)
- `usePageStore` (used by: `/app/page.tsx` → Get random page)
- `usePageStore` (used by: `/app/page.tsx` → Get featured pages)

### /app/page.types.ts
- `SearchType` (used by: `/app/page.tsx` → Search pages)
- `FilterType` (used by: `/app/page.tsx` → Filter by category)
- `RandomPageType` (used by: `/app/page.tsx` → Get random page)
- `FeaturedPagesType` (used by: `/app/page.tsx` → Get featured pages)

