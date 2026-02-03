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
    │   ├── sign-up/
    │   │   ├── page.tsx
    │   │   └── page.hooks.tsx
    │   ├── forgot-password/
    │   │   └── page.tsx
    │   ├── reset-password/
    │   │   └── page.tsx
    │   └── verify/
    │       └── page.tsx
    ├── welcome/
    │   ├── page.tsx
    │   └── page.hooks.tsx
    ├── training/
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
    │   ├── page.stores.ts
    │   └── [matchId]/
    │       ├── page.tsx
    │       ├── page.hooks.tsx
    │       ├── page.stores.ts
    │       ├── page.actions.ts
    │       └── page.types.ts
    ├── leaderboard/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   ├── page.actions.ts
    │   ├── page.stores.ts
    │   └── page.types.ts
    ├── profile/
    │   └── [userId]/
    │       ├── page.tsx
    │       ├── page.hooks.tsx
    │       ├── page.actions.ts
    │       ├── page.stores.ts
    │       └── page.types.ts
    ├── settings/
    │   ├── page.tsx
    │   ├── page.hooks.tsx
    │   ├── page.actions.ts
    │   ├── page.stores.ts
    │   └── page.types.ts
    ├── (legal)/
    │   ├── terms/
    │   │   └── page.tsx
    │   └── privacy/
    │       └── page.tsx
    ├── about/
    │   └── page.tsx
    └── contact/
        ├── page.tsx
        └── page.hooks.tsx

```

```txt
Route Map (Generated from App Structure):

├── /
├── /sign-in
├── /sign-up
├── /forgot-password
├── /reset-password
├── /verify
├── /welcome
├── /training
├── /practice
├── /compete
    └── /compete/[matchId]
├── /leaderboard
├── /profile/[userId]
├── /settings
├── /terms
├── /privacy
├── /about
└── /contact

```

## Feature and Function Map

### /app/layout.tsx
**Feature: Sign out user**
- Hook: `useSignOut` → `/app/layout.hooks.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `signOutAction` → `/app/layout.actions.ts`
- Type: `SignOutResult` → `/app/layout.types.ts`

**Feature: Toggle profile menu**
- Hook: `useProfileMenu` → `/app/layout.hooks.tsx`
- Store: `useProfileMenuStore` → `/app/layout.stores.ts`
- Action: `toggleProfileMenuAction` → `/app/layout.actions.ts`
- Type: `ProfileMenuState` → `/app/layout.types.ts`

### /app/layout.hooks.tsx
- `useSignOut` (used by: `/app/layout.tsx` → Sign out user)
- `useProfileMenu` (used by: `/app/layout.tsx` → Toggle profile menu)

### /app/layout.stores.ts
- `useAuthStore` (used by: `/app/layout.tsx` → Sign out user)
- `useProfileMenuStore` (used by: `/app/layout.tsx` → Toggle profile menu)

### /app/layout.actions.ts
- `signOutAction` (used by: `/app/layout.tsx` → Sign out user)
- `toggleProfileMenuAction` (used by: `/app/layout.tsx` → Toggle profile menu)

### /app/layout.types.ts
- `SignOutResult` (used by: `/app/layout.tsx` → Sign out user)
- `ProfileMenuState` (used by: `/app/layout.tsx` → Toggle profile menu)

### /app/page.tsx
**Feature: Demo morse translation**
- Hook: `useMorseDemo` → `/app/page.hooks.tsx`
- Store: `useMorseStore` → `/app/layout.stores.ts`
- Action: `translateMorseAction` → `/app/layout.actions.ts`
- Type: `MorseTranslation` → `/app/layout.types.ts`

### /app/page.hooks.tsx
- `useMorseDemo` (used by: `/app/page.tsx` → Demo morse translation)

