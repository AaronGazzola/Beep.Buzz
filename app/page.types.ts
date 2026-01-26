import type { Database } from "@/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type Page = Database["public"]["Tables"]["pages"]["Row"];

export type PageWithProfile = Page & {
  profile: Profile;
};

export type FeaturedSectionsData = {
  recentPages: PageWithProfile[];
  popularProfiles: Profile[];
};
