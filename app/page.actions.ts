"use server";

import { createClient } from "@/supabase/server-client";
import type { FeaturedSectionsData } from "./page.types";

export async function fetchFeaturedSectionsAction(): Promise<FeaturedSectionsData> {
  const supabase = await createClient();

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  if (profilesError) {
    console.error(profilesError);
    throw new Error("Failed to fetch featured profiles");
  }

  const { data: pages, error: pagesError } = await supabase
    .from("pages")
    .select("*, profile:profiles(*)")
    .eq("status", "ACTIVE")
    .order("updated_at", { ascending: false })
    .limit(6);

  if (pagesError) {
    console.error(pagesError);
    throw new Error("Failed to fetch recent pages");
  }

  const { data: activeUsers, error: activeUsersError } = await supabase
    .from("profiles")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(6);

  if (activeUsersError) {
    console.error(activeUsersError);
    throw new Error("Failed to fetch active users");
  }

  const featuredProfiles = await Promise.all(
    profiles.map(async (profile) => {
      const { data: userPages, error } = await supabase
        .from("pages")
        .select("*")
        .eq("profile_id", profile.id)
        .eq("status", "ACTIVE");

      const { count } = await supabase
        .from("stickers")
        .select("*", { count: "exact", head: true })
        .eq("profile_id", profile.id);

      return {
        ...profile,
        pages: userPages || [],
        sticker_count: count || 0,
      };
    })
  );

  return {
    featuredProfiles,
    recentPages: pages as any,
    activeUsers,
  };
}
