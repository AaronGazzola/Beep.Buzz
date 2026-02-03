"use server";

import { createClient } from "@/supabase/server-client";

export async function createMatchAction(opponentId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  if (user.id === opponentId) {
    throw new Error("Cannot create match with yourself");
  }

  const { data, error } = await supabase
    .from("matches")
    .insert({
      user_id: user.id,
      opponent_id: opponentId,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create match");
  }

  return data;
}

export async function getAvailableMatchesAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("status", "pending")
    .neq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function getUserMatchesAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .or(`user_id.eq.${user.id},opponent_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function joinMatchAction(matchId: string) {
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
    .update({ status: "active" })
    .eq("id", matchId)
    .eq("opponent_id", user.id)
    .eq("status", "pending");

  if (error) {
    console.error(error);
    throw new Error("Failed to join match");
  }

  return { success: true, matchId };
}
