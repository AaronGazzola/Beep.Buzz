import type { Tables, Enums } from "@/supabase/types";

export type Profile = Tables<"profiles">;
export type Page = Tables<"pages">;
export type PageElement = Tables<"page_elements">;
export type Sticker = Tables<"stickers">;
export type StickerDesign = Tables<"sticker_designs">;
export type Category = Tables<"categories">;
export type PageCategory = Tables<"page_categories">;
export type ContentFlag = Tables<"content_flags">;
export type ModerationLog = Tables<"moderation_logs">;

export type UserRole = Enums<"user_role">;
export type PageVisibility = Enums<"page_visibility">;
export type ElementType = Enums<"element_type">;
export type StickerType = Enums<"sticker_type">;
export type ContentType = Enums<"content_type">;
export type FlagReason = Enums<"flag_reason">;
export type FlagStatus = Enums<"flag_status">;
export type ModAction = Enums<"mod_action">;
export type ApprovalStatus = Enums<"approval_status">;

export type AuthState = {
  user: {
    id: string;
    email: string;
  } | null;
  profile: Profile | null;
  isLoading: boolean;
};
