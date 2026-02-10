"use client";

import { MorseTrainer } from "@/components/MorseTrainer";
import { MorseChatAI } from "@/components/MorseChatAI";
import { InlineSignUp } from "@/components/InlineSignUp";
import { LearnedLetters } from "@/components/LearnedLetters";
import { useLearnedLetters, useLearnedLettersSync } from "./page.hooks";
import { useAuthStore } from "./layout.stores";
import { useGameStore } from "./page.stores";
import { cn } from "@/lib/utils";
import type { InterfaceMode } from "./page.types";

const interfaceModes: { value: InterfaceMode; label: string }[] = [
  { value: "training", label: "Training" },
  { value: "chatAI", label: "AI Chat" },
  { value: "chatPerson", label: "User Chat" },
];

export default function Home() {
  const learnedLettersQuery = useLearnedLetters();
  useLearnedLettersSync();
  const { isAuthenticated } = useAuthStore();
  const { interfaceMode, setInterfaceMode } = useGameStore();

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
          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-lg bg-muted p-1">
              {interfaceModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setInterfaceMode(mode.value)}
                  disabled={mode.value === "chatPerson"}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    interfaceMode === mode.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                    mode.value === "chatPerson" && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className={cn(
            "h-[44rem] md:h-[48rem]",
            interfaceMode === "training" ? "lg:h-64" : "lg:h-[48rem]"
          )}>
            {interfaceMode === "training" ? (
              <MorseTrainer />
            ) : interfaceMode === "chatAI" ? (
              <MorseChatAI />
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
