import { create } from "zustand";
import type { Match } from "./page.types";

type CompeteStore = {
  selectedMatch: Match | null;
  setSelectedMatch: (match: Match | null) => void;
};

export const useCompeteStore = create<CompeteStore>((set) => ({
  selectedMatch: null,
  setSelectedMatch: (match) => set({ selectedMatch: match }),
}));
