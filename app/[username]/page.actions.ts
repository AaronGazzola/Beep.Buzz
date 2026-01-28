"use server";

import { createClient } from "@/supabase/server-client";
import type { Profile, Page, Sticker } from "../layout.types";
import type { PageWithElements } from "./page.types";

export async function getProfilePageDataAction(username: string): Promise<{
  profile: Profile | null;
  page: PageWithElements | null;
}> {
  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    return { profile: null, page: null };
  }

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("*, page_elements(*), stickers(*)")
    .eq("profile_id", profile.id)
    .eq("visibility", "public")
    .single();

  if (pageError) {
    return { profile, page: null };
  }

  return { profile, page: page as PageWithElements };
}

export async function addStickerAction(
  pageId: string,
  stickerType: "beep" | "buzz",
  positionX: number,
  positionY: number
): Promise<Sticker | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to add a sticker");
  }

  const { data, error } = await supabase
    .from("stickers")
    .insert({
      page_id: pageId,
      user_id: user.id,
      sticker_type: stickerType,
      position_x: positionX,
      position_y: positionY,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function removeStickerAction(stickerId: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to remove a sticker");
  }

  const { error } = await supabase
    .from("stickers")
    .delete()
    .eq("id", stickerId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}
