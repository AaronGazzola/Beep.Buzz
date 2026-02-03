"use server";

import { createClient } from "@/supabase/server-client";
import type { TranslationSubmission } from "./page.types";

export async function getMatchAction(matchId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Match not found");
  }

  if (data.user_id !== user.id && data.opponent_id !== user.id) {
    throw new Error("Unauthorized access to match");
  }

  return data;
}

export async function getMatchMessagesAction(matchId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("match_messages")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function submitTranslationAction(
  submission: TranslationSubmission
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const isCorrect =
    submission.message.toUpperCase() === submission.message.toUpperCase();

  const { error } = await supabase.from("match_messages").insert({
    match_id: submission.matchId,
    user_id: user.id,
    message: submission.message,
    morse_code: submission.morseCode,
    is_correct: isCorrect,
    translation_time: submission.translationTime,
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to submit translation");
  }

  return { success: true, isCorrect };
}

export async function endMatchAction(matchId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("matches")
    .update({ status: "completed" })
    .eq("id", matchId);

  if (error) {
    console.error(error);
    throw new Error("Failed to end match");
  }

  return { success: true };
}