### /app/(auth)/sign-in/page.tsx
**Feature: Sign in with email and password**
- Hook: `useEmailSignIn` → `/app/(auth)/sign-in/page.hooks.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `emailSignInAction` → `/app/layout.actions.ts`
- Type: `EmailSignInInput` → `/app/layout.types.ts`

**Feature: Send magic link email**
- Hook: `useMagicLink` → `/app/(auth)/sign-in/page.hooks.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `sendMagicLinkAction` → `/app/layout.actions.ts`
- Type: `MagicLinkInput` → `/app/layout.types.ts`

### /app/(auth)/sign-in/page.hooks.tsx
- `useEmailSignIn` (used by: `/app/(auth)/sign-in/page.tsx` → Sign in with email and password)
- `useMagicLink` (used by: `/app/(auth)/sign-in/page.tsx` → Send magic link email)

### /app/(auth)/sign-up/page.tsx
**Feature: Create account with email and password**
- Hook: `useEmailSignUp` → `/app/(auth)/sign-up/page.hooks.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `emailSignUpAction` → `/app/layout.actions.ts`
- Type: `EmailSignUpInput` → `/app/layout.types.ts`

**Feature: Send magic link signup email**
- Hook: `useMagicLinkSignUp` → `/app/(auth)/sign-up/page.hooks.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `sendMagicLinkSignUpAction` → `/app/layout.actions.ts`
- Type: `MagicLinkSignUpInput` → `/app/layout.types.ts`

### /app/(auth)/sign-up/page.hooks.tsx
- `useEmailSignUp` (used by: `/app/(auth)/sign-up/page.tsx` → Create account with email and password)
- `useMagicLinkSignUp` (used by: `/app/(auth)/sign-up/page.tsx` → Send magic link signup email)

### /app/(auth)/forgot-password/page.tsx
**Feature: Send password reset email**
- Hook: `usePasswordReset` → `/app/(auth)/forgot-password/page.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `sendPasswordResetAction` → `/app/layout.actions.ts`
- Type: `PasswordResetInput` → `/app/layout.types.ts`

### /app/(auth)/reset-password/page.tsx
**Feature: Reset user password**
- Hook: `useUpdatePassword` → `/app/(auth)/reset-password/page.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `updatePasswordAction` → `/app/layout.actions.ts`
- Type: `UpdatePasswordInput` → `/app/layout.types.ts`

### /app/(auth)/verify/page.tsx
**Feature: Verify email token**
- Hook: `useVerifyEmail` → `/app/(auth)/verify/page.tsx`
- Store: `useAuthStore` → `/app/layout.stores.ts`
- Action: `verifyEmailAction` → `/app/layout.actions.ts`
- Type: `VerifyEmailInput` → `/app/layout.types.ts`

### /app/welcome/page.tsx
**Feature: Update user profile**
- Hook: `useUpdateProfile` → `/app/welcome/page.hooks.tsx`
- Store: `useProfileStore` → `/app/layout.stores.ts`
- Action: `updateProfileAction` → `/app/layout.actions.ts`
- Type: `UpdateProfileInput` → `/app/layout.types.ts`

**Feature: Upload profile picture**
- Hook: `useProfilePicture` → `/app/welcome/page.hooks.tsx`
- Store: `useProfileStore` → `/app/layout.stores.ts`
- Action: `uploadProfilePictureAction` → `/app/layout.actions.ts`
- Type: `ProfilePictureInput` → `/app/layout.types.ts`

### /app/welcome/page.hooks.tsx
- `useUpdateProfile` (used by: `/app/welcome/page.tsx` → Update user profile)
- `useProfilePicture` (used by: `/app/welcome/page.tsx` → Upload profile picture)

### /app/training/page.tsx
**Feature: Get training exercise**
- Hook: `useTrainingExercise` → `/app/training/page.hooks.tsx`
- Store: `useTrainingStore` → `/app/training/page.stores.ts`
- Action: `getTrainingExerciseAction` → `/app/training/page.hooks.tsx`
- Type: `TrainingExercise` → `/app/training/page.hooks.tsx`

**Feature: Submit exercise answer**
- Hook: `useSubmitTraining` → `/app/training/page.hooks.tsx`
- Store: `useTrainingStore` → `/app/training/page.stores.ts`
- Action: `submitTrainingAnswerAction` → `/app/training/page.hooks.tsx`
- Type: `TrainingSubmission` → `/app/training/page.hooks.tsx`

