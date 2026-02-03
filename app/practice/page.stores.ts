import { create } from "zustand";
import type { DifficultyLevel } from "./page.types";

type PracticeStore = {
  difficulty: DifficultyLevel;
  currentWordIndex: number;
  wordsAttempted: number;
  wordsCorrect: number;
  startTime: number | null;
  isSessionActive: boolean;
  setDifficulty: (difficulty: DifficultyLevel) => void;
  nextWord: () => void;
  recordAnswer: (correct: boolean) => void;
  startSession: () => void;
  endSession: () => void;
  reset: () => void;
};

export const usePracticeStore = create<PracticeStore>((set) => ({
  difficulty: "beginner",
  currentWordIndex: 0,
  wordsAttempted: 0,
  wordsCorrect: 0,
  startTime: null,
  isSessionActive: false,
  setDifficulty: (difficulty) => set({ difficulty }),
  nextWord: () =>
    set((state) => ({
      currentWordIndex: state.currentWordIndex + 1,
    })),
  recordAnswer: (correct) =>
    set((state) => ({
      wordsAttempted: state.wordsAttempted + 1,
      wordsCorrect: correct ? state.wordsCorrect + 1 : state.wordsCorrect,
    })),
  startSession: () => set({ startTime: Date.now(), isSessionActive: true }),
  endSession: () => set({ isSessionActive: false }),
  reset: () =>
    set({
      currentWordIndex: 0,
      wordsAttempted: 0,
      wordsCorrect: 0,
      startTime: null,
      isSessionActive: false,
    }),
}));
