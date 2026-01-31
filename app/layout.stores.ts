import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Profile,
  UserProgressSummary,
  LeaderboardSnapshot,
  Achievement,
  UserStatistics,
  GamePreferences,
  NotificationSettings,
  SoundSettings,
  AccountDetails,
} from "./layout.types";

type AuthStore = {
  profile: Profile | null;
  setProfile: (profile: Profile | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));

type ProgressStore = {
  progress: UserProgressSummary | null;
  setProgress: (progress: UserProgressSummary) => void;
};

export const useProgressStore = create<ProgressStore>((set) => ({
  progress: null,
  setProgress: (progress) => set({ progress }),
}));

type LeaderboardStore = {
  snapshot: LeaderboardSnapshot | null;
  setSnapshot: (snapshot: LeaderboardSnapshot) => void;
};

export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  snapshot: null,
  setSnapshot: (snapshot) => set({ snapshot }),
}));

type StatsStore = {
  activeUsersCount: number;
  activeUsersChange: number;
  setActiveUsers: (count: number, change: number) => void;
};

export const useStatsStore = create<StatsStore>((set) => ({
  activeUsersCount: 0,
  activeUsersChange: 0,
  setActiveUsers: (count, change) =>
    set({ activeUsersCount: count, activeUsersChange: change }),
}));

type MatchStore = {
  ongoingMatches: Array<{
    id: string;
    player1: { id: string; username: string };
    player2: { id: string; username: string };
    status: string;
    createdAt: string;
  }>;
  setOngoingMatches: (
    matches: Array<{
      id: string;
      player1: { id: string; username: string };
      player2: { id: string; username: string };
      status: string;
      createdAt: string;
    }>
  ) => void;
};

export const useMatchStore = create<MatchStore>((set) => ({
  ongoingMatches: [],
  setOngoingMatches: (matches) => set({ ongoingMatches: matches }),
}));

type DemoStore = {
  input: string;
  output: string;
  isPlaying: boolean;
  setInput: (input: string) => void;
  setOutput: (output: string) => void;
  setIsPlaying: (isPlaying: boolean) => void;
};

export const useDemoStore = create<DemoStore>((set) => ({
  input: "",
  output: "",
  isPlaying: false,
  setInput: (input) => set({ input }),
  setOutput: (output) => set({ output }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}));

type ProfileStore = {
  username: string;
  avatarUrl: string | null;
  setUsername: (username: string) => void;
  setAvatarUrl: (url: string | null) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  username: "",
  avatarUrl: null,
  setUsername: (username) => set({ username }),
  setAvatarUrl: (url) => set({ avatarUrl: url }),
}));

type AchievementStore = {
  achievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
  addAchievement: (achievement: Achievement) => void;
};

export const useAchievementStore = create<AchievementStore>((set) => ({
  achievements: [],
  setAchievements: (achievements) => set({ achievements }),
  addAchievement: (achievement) =>
    set((state) => ({
      achievements: [...state.achievements, achievement],
    })),
}));

type HistoryStore = {
  recentMatches: Array<{
    id: string;
    opponentUsername: string;
    result: string;
    date: string;
  }>;
  setRecentMatches: (
    matches: Array<{
      id: string;
      opponentUsername: string;
      result: string;
      date: string;
    }>
  ) => void;
};

export const useHistoryStore = create<HistoryStore>((set) => ({
  recentMatches: [],
  setRecentMatches: (matches) => set({ recentMatches: matches }),
}));

type PracticeStatsStore = {
  stats: UserStatistics | null;
  setStats: (stats: UserStatistics) => void;
};

export const usePracticeStatsStore = create<PracticeStatsStore>((set) => ({
  stats: null,
  setStats: (stats) => set({ stats }),
}));

type PreferencesStore = {
  preferences: GamePreferences;
  setPreferences: (preferences: GamePreferences) => void;
  updatePreference: <K extends keyof GamePreferences>(
    key: K,
    value: GamePreferences[K]
  ) => void;
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      preferences: {
        difficulty: 5,
        soundEnabled: true,
        visualFeedback: true,
      },
      setPreferences: (preferences) => set({ preferences }),
      updatePreference: (key, value) =>
        set((state) => ({
          preferences: { ...state.preferences, [key]: value },
        })),
    }),
    {
      name: "game-preferences",
    }
  )
);

type SettingsStore = {
  notifications: NotificationSettings;
  setNotifications: (notifications: NotificationSettings) => void;
  updateNotification: <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => void;
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      notifications: {
        email: true,
        matchInvites: true,
        achievements: true,
      },
      setNotifications: (notifications) => set({ notifications }),
      updateNotification: (key, value) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),
    }),
    {
      name: "notification-settings",
    }
  )
);

type SoundStore = {
  sound: SoundSettings;
  setSound: (sound: SoundSettings) => void;
  updateSound: <K extends keyof SoundSettings>(
    key: K,
    value: SoundSettings[K]
  ) => void;
};

export const useSoundStore = create<SoundStore>()(
  persist(
    (set) => ({
      sound: {
        volume: 0.7,
        ditSound: "beep",
        dahSound: "buzz",
      },
      setSound: (sound) => set({ sound }),
      updateSound: (key, value) =>
        set((state) => ({
          sound: { ...state.sound, [key]: value },
        })),
    }),
    {
      name: "sound-settings",
    }
  )
);

type AccountStore = {
  account: AccountDetails | null;
  setAccount: (account: AccountDetails) => void;
};

export const useAccountStore = create<AccountStore>((set) => ({
  account: null,
  setAccount: (account) => set({ account }),
}));
