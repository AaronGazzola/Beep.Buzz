import { create } from "zustand";
import { ChallengeAttempt, Difficulty, GameMode, TrainingStep, GameState, PracticeType } from "./page.types";

interface GameStore extends GameState {
  setStep: (step: TrainingStep) => void;
  setMode: (mode: GameMode) => void;
  setPracticeType: (practiceType: PracticeType) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setChallenge: (challenge: string, morse: string) => void;
  setUserInput: (input: string) => void;
  appendToUserInput: (signal: string) => void;
  addCharacterGap: () => void;
  addWordGap: () => void;
  clearUserInput: () => void;
  setUserTextInput: (input: string) => void;
  clearUserTextInput: () => void;
  setIsCorrect: (isCorrect: boolean | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  incrementScore: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  startSession: () => void;
  startChallenge: () => void;
  recordAttempt: (attempt: Omit<ChallengeAttempt, "attemptNumber" | "timestamp">) => void;
  getSessionSummary: () => {
    totalAttempts: number;
    correctAttempts: number;
    accuracy: number;
    maxStreak: number;
    score: number;
    attempts: ChallengeAttempt[];
  };
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  step: "ready",
  mode: "training",
  practiceType: "text-to-morse",
  difficulty: "letter",
  currentChallenge: "",
  currentMorse: "",
  userInput: "",
  userTextInput: "",
  isCorrect: null,
  isPlaying: false,
  score: 0,
  streak: 0,
  maxStreak: 0,
  attempts: [],
  sessionStartTime: null,
  challengeStartTime: null,

  setStep: (step) => set({ step }),
  setMode: (mode) => set({ mode, step: "ready", score: 0, streak: 0, maxStreak: 0, attempts: [] }),
  setPracticeType: (practiceType) => set({ practiceType }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setChallenge: (challenge, morse) =>
    set({ currentChallenge: challenge, currentMorse: morse }),
  setUserInput: (input) => set({ userInput: input }),
  appendToUserInput: (signal) =>
    set((state) => ({ userInput: state.userInput + signal })),
  addCharacterGap: () =>
    set((state) => {
      if (state.userInput.length === 0) return state;
      if (state.userInput.endsWith(" ")) return state;
      if (state.userInput.endsWith("/")) return state;
      return { userInput: state.userInput + " " };
    }),
  addWordGap: () =>
    set((state) => {
      if (state.userInput.length === 0) return state;
      if (state.userInput.endsWith("/")) return state;
      const trimmed = state.userInput.trimEnd();
      return { userInput: trimmed + " / " };
    }),
  clearUserInput: () => set({ userInput: "" }),
  setUserTextInput: (input) => set({ userTextInput: input }),
  clearUserTextInput: () => set({ userTextInput: "" }),
  setIsCorrect: (isCorrect) => set({ isCorrect }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  incrementStreak: () =>
    set((state) => {
      const newStreak = state.streak + 1;
      return {
        streak: newStreak,
        maxStreak: Math.max(state.maxStreak, newStreak),
      };
    }),
  resetStreak: () => set({ streak: 0 }),
  startSession: () => set({ sessionStartTime: Date.now(), attempts: [], score: 0, streak: 0, maxStreak: 0 }),
  startChallenge: () => set({ challengeStartTime: Date.now() }),
  recordAttempt: (attempt) =>
    set((state) => {
      const responseTimeMs = state.challengeStartTime
        ? Date.now() - state.challengeStartTime
        : undefined;
      const newAttempt: ChallengeAttempt = {
        ...attempt,
        attemptNumber: state.attempts.length + 1,
        timestamp: Date.now(),
        responseTimeMs,
      };
      return { attempts: [...state.attempts, newAttempt] };
    }),
  getSessionSummary: () => {
    const state = get();
    const totalAttempts = state.attempts.length;
    const correctAttempts = state.attempts.filter((a) => a.isCorrect).length;
    const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
    return {
      totalAttempts,
      correctAttempts,
      accuracy,
      maxStreak: state.maxStreak,
      score: state.score,
      attempts: state.attempts,
    };
  },
  resetGame: () =>
    set({
      step: "ready",
      currentChallenge: "",
      currentMorse: "",
      userInput: "",
      userTextInput: "",
      isCorrect: null,
      isPlaying: false,
      score: 0,
      streak: 0,
      maxStreak: 0,
      attempts: [],
      sessionStartTime: null,
      challengeStartTime: null,
    }),
}));
