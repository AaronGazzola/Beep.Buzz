"use server";

import { createClient } from "@/supabase/server-client";

const RESERVED_USERNAMES = [
  "admin",
  "beep",
  "buzz",
  "system",
  "moderator",
  "support",
  "help",
  "api",
  "root",
  "user",
];

export async function checkUsernameAvailableAction(
  username: string
): Promise<{ available: boolean; error?: string }> {
  if (!username || username.length < 3 || username.length > 20) {
    return { available: false, error: "Username must be 3-20 characters" };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      available: false,
      error: "Only letters, numbers, underscore, and hyphen allowed",
    };
  }

  if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
    return { available: false, error: "This username is reserved" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .ilike("username", username)
    .maybeSingle();

  if (error) {
    console.error("[checkUsernameAvailableAction]", error);
    return { available: false, error: "Error checking username" };
  }

  return { available: !data };
}
