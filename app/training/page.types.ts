import type { Database } from "@/supabase/types";

export type TrainingProgress = Database["public"]["Tables"]["training_progress"]["Row"];

export type Lesson = {
  id: number;
  title: string;
  description: string;
  characters: string[];
  words: string[];
};

export type TrainingSubmission = {
  lessonId: number;
  accuracy: number;
  completionTime: number;
  completed: boolean;
};
