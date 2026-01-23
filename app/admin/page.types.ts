import type { Database } from "@/supabase/types";

export type FlaggedContent = Database["public"]["Tables"]["flagged_content"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ContentStatus = Database["public"]["Enums"]["content_status"];
export type UserRole = Database["public"]["Enums"]["user_role"];

export type FlaggedContentData = {
  items: FlaggedContent[];
  filteredItems: FlaggedContent[];
  filterStatus: ContentStatus | "ALL";
};

export type ModerateContentData = {
  id: string;
  action: "approve" | "remove";
};

export type UserManagementData = {
  user_id: string;
  action: "ban" | "unban" | "promote" | "demote";
};
