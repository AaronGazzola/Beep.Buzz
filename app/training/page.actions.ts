"use server";

import { createClient } from "@/supabase/server-client";
import type { TrainingSubmission } from "./page.types";

export async function submitTrainingAction(submission: TrainingSubmission) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: existing } = await supabase
    .from("training_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("lesson_id", submission.lessonId)
    .single();

  if (existing) {
    const { error } = await supabase
      .from("training_progress")
      .update({
        accuracy: submission.accuracy,
        completion_time: submission.completionTime,
        completed: submission.completed,
        attempts: existing.attempts + 1,
      })
      .eq("id", existing.id);

    if (error) {
      console.error(error);
      throw new Error("Failed to update training progress");
    }
  } else {
    const { error } = await supabase.from("training_progress").insert({
      user_id: user.id,
      lesson_id: submission.lessonId,
      accuracy: submission.accuracy,
      completion_time: submission.completionTime,
      completed: submission.completed,
      attempts: 1,
    });

    if (error) {
      console.error(error);
      throw new Error("Failed to save training progress");
    }
  }

  return { success: true };
}

export async function getTrainingProgressAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("training_progress")
    .select("*")
    .eq("user_id", user.id)
    .order("lesson_id", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
