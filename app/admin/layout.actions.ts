"use server";

import { createClient } from "@/supabase/server-client";
import type { ModerationQueueData } from "./layout.types";

export async function fetchModerationQueueAction(): Promise<ModerationQueueData> {
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
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile || (profile.role !== "admin" && profile.role !== "super-admin")) {
    throw new Error("Unauthorized - Admin access required");
  }

  const { data: flaggedContent, error: contentError } = await supabase
    .from("flagged_content")
    .select("*, page:pages(title, profile:profiles(*)), reporter:profiles!fk_flagged_content_reporter_id(*)")
    .eq("status", "FLAGGED")
    .order("created_at", { ascending: false });

  if (contentError) {
    console.error(contentError);
    throw new Error("Failed to fetch moderation queue");
  }

  return {
    items: flaggedContent as any,
    count: flaggedContent?.length || 0,
  };
}
