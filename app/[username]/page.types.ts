import type { Database } from "@/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type Page = Database["public"]["Tables"]["pages"]["Row"];

export type PageElement = Database["public"]["Tables"]["page_elements"]["Row"];

export type Sticker = Database["public"]["Tables"]["stickers"]["Row"];

export type StickerPlacement =
  Database["public"]["Tables"]["sticker_placements"]["Row"];

export type StickerPlacementInsert =
  Database["public"]["Tables"]["sticker_placements"]["Insert"];

export type PageWithElements = Page & {
  page_elements: PageElement[];
};

export type ProfileWithPage = Profile & {
  page?: PageWithElements | null;
};

export type StickerPlacementData = {
  stickerId: string;
  pageElementId: string;
  positionX: number;
  positionY: number;
};

export type StickerPlacementWithSticker = StickerPlacement & {
  sticker: Sticker;
};

export type PageElementWithPlacements = PageElement & {
  sticker_placements: StickerPlacementWithSticker[];
};
