"use server";

import { createClient } from "@/supabase/server-client";
import type { ModerateContentData, UserManagementData, ContentStatus } from "./page.types";

export async function fetchFlaggedContentAction(filterStatus?: ContentStatus | "ALL") {
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

  let query = supabase
    .from("flagged_content")
    .select("*, page:pages(title, profile:profiles(*)), reporter:profiles!fk_flagged_content_reporter_id(*)")
    .order("created_at", { ascending: false });

  if (filterStatus && filterStatus !== "ALL") {
    query = query.eq("status", filterStatus);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch flagged content");
  }

  return data || [];
}

export async function moderateContentAction(data: ModerateContentData) {
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

  const newStatus = data.action === "approve" ? "ACTIVE" : "REMOVED";

  const { error: flagError } = await supabase
    .from("flagged_content")
    .update({ status: newStatus as ContentStatus })
    .eq("id", data.id);

  if (flagError) {
    console.error(flagError);
    throw new Error("Failed to moderate content");
  }

  const { data: flaggedContent } = await supabase
    .from("flagged_content")
    .select("page_id")
    .eq("id", data.id)
    .single();

  if (flaggedContent) {
    const { error: pageError } = await supabase
      .from("pages")
      .update({ status: newStatus as ContentStatus })
      .eq("id", flaggedContent.page_id);

    if (pageError) {
      console.error(pageError);
    }
  }

  return { success: true };
}

export async function manageUsersAction(data: UserManagementData) {
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

  if (profileError || !profile || profile.role !== "super-admin") {
    throw new Error("Unauthorized - Super admin access required");
  }

  if (data.action === "promote" || data.action === "demote") {
    const newRole = data.action === "promote" ? "admin" : "user";
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("user_id", data.user_id);

    if (error) {
      console.error(error);
      throw new Error("Failed to update user role");
    }
  }

  return { success: true };
}
