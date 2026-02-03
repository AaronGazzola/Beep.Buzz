import type { Database } from "@/supabase/types";

export type Match = Database["public"]["Tables"]["matches"]["Row"];

export type MatchStatus = Database["public"]["Enums"]["match_status"];

export type MatchWithProfile = Match & {
  opponent_email?: string;
  opponent_skill_rating?: number;
};
