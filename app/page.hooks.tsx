import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { textToMorse, playMorseAudio } from "@/lib/morse.utils";
import { useAuthStore } from "./layout.stores";
import { useGameStore } from "./page.stores";
import { getLearnedLettersAction, saveLearnedLettersAction } from "./page.actions";
import type { ChatMessage, LearnedLetter } from "./page.types";

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
  const { isAuthenticated, user } = useAuthStore();
  const { setLearnedLetters } = useGameStore();

  const query = useQuery({
    queryKey: ["learnedLetters", user?.id],
    queryFn: async () => {
      const letters = await getLearnedLettersAction();
      return letters;
    },
    enabled: isAuthenticated && !!user,
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

export function useAIChat() {
  return useMutation({
    mutationFn: async (chatMessages: ChatMessage[]) => {
      const apiMessages = chatMessages
        .filter((msg) => msg.isComplete && msg.text.trim().length > 0)
        .map((msg) => ({
          role: msg.speaker === "beep" ? ("user" as const) : ("assistant" as const),
          content: msg.text,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Chat API error:", errorText);
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      return data.text as string;
    },
  });
}
