import { create } from "zustand";
import type { Lesson } from "./page.types";

type TrainingStore = {
  currentLesson: Lesson | null;
  currentExerciseIndex: number;
  correctAnswers: number;
  totalAttempts: number;
  startTime: number | null;
  showTranslation: boolean;
  setCurrentLesson: (lesson: Lesson | null) => void;
  nextExercise: () => void;
  recordAnswer: (correct: boolean) => void;
  startSession: () => void;
  toggleTranslation: () => void;
  reset: () => void;
};

export const useTrainingStore = create<TrainingStore>((set) => ({
  currentLesson: null,
  currentExerciseIndex: 0,
  correctAnswers: 0,
  totalAttempts: 0,
  startTime: null,
  showTranslation: true,
  setCurrentLesson: (lesson) =>
    set({
      currentLesson: lesson,
      currentExerciseIndex: 0,
      correctAnswers: 0,
      totalAttempts: 0,
    }),
  nextExercise: () =>
    set((state) => ({
      currentExerciseIndex: state.currentExerciseIndex + 1,
    })),
  recordAnswer: (correct) =>
    set((state) => ({
      correctAnswers: correct
        ? state.correctAnswers + 1
        : state.correctAnswers,
      totalAttempts: state.totalAttempts + 1,
    })),
  startSession: () => set({ startTime: Date.now() }),
  toggleTranslation: () =>
    set((state) => ({ showTranslation: !state.showTranslation })),
  reset: () =>
    set({
      currentLesson: null,
      currentExerciseIndex: 0,
      correctAnswers: 0,
      totalAttempts: 0,
      startTime: null,
      showTranslation: true,
    }),
}));
