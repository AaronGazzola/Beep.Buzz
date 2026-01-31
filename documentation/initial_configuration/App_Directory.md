# App Directory

```txt
App Directory Structure:

└── app/
    ├── layout.tsx
    ├── layout.hooks.tsx
    ├── layout.stores.ts
    ├── layout.actions.ts
    ├── layout.types.ts
    ├── page.tsx
    ├── page.hooks.tsx
    ├── (auth)/
    │   ├── sign-in/
    │   │   ├── page.tsx
    │   │   └── page.hooks.tsx
    │   └── verify/
    │       └── page.tsx
    ├── welcome/
    │   ├── page.tsx
    │   └── page.hooks.tsx
    ├── learn/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   └── page.stores.ts
    ├── practice/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   └── page.stores.ts
    ├── compete/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   └── page.stores.ts
    ├── messages/
    │   ├── page.tsx
    │   └── page.hooks.tsx
    ├── leaderboards/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   └── page.stores.ts
    ├── profile/
    │   └── [id]/
    │       ├── page.tsx
    │       └── page.hooks.tsx
    └── settings/
        ├── page.tsx
        └── page.hooks.tsx

```

```txt
Route Map (Generated from App Structure):

├── /
├── /sign-in
├── /verify
├── /welcome
├── /learn
├── /practice
├── /compete
├── /messages
├── /leaderboards
├── /profile/[id]
└── /settings

```

## Feature and Function Map

### /app/layout.tsx
**Feature: Sign out user**
- Hook: `useSignOut` → `/app/layout.hooks.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `signOutAction` → `/app/layout.actions.ts`
- Type: `SignOutResult` → `/app/layout.types.ts`

**Feature: Get user progress summary**
- Hook: `useUserProgress` → `/app/layout.hooks.tsx`
- Store: `useProgressStore` → `/app/layout.stores.ts`
- Action: `getUserProgressAction` → `/app/layout.actions.ts`
- Type: `UserProgressSummary` → `/app/layout.types.ts`

**Feature: Get leaderboard snapshot**
- Hook: `useLeaderboardSnapshot` → `/app/layout.hooks.tsx`
- Store: `useLeaderboardStore` → `/app/layout.stores.ts`
- Action: `getLeaderboardSnapshotAction` → `/app/layout.actions.ts`
- Type: `LeaderboardSnapshot` → `/app/layout.types.ts`

### /app/layout.hooks.tsx
- `useSignOut` (used by: `/app/layout.tsx` → Sign out user)
- `useUserProgress` (used by: `/app/layout.tsx` → Get user progress summary)
- `useLeaderboardSnapshot` (used by: `/app/layout.tsx` → Get leaderboard snapshot)

### /app/layout.stores.ts
- `useAuthStore` (used by: `/app/layout.tsx` → Sign out user)
- `useProgressStore` (used by: `/app/layout.tsx` → Get user progress summary)
- `useLeaderboardStore` (used by: `/app/layout.tsx` → Get leaderboard snapshot)

### /app/layout.actions.ts
- `signOutAction` (used by: `/app/layout.tsx` → Sign out user)
- `getUserProgressAction` (used by: `/app/layout.tsx` → Get user progress summary)
- `getLeaderboardSnapshotAction` (used by: `/app/layout.tsx` → Get leaderboard snapshot)

### /app/layout.types.ts
- `SignOutResult` (used by: `/app/layout.tsx` → Sign out user)
- `UserProgressSummary` (used by: `/app/layout.tsx` → Get user progress summary)
- `LeaderboardSnapshot` (used by: `/app/layout.tsx` → Get leaderboard snapshot)

### /app/page.tsx
**Feature: Get active users count**
- Hook: `useActiveUsersCount` → `/app/page.hooks.tsx`
- Store: `useStatsStore` → `/app/layout.stores.ts`
- Action: `getActiveUsersCountAction` → `/app/layout.actions.ts`
- Type: `ActiveUsersCount` → `/app/layout.types.ts`

**Feature: Get ongoing matches**
- Hook: `useOngoingMatches` → `/app/page.hooks.tsx`
- Store: `useMatchStore` → `/app/layout.stores.ts`
- Action: `getOngoingMatchesAction` → `/app/layout.actions.ts`
- Type: `OngoingMatch` → `/app/layout.types.ts`

**Feature: Try demo interaction**
- Hook: `useMorseDemo` → `/app/page.hooks.tsx`
- Store: `useDemoStore` → `/app/layout.stores.ts`
- Action: `processMorseDemoAction` → `/app/layout.actions.ts`
- Type: `MorseDemoState` → `/app/layout.types.ts`

### /app/page.hooks.tsx
- `useActiveUsersCount` (used by: `/app/page.tsx` → Get active users count)
- `useOngoingMatches` (used by: `/app/page.tsx` → Get ongoing matches)
- `useMorseDemo` (used by: `/app/page.tsx` → Try demo interaction)

### /app/(auth)/sign-in/page.tsx
**Feature: Send magic link email**
- Hook: `useSendMagicLink` → `/app/(auth)/sign-in/page.hooks.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `sendMagicLinkAction` → `/app/layout.actions.ts`
- Type: `MagicLinkPayload` → `/app/layout.types.ts`

