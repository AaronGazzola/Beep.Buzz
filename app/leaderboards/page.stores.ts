import { create } from "zustand";
import type { LeaderboardCategory } from "@/app/layout.types";

type RankingStore = {
  rankings: Array<{
    userId: string;
    username: string;
    score: number;
    rank: number;
  }>;
  setRankings: (
    rankings: Array<{
      userId: string;
      username: string;
      score: number;
      rank: number;
    }>
  ) => void;
};

export const useRankingStore = create<RankingStore>((set) => ({
  rankings: [],
  setRankings: (rankings) => set({ rankings }),
}));

type SeasonalStore = {
  seasonalRankings: Array<{
    userId: string;
    username: string;
    score: number;
    rank: number;
    period: string;
  }>;
  setSeasonalRankings: (
    rankings: Array<{
      userId: string;
      username: string;
      score: number;
      rank: number;
      period: string;
    }>
  ) => void;
};

export const useSeasonalStore = create<SeasonalStore>((set) => ({
  seasonalRankings: [],
  setSeasonalRankings: (rankings) => set({ seasonalRankings: rankings }),
}));

type FilterStore = {
  category: LeaderboardCategory;
  period: "daily" | "weekly" | "monthly" | "all-time";
  setCategory: (category: LeaderboardCategory) => void;
  setPeriod: (period: "daily" | "weekly" | "monthly" | "all-time") => void;
};

export const useFilterStore = create<FilterStore>((set) => ({
  category: "overall",
  period: "weekly",
  setCategory: (category) => set({ category }),
  setPeriod: (period) => set({ period }),
}));
