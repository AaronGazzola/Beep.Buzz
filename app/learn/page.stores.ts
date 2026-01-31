import { create } from "zustand";
import type { Lesson, LessonProgress } from "@/app/layout.types";

type LessonStore = {
  lessons: Lesson[];
  progress: LessonProgress[];
  setLessons: (lessons: Lesson[]) => void;
  setProgress: (progress: LessonProgress[]) => void;
};

export const useLessonStore = create<LessonStore>((set) => ({
  lessons: [],
  progress: [],
  setLessons: (lessons) => set({ lessons }),
  setProgress: (progress) => set({ progress }),
}));

type PracticeStore = {
  stats: {
    totalSessions: number;
    avgWpm: number;
    avgAccuracy: number;
  } | null;
  setStats: (stats: { totalSessions: number; avgWpm: number; avgAccuracy: number }) => void;
};

export const usePracticeStore = create<PracticeStore>((set) => ({
  stats: null,
  setStats: (stats) => set({ stats }),
}));

type SkillStore = {
  progression: {
    level: number;
    xp: number;
    nextLevelXp: number;
    skills: Record<string, number>;
  } | null;
  setProgression: (progression: {
    level: number;
    xp: number;
    nextLevelXp: number;
    skills: Record<string, number>;
  }) => void;
};

export const useSkillStore = create<SkillStore>((set) => ({
  progression: null,
  setProgression: (progression) => set({ progression }),
}));

type LessonRecommendationStore = {
  recommendations: Array<{
    lessonId: string;
    title: string;
    reason: string;
  }>;
  setRecommendations: (
    recommendations: Array<{
      lessonId: string;
      title: string;
      reason: string;
    }>
  ) => void;
};

export const useLessonRecommendationStore = create<LessonRecommendationStore>((set) => ({
  recommendations: [],
  setRecommendations: (recommendations) => set({ recommendations }),
}));
