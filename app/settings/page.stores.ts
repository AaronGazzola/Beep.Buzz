import { create } from "zustand";
import type { Profile, Sticker, StickerStyle, StickerType } from "./page.types";

type IdentityStore = {
  profile: Profile | null;
  sticker: Sticker | null;
  email: string | null;
  setProfile: (profile: Profile | null) => void;
  setSticker: (sticker: Sticker | null) => void;
  setEmail: (email: string | null) => void;
  updateUsername: (username: string) => void;
  updateStickerType: (type: StickerType) => void;
  updateStickerStyle: (style: Partial<StickerStyle>) => void;
};

export const useIdentityStore = create<IdentityStore>((set) => ({
  profile: null,
  sticker: null,
  email: null,
  setProfile: (profile) => set({ profile }),
  setSticker: (sticker) => set({ sticker }),
  setEmail: (email) => set({ email }),
  updateUsername: (username) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, username } : null,
    })),
  updateStickerType: (type) =>
    set((state) => ({
      sticker: state.sticker ? { ...state.sticker, type } : null,
    })),
  updateStickerStyle: (style) =>
    set((state) => ({
      sticker: state.sticker
        ? {
            ...state.sticker,
            style: { ...(state.sticker.style as object), ...style },
          }
        : null,
    })),
}));
