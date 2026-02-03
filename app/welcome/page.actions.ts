"use server";

import { createClient } from "@/supabase/server-client";
import type { ProfileUpdateParams } from "./page.types";

export async function updateProfileSettingsAction(params: ProfileUpdateParams) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      audio_settings: {
        volume: params.audioVolume,
        wpm: params.morseWPM,
        frequency: 600,
      },
      visual_settings: {
        theme: params.theme,
        animationsEnabled: true,
      },
    })
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to update profile settings");
  }

  return { success: true };
}
