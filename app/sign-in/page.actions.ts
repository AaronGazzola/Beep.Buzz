"use server";

import { createClient } from "@/supabase/server-client";
import type { MagicLinkData, MagicLinkResult } from "./page.types";

export async function sendMagicLinkAction(
  data: MagicLinkData
): Promise<MagicLinkResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to send magic link");
  }

  return {
    success: true,
    message: "Check your email for the magic link!",
  };
}
