import { create } from "zustand";
import { Difficulty, GamePhase, GameState } from "./page.types";

interface GameStore extends GameState {
  setPhase: (phase: GamePhase) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setChallenge: (challenge: string, morse: string) => void;
  setUserInput: (input: string) => void;
  appendToUserInput: (signal: string) => void;
  addCharacterGap: () => void;
  addWordGap: () => void;
  clearUserInput: () => void;
  setIsCorrect: (isCorrect: boolean | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  incrementScore: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  phase: "idle",
  difficulty: "letter",
  currentChallenge: "",
  currentMorse: "",
  userInput: "",
  isCorrect: null,
  isPlaying: false,
  score: 0,
  streak: 0,

  setPhase: (phase) => set({ phase }),
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
  setIsCorrect: (isCorrect) => set({ isCorrect }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  incrementScore: () => set((state) => ({ score: state.score + 1 })),
  incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
  resetStreak: () => set({ streak: 0 }),
  resetGame: () =>
    set({
      phase: "idle",
      currentChallenge: "",
      currentMorse: "",
      userInput: "",
      isCorrect: null,
      isPlaying: false,
      score: 0,
      streak: 0,
    }),
}));
