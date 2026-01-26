import type { Database } from "@/supabase/types";

export type FlaggedContent = Database["public"]["Tables"]["flagged_content"]["Row"];

export type FlagStatus = Database["public"]["Enums"]["flag_status"];

export type Sticker = Database["public"]["Tables"]["stickers"]["Row"];

export type FlaggedContentData = FlaggedContent & {
  reporter?: {
    username: string;
  };
};

export type ContentModerationData = {
  flagId: string;
  action: "APPROVED" | "REMOVED" | "DISMISSED";
};

export type StickerApprovalData = {
  stickerId: string;
  approved: boolean;
};

export type StickerWithProfile = Sticker & {
  profile: {
    username: string;
  };
};
