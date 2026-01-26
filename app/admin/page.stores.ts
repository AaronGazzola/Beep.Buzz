import { create } from "zustand";
import type { FlaggedContentData, FlagStatus } from "./page.types";

type FlaggedContentStore = {
  items: FlaggedContentData[];
  setItems: (items: FlaggedContentData[]) => void;
  removeItem: (id: string) => void;
  updateItemStatus: (id: string, status: FlagStatus) => void;
  filter: FlagStatus | "ALL";
  setFilter: (filter: FlagStatus | "ALL") => void;
};

export const useFlaggedContentStore = create<FlaggedContentStore>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  updateItemStatus: (id, status) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, status } : item
      ),
    })),
  filter: "PENDING",
  setFilter: (filter) => set({ filter }),
}));
