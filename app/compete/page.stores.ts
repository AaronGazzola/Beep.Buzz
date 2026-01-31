import { create } from "zustand";

type QueueStore = {
  inQueue: boolean;
  queueTime: number;
  setInQueue: (inQueue: boolean) => void;
  setQueueTime: (time: number) => void;
};

export const useQueueStore = create<QueueStore>((set) => ({
  inQueue: false,
  queueTime: 0,
  setInQueue: (inQueue) => set({ inQueue }),
  setQueueTime: (time) => set({ queueTime: time }),
}));

type SolutionStore = {
  currentSolution: string;
  progress: number;
  setCurrentSolution: (solution: string) => void;
  setProgress: (progress: number) => void;
};

export const useSolutionStore = create<SolutionStore>((set) => ({
  currentSolution: "",
  progress: 0,
  setCurrentSolution: (solution) => set({ currentSolution: solution }),
  setProgress: (progress) => set({ progress }),
}));

type MatchChatStore = {
  messages: Array<{
    id: string;
    senderId: string;
    message: string;
    timestamp: string;
  }>;
  addMessage: (message: {
    id: string;
    senderId: string;
    message: string;
    timestamp: string;
  }) => void;
  clearMessages: () => void;
};

export const useMatchChatStore = create<MatchChatStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}));

type ProgressTrackingStore = {
  opponentProgress: number;
  setOpponentProgress: (progress: number) => void;
};

export const useProgressTrackingStore = create<ProgressTrackingStore>((set) => ({
  opponentProgress: 0,
  setOpponentProgress: (progress) => set({ opponentProgress: progress }),
}));
