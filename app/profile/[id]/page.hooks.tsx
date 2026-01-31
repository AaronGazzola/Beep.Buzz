import { supabase } from "@/supabase/browser-client";
import { useQuery } from "@tanstack/react-query";
import type { UserAchievements, MatchHistory, UserPracticeStats } from "@/app/layout.types";

export async function getUserAchievementsAction(
  userId: string
): Promise<UserAchievements> {
  return [];
}

export function useUserAchievements(userId: string) {
  // const supabase = createClient(); // Already imported

  return useQuery({
    queryKey: ["userAchievements", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_achievements")
        .select("*, achievements(*)")
        .eq("user_id", userId);

      if (error) {
        console.error(error);
        throw new Error("Failed to fetch achievements");
      }

      return data || [];
    },
  });
}

export async function getMatchHistoryAction(
  userId: string
): Promise<MatchHistory> {
  return [];
}

export function useMatchHistory(userId: string) {
  // const supabase = createClient(); // Already imported

  return useQuery({
    queryKey: ["matchHistory", userId],
    queryFn: async () => {
      const { data: matches, error } = await supabase
        .from("competitive_matches")
        .select("*")
        .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error(error);
        throw new Error("Failed to fetch match history");
      }

      const history: MatchHistory = [];

      for (const match of matches || []) {
        const opponentId =
          match.player1_id === userId ? match.player2_id : match.player1_id;

        const { data: opponentProfile } = await supabase
          .from("profiles")
          .select("username")
          .eq("user_id", opponentId)
          .single();

        const { data: solution } = await supabase
          .from("match_solutions")
          .select("wpm, accuracy")
          .eq("match_id", match.id)
          .eq("user_id", userId)
          .single();

        let result: "won" | "lost" | "abandoned" = "abandoned";
        if (match.status === "completed" && match.winner_id) {
          result = match.winner_id === userId ? "won" : "lost";
        }

        history.push({
          match,
          opponent: {
            id: opponentId,
            username: opponentProfile?.username || "Unknown",
          },
          result,
          wpm: solution?.wpm || 0,
          accuracy: solution?.accuracy || 0,
        });
      }

      return history;
    },
  });
}

export async function getUserPracticeStatsAction(
  userId: string
): Promise<UserPracticeStats> {
  return {
    totalSessions: 0,
    totalTime: 0,
    avgEncodeWpm: 0,
    avgDecodeWpm: 0,
    bestWpm: 0,
    avgAccuracy: 0,
    recentSessions: [],
  };
}

export function useUserPracticeStats(userId: string) {
  // const supabase = createClient(); // Already imported

  return useQuery({
    queryKey: ["userPracticeStats", userId],
    queryFn: async () => {
      const { data: sessions, error } = await supabase
        .from("practice_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        throw new Error("Failed to fetch practice stats");
      }

      const totalSessions = sessions?.length || 0;
      const totalTime =
        sessions?.reduce((acc, s) => acc + s.duration_seconds, 0) || 0;
      const avgWpm =
        sessions?.reduce((acc, s) => acc + s.wpm, 0) / totalSessions || 0;
      const avgAccuracy =
        sessions?.reduce((acc, s) => acc + s.accuracy, 0) / totalSessions || 0;
      const bestWpm = Math.max(...(sessions?.map((s) => s.wpm) || [0]));

      const { data: stats } = await supabase
        .from("user_statistics")
        .select("avg_encode_wpm, avg_decode_wpm")
        .eq("user_id", userId)
        .single();

      return {
        totalSessions,
        totalTime,
        avgEncodeWpm: stats?.avg_encode_wpm || 0,
        avgDecodeWpm: stats?.avg_decode_wpm || 0,
        bestWpm,
        avgAccuracy,
        recentSessions: sessions?.slice(0, 5) || [],
      };
    },
  });
}
