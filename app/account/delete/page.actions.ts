"use server";

import { createClient } from "@/supabase/server-client";
import { supabaseAdmin } from "@/supabase/admin-client";

export async function deleteAccountAction(): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const userId = user.id;

  const tables: Array<{ table: string; column: string }> = [
    { table: "challenge_attempts", column: "user_id" },
    { table: "game_sessions", column: "user_id" },
    { table: "practice_sessions", column: "user_id" },
    { table: "training_progress", column: "user_id" },
    { table: "user_achievements", column: "user_id" },
    { table: "leaderboard_rankings", column: "user_id" },
    { table: "contact_messages", column: "user_id" },
  ];

  for (const { table, column } of tables) {
    const { error } = await supabase
      .from(table as never)
      .delete()
      .eq(column, userId);

    if (error) {
      console.error(`[deleteAccountAction] error deleting from ${table}:`, error);
    }
  }

  await supabase
    .from("match_messages")
    .delete()
    .eq("user_id", userId);

  await supabase
    .from("matches")
    .delete()
    .or(`user_id.eq.${userId},opponent_id.eq.${userId}`);

  await supabase
    .from("direct_messages")
    .delete()
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`);

  await supabase
    .from("user_reports")
    .delete()
    .or(`reporter_id.eq.${userId},reported_user_id.eq.${userId}`);

  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("user_id", userId);

  if (profileError) {
    console.error("[deleteAccountAction] profile delete error:", profileError);
    throw new Error("Failed to delete account data");
  }

  const { error: adminError } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (adminError) {
    console.error("[deleteAccountAction] auth delete error:", adminError);
    throw new Error("Failed to delete account");
  }
}
