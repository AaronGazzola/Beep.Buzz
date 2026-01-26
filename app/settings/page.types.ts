import type { Database } from "@/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type Sticker = Database["public"]["Tables"]["stickers"]["Row"];

export type StickerPlacement =
  Database["public"]["Tables"]["sticker_placements"]["Row"];

export type StickerType = Database["public"]["Enums"]["sticker_type"];

export type StickerStyle = {
  size: "small" | "medium" | "large";
  color: string;
};

export type IdentityUpdateData = {
  username?: string;
  stickerType?: StickerType;
  stickerStyle?: StickerStyle;
};

export type StickerManagementData = {
  placementId: string;
  action: "remove";
};

export type StickerPlacementWithDetails = StickerPlacement & {
  pageElement: {
    id: string;
    page: {
      title: string;
      profile: {
        username: string;
      };
    };
  };
};

export type StickerAnalyticsData = {
  totalPlacements: number;
  uniquePages: number;
  recentPlacements: StickerPlacementWithDetails[];
};
