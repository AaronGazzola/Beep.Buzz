import type { Database } from "@/supabase/types";

export type PracticeSession = Database["public"]["Tables"]["practice_sessions"]["Row"];

export type DifficultyLevel = Database["public"]["Enums"]["difficulty_level"];

export type PracticeSessionSubmission = {
  difficulty: DifficultyLevel;
  exerciseType: "translation" | "morse_input";
  wordsAttempted: number;
  wordsCorrect: number;
  accuracy: number;
  completionTime: number;
};
