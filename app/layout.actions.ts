"use server";

import { createClient } from "@/supabase/server-client";
import type { Database } from "@/supabase/types";
import type {
  UserProgressSummary,
  LeaderboardSnapshot,
  ActiveUsersCount,
  OngoingMatch,
  AccountDetails,
} from "./layout.types";

export async function getUserProgressAction(): Promise<UserProgressSummary> {
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
    .select("xp, rank, streak_days")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    console.error(profileError);
    throw new Error("Failed to fetch user profile");
  }

  const { data: completedLessons, error: lessonsError } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("completed", true);

  if (lessonsError) {
    console.error(lessonsError);
    throw new Error("Failed to fetch lesson progress");
  }

  const { count: totalLessons, error: totalError } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true });

  if (totalError) {
    console.error(totalError);
    throw new Error("Failed to fetch total lessons");
  }

  return {
    xp: profile.xp,
    rank: profile.rank,
    streakDays: profile.streak_days,
    lessonsCompleted: completedLessons?.length || 0,
    totalLessons: totalLessons || 0,
  };
}

export async function getLeaderboardSnapshotAction(
  category: "encoding_speed" | "decoding_speed" | "overall" | "weekly_challenge" = "overall"
): Promise<LeaderboardSnapshot> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const { data: entries, error } = await supabase
    .from("leaderboard_entries")
    .select("user_id, score")
    .eq("category", category)
    .gte("period_start", weekStart.toISOString())
    .order("score", { ascending: false })
    .limit(10);

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch leaderboard");
  }

  const userIds = entries?.map((e) => e.user_id) || [];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, username")
    .in("user_id", userIds);

  const profileMap = new Map(
    profiles?.map((p) => [p.user_id, p.username]) || []
  );

  const topPlayers =
    entries?.map((entry, index) => ({
      userId: entry.user_id,
      username: profileMap.get(entry.user_id) || "Unknown",
      score: entry.score,
      rank: index + 1,
    })) || [];

  let userRank: number | null = null;
  if (user) {
    const userEntry = entries?.findIndex((e) => e.user_id === user.id);
    if (userEntry !== undefined && userEntry !== -1) {
      userRank = userEntry + 1;
    }
  }

  return {
    topPlayers,
    userRank,
    category,
  };
}

export async function getActiveUsersCountAction(): Promise<ActiveUsersCount> {
  const supabase = await createClient();

  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const { count: current, error: currentError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("last_practice", last24h.toISOString());

  if (currentError) {
    console.error(currentError);
    throw new Error("Failed to fetch active users count");
  }

  const { count: previous, error: previousError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("last_practice", last48h.toISOString())
    .lt("last_practice", last24h.toISOString());

  if (previousError) {
    console.error(previousError);
  }

  const change24h = (current || 0) - (previous || 0);

  return {
    count: current || 0,
    change24h,
  };
}

export async function getOngoingMatchesAction(): Promise<OngoingMatch[]> {
  const supabase = await createClient();

  const { data: matches, error } = await supabase
    .from("competitive_matches")
    .select("id, player1_id, player2_id, status, created_at")
    .eq("status", "in_progress")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch ongoing matches");
  }

  if (!matches || matches.length === 0) {
    return [];
  }

  const playerIds = matches.flatMap((m) => [m.player1_id, m.player2_id]);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("user_id, username")
    .in("user_id", playerIds);

  const profileMap = new Map(
    profiles?.map((p) => [p.user_id, p.username]) || []
  );

  return matches.map((match) => ({
    id: match.id,
    player1: {
      id: match.player1_id,
      username: profileMap.get(match.player1_id) || "Unknown",
    },
    player2: {
      id: match.player2_id,
      username: profileMap.get(match.player2_id) || "Unknown",
    },
    status: match.status,
    createdAt: match.created_at,
  }));
}

export async function updateAccountDetailsAction(
  details: Partial<AccountDetails>
): Promise<AccountDetails> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  if (details.username) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ username: details.username })
      .eq("user_id", user.id);

    if (updateError) {
      console.error(updateError);
      throw new Error("Failed to update username");
    }
  }

  if (details.email) {
    const { error: emailError } = await supabase.auth.updateUser({
      email: details.email,
    });

    if (emailError) {
      console.error(emailError);
      throw new Error("Failed to update email");
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("user_id", user.id)
    .single();

  return {
    email: user.email || "",
    username: profile?.username || "",
  };
}

export async function sendMagicLinkAction(email: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/welcome`,
    },
  });

  if (error) {
    console.error(error);
    throw new Error("Failed to send magic link");
  }
}

export async function createProfileAction(
  username: string,
  settings?: Record<string, unknown>
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (existingProfile) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username,
        settings: (settings || {}) as Database["public"]["Tables"]["profiles"]["Row"]["settings"],
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error(updateError);
      throw new Error("Failed to update profile");
    }
  } else {
    const { error: insertError } = await supabase.from("profiles").insert({
      user_id: user.id,
      username,
      settings: (settings || {}) as Database["public"]["Tables"]["profiles"]["Row"]["settings"],
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error(insertError);
      throw new Error("Failed to create profile");
    }
  }
}
