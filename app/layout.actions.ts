"use server";

import { createClient } from "@/supabase/server-client";
import type { Profile } from "./layout.types";

export async function getCurrentUserAction(): Promise<{
  user: { id: string; email: string } | null;
  profile: Profile | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { user: null, profile: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    return {
      user: { id: user.id, email: user.email! },
      profile: null,
    };
  }

  return {
    user: { id: user.id, email: user.email! },
    profile,
  };
}

export async function getProfileByUsernameAction(
  username: string
): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function updateProfileAction(
  profileId: string,
  updates: Partial<Pick<Profile, "username" | "beep_design" | "buzz_design">>
): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", profileId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createProfileAction(
  username: string
): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      username,
      beep_design: {},
      buzz_design: {},
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function checkUsernameAvailableAction(
  username: string
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (error && error.code === "PGRST116") {
    return true;
  }

  return !data;
}
