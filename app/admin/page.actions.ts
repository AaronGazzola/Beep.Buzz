"use server";

import { createClient } from "@/supabase/server-client";
import type {
  FlagStatus,
  ContentModerationData,
  StickerApprovalData,
} from "./page.types";

async function verifyAdminAccess() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "super-admin")) {
    throw new Error("Unauthorized - Admin access required");
  }

  return { supabase, user };
}

export async function fetchFlaggedContentAction(status?: FlagStatus) {
  const { supabase } = await verifyAdminAccess();

  let query = supabase
    .from("flagged_content")
    .select(
      `
      *,
      reporter:profiles!fk_flagged_content_reporter_id(username)
    `
    )
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch flagged content");
  }

  return data;
}

export async function moderateContentAction(data: ContentModerationData) {
  const { supabase } = await verifyAdminAccess();

  const { error } = await supabase
    .from("flagged_content")
    .update({
      status: data.action,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.flagId);

  if (error) {
    console.error(error);
    throw new Error("Failed to moderate content");
  }

  return { success: true };
}

export async function fetchStickersForApprovalAction() {
  const { supabase } = await verifyAdminAccess();

  const { data, error } = await supabase
    .from("stickers")
    .select(
      `
      *,
      profile:profiles(username)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch stickers");
  }

  return data;
}

export async function approveStickerAction(data: StickerApprovalData) {
  const { supabase } = await verifyAdminAccess();

  if (!data.approved) {
    const { error } = await supabase
      .from("stickers")
      .delete()
      .eq("id", data.stickerId);

    if (error) {
      console.error(error);
      throw new Error("Failed to reject sticker");
    }
  }

  return { success: true };
}
