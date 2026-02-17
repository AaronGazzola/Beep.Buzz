"use server";

import { createClient } from "@/supabase/server-client";

export type Contact = {
  userId: string;
  username: string;
  lastMessage: string;
  lastMessageAt: string;
};

export async function getContactsAction(): Promise<Contact[]> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("direct_messages")
    .select("sender_id, recipient_id, message, created_at")
    .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Failed to get contacts");
  }

  const contactMap = new Map<string, { lastMessage: string; lastMessageAt: string }>();

  for (const msg of data) {
    const partnerId = msg.sender_id === user.id ? msg.recipient_id : msg.sender_id;
    if (!contactMap.has(partnerId)) {
      contactMap.set(partnerId, {
        lastMessage: msg.message,
        lastMessageAt: msg.created_at ?? "",
      });
    }
  }

  if (contactMap.size === 0) return [];

  const partnerIds = Array.from(contactMap.keys());
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("user_id, username")
    .in("user_id", partnerIds);

  if (profilesError) {
    console.error(profilesError);
    throw new Error("Failed to get contact profiles");
  }

  const contacts: Contact[] = [];
  for (const profile of profiles ?? []) {
    const contact = contactMap.get(profile.user_id);
    if (contact && profile.username) {
      contacts.push({
        userId: profile.user_id,
        username: profile.username,
        lastMessage: contact.lastMessage,
        lastMessageAt: contact.lastMessageAt,
      });
    }
  }

  contacts.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  return contacts;
}
