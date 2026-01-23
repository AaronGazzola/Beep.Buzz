"use server";

import { createClient } from "@/supabase/server-client";
import type { MagicLinkData, MagicLinkResponse } from "./page.types";

export async function sendMagicLinkAction(data: MagicLinkData): Promise<MagicLinkResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/welcome`,
    },
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to send magic link");
  }

  return { success: true };
}
