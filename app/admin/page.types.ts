import type { ContentFlag, ModerationLog, StickerDesign, Profile } from "../layout.types";

export type FlaggedContentWithReporter = ContentFlag & {
  reporter: Profile | null;
};

export type ModerationLogWithAdmin = ModerationLog & {
  admin: Profile | null;
};

export type StickerDesignWithProfile = StickerDesign & {
  profile: Profile | null;
};

export type AdminTab = "flags" | "stickers" | "logs";
