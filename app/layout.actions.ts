"use server";

import { createClient } from "@/supabase/server-client";
import type {
  UpdateNotificationSettingsParams,
  UpdateNotificationSettingsResult,
} from "./layout.types";

export async function updateNotificationSettingsAction(
  params: UpdateNotificationSettingsParams
): Promise<UpdateNotificationSettingsResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  if (user.id !== params.userId) {
    throw new Error("Forbidden");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      notification_preferences: params.preferences,
    })
    .eq("user_id", params.userId);

  if (error) {
    console.error(error);
    throw new Error("Failed to update notification settings");
  }

  return { success: true };
}

export async function getCurrentProfileAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
