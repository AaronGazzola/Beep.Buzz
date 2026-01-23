import { create } from "zustand";
import type { Sticker } from "./page.types";

type PlaceStickersStore = {
  selectedPageId: string | null;
  placementMode: "beep" | "buzz" | null;
  stickers: Sticker[];
  setSelectedPageId: (pageId: string | null) => void;
  setPlacementMode: (mode: "beep" | "buzz" | null) => void;
  addSticker: (sticker: Sticker) => void;
  setStickers: (stickers: Sticker[]) => void;
};

export const usePlaceStickersStore = create<PlaceStickersStore>((set) => ({
  selectedPageId: null,
  placementMode: null,
  stickers: [],
  setSelectedPageId: (pageId) => set({ selectedPageId: pageId }),
  setPlacementMode: (mode) => set({ placementMode: mode }),
  addSticker: (sticker) => set((state) => ({ stickers: [...state.stickers, sticker] })),
  setStickers: (stickers) => set({ stickers }),
}));
