"use server";

import { createClient } from "@/supabase/server-client";
import type { PracticeSessionSubmission } from "./page.types";

export async function savePracticeSessionAction(
  session: PracticeSessionSubmission
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.from("practice_sessions").insert({
    user_id: user.id,
    difficulty: session.difficulty,
    exercise_type: session.exerciseType,
    words_attempted: session.wordsAttempted,
    words_correct: session.wordsCorrect,
    accuracy: session.accuracy,
    completion_time: session.completionTime,
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to save practice session");
  }

  return { success: true };
}

export async function getPracticeHistoryAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("practice_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