**Feature: Show translation hint**
- Hook: `useTranslationHint` → `/app/training/page.hooks.tsx`
- Store: `useTrainingStore` → `/app/training/page.stores.ts`
- Action: `getTranslationHintAction` → `/app/training/page.hooks.tsx`
- Type: `TranslationHint` → `/app/training/page.hooks.tsx`

### /app/training/page.hooks.tsx
- `useTrainingExercise` (used by: `/app/training/page.tsx` → Get training exercise)
- `getTrainingExerciseAction` (used by: `/app/training/page.tsx` → Get training exercise)
- `TrainingExercise` (used by: `/app/training/page.tsx` → Get training exercise)
- `useSubmitTraining` (used by: `/app/training/page.tsx` → Submit exercise answer)
- `submitTrainingAnswerAction` (used by: `/app/training/page.tsx` → Submit exercise answer)
- `TrainingSubmission` (used by: `/app/training/page.tsx` → Submit exercise answer)
- `useTranslationHint` (used by: `/app/training/page.tsx` → Show translation hint)
- `getTranslationHintAction` (used by: `/app/training/page.tsx` → Show translation hint)
- `TranslationHint` (used by: `/app/training/page.tsx` → Show translation hint)

### /app/training/page.stores.ts
- `useTrainingStore` (used by: `/app/training/page.tsx` → Get training exercise)
- `useTrainingStore` (used by: `/app/training/page.tsx` → Submit exercise answer)
- `useTrainingStore` (used by: `/app/training/page.tsx` → Show translation hint)

### /app/practice/page.tsx
**Feature: Get practice exercise**
- Hook: `usePracticeExercise` → `/app/practice/page.hooks.tsx`
- Store: `usePracticeStore` → `/app/practice/page.stores.ts`
- Action: `getPracticeExerciseAction` → `/app/practice/page.hooks.tsx`
- Type: `PracticeExercise` → `/app/practice/page.hooks.tsx`

**Feature: Submit practice attempt**
- Hook: `useSubmitPractice` → `/app/practice/page.hooks.tsx`
- Store: `usePracticeStore` → `/app/practice/page.stores.ts`
- Action: `submitPracticeAttemptAction` → `/app/practice/page.hooks.tsx`
- Type: `PracticeSubmission` → `/app/practice/page.hooks.tsx`

**Feature: Save practice results**
- Hook: `useSavePracticeResults` → `/app/practice/page.hooks.tsx`
- Store: `usePracticeStore` → `/app/practice/page.stores.ts`
- Action: `savePracticeResultsAction` → `/app/practice/page.hooks.tsx`
- Type: `PracticeResults` → `/app/practice/page.hooks.tsx`

### /app/practice/page.hooks.tsx
- `usePracticeExercise` (used by: `/app/practice/page.tsx` → Get practice exercise)
- `getPracticeExerciseAction` (used by: `/app/practice/page.tsx` → Get practice exercise)
- `PracticeExercise` (used by: `/app/practice/page.tsx` → Get practice exercise)
- `useSubmitPractice` (used by: `/app/practice/page.tsx` → Submit practice attempt)
- `submitPracticeAttemptAction` (used by: `/app/practice/page.tsx` → Submit practice attempt)
- `PracticeSubmission` (used by: `/app/practice/page.tsx` → Submit practice attempt)
- `useSavePracticeResults` (used by: `/app/practice/page.tsx` → Save practice results)
- `savePracticeResultsAction` (used by: `/app/practice/page.tsx` → Save practice results)
- `PracticeResults` (used by: `/app/practice/page.tsx` → Save practice results)

### /app/practice/page.stores.ts
- `usePracticeStore` (used by: `/app/practice/page.tsx` → Get practice exercise)
- `usePracticeStore` (used by: `/app/practice/page.tsx` → Submit practice attempt)
- `usePracticeStore` (used by: `/app/practice/page.tsx` → Save practice results)

