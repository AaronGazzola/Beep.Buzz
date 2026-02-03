import { create } from "zustand";
import type { Match, MatchMessage } from "./page.types";

type MatchStore = {
  match: Match | null;
  messages: MatchMessage[];
  userScore: number;
  opponentScore: number;
  setMatch: (match: Match) => void;
  setMessages: (messages: MatchMessage[]) => void;
  addMessage: (message: MatchMessage) => void;
  incrementUserScore: () => void;
  incrementOpponentScore: () => void;
  reset: () => void;
};

export const useMatchStore = create<MatchStore>((set) => ({
  match: null,
  messages: [],
  userScore: 0,
  opponentScore: 0,
  setMatch: (match) => set({ match }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  incrementUserScore: () =>
    set((state) => ({ userScore: state.userScore + 1 })),
  incrementOpponentScore: () =>
    set((state) => ({ opponentScore: state.opponentScore + 1 })),
  reset: () =>
    set({
      match: null,
      messages: [],
      userScore: 0,
      opponentScore: 0,
    }),
}));
