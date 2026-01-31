import { supabase } from "@/supabase/browser-client";
import { useQuery } from "@tanstack/react-query";
import {
  useLessonStore,
  usePracticeStore,
  useSkillStore,
  useLessonRecommendationStore,
} from "./page.stores";

export type SkillProgression = {
  level: number;
  xp: number;
  nextLevelXp: number;
  skills: Record<string, number>;
};

export type LessonRecommendation = {
  lessonId: string;
  title: string;
  reason: string;
};

export function useLessonProgress() {
  // const supabase = createClient(); // Already imported
  const { setLessons, setProgress } = useLessonStore();

  return useQuery({
    queryKey: ["lessonProgress"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const { data: lessons, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .order("order_index");

      if (lessonsError) {
        console.error(lessonsError);
        throw new Error("Failed to fetch lessons");
      }

      const { data: progress, error: progressError } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", user.id);

      if (progressError) {
        console.error(progressError);
        throw new Error("Failed to fetch progress");
      }

      setLessons(lessons);
      setProgress(progress);

      return { lessons, progress };
    },
  });
}

export function usePracticeStats() {
  // const supabase = createClient(); // Already imported
  const setStats = usePracticeStore((state) => state.setStats);

  return useQuery({
    queryKey: ["practiceStats"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const { data: sessions, error } = await supabase
        .from("practice_sessions")
        .select("wpm, accuracy")
        .eq("user_id", user.id);

      if (error) {
        console.error(error);
        throw new Error("Failed to fetch practice stats");
      }

      const totalSessions = sessions.length;
      const avgWpm =
        sessions.reduce((acc, s) => acc + s.wpm, 0) / totalSessions || 0;
      const avgAccuracy =
        sessions.reduce((acc, s) => acc + s.accuracy, 0) / totalSessions || 0;

      const stats = {
        totalSessions,
        avgWpm,
        avgAccuracy,
      };

      setStats(stats);
      return stats;
    },
  });
}

export async function getSkillProgressionAction(
  userId: string
): Promise<SkillProgression> {
  return {
    level: 5,
    xp: 2500,
    nextLevelXp: 3000,
    skills: {
      encoding: 75,
      decoding: 60,
      speed: 50,
      accuracy: 80,
    },
  };
}

export function useSkillProgression() {
  // const supabase = createClient(); // Already imported
  const setProgression = useSkillStore((state) => state.setProgression);

  return useQuery({
    queryKey: ["skillProgression"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const progression = await getSkillProgressionAction(user.id);
      setProgression(progression);
      return progression;
    },
  });
}

export async function getRecommendedLessonsAction(
  userId: string
): Promise<LessonRecommendation[]> {
  return [
    {
      lessonId: "1",
      title: "Basic Letters A-E",
      reason: "Complete fundamentals to progress",
    },
    {
      lessonId: "2",
      title: "Numbers 0-5",
      reason: "Build on your letter knowledge",
    },
  ];
}

export function useRecommendedLessons() {
  // const supabase = createClient(); // Already imported
  const setRecommendations = useLessonRecommendationStore(
    (state) => state.setRecommendations
  );

  return useQuery({
    queryKey: ["recommendedLessons"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const recommendations = await getRecommendedLessonsAction(user.id);
      setRecommendations(recommendations);
      return recommendations;
    },
  });
}
