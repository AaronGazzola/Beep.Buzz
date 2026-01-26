import { create } from "zustand";
import type { ModerationQueueData } from "./layout.types";

type ModerationQueueStore = {
  queueData: ModerationQueueData | null;
  setQueueData: (data: ModerationQueueData) => void;
  decrementPending: () => void;
};

export const useModerationQueueStore = create<ModerationQueueStore>((set) => ({
  queueData: null,
  setQueueData: (queueData) => set({ queueData }),
  decrementPending: () =>
    set((state) => ({
      queueData: state.queueData
        ? {
            ...state.queueData,
            pendingCount: Math.max(0, state.queueData.pendingCount - 1),
          }
        : null,
    })),
}));
