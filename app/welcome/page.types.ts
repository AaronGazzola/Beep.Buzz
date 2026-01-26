import type { Database } from "@/supabase/types";

export type UsernameValidationData = {
  username: string;
};

export type UsernameValidationResult = {
  isValid: boolean;
  isAvailable: boolean;
  message?: string;
};

export type StickerType = Database["public"]["Enums"]["sticker_type"];

export type StickerStyle = {
  size: "small" | "medium" | "large";
  color: string;
};

export type StickerIdentityData = {
  username: string;
  stickerType: StickerType;
  stickerStyle: StickerStyle;
};
