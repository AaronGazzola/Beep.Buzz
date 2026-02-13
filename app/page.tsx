"use client";

import { useEffect, useRef } from "react";
import { MorseTrainer } from "@/components/MorseTrainer";
import { MorseChatAI } from "@/components/MorseChatAI";
import { MorseChatUser } from "@/components/MorseChatUser";
import { InlineSignUp } from "@/components/InlineSignUp";
import { LearnedLetters } from "@/components/LearnedLetters";
import { useLearnedLetters, useLearnedLettersSync } from "./page.hooks";
import { useAuthStore } from "./layout.stores";
import { useGameStore, useUserChatStore } from "./page.stores";
import { Turtle, Rabbit, Bike, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InterfaceMode, MorseSpeed } from "./page.types";

const interfaceModes: { value: InterfaceMode; label: string }[] = [
  { value: "training", label: "Training" },
  { value: "chatAI", label: "AI Chat" },
  { value: "chatPerson", label: "User Chat" },
];

const speedCycle: MorseSpeed[] = ["slow", "medium", "fast", "fastest"];

const speedIcons: Record<MorseSpeed, typeof Turtle> = {
  slow: Turtle,
  medium: Rabbit,
  fast: Bike,
  fastest: Rocket,
};

export default function Home() {
  const learnedLettersQuery = useLearnedLetters();
  useLearnedLettersSync();
  const { isAuthenticated } = useAuthStore();
  const { interfaceMode, setInterfaceMode, morseSpeed, setMorseSpeed, clearChatMessages } = useGameStore();
  const resetUserChat = useUserChatStore((s) => s.resetUserChat);
  const prevModeRef = useRef(interfaceMode);

  useEffect(() => {
    if (prevModeRef.current === "chatPerson" && interfaceMode !== "chatPerson") {
      resetUserChat();
      clearChatMessages();
    }
    prevModeRef.current = interfaceMode;
  }, [interfaceMode, resetUserChat, clearChatMessages]);

  const showTrainerModes = interfaceMode === "training";

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Learn Morse Code with
          <span className="block text-primary">Beep & Buzz</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Master Morse code through interactive training, practice challenges, and competitive gameplay
        </p>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="mb-6 flex justify-center items-center gap-2">
            <div className="inline-flex rounded-lg bg-muted p-1">
              {interfaceModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setInterfaceMode(mode.value)}
                  disabled={mode.value === "chatPerson" && !isAuthenticated}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    interfaceMode === mode.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                    mode.value === "chatPerson" && !isAuthenticated && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            {(interfaceMode === "chatAI" || interfaceMode === "chatPerson") && (() => {
              const SpeedIcon = speedIcons[morseSpeed];
              return (
                <button
                  onClick={() => {
                    const currentIndex = speedCycle.indexOf(morseSpeed);
                    const nextIndex = (currentIndex + 1) % speedCycle.length;
                    setMorseSpeed(speedCycle[nextIndex]);
                  }}
                  className="bg-muted rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SpeedIcon className="w-5 h-5" />
                </button>
              );
            })()}
          </div>

          <div className={cn(
            "h-[44rem] md:h-[48rem]",
            interfaceMode === "training" ? "lg:h-64" : "lg:h-[48rem]"
          )}>
            {interfaceMode === "training" ? (
              <MorseTrainer />
            ) : interfaceMode === "chatAI" ? (
              <MorseChatAI />
            ) : interfaceMode === "chatPerson" ? (
              <MorseChatUser />
            ) : null}
          </div>
        </div>

        {showTrainerModes && (
          <LearnedLetters className="mb-8" isLoading={learnedLettersQuery.isPending} />
        )}

        {!isAuthenticated && <InlineSignUp className="mb-8" />}
      </section>
    </div>
  );
}
