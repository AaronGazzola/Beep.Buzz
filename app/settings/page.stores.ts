import { create } from "zustand";
import type { StickerStyle } from "./page.types";

type StickerIdentityStore = {
  beep_style: StickerStyle;
  buzz_style: StickerStyle;
  setBeepStyle: (style: Partial<StickerStyle>) => void;
  setBuzzStyle: (style: Partial<StickerStyle>) => void;
  setStyles: (beep: StickerStyle, buzz: StickerStyle) => void;
};

export const useStickerIdentityStore = create<StickerIdentityStore>((set) => ({
  beep_style: {
    backgroundColor: "#3b82f6",
    borderColor: "#1e40af",
    textColor: "#ffffff",
    shape: "circle",
  },
  buzz_style: {
    backgroundColor: "#8b5cf6",
    borderColor: "#6d28d9",
    textColor: "#ffffff",
    shape: "circle",
  },
  setBeepStyle: (style) =>
    set((state) => ({
      beep_style: { ...state.beep_style, ...style },
    })),
  setBuzzStyle: (style) =>
    set((state) => ({
      buzz_style: { ...state.buzz_style, ...style },
    })),
  setStyles: (beep, buzz) =>
    set({
      beep_style: beep,
      buzz_style: buzz,
    }),
}));
