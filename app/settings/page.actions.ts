"use server";

import { createClient } from "@/supabase/server-client";
import type { StickerIdentityData, StickerActivityData } from "./page.types";

export async function updateStickerIdentityAction(data: StickerIdentityData) {
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
    .update({
      beep_style: data.beep_style,
      buzz_style: data.buzz_style,
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to update sticker identity");
  }

  return profile;
}

export async function fetchStickerActivityAction(): Promise<StickerActivityData> {
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
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    console.error(profileError);
    throw new Error("Profile not found");
  }

  const { data: stickers, error: stickersError } = await supabase
    .from("stickers")
    .select("*, page:pages(title, profile:profiles(username))")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  if (stickersError) {
    console.error(stickersError);
    throw new Error("Failed to fetch sticker activity");
  }

  const beeps = (stickers || []).filter((s) => !s.is_buzz);
  const buzzes = (stickers || []).filter((s) => s.is_buzz);

  return {
    beeps: beeps as any,
    buzzes: buzzes as any,
    totalCount: stickers?.length || 0,
  };
}

export async function getCurrentProfileAction() {
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
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Profile not found");
  }

  return profile;
}
