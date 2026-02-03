import type { Database } from "@/supabase/types";

export type Match = Database["public"]["Tables"]["matches"]["Row"];
export type MatchMessage = Database["public"]["Tables"]["match_messages"]["Row"];

export type MatchState = {
  match: Match | null;
  messages: MatchMessage[];
  timeRemaining: number;
  isMyTurn: boolean;
};

export type TranslationSubmission = {
  matchId: string;
  message: string;
  morseCode: string;
  translationTime: number;
};
