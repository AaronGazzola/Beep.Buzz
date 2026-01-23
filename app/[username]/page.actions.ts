"use server";

import { createClient } from "@/supabase/server-client";
import type { UserProfileData, PlaceStickersData } from "./page.types";

export async function getUserProfileAction(username: string): Promise<UserProfileData> {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (profileError) {
    console.error(profileError);
    throw new Error("Profile not found");
  }

  const { data: pages, error: pagesError } = await supabase
    .from("pages")
    .select("*")
    .eq("profile_id", profile.id)
    .eq("status", "ACTIVE");

  if (pagesError) {
    console.error(pagesError);
    throw new Error("Failed to fetch pages");
  }

  const pagesWithElements = await Promise.all(
    (pages || []).map(async (page) => {
      const { data: elements, error } = await supabase
        .from("page_elements")
        .select("*")
        .eq("page_id", page.id)
        .order("created_at", { ascending: true });

      return {
        ...page,
        elements: elements || [],
      };
    })
  );

  const { data: stickers, error: stickersError } = await supabase
    .from("stickers")
    .select("*")
    .eq("profile_id", profile.id);

  if (stickersError) {
    console.error(stickersError);
    throw new Error("Failed to fetch stickers");
  }

  return {
    profile,
    pages: pagesWithElements,
    stickers: stickers || [],
  };
}

export async function placeStickersAction(data: PlaceStickersData) {
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

  const { data: sticker, error } = await supabase
    .from("stickers")
    .insert({
      page_id: data.page_id,
      profile_id: profile.id,
      user_id: user.id,
      is_buzz: data.is_buzz,
      position: data.position,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to place sticker");
  }

  return sticker;
}
