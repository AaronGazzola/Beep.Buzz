"use server";

import { createClient } from "@/supabase/server-client";
import type { LearnedLetter } from "./page.types";

export async function getLearnedLettersAction(): Promise<LearnedLetter[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("learned_letters")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error(error);
    return [];
  }

  return (data?.learned_letters as unknown as LearnedLetter[]) || [];
}

export async function saveLearnedLettersAction(
  learnedLetters: LearnedLetter[]
): Promise<{ success: boolean }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ learned_letters: learnedLetters as unknown as null })
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to save learned letters");
  }

  return { success: true };
}