### /app/(auth)/sign-in/page.hooks.tsx
- `useSendMagicLink` (used by: `/app/(auth)/sign-in/page.tsx` → Send magic link email)

### /app/(auth)/verify/page.tsx
**Feature: Verify magic link token**
- Hook: `useVerifyToken` → `/app/(auth)/verify/page.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `verifyTokenAction` → `/app/layout.actions.ts`
- Type: `VerificationResult` → `/app/layout.types.ts`

### /app/welcome/page.tsx
**Feature: Create user profile**
- Hook: `useCreateProfile` → `/app/welcome/page.hooks.tsx`
- Store: `useProfileStore` → `/app/layout.stores.ts`
- Action: `createProfileAction` → `/app/layout.actions.ts`
- Type: `CreateProfileInput` → `/app/layout.types.ts`

**Feature: Upload profile picture**
- Hook: `useUploadProfilePicture` → `/app/welcome/page.hooks.tsx`
- Store: `useProfileStore` → `/app/layout.stores.ts`
- Action: `uploadProfilePictureAction` → `/app/layout.actions.ts`
- Type: `ProfilePictureUpload` → `/app/layout.types.ts`

### /app/welcome/page.hooks.tsx
- `useCreateProfile` (used by: `/app/welcome/page.tsx` → Create user profile)
- `useUploadProfilePicture` (used by: `/app/welcome/page.tsx` → Upload profile picture)

### /app/learn/page.tsx
**Feature: Get lesson progress**
- Hook: `useLessonProgress` → `/app/learn/page.hooks.tsx`
- Store: `useLessonStore` → `/app/learn/page.stores.ts`
- Action: `getLessonProgressAction` → `/app/layout.actions.ts`
- Type: `LessonProgress` → `/app/layout.types.ts`

**Feature: Get practice statistics**
- Hook: `usePracticeStats` → `/app/learn/page.hooks.tsx`
- Store: `usePracticeStore` → `/app/learn/page.stores.ts`
- Action: `getPracticeStatsAction` → `/app/layout.actions.ts`
- Type: `PracticeStatistics` → `/app/layout.types.ts`

**Feature: Get skill progression**
- Hook: `useSkillProgression` → `/app/learn/page.hooks.tsx`
- Store: `useSkillStore` → `/app/learn/page.stores.ts`
- Action: `getSkillProgressionAction` → `/app/learn/page.hooks.tsx`
- Type: `SkillProgression` → `/app/learn/page.hooks.tsx`

**Feature: Get recommended lessons**
- Hook: `useRecommendedLessons` → `/app/learn/page.hooks.tsx`
- Store: `useLessonRecommendationStore` → `/app/learn/page.stores.ts`
- Action: `getRecommendedLessonsAction` → `/app/learn/page.hooks.tsx`
- Type: `LessonRecommendation` → `/app/learn/page.hooks.tsx`

### /app/learn/page.hooks.tsx
- `useLessonProgress` (used by: `/app/learn/page.tsx` → Get lesson progress)
- `usePracticeStats` (used by: `/app/learn/page.tsx` → Get practice statistics)
- `useSkillProgression` (used by: `/app/learn/page.tsx` → Get skill progression)
- `getSkillProgressionAction` (used by: `/app/learn/page.tsx` → Get skill progression)
- `SkillProgression` (used by: `/app/learn/page.tsx` → Get skill progression)
- `useRecommendedLessons` (used by: `/app/learn/page.tsx` → Get recommended lessons)
- `getRecommendedLessonsAction` (used by: `/app/learn/page.tsx` → Get recommended lessons)
- `LessonRecommendation` (used by: `/app/learn/page.tsx` → Get recommended lessons)

### /app/learn/page.stores.ts
- `useLessonStore` (used by: `/app/learn/page.tsx` → Get lesson progress)
- `usePracticeStore` (used by: `/app/learn/page.tsx` → Get practice statistics)
- `useSkillStore` (used by: `/app/learn/page.tsx` → Get skill progression)
- `useLessonRecommendationStore` (used by: `/app/learn/page.tsx` → Get recommended lessons)

### /app/practice/page.tsx
**Feature: Submit morse code translation**
- Hook: `useSubmitTranslation` → `/app/practice/page.hooks.tsx`
- Store: `useTranslationStore` → `/app/practice/page.stores.ts`
- Action: `submitTranslationAction` → `/app/practice/page.hooks.tsx`
- Type: `TranslationSubmission` → `/app/practice/page.hooks.tsx`

**Feature: Update difficulty settings**
- Hook: `useUpdateDifficulty` → `/app/practice/page.hooks.tsx`
- Store: `useDifficultyStore` → `/app/practice/page.stores.ts`
- Action: `updateDifficultyAction` → `/app/practice/page.hooks.tsx`
- Type: `DifficultySettings` → `/app/practice/page.hooks.tsx`

**Feature: Get practice content**
- Hook: `usePracticeContent` → `/app/practice/page.hooks.tsx`
- Store: `useContentStore` → `/app/practice/page.stores.ts`
- Action: `getPracticeContentAction` → `/app/practice/page.hooks.tsx`
- Type: `PracticeContent` → `/app/practice/page.hooks.tsx`

### /app/practice/page.hooks.tsx
- `useSubmitTranslation` (used by: `/app/practice/page.tsx` → Submit morse code translation)
- `submitTranslationAction` (used by: `/app/practice/page.tsx` → Submit morse code translation)
- `TranslationSubmission` (used by: `/app/practice/page.tsx` → Submit morse code translation)
- `useUpdateDifficulty` (used by: `/app/practice/page.tsx` → Update difficulty settings)
- `updateDifficultyAction` (used by: `/app/practice/page.tsx` → Update difficulty settings)
- `DifficultySettings` (used by: `/app/practice/page.tsx` → Update difficulty settings)
- `usePracticeContent` (used by: `/app/practice/page.tsx` → Get practice content)
- `getPracticeContentAction` (used by: `/app/practice/page.tsx` → Get practice content)
- `PracticeContent` (used by: `/app/practice/page.tsx` → Get practice content)

### /app/practice/page.stores.ts
- `useTranslationStore` (used by: `/app/practice/page.tsx` → Submit morse code translation)
- `useDifficultyStore` (used by: `/app/practice/page.tsx` → Update difficulty settings)
- `useContentStore` (used by: `/app/practice/page.tsx` → Get practice content)

### /app/compete/page.tsx
**Feature: Join match queue**
- Hook: `useJoinQueue` → `/app/compete/page.hooks.tsx`
- Store: `useQueueStore` → `/app/compete/page.stores.ts`
- Action: `joinQueueAction` → `/app/compete/page.hooks.tsx`
- Type: `QueueStatus` → `/app/compete/page.hooks.tsx`

**Feature: Submit match solution**
- Hook: `useSubmitSolution` → `/app/compete/page.hooks.tsx`
- Store: `useSolutionStore` → `/app/compete/page.stores.ts`
- Action: `submitSolutionAction` → `/app/compete/page.hooks.tsx`
- Type: `MatchSolution` → `/app/compete/page.hooks.tsx`

**Feature: Send match chat message**
- Hook: `useMatchChat` → `/app/compete/page.hooks.tsx`
- Store: `useMatchChatStore` → `/app/compete/page.stores.ts`
- Action: `sendMatchChatAction` → `/app/compete/page.hooks.tsx`
- Type: `MatchChatMessage` → `/app/compete/page.hooks.tsx`

**Feature: Get opponent progress**
- Hook: `useOpponentProgress` → `/app/compete/page.hooks.tsx`
- Store: `useProgressTrackingStore` → `/app/compete/page.stores.ts`
- Action: `getOpponentProgressAction` → `/app/compete/page.hooks.tsx`
- Type: `OpponentProgress` → `/app/compete/page.hooks.tsx`

### /app/compete/page.hooks.tsx
- `useJoinQueue` (used by: `/app/compete/page.tsx` → Join match queue)
- `joinQueueAction` (used by: `/app/compete/page.tsx` → Join match queue)
- `QueueStatus` (used by: `/app/compete/page.tsx` → Join match queue)
- `useSubmitSolution` (used by: `/app/compete/page.tsx` → Submit match solution)
- `submitSolutionAction` (used by: `/app/compete/page.tsx` → Submit match solution)
- `MatchSolution` (used by: `/app/compete/page.tsx` → Submit match solution)
- `useMatchChat` (used by: `/app/compete/page.tsx` → Send match chat message)
- `sendMatchChatAction` (used by: `/app/compete/page.tsx` → Send match chat message)
- `MatchChatMessage` (used by: `/app/compete/page.tsx` → Send match chat message)
- `useOpponentProgress` (used by: `/app/compete/page.tsx` → Get opponent progress)
- `getOpponentProgressAction` (used by: `/app/compete/page.tsx` → Get opponent progress)
- `OpponentProgress` (used by: `/app/compete/page.tsx` → Get opponent progress)

### /app/compete/page.stores.ts
- `useQueueStore` (used by: `/app/compete/page.tsx` → Join match queue)
- `useSolutionStore` (used by: `/app/compete/page.tsx` → Submit match solution)
- `useMatchChatStore` (used by: `/app/compete/page.tsx` → Send match chat message)
- `useProgressTrackingStore` (used by: `/app/compete/page.tsx` → Get opponent progress)

### /app/messages/page.tsx
**Feature: Send morse message**
- Hook: `useSendMorseMessage` → `/app/messages/page.hooks.tsx`
- Store: `useMessageStore` → `/app/messages/page.hooks.tsx`
- Action: `sendMorseMessageAction` → `/app/messages/page.hooks.tsx`
- Type: `MorseMessage` → `/app/messages/page.hooks.tsx`

**Feature: Get message history**
- Hook: `useMessageHistory` → `/app/messages/page.hooks.tsx`
- Store: `useHistoryStore` → `/app/messages/page.hooks.tsx`
- Action: `getMessageHistoryAction` → `/app/messages/page.hooks.tsx`
- Type: `MessageHistory` → `/app/messages/page.hooks.tsx`

**Feature: Decode received message**
- Hook: `useDecodeMessage` → `/app/messages/page.hooks.tsx`
- Store: `useDecodingStore` → `/app/messages/page.hooks.tsx`
- Action: `decodeMessageAction` → `/app/messages/page.hooks.tsx`
- Type: `MessageDecoding` → `/app/messages/page.hooks.tsx`

### /app/messages/page.hooks.tsx
- `useSendMorseMessage` (used by: `/app/messages/page.tsx` → Send morse message)
- `useMessageStore` (used by: `/app/messages/page.tsx` → Send morse message)
- `sendMorseMessageAction` (used by: `/app/messages/page.tsx` → Send morse message)
- `MorseMessage` (used by: `/app/messages/page.tsx` → Send morse message)
- `useMessageHistory` (used by: `/app/messages/page.tsx` → Get message history)
- `useHistoryStore` (used by: `/app/messages/page.tsx` → Get message history)
- `getMessageHistoryAction` (used by: `/app/messages/page.tsx` → Get message history)
- `MessageHistory` (used by: `/app/messages/page.tsx` → Get message history)
- `useDecodeMessage` (used by: `/app/messages/page.tsx` → Decode received message)
- `useDecodingStore` (used by: `/app/messages/page.tsx` → Decode received message)
- `decodeMessageAction` (used by: `/app/messages/page.tsx` → Decode received message)
- `MessageDecoding` (used by: `/app/messages/page.tsx` → Decode received message)

### /app/leaderboards/page.tsx
**Feature: Get category rankings**
- Hook: `useCategoryRankings` → `/app/leaderboards/page.hooks.tsx`
- Store: `useRankingStore` → `/app/leaderboards/page.stores.ts`
- Action: `getCategoryRankingsAction` → `/app/leaderboards/page.hooks.tsx`
- Type: `CategoryRankings` → `/app/leaderboards/page.hooks.tsx`

**Feature: Get seasonal rankings**
- Hook: `useSeasonalRankings` → `/app/leaderboards/page.hooks.tsx`
- Store: `useSeasonalStore` → `/app/leaderboards/page.stores.ts`
- Action: `getSeasonalRankingsAction` → `/app/leaderboards/page.hooks.tsx`
- Type: `SeasonalRankings` → `/app/leaderboards/page.hooks.tsx`

**Feature: Filter leaderboard results**
- Hook: `useLeaderboardFilter` → `/app/leaderboards/page.hooks.tsx`
- Store: `useFilterStore` → `/app/leaderboards/page.stores.ts`
- Action: `filterLeaderboardAction` → `/app/leaderboards/page.hooks.tsx`
- Type: `LeaderboardFilter` → `/app/leaderboards/page.hooks.tsx`

### /app/leaderboards/page.hooks.tsx
- `useCategoryRankings` (used by: `/app/leaderboards/page.tsx` → Get category rankings)
- `getCategoryRankingsAction` (used by: `/app/leaderboards/page.tsx` → Get category rankings)
- `CategoryRankings` (used by: `/app/leaderboards/page.tsx` → Get category rankings)
- `useSeasonalRankings` (used by: `/app/leaderboards/page.tsx` → Get seasonal rankings)
- `getSeasonalRankingsAction` (used by: `/app/leaderboards/page.tsx` → Get seasonal rankings)
- `SeasonalRankings` (used by: `/app/leaderboards/page.tsx` → Get seasonal rankings)
- `useLeaderboardFilter` (used by: `/app/leaderboards/page.tsx` → Filter leaderboard results)
- `filterLeaderboardAction` (used by: `/app/leaderboards/page.tsx` → Filter leaderboard results)
- `LeaderboardFilter` (used by: `/app/leaderboards/page.tsx` → Filter leaderboard results)

### /app/leaderboards/page.stores.ts
- `useRankingStore` (used by: `/app/leaderboards/page.tsx` → Get category rankings)
- `useSeasonalStore` (used by: `/app/leaderboards/page.tsx` → Get seasonal rankings)
- `useFilterStore` (used by: `/app/leaderboards/page.tsx` → Filter leaderboard results)

### /app/profile/[id]/page.tsx
**Feature: Get user achievements**
- Hook: `useUserAchievements` → `/app/profile/[id]/page.hooks.tsx`
- Store: `useAchievementStore` → `/app/layout.stores.ts`
- Action: `getUserAchievementsAction` → `/app/profile/[id]/page.hooks.tsx`
- Type: `UserAchievements` → `/app/layout.types.ts`

**Feature: Get match history**
- Hook: `useMatchHistory` → `/app/profile/[id]/page.hooks.tsx`
- Store: `useHistoryStore` → `/app/layout.stores.ts`
- Action: `getMatchHistoryAction` → `/app/profile/[id]/page.hooks.tsx`
- Type: `MatchHistory` → `/app/layout.types.ts`

**Feature: Get practice statistics**
- Hook: `useUserPracticeStats` → `/app/profile/[id]/page.hooks.tsx`
- Store: `usePracticeStatsStore` → `/app/layout.stores.ts`
- Action: `getUserPracticeStatsAction` → `/app/profile/[id]/page.hooks.tsx`
- Type: `UserPracticeStats` → `/app/layout.types.ts`

### /app/profile/[id]/page.hooks.tsx
- `useUserAchievements` (used by: `/app/profile/[id]/page.tsx` → Get user achievements)
- `getUserAchievementsAction` (used by: `/app/profile/[id]/page.tsx` → Get user achievements)
- `useMatchHistory` (used by: `/app/profile/[id]/page.tsx` → Get match history)
- `getMatchHistoryAction` (used by: `/app/profile/[id]/page.tsx` → Get match history)
- `useUserPracticeStats` (used by: `/app/profile/[id]/page.tsx` → Get practice statistics)
- `getUserPracticeStatsAction` (used by: `/app/profile/[id]/page.tsx` → Get practice statistics)

### /app/settings/page.tsx
**Feature: Update game preferences**
- Hook: `useGamePreferences` → `/app/settings/page.hooks.tsx`
- Store: `usePreferencesStore` → `/app/layout.stores.ts`
- Action: `updateGamePreferencesAction` → `/app/settings/page.hooks.tsx`
- Type: `GamePreferences` → `/app/layout.types.ts`

**Feature: Update notification settings**
- Hook: `useNotificationSettings` → `/app/settings/page.hooks.tsx`
- Store: `useSettingsStore` → `/app/layout.stores.ts`
- Action: `updateNotificationSettingsAction` → `/app/settings/page.hooks.tsx`
- Type: `NotificationSettings` → `/app/layout.types.ts`

**Feature: Update sound settings**
- Hook: `useSoundSettings` → `/app/settings/page.hooks.tsx`
- Store: `useSoundStore` → `/app/layout.stores.ts`
- Action: `updateSoundSettingsAction` → `/app/settings/page.hooks.tsx`
- Type: `SoundSettings` → `/app/layout.types.ts`

**Feature: Update account details**
- Hook: `useAccountDetails` → `/app/layout.hooks.tsx`
- Store: `useAccountStore` → `/app/layout.stores.ts`
- Action: `updateAccountDetailsAction` → `/app/layout.actions.ts`
- Type: `AccountDetails` → `/app/layout.types.ts`

### /app/settings/page.hooks.tsx
- `useGamePreferences` (used by: `/app/settings/page.tsx` → Update game preferences)
- `updateGamePreferencesAction` (used by: `/app/settings/page.tsx` → Update game preferences)
- `useNotificationSettings` (used by: `/app/settings/page.tsx` → Update notification settings)
- `updateNotificationSettingsAction` (used by: `/app/settings/page.tsx` → Update notification settings)
- `useSoundSettings` (used by: `/app/settings/page.tsx` → Update sound settings)
- `updateSoundSettingsAction` (used by: `/app/settings/page.tsx` → Update sound settings)

