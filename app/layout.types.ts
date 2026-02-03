import type { Database } from "@/supabase/types";
import type { User } from "@supabase/supabase-js";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type AudioSettings = {
  volume: number;
  wpm: number;
  frequency: number;
};

export type VisualSettings = {
  theme: "light" | "dark" | "system";
  animationsEnabled: boolean;
};

export type NotificationPreferences = {
  email: boolean;
  matchRequests: boolean;
  achievements: boolean;
};

export type AuthState = {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type SignOutResult = {
  success: boolean;
  error?: string;
};

export type UpdateNotificationSettingsParams = {
  userId: string;
  preferences: NotificationPreferences;
};

export type UpdateNotificationSettingsResult = {
  success: boolean;
  error?: string;
};
