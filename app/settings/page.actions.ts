"use server";

import { createClient } from "@/supabase/server-client";
import type { StickerWithTarget, StickerAnalytics } from "./page.types";
import type { Json } from "@/supabase/types";

export async function updateProfileIconsAction(
  beepDesign: { emoji: string; color: string },
  buzzDesign: { emoji: string; color: string }
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      beep_design: beepDesign as unknown as Json,
      buzz_design: buzzDesign as unknown as Json,
    })
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getStickerActivityAction(): Promise<StickerWithTarget[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: stickers, error } = await supabase
    .from("stickers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const stickersWithTargets = await Promise.all(
    stickers.map(async (sticker) => {
      const { data: page } = await supabase
        .from("pages")
        .select("*, profile:profiles(*)")
        .eq("id", sticker.page_id)
        .single();

      return {
        ...sticker,
        target_page: page as StickerWithTarget["target_page"],
      };
    })
  );

  return stickersWithTargets;
}

export async function removePlacedStickerAction(stickerId: string): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
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

export async function getStickerAnalyticsAction(): Promise<StickerAnalytics> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    throw new Error("Profile not found");
  }

  const { data: givenStickers, error: givenError } = await supabase
    .from("stickers")
    .select("sticker_type")
    .eq("user_id", user.id);

  if (givenError) {
    throw new Error(givenError.message);
  }

  const { data: userPages } = await supabase
    .from("pages")
    .select("id")
    .eq("profile_id", profile.id);

  const pageIds = userPages?.map((p) => p.id) || [];

  let receivedCount = 0;
  if (pageIds.length > 0) {
    const { count, error: receivedError } = await supabase
      .from("stickers")
      .select("*", { count: "exact", head: true })
      .in("page_id", pageIds);

    if (receivedError) {
      throw new Error(receivedError.message);
    }

    receivedCount = count || 0;
  }

  const totalBeeps = givenStickers?.filter((s) => s.sticker_type === "beep").length || 0;
  const totalBuzzes = givenStickers?.filter((s) => s.sticker_type === "buzz").length || 0;

  return {
    totalBeeps,
    totalBuzzes,
    totalReceived: receivedCount,
    totalGiven: givenStickers?.length || 0,
  };
}
