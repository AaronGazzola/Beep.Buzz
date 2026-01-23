"use server";

import { createClient } from "@/supabase/server-client";

export async function signOutUserAction() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    throw new Error("Failed to sign out");
  }

  return { success: true };
}
