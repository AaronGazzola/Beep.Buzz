import type { Database } from "@/supabase/types";

export type FlaggedContent = Database["public"]["Tables"]["flagged_content"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type ModerationQueueItem = FlaggedContent & {
  page: {
    title: string;
    profile: Profile;
  };
  reporter: Profile;
};

export type ModerationQueueData = {
  items: ModerationQueueItem[];
  count: number;
};
