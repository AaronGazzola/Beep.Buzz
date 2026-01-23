import type { Database } from "@/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type Sticker = Database["public"]["Tables"]["stickers"]["Row"];

export type StickerStyle = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  shape: "circle" | "square" | "rounded";
};

export type StickerIdentityData = {
  beep_style: StickerStyle;
  buzz_style: StickerStyle;
};

export type StickerWithPage = Sticker & {
  page: {
    title: string;
    profile: {
      username: string;
    };
  };
};

export type StickerActivityData = {
  beeps: StickerWithPage[];
  buzzes: StickerWithPage[];
  totalCount: number;
};
