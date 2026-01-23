import { create } from "zustand";
import type { ModerationQueueItem } from "./layout.types";

type ModerationQueueStore = {
  items: ModerationQueueItem[];
  count: number;
  setQueue: (items: ModerationQueueItem[], count: number) => void;
  removeItem: (id: string) => void;
};

export const useModerationQueueStore = create<ModerationQueueStore>((set) => ({
  items: [],
  count: 0,
  setQueue: (items, count) => set({ items, count }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      count: state.count - 1,
    })),
}));
