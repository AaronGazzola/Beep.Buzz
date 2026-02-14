"use client";

import { MorseTrainer } from "@/components/MorseTrainer";
import { MorseChatAI } from "@/components/MorseChatAI";
import { InlineSignUp } from "@/components/InlineSignUp";
import { LearnedLetters } from "@/components/LearnedLetters";
import { useLearnedLetters, useLearnedLettersSync } from "./page.hooks";
import { useAuthStore } from "./layout.stores";
import { useGameStore } from "./page.stores";
import { Turtle, Rabbit, Bike, Rocket, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { InterfaceMode, MorseSpeed, TrainerMode } from "./page.types";

const interfaceModes: { value: InterfaceMode; label: string }[] = [
  { value: "training", label: "Training" },
  { value: "chatAI", label: "AI Chat" },
  { value: "chatPerson", label: "User Chat" },
];

const trainerModes: { value: TrainerMode; label: string; description: string }[] = [
  {
    value: "learn",
    label: "Learn",
    description: "Learn new letters with guided demonstrations",
  },
  {
    value: "practice",
    label: "Practice",
    description: "Quiz yourself on letters you've learned",
  },
  {
    value: "mixed",
    label: "Mixed",
    description: "Learn new letters with occasional quizzes",
  },
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
  const { interfaceMode, setInterfaceMode, morseSpeed, setMorseSpeed, trainerMode, setTrainerMode } = useGameStore();

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
            <Popover>
              <PopoverTrigger asChild>
                <button className="bg-muted rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Info className="w-5 h-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Morse Code Input Guide</h4>
                  <p className="text-sm text-muted-foreground">
                    Press space bar to tap morse
                  </p>
                  <div className="space-y-1 pt-2">
                    <p className="text-sm text-muted-foreground">
                      3 dit lengths = space between characters in words
                    </p>
                    <p className="text-sm text-muted-foreground">
                      7 dit lengths = space between words
                    </p>
                    <p className="text-sm text-muted-foreground">
                      14 dit lengths = end of message
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
            {(() => {
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

          {interfaceMode === "training" && (
            <div className="mb-6 flex flex-col items-center">
              <div className="inline-flex rounded-lg bg-muted p-1">
                {trainerModes.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setTrainerMode(mode.value)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                      trainerMode === mode.value
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {trainerModes.find((m) => m.value === trainerMode)?.description}
              </p>
            </div>
          )}

          <div className={cn(
            interfaceMode === "training" && "h-[44rem] md:h-[48rem] lg:h-64"
          )}>
            {interfaceMode === "training" ? (
              <MorseTrainer />
            ) : interfaceMode === "chatAI" ? (
              <MorseChatAI className="min-h-[20rem] max-h-[24rem] md:max-h-[28rem]" />
            ) : null}
          </div>
        </div>

        <LearnedLetters className="mb-8" isLoading={learnedLettersQuery.isPending} />

        {!isAuthenticated && <InlineSignUp className="mb-8" />}
      </section>
    </div>
  );
}
