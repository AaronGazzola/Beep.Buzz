import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { textToMorse, playMorseAudio } from "@/lib/morse.utils";
import { useAuthStore } from "./layout.stores";
import { useGameStore } from "./page.stores";
import { getLearnedLettersAction, saveLearnedLettersAction } from "./page.actions";
import type { LearnedLetter } from "./page.types";

export function useMorseDemo() {
  const [inputText, setInputText] = useState("");
  const [morseCode, setMorseCode] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTextChange = (text: string) => {
    setInputText(text);
    setMorseCode(textToMorse(text));
  };

  const handlePlayAudio = async () => {
    if (!morseCode || isPlaying) return;

    setIsPlaying(true);
    try {
      await playMorseAudio(morseCode, {
        volume: 0.5,
        wpm: 20,
        frequency: 600,
      });
    } finally {
      setIsPlaying(false);
    }
  };

  return {
    inputText,
    morseCode,
    isPlaying,
    handleTextChange,
    handlePlayAudio,
  };
}

export function useLearnedLetters() {
  const { isAuthenticated } = useAuthStore();
  const { setLearnedLetters } = useGameStore();

  const query = useQuery({
    queryKey: ["learnedLetters"],
    queryFn: async () => {
      const letters = await getLearnedLettersAction();
      return letters;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data && query.data.length > 0) {
      setLearnedLetters(query.data);
    }
  }, [query.data, setLearnedLetters]);

  return query;
}

export function useSaveLearnedLetters() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (learnedLetters: LearnedLetter[]) => {
      return saveLearnedLettersAction(learnedLetters);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learnedLetters"] });
    },
  });
}

export function useLearnedLettersSync() {
  const { isAuthenticated } = useAuthStore();
  const learnedLetters = useGameStore((state) => state.learnedLetters);
  const saveLearnedLetters = useSaveLearnedLetters();
  const prevLettersRef = useRef<string>("");

  useEffect(() => {
    if (!isAuthenticated || learnedLetters.length === 0) return;

    const currentLetters = JSON.stringify(learnedLetters);
    if (currentLetters === prevLettersRef.current) return;

    prevLettersRef.current = currentLetters;
    saveLearnedLetters.mutate(learnedLetters);
  }, [isAuthenticated, learnedLetters, saveLearnedLetters]);
}
