"use server";

import { createClient } from "@/supabase/server-client";
import type { LearnedLetter, Match, MatchMessage, Profile } from "./page.types";

export async function getLearnedLettersAction(): Promise<LearnedLetter[]> {
  const supabase = await createClient();

  try {
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
  } catch (error) {
    return [];
  }
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

export async function createMatchAction(partnerId: string, matchId: string): Promise<Match> {
  console.log("📝 [ACTION] createMatchAction called, partner:", partnerId.substring(0, 8), "matchId:", matchId.substring(0, 8));

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("🔴 [ACTION] MATCH AUTH ERROR:", authError);
    throw new Error("Unauthorized");
  }

  console.log("📝 [ACTION] Auth OK, user:", user.id.substring(0, 8), "inserting match with ID...");

  const { data: newMatch, error } = await supabase
    .from("matches")
    .insert({
      id: matchId,
      user_id: user.id,
      opponent_id: partnerId,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    console.error("🔴 [ACTION] CREATE ERROR:", error);
    throw new Error("Failed to create match");
  }

  console.log("✅ [ACTION] Match created:", newMatch.id.substring(0, 8), "status:", newMatch.status);
  return newMatch;
}

export async function getCurrentMatchAction(matchId?: string): Promise<Match | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  if (!matchId) {
    return null;
  }

  const { data } = await supabase
    .from("matches")
    .select("*")
    .eq("id", matchId)
    .or(`user_id.eq.${user.id},opponent_id.eq.${user.id}`)
    .in("status", ["pending", "active"])
    .single();

  return data || null;
}

export async function cancelMatchAction(matchId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("matches")
    .update({ status: "cancelled" })
    .eq("id", matchId)
    .or(`user_id.eq.${user.id},opponent_id.eq.${user.id}`);

  if (error) throw new Error("Failed to cancel match");
}

export async function getPartnerProfileAction(userId: string): Promise<Profile> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw new Error("Failed to get partner profile");
  return data;
}

export async function sendMatchMessageAction(
  matchId: string,
  message: string,
  morseCode: string
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("Unauthorized");

  const { error } = await supabase.from("match_messages").insert({
    match_id: matchId,
    user_id: user.id,
    message,
    morse_code: morseCode,
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to send message");
  }
}

export async function getMatchMessagesAction(
  matchId: string
): Promise<MatchMessage[]> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return [];

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
