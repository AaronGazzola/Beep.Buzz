"use server";

import { createClient } from "@/supabase/server-client";
import type {
  UsernameValidationData,
  UsernameValidationResult,
  StickerIdentityData,
} from "./page.types";

export async function validateUsernameAction(
  data: UsernameValidationData
): Promise<UsernameValidationResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const username = data.username.toLowerCase().trim();

  if (username.length < 3) {
    return {
      isValid: false,
      isAvailable: false,
      message: "Username must be at least 3 characters",
    };
  }

  if (username.length > 20) {
    return {
      isValid: false,
      isAvailable: false,
      message: "Username must be 20 characters or less",
    };
  }

  if (!/^[a-z0-9_]+$/.test(username)) {
    return {
      isValid: false,
      isAvailable: false,
      message: "Username can only contain letters, numbers, and underscores",
    };
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .neq("user_id", user.id)
    .single();

  if (existingProfile) {
    return {
      isValid: true,
      isAvailable: false,
      message: "This username is already taken",
    };
  }

  return {
    isValid: true,
    isAvailable: true,
  };
}

export async function customizeStickerIdentityAction(
  data: StickerIdentityData
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existingProfile) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: data.username.toLowerCase().trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingProfile.id);

    if (updateError) {
      console.error(updateError);
      throw new Error("Failed to update profile");
    }

    const { error: stickerError } = await supabase.from("stickers").insert({
      profile_id: existingProfile.id,
      user_id: user.id,
      type: data.stickerType,
      style: data.stickerStyle,
      updated_at: new Date().toISOString(),
    });

    if (stickerError) {
      console.error(stickerError);
      throw new Error("Failed to create sticker");
    }
  } else {
    const { data: newProfile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        user_id: user.id,
        username: data.username.toLowerCase().trim(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError || !newProfile) {
      console.error(profileError);
      throw new Error("Failed to create profile");
    }

    const { error: stickerError } = await supabase.from("stickers").insert({
      profile_id: newProfile.id,
      user_id: user.id,
      type: data.stickerType,
      style: data.stickerStyle,
      updated_at: new Date().toISOString(),
    });

    if (stickerError) {
      console.error(stickerError);
      throw new Error("Failed to create sticker");
    }
  }

  return { success: true };
}
