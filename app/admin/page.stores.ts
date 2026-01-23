import { create } from "zustand";
import type { FlaggedContent, ContentStatus } from "./page.types";

type FlaggedContentStore = {
  items: FlaggedContent[];
  filterStatus: ContentStatus | "ALL";
  setItems: (items: FlaggedContent[]) => void;
  setFilterStatus: (status: ContentStatus | "ALL") => void;
  removeItem: (id: string) => void;
};

export const useFlaggedContentStore = create<FlaggedContentStore>((set) => ({
  items: [],
  filterStatus: "FLAGGED",
  setItems: (items) => set({ items }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}));
