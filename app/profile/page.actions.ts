"use server";

import { createClient } from "@/supabase/server-client";
import type { CharacterSettings, UpdateUsernameResult, UpdateCharacterResult } from "./page.types";

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

export async function getProfileAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("[getProfileAction]", error);
    throw new Error("Failed to load profile");
  }

  return data;
}

export async function updateUsernameAction(
  username: string
): Promise<UpdateUsernameResult> {
  if (!username || username.length < 3 || username.length > 20) {
    throw new Error("Username must be 3-20 characters");
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    throw new Error("Only letters, numbers, underscore, and hyphen allowed");
  }

  if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
    throw new Error("This username is reserved");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: existing } = await supabase
    .from("profiles")
    .select("user_id")
    .ilike("username", username)
    .maybeSingle();

  if (existing && existing.user_id !== user.id) {
    throw new Error("Username is already taken");
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("user_id", user.id);

  if (error) {
    console.error("[updateUsernameAction]", error);
    throw new Error("Failed to update username");
  }

  return { success: true };
}

export async function updateCharacterSettingsAction(
  settings: CharacterSettings
): Promise<UpdateCharacterResult> {
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
    .update({ character_settings: settings })
    .eq("user_id", user.id);

  if (error) {
    console.error("[updateCharacterSettingsAction]", error);
    throw new Error("Failed to save character");
  }

  return { success: true };
}
