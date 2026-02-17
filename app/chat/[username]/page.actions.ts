"use server";

import { createClient } from "@/supabase/server-client";
import type { DirectMessage } from "./page.types";

export async function getDirectMessagesAction(
  partnerUserId: string,
  cursor?: string,
  limit = 20
): Promise<DirectMessage[]> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  let query = supabase
    .from("direct_messages")
    .select("*")
    .or(
      `and(sender_id.eq.${user.id},recipient_id.eq.${partnerUserId}),and(sender_id.eq.${partnerUserId},recipient_id.eq.${user.id})`
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Failed to get messages");
  }

  return data ?? [];
}

export async function sendDirectMessageAction(
  recipientId: string,
  message: string,
  morseCode: string
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.from("direct_messages").insert({
    sender_id: user.id,
    recipient_id: recipientId,
    message,
    morse_code: morseCode,
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to send message");
  }
}
