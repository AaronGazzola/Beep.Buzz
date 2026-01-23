"use server";

import { createClient } from "@/supabase/server-client";
import type { UsernameValidationData, StickerIdentityData } from "./page.types";

export async function validateUsernameAction(username: string): Promise<UsernameValidationData> {
  const isValid = /^[a-zA-Z0-9_-]{3,20}$/.test(username);

  if (!isValid) {
    return {
      username,
      isValid: false,
      isAvailable: false,
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error(error);
    throw new Error("Failed to validate username");
  }

  return {
    username,
    isValid: true,
    isAvailable: !data,
  };
}

export async function customizeStickerIdentityAction(data: StickerIdentityData & { username: string }) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      username: data.username,
      beep_style: data.beep_style,
      buzz_style: data.buzz_style,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create profile");
  }

  return profile;
}