### /app/compete/page.tsx
**Feature: Get available matches**
- Hook: `useAvailableMatches` → `/app/compete/page.hooks.tsx`
- Store: `useCompeteStore` → `/app/compete/page.stores.ts`
- Action: `getAvailableMatchesAction` → `/app/compete/page.hooks.tsx`
- Type: `AvailableMatch` → `/app/compete/page.hooks.tsx`

**Feature: Create match**
- Hook: `useCreateMatch` → `/app/compete/page.hooks.tsx`
- Store: `useCompeteStore` → `/app/compete/page.stores.ts`
- Action: `createMatchAction` → `/app/compete/page.hooks.tsx`
- Type: `CreateMatchInput` → `/app/compete/page.hooks.tsx`

**Feature: Join match**
- Hook: `useJoinMatch` → `/app/compete/page.hooks.tsx`
- Store: `useCompeteStore` → `/app/compete/page.stores.ts`
- Action: `joinMatchAction` → `/app/compete/page.hooks.tsx`
- Type: `JoinMatchInput` → `/app/compete/page.hooks.tsx`

**Feature: Get user rankings**
- Hook: `useUserRankings` → `/app/compete/page.hooks.tsx`
- Store: `useCompeteStore` → `/app/compete/page.stores.ts`
- Action: `getUserRankingsAction` → `/app/compete/page.hooks.tsx`
- Type: `UserRanking` → `/app/compete/page.hooks.tsx`

### /app/compete/page.hooks.tsx
- `useAvailableMatches` (used by: `/app/compete/page.tsx` → Get available matches)
- `getAvailableMatchesAction` (used by: `/app/compete/page.tsx` → Get available matches)
- `AvailableMatch` (used by: `/app/compete/page.tsx` → Get available matches)
- `useCreateMatch` (used by: `/app/compete/page.tsx` → Create match)
- `createMatchAction` (used by: `/app/compete/page.tsx` → Create match)
- `CreateMatchInput` (used by: `/app/compete/page.tsx` → Create match)
- `useJoinMatch` (used by: `/app/compete/page.tsx` → Join match)
- `joinMatchAction` (used by: `/app/compete/page.tsx` → Join match)
- `JoinMatchInput` (used by: `/app/compete/page.tsx` → Join match)
- `useUserRankings` (used by: `/app/compete/page.tsx` → Get user rankings)
- `getUserRankingsAction` (used by: `/app/compete/page.tsx` → Get user rankings)
- `UserRanking` (used by: `/app/compete/page.tsx` → Get user rankings)

### /app/compete/page.stores.ts
- `useCompeteStore` (used by: `/app/compete/page.tsx` → Get available matches)
- `useCompeteStore` (used by: `/app/compete/page.tsx` → Create match)
- `useCompeteStore` (used by: `/app/compete/page.tsx` → Join match)
- `useCompeteStore` (used by: `/app/compete/page.tsx` → Get user rankings)

### /app/compete/[matchId]/page.tsx
**Feature: Get match state**
- Hook: `useMatchState` → `/app/compete/[matchId]/page.hooks.tsx`
- Store: `useMatchStore` → `/app/compete/[matchId]/page.stores.ts`
- Action: `getMatchStateAction` → `/app/compete/[matchId]/page.hooks.tsx`
- Type: `MatchState` → `/app/compete/[matchId]/page.hooks.tsx`

**Feature: Submit translation**
- Hook: `useSubmitTranslation` → `/app/compete/[matchId]/page.hooks.tsx`
- Store: `useMatchStore` → `/app/compete/[matchId]/page.stores.ts`
- Action: `submitTranslationAction` → `/app/compete/[matchId]/page.hooks.tsx`
- Type: `TranslationSubmission` → `/app/compete/[matchId]/page.hooks.tsx`

