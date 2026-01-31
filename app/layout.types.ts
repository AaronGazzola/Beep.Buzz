import type { Database } from "@/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
export type UserAchievement = Database["public"]["Tables"]["user_achievements"]["Row"];

export type Match = Database["public"]["Tables"]["competitive_matches"]["Row"];
export type MatchSolution = Database["public"]["Tables"]["match_solutions"]["Row"];

export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
export type LessonProgress = Database["public"]["Tables"]["lesson_progress"]["Row"];

export type PracticeSession = Database["public"]["Tables"]["practice_sessions"]["Row"];
export type PracticeSessionInsert = Database["public"]["Tables"]["practice_sessions"]["Insert"];

export type MorseMessage = Database["public"]["Tables"]["morse_messages"]["Row"];
export type MorseMessageInsert = Database["public"]["Tables"]["morse_messages"]["Insert"];

export type LeaderboardEntry = Database["public"]["Tables"]["leaderboard_entries"]["Row"];
export type UserStatistics = Database["public"]["Tables"]["user_statistics"]["Row"];

export type UserRole = Database["public"]["Enums"]["user_role"];
export type MatchStatus = Database["public"]["Enums"]["match_status"];
export type LeaderboardCategory = Database["public"]["Enums"]["leaderboard_category"];

export type SignOutResult = {
  success: boolean;
};

export type UserProgressSummary = {
  xp: number;
  rank: number;
  streakDays: number;
  lessonsCompleted: number;
  totalLessons: number;
};

export type LeaderboardSnapshot = {
  topPlayers: Array<{
    userId: string;
    username: string;
    score: number;
    rank: number;
  }>;
  userRank: number | null;
  category: LeaderboardCategory;
};

export type ActiveUsersCount = {
  count: number;
  change24h: number;
};

export type OngoingMatch = {
  id: string;
  player1: {
    id: string;
    username: string;
  };
  player2: {
    id: string;
    username: string;
  };
  status: MatchStatus;
  createdAt: string;
};

export type MorseDemoState = {
  input: string;
  output: string;
  isPlaying: boolean;
};

export type MagicLinkPayload = {
  email: string;
};

export type VerificationResult = {
  success: boolean;
  hasProfile: boolean;
};

export type CreateProfileInput = {
  username: string;
  settings?: Record<string, unknown>;
};

export type ProfilePictureUpload = {
  file: File;
  userId: string;
};

export type PracticeStatistics = {
  totalSessions: number;
  avgWpm: number;
  avgAccuracy: number;
  totalTime: number;
};

export type AccountDetails = {
  email: string;
  username: string;
};

export type GamePreferences = {
  difficulty: number;
  soundEnabled: boolean;
  visualFeedback: boolean;
};

export type NotificationSettings = {
  email: boolean;
  matchInvites: boolean;
  achievements: boolean;
};

export type SoundSettings = {
  volume: number;
  ditSound: string;
  dahSound: string;
};

export type UserAchievements = Array<{
  achievement: Achievement;
  unlockedAt: string;
  progress: Record<string, unknown>;
}>;

export type MatchHistory = Array<{
  match: Match;
  opponent: {
    id: string;
    username: string;
  };
  result: "won" | "lost" | "abandoned";
  wpm: number;
  accuracy: number;
}>;

export type UserPracticeStats = {
  totalSessions: number;
  totalTime: number;
  avgEncodeWpm: number;
  avgDecodeWpm: number;
  bestWpm: number;
  avgAccuracy: number;
  recentSessions: Array<PracticeSession>;
};
