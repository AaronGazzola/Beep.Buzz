import { create } from "zustand";
import type { StickerType, StickerStyle } from "./page.types";

type StickerIdentityStore = {
  username: string;
  stickerType: StickerType;
  stickerStyle: StickerStyle;
  setUsername: (username: string) => void;
  setStickerType: (type: StickerType) => void;
  setStickerStyle: (style: Partial<StickerStyle>) => void;
  reset: () => void;
};

const defaultStickerStyle: StickerStyle = {
  size: "medium",
  color: "#ff6b6b",
};

export const useStickerIdentityStore = create<StickerIdentityStore>((set) => ({
  username: "",
  stickerType: "BEEP",
  stickerStyle: defaultStickerStyle,
  setUsername: (username) => set({ username }),
  setStickerType: (stickerType) => set({ stickerType }),
  setStickerStyle: (style) =>
    set((state) => ({
      stickerStyle: { ...state.stickerStyle, ...style },
    })),
  reset: () =>
    set({
      username: "",
      stickerType: "BEEP",
      stickerStyle: defaultStickerStyle,
    }),
}));