**Feature: Update match score**
- Hook: `useUpdateScore` → `/app/compete/[matchId]/page.hooks.tsx`
- Store: `useMatchScoreStore` → `/app/compete/[matchId]/page.stores.ts`
- Action: `updateMatchScoreAction` → `/app/compete/[matchId]/page.actions.ts`
- Type: `MatchScoreUpdate` → `/app/compete/[matchId]/page.types.ts`

**Feature: End match**
- Hook: `useEndMatch` → `/app/compete/[matchId]/page.hooks.tsx`
- Store: `useMatchEndStore` → `/app/compete/[matchId]/page.stores.ts`
- Action: `endMatchAction` → `/app/compete/[matchId]/page.actions.ts`
- Type: `MatchEndResult` → `/app/compete/[matchId]/page.types.ts`

### /app/compete/[matchId]/page.hooks.tsx
- `useMatchState` (used by: `/app/compete/[matchId]/page.tsx` → Get match state)
- `getMatchStateAction` (used by: `/app/compete/[matchId]/page.tsx` → Get match state)
- `MatchState` (used by: `/app/compete/[matchId]/page.tsx` → Get match state)
- `useSubmitTranslation` (used by: `/app/compete/[matchId]/page.tsx` → Submit translation)
- `submitTranslationAction` (used by: `/app/compete/[matchId]/page.tsx` → Submit translation)
- `TranslationSubmission` (used by: `/app/compete/[matchId]/page.tsx` → Submit translation)
- `useUpdateScore` (used by: `/app/compete/[matchId]/page.tsx` → Update match score)
- `useEndMatch` (used by: `/app/compete/[matchId]/page.tsx` → End match)

### /app/compete/[matchId]/page.stores.ts
- `useMatchStore` (used by: `/app/compete/[matchId]/page.tsx` → Get match state)
- `useMatchStore` (used by: `/app/compete/[matchId]/page.tsx` → Submit translation)
- `useMatchScoreStore` (used by: `/app/compete/[matchId]/page.tsx` → Update match score)
- `useMatchEndStore` (used by: `/app/compete/[matchId]/page.tsx` → End match)

### /app/compete/[matchId]/page.actions.ts
- `updateMatchScoreAction` (used by: `/app/compete/[matchId]/page.tsx` → Update match score)
- `endMatchAction` (used by: `/app/compete/[matchId]/page.tsx` → End match)

### /app/compete/[matchId]/page.types.ts
- `MatchScoreUpdate` (used by: `/app/compete/[matchId]/page.tsx` → Update match score)
- `MatchEndResult` (used by: `/app/compete/[matchId]/page.tsx` → End match)

### /app/leaderboard/page.tsx
**Feature: Get global rankings**
- Hook: `useGlobalRankings` → `/app/leaderboard/page.hooks.tsx`
- Store: `useLeaderboardStore` → `/app/leaderboard/page.stores.ts`
- Action: `getGlobalRankingsAction` → `/app/leaderboard/page.actions.ts`
- Type: `GlobalRankings` → `/app/leaderboard/page.types.ts`

**Feature: Filter rankings by category**
- Hook: `useRankingsFilter` → `/app/leaderboard/page.hooks.tsx`
- Store: `useRankingsFilterStore` → `/app/leaderboard/page.stores.ts`
- Action: `filterRankingsAction` → `/app/leaderboard/page.actions.ts`
- Type: `RankingsFilter` → `/app/leaderboard/page.types.ts`

**Feature: Sort rankings**
- Hook: `useRankingsSort` → `/app/leaderboard/page.hooks.tsx`
- Store: `useRankingsSortStore` → `/app/leaderboard/page.stores.ts`
- Action: `sortRankingsAction` → `/app/leaderboard/page.actions.ts`
- Type: `RankingsSortCriteria` → `/app/leaderboard/page.types.ts`

### /app/leaderboard/page.hooks.tsx
- `useGlobalRankings` (used by: `/app/leaderboard/page.tsx` → Get global rankings)
- `useRankingsFilter` (used by: `/app/leaderboard/page.tsx` → Filter rankings by category)
- `useRankingsSort` (used by: `/app/leaderboard/page.tsx` → Sort rankings)

