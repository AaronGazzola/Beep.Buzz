import type { Database } from "@/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Page = Database["public"]["Tables"]["pages"]["Row"];
export type PageElement = Database["public"]["Tables"]["page_elements"]["Row"];
export type Sticker = Database["public"]["Tables"]["stickers"]["Row"];
export type StickerInsert = Database["public"]["Tables"]["stickers"]["Insert"];

export type PageWithElements = Page & {
  elements: PageElement[];
};

export type UserProfileData = {
  profile: Profile;
  pages: PageWithElements[];
  stickers: Sticker[];
};

export type PlaceStickersData = {
  page_id: string;
  is_buzz: boolean;
  position: {
    x: number;
    y: number;
  };
};
