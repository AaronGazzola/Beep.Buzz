"use server";

import { createClient } from "@/supabase/server-client";
import type { Json } from "@/supabase/types";
import type {
  IdentityUpdateData,
  StickerManagementData,
  StickerAnalyticsData,
} from "./page.types";

export async function fetchUserSettingsAction() {
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
    throw new Error("Failed to fetch profile");
  }

  const { data: sticker } = await supabase
    .from("stickers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return { profile, sticker, email: user.email };
}

export async function updateIdentityAction(data: IdentityUpdateData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  if (data.username) {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", data.username.toLowerCase().trim())
      .neq("user_id", user.id)
      .single();

    if (existingProfile) {
      throw new Error("Username is already taken");
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        username: data.username.toLowerCase().trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (profileError) {
      console.error(profileError);
      throw new Error("Failed to update username");
    }
  }

  if (data.stickerType || data.stickerStyle) {
    const { data: sticker } = await supabase
      .from("stickers")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (sticker) {
      const updateData: {
        type?: "BEEP" | "BUZZ";
        style?: Json;
        updated_at: string;
      } = {
        updated_at: new Date().toISOString(),
      };

      if (data.stickerType) {
        updateData.type = data.stickerType;
      }

      if (data.stickerStyle) {
        updateData.style = {
          ...(sticker.style as { [key: string]: Json | undefined }),
          ...data.stickerStyle,
        } as Json;
      }

      const { error: stickerError } = await supabase
        .from("stickers")
        .update(updateData)
        .eq("id", sticker.id);

      if (stickerError) {
        console.error(stickerError);
        throw new Error("Failed to update sticker");
      }
    }
  }

  return { success: true };
}

export async function manageStickerAction(data: StickerManagementData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  if (data.action === "remove") {
    const { error } = await supabase
      .from("sticker_placements")
      .delete()
      .eq("id", data.placementId)
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      throw new Error("Failed to remove sticker placement");
    }
  }

  return { success: true };
}

export async function fetchAnalyticsAction(): Promise<StickerAnalyticsData> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: placements, error } = await supabase
    .from("sticker_placements")
    .select(
      `
      *,
      pageElement:page_elements(
        id,
        page:pages(
          title,
          profile:profiles(username)
        )
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch analytics");
  }

  const { count: totalCount } = await supabase
    .from("sticker_placements")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const uniquePageIds = new Set(
    placements?.map((p) => (p.pageElement as { id: string })?.id) || []
  );

  return {
    totalPlacements: totalCount || 0,
    uniquePages: uniquePageIds.size,
    recentPlacements: placements as StickerAnalyticsData["recentPlacements"],
  };
}
