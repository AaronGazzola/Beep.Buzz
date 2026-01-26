"use server";

import { createClient } from "@/supabase/server-client";
import type { FeaturedSectionsData } from "./page.types";

export async function fetchFeaturedSectionsAction(): Promise<FeaturedSectionsData> {
  const supabase = await createClient();

  const [pagesResult, profilesResult] = await Promise.all([
    supabase
      .from("pages")
      .select("*, profile:profiles(*)")
      .eq("status", "PUBLISHED")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  if (pagesResult.error) {
    console.error(pagesResult.error);
    throw new Error("Failed to fetch recent pages");
  }

  if (profilesResult.error) {
    console.error(profilesResult.error);
    throw new Error("Failed to fetch popular profiles");
  }

  return {
    recentPages: pagesResult.data as FeaturedSectionsData["recentPages"],
    popularProfiles: profilesResult.data,
  };
}
