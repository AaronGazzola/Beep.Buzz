import type { Database } from "@/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Page = Database["public"]["Tables"]["pages"]["Row"];
export type Sticker = Database["public"]["Tables"]["stickers"]["Row"];

export type FeaturedProfile = Profile & {
  pages: Page[];
  sticker_count: number;
};

export type FeaturedSectionsData = {
  featuredProfiles: FeaturedProfile[];
  recentPages: (Page & { profile: Profile })[];
  activeUsers: Profile[];
};