### /app/leaderboard/page.actions.ts
- `getGlobalRankingsAction` (used by: `/app/leaderboard/page.tsx` → Get global rankings)
- `filterRankingsAction` (used by: `/app/leaderboard/page.tsx` → Filter rankings by category)
- `sortRankingsAction` (used by: `/app/leaderboard/page.tsx` → Sort rankings)

### /app/leaderboard/page.stores.ts
- `useLeaderboardStore` (used by: `/app/leaderboard/page.tsx` → Get global rankings)
- `useRankingsFilterStore` (used by: `/app/leaderboard/page.tsx` → Filter rankings by category)
- `useRankingsSortStore` (used by: `/app/leaderboard/page.tsx` → Sort rankings)

### /app/leaderboard/page.types.ts
- `GlobalRankings` (used by: `/app/leaderboard/page.tsx` → Get global rankings)
- `RankingsFilter` (used by: `/app/leaderboard/page.tsx` → Filter rankings by category)
- `RankingsSortCriteria` (used by: `/app/leaderboard/page.tsx` → Sort rankings)

### /app/profile/[userId]/page.tsx
**Feature: Get user stats**
- Hook: `useUserStats` → `/app/profile/[userId]/page.hooks.tsx`
- Store: `useUserStatsStore` → `/app/profile/[userId]/page.stores.ts`
- Action: `getUserStatsAction` → `/app/profile/[userId]/page.actions.ts`
- Type: `UserStats` → `/app/profile/[userId]/page.types.ts`

**Feature: Get user achievements**
- Hook: `useUserAchievements` → `/app/profile/[userId]/page.hooks.tsx`
- Store: `useAchievementsStore` → `/app/profile/[userId]/page.stores.ts`
- Action: `getUserAchievementsAction` → `/app/profile/[userId]/page.actions.ts`
- Type: `UserAchievements` → `/app/profile/[userId]/page.types.ts`

**Feature: Get match history**
- Hook: `useMatchHistory` → `/app/profile/[userId]/page.hooks.tsx`
- Store: `useMatchHistoryStore` → `/app/profile/[userId]/page.stores.ts`
- Action: `getMatchHistoryAction` → `/app/profile/[userId]/page.actions.ts`
- Type: `MatchHistory` → `/app/profile/[userId]/page.types.ts`

**Feature: Get practice recommendations**
- Hook: `usePracticeRecommendations` → `/app/profile/[userId]/page.hooks.tsx`
- Store: `useRecommendationsStore` → `/app/profile/[userId]/page.stores.ts`
- Action: `getPracticeRecommendationsAction` → `/app/profile/[userId]/page.actions.ts`
- Type: `PracticeRecommendations` → `/app/profile/[userId]/page.types.ts`

### /app/profile/[userId]/page.hooks.tsx
- `useUserStats` (used by: `/app/profile/[userId]/page.tsx` → Get user stats)
- `useUserAchievements` (used by: `/app/profile/[userId]/page.tsx` → Get user achievements)
- `useMatchHistory` (used by: `/app/profile/[userId]/page.tsx` → Get match history)
- `usePracticeRecommendations` (used by: `/app/profile/[userId]/page.tsx` → Get practice recommendations)

### /app/profile/[userId]/page.actions.ts
- `getUserStatsAction` (used by: `/app/profile/[userId]/page.tsx` → Get user stats)
- `getUserAchievementsAction` (used by: `/app/profile/[userId]/page.tsx` → Get user achievements)
- `getMatchHistoryAction` (used by: `/app/profile/[userId]/page.tsx` → Get match history)
- `getPracticeRecommendationsAction` (used by: `/app/profile/[userId]/page.tsx` → Get practice recommendations)

### /app/profile/[userId]/page.stores.ts
- `useUserStatsStore` (used by: `/app/profile/[userId]/page.tsx` → Get user stats)
- `useAchievementsStore` (used by: `/app/profile/[userId]/page.tsx` → Get user achievements)
- `useMatchHistoryStore` (used by: `/app/profile/[userId]/page.tsx` → Get match history)
- `useRecommendationsStore` (used by: `/app/profile/[userId]/page.tsx` → Get practice recommendations)

