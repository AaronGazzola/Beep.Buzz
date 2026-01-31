import { create } from "zustand";

type TranslationStore = {
  currentTranslation: string;
  targetText: string;
  setCurrentTranslation: (translation: string) => void;
  setTargetText: (text: string) => void;
};

export const useTranslationStore = create<TranslationStore>((set) => ({
  currentTranslation: "",
  targetText: "",
  setCurrentTranslation: (translation) => set({ currentTranslation: translation }),
  setTargetText: (text) => set({ targetText: text }),
}));

type DifficultyStore = {
  difficulty: number;
  speed: number;
  characterSet: string[];
  setDifficulty: (difficulty: number) => void;
  setSpeed: (speed: number) => void;
  setCharacterSet: (chars: string[]) => void;
};

export const useDifficultyStore = create<DifficultyStore>((set) => ({
  difficulty: 5,
  speed: 15,
  characterSet: ["A", "B", "C", "D", "E"],
  setDifficulty: (difficulty) => set({ difficulty }),
  setSpeed: (speed) => set({ speed }),
  setCharacterSet: (chars) => set({ characterSet: chars }),
}));

type ContentStore = {
  practiceText: string;
  morseCode: string;
  setPracticeText: (text: string) => void;
  setMorseCode: (code: string) => void;
};

export const useContentStore = create<ContentStore>((set) => ({
  practiceText: "",
  morseCode: "",
  setPracticeText: (text) => set({ practiceText: text }),
  setMorseCode: (code) => set({ morseCode: code }),
}));
