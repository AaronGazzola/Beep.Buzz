import type { Database } from "@/supabase/types";

export type FlaggedContent = Database["public"]["Tables"]["flagged_content"]["Row"];

export type FlagStatus = Database["public"]["Enums"]["flag_status"];

export type ModerationQueueData = {
  pendingCount: number;
  totalCount: number;
};

export type ModerationQueueItem = FlaggedContent & {
  reporter: {
    username: string;
  };
  flaggedUser: {
    email: string;
  };
};
