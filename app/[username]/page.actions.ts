"use server";

import { createClient } from "@/supabase/server-client";
import type { StickerPlacementData } from "./page.types";

export async function fetchProfilePageAction(username: string) {
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

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select(
      `
      *,
      page_elements(
        *,
        sticker_placements(
          *,
          sticker:stickers(*)
        )
      )
    `
    )
    .eq("profile_id", profile.id)
    .eq("status", "PUBLISHED")
    .order("position", { referencedTable: "page_elements", ascending: true })
    .single();

  if (pageError && pageError.code !== "PGRST116") {
    console.error(pageError);
    throw new Error("Failed to fetch page");
  }

  return { profile, page };
}

export async function fetchUserStickerAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: sticker } = await supabase
    .from("stickers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return sticker;
}

export async function placeStickerAction(data: StickerPlacementData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: existingPlacement } = await supabase
    .from("sticker_placements")
    .select("id")
    .eq("sticker_id", data.stickerId)
    .eq("page_element_id", data.pageElementId)
    .single();

  if (existingPlacement) {
    const { error } = await supabase
      .from("sticker_placements")
      .update({
        position_x: data.positionX,
        position_y: data.positionY,
      })
      .eq("id", existingPlacement.id);

    if (error) {
      console.error(error);
      throw new Error("Failed to update sticker placement");
    }
  } else {
    const { error } = await supabase.from("sticker_placements").insert({
      sticker_id: data.stickerId,
      page_element_id: data.pageElementId,
      user_id: user.id,
      position_x: data.positionX,
      position_y: data.positionY,
    });

    if (error) {
      console.error(error);
      throw new Error("Failed to place sticker");
    }
  }

  return { success: true };
}

export async function removeStickerPlacementAction(placementId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("sticker_placements")
    .delete()
    .eq("id", placementId)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to remove sticker");
  }

  return { success: true };
}
