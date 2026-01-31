import { supabase } from "@/supabase/browser-client";
import { useQuery } from "@tanstack/react-query";
import { useRankingStore, useSeasonalStore, useFilterStore } from "./page.stores";
import type { LeaderboardCategory } from "@/app/layout.types";

export type CategoryRankings = Array<{
  userId: string;
  username: string;
  score: number;
  rank: number;
}>;

export type SeasonalRankings = Array<{
  userId: string;
  username: string;
  score: number;
  rank: number;
  period: string;
}>;

export type LeaderboardFilter = {
  category: LeaderboardCategory;
  period: "daily" | "weekly" | "monthly" | "all-time";
};

export async function getCategoryRankingsAction(
  category: LeaderboardCategory,
  period: string
): Promise<CategoryRankings> {
  return [];
}

export function useCategoryRankings(
  category: LeaderboardCategory = "overall",
  period: string = "weekly"
) {
  // const supabase = createClient(); // Already imported
  const setRankings = useRankingStore((state) => state.setRankings);

  return useQuery({
    queryKey: ["categoryRankings", category, period],
    queryFn: async () => {
      const now = new Date();
      let startDate = new Date();

      if (period === "daily") {
        startDate.setDate(now.getDate() - 1);
      } else if (period === "weekly") {
        startDate.setDate(now.getDate() - 7);
      } else if (period === "monthly") {
        startDate.setMonth(now.getMonth() - 1);
      } else {
        startDate = new Date(0);
      }

      const { data: entries, error } = await supabase
        .from("leaderboard_entries")
        .select("user_id, score")
        .eq("category", category)
        .gte("period_start", startDate.toISOString())
        .order("score", { ascending: false })
        .limit(100);

      if (error) {
        console.error(error);
        throw new Error("Failed to fetch rankings");
      }

      if (!entries || entries.length === 0) {
        return [];
      }

      const userIds = entries.map((e) => e.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username")
        .in("user_id", userIds);

      const profileMap = new Map(
        profiles?.map((p) => [p.user_id, p.username]) || []
      );

      const rankings = entries.map((entry, index) => ({
        userId: entry.user_id,
        username: profileMap.get(entry.user_id) || "Unknown",
        score: entry.score,
        rank: index + 1,
      }));

      setRankings(rankings);
      return rankings;
    },
  });
}

export async function getSeasonalRankingsAction(): Promise<SeasonalRankings> {
  return [];
}

export function useSeasonalRankings() {
  const setSeasonalRankings = useSeasonalStore(
    (state) => state.setSeasonalRankings
  );

  return useQuery({
    queryKey: ["seasonalRankings"],
    queryFn: async () => {
      const rankings = await getSeasonalRankingsAction();
      setSeasonalRankings(rankings);
      return rankings;
    },
  });
}

export async function filterLeaderboardAction(
  filter: LeaderboardFilter
): Promise<void> {
  return Promise.resolve();
}

export function useLeaderboardFilter() {
  const { category, period, setCategory, setPeriod } = useFilterStore();

  return {
    category,
    period,
    setCategory,
    setPeriod,
  };
}
