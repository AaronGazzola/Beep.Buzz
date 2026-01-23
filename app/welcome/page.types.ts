import type { Database } from "@/supabase/types";

export type UsernameValidationData = {
  username: string;
  isValid: boolean;
  isAvailable: boolean;
};

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

export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
