"use server";

import { createClient } from "@/supabase/server-client";
import type { LearnedLetter, ChatRoom } from "./page.types";

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

export async function joinChatQueueAction(): Promise<ChatRoom> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    console.error(profileError);
    throw new Error("Failed to fetch profile");
  }

  const username = profile.username || "Anonymous";

  await supabase
    .from("chat_queue")
    .delete()
    .eq("user_id", user.id)
    .eq("status", "waiting");

  const { data: matched, error: rpcError } = await supabase.rpc(
    "claim_chat_queue_entry",
    {
      claiming_user_id: user.id,
      claiming_username: username,
    }
  );

  if (rpcError) {
    console.error(rpcError);
    throw new Error("Failed to join chat queue");
  }

  if (matched && matched.id) {
    return {
      id: matched.id,
      roomId: matched.room_id,
      userId: matched.user_id,
      username: matched.username,
      partnerId: user.id,
      partnerUsername: username,
      isCreator: false,
    };
  }

  const { data: entry, error: insertError } = await supabase
    .from("chat_queue")
    .insert({
      user_id: user.id,
      username,
    })
    .select()
    .single();

  if (insertError) {
    console.error(insertError);
    throw new Error("Failed to insert queue entry");
  }

  return {
    id: entry.id,
    roomId: entry.room_id,
    userId: user.id,
    username,
    partnerId: null,
    partnerUsername: null,
    isCreator: true,
  };
}

export async function leaveChatQueueAction(): Promise<{ success: boolean }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("chat_queue")
    .delete()
    .eq("user_id", user.id)
    .eq("status", "waiting");

  if (error) {
    console.error(error);
    throw new Error("Failed to leave chat queue");
  }

  return { success: true };
}

export async function getChatQueueEntryAction(
  entryId: string
): Promise<ChatRoom | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("chat_queue")
    .select("*")
    .eq("id", entryId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch queue entry");
  }

  if (!data || data.status !== "matched") {
    return null;
  }

  const isCreator = data.user_id === user.id;

  return {
    id: data.id,
    roomId: data.room_id,
    userId: data.user_id,
    username: data.username,
    partnerId: data.partner_id,
    partnerUsername: data.partner_username,
    isCreator,
  };
}