### /app/profile/[userId]/page.types.ts
- `UserStats` (used by: `/app/profile/[userId]/page.tsx` → Get user stats)
- `UserAchievements` (used by: `/app/profile/[userId]/page.tsx` → Get user achievements)
- `MatchHistory` (used by: `/app/profile/[userId]/page.tsx` → Get match history)
- `PracticeRecommendations` (used by: `/app/profile/[userId]/page.tsx` → Get practice recommendations)

### /app/settings/page.tsx
**Feature: Update audio settings**
- Hook: `useAudioSettings` → `/app/settings/page.hooks.tsx`
- Store: `useAudioSettingsStore` → `/app/settings/page.stores.ts`
- Action: `updateAudioSettingsAction` → `/app/settings/page.actions.ts`
- Type: `AudioSettings` → `/app/settings/page.types.ts`

**Feature: Update visual settings**
- Hook: `useVisualSettings` → `/app/settings/page.hooks.tsx`
- Store: `useVisualSettingsStore` → `/app/settings/page.stores.ts`
- Action: `updateVisualSettingsAction` → `/app/settings/page.actions.ts`
- Type: `VisualSettings` → `/app/settings/page.types.ts`

**Feature: Update difficulty settings**
- Hook: `useDifficultySettings` → `/app/settings/page.hooks.tsx`
- Store: `useDifficultySettingsStore` → `/app/settings/page.stores.ts`
- Action: `updateDifficultySettingsAction` → `/app/settings/page.actions.ts`
- Type: `DifficultySettings` → `/app/settings/page.types.ts`

**Feature: Update notification settings**
- Hook: `useNotificationSettings` → `/app/layout.hooks.tsx`
- Store: `useNotificationSettingsStore` → `/app/layout.stores.ts`
- Action: `updateNotificationSettingsAction` → `/app/layout.actions.ts`
- Type: `NotificationSettings` → `/app/layout.types.ts`

### /app/settings/page.hooks.tsx
- `useAudioSettings` (used by: `/app/settings/page.tsx` → Update audio settings)
- `useVisualSettings` (used by: `/app/settings/page.tsx` → Update visual settings)
- `useDifficultySettings` (used by: `/app/settings/page.tsx` → Update difficulty settings)

### /app/settings/page.actions.ts
- `updateAudioSettingsAction` (used by: `/app/settings/page.tsx` → Update audio settings)
- `updateVisualSettingsAction` (used by: `/app/settings/page.tsx` → Update visual settings)
- `updateDifficultySettingsAction` (used by: `/app/settings/page.tsx` → Update difficulty settings)

### /app/settings/page.stores.ts
- `useAudioSettingsStore` (used by: `/app/settings/page.tsx` → Update audio settings)
- `useVisualSettingsStore` (used by: `/app/settings/page.tsx` → Update visual settings)
- `useDifficultySettingsStore` (used by: `/app/settings/page.tsx` → Update difficulty settings)

### /app/settings/page.types.ts
- `AudioSettings` (used by: `/app/settings/page.tsx` → Update audio settings)
- `VisualSettings` (used by: `/app/settings/page.tsx` → Update visual settings)
- `DifficultySettings` (used by: `/app/settings/page.tsx` → Update difficulty settings)

### /app/(legal)/terms/page.tsx
*No features defined*

### /app/(legal)/privacy/page.tsx
*No features defined*

### /app/about/page.tsx
*No features defined*

### /app/contact/page.tsx
**Feature: Submit contact form**
- Hook: `useContactForm` → `/app/contact/page.hooks.tsx`
- Store: `useContactFormStore` → `/app/contact/page.tsx`
- Action: `submitContactFormAction` → `/app/contact/page.tsx`
- Type: `ContactFormData` → `/app/contact/page.tsx`

### /app/contact/page.hooks.tsx
- `useContactForm` (used by: `/app/contact/page.tsx` → Submit contact form)

