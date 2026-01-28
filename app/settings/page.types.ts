import type { Sticker, Profile, Page } from "../layout.types";

export type StickerWithTarget = Sticker & {
  target_page: (Page & { profile: Profile | null }) | null;
};

export type StickerAnalytics = {
  totalBeeps: number;
  totalBuzzes: number;
  totalReceived: number;
  totalGiven: number;
};

export type SettingsTab = "profile" | "stickers" | "analytics";
