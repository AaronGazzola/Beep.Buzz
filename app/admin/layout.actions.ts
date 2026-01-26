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

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "super-admin")) {
    throw new Error("Unauthorized - Admin access required");
  }

  const [pendingResult, totalResult] = await Promise.all([
    supabase
      .from("flagged_content")
      .select("id", { count: "exact", head: true })
      .eq("status", "PENDING"),
    supabase
      .from("flagged_content")
      .select("id", { count: "exact", head: true }),
  ]);

  return {
    pendingCount: pendingResult.count || 0,
    totalCount: totalResult.count || 0,
  };
}

export async function checkAdminAccessAction(): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return false;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  return profile?.role === "admin" || profile?.role === "super-admin";
}
