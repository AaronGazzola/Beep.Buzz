import { create } from "zustand";
import type { StickerPlacementWithSticker } from "./page.types";

type StickerPlacementStore = {
  placements: StickerPlacementWithSticker[];
  setPlacements: (placements: StickerPlacementWithSticker[]) => void;
  addPlacement: (placement: StickerPlacementWithSticker) => void;
  updatePlacement: (
    placementId: string,
    updates: Partial<StickerPlacementWithSticker>
  ) => void;
  removePlacement: (placementId: string) => void;
  placingSticker: boolean;
  setPlacingSticker: (placing: boolean) => void;
  selectedElementId: string | null;
  setSelectedElementId: (id: string | null) => void;
};

export const useStickerPlacementStore = create<StickerPlacementStore>(
  (set) => ({
    placements: [],
    setPlacements: (placements) => set({ placements }),
    addPlacement: (placement) =>
      set((state) => ({ placements: [...state.placements, placement] })),
    updatePlacement: (placementId, updates) =>
      set((state) => ({
        placements: state.placements.map((p) =>
          p.id === placementId ? { ...p, ...updates } : p
        ),
      })),
    removePlacement: (placementId) =>
      set((state) => ({
        placements: state.placements.filter((p) => p.id !== placementId),
      })),
    placingSticker: false,
    setPlacingSticker: (placingSticker) => set({ placingSticker }),
    selectedElementId: null,
    setSelectedElementId: (selectedElementId) => set({ selectedElementId }),
  })
);

type StickerVisibilityStore = {
  showStickers: boolean;
  toggleStickers: () => void;
  setShowStickers: (show: boolean) => void;
};

export const useStickerVisibilityStore = create<StickerVisibilityStore>(
  (set) => ({
    showStickers: true,
    toggleStickers: () => set((state) => ({ showStickers: !state.showStickers })),
    setShowStickers: (showStickers) => set({ showStickers }),
  })
);
