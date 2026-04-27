"use client";

import { useEffect } from "react";
import { MorseTrainer } from "@/components/MorseTrainer";
import { LearnedLetters } from "@/components/LearnedLetters";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Gauge, MessagesSquare, Volume2 } from "lucide-react";
import Link from "next/link";
import { useGameWorldStore } from "../page.stores";
import { useGameStore } from "@/app/page.stores";
import { useLearnedLetters } from "@/app/layout.hooks";
import type { MorseSpeed, TrainerMode } from "@/app/page.types";

const speedSteps: MorseSpeed[] = ["slow", "medium", "fast", "fastest"];

const speedLabels: Record<MorseSpeed, string> = {
  slow: "Slow",
  medium: "Medium",
  fast: "Fast",
  fastest: "Fastest",
};

const trainerModes: { value: TrainerMode; label: string; description: string }[] = [
  { value: "learn", label: "Learn", description: "Learn new letters with guided demonstrations" },
  { value: "practice", label: "Practice", description: "Quiz yourself on letters you've learned" },
  { value: "mixed", label: "Mixed", description: "Learn new letters with occasional quizzes" },
];

export function TrainerModal() {
  const open = useGameWorldStore((s) => s.trainerOpen);
  const setOpen = useGameWorldStore((s) => s.setTrainerOpen);
  const addLearnedLetter = useGameWorldStore((s) => s.addLearnedLetter);

  const { learnedLetters: trainerLearnedLetters, trainerMode, setTrainerMode, morseSpeed, setMorseSpeed, morseVolume, setMorseVolume } = useGameStore();
  const learnedLettersQuery = useLearnedLetters();

  useEffect(() => {
    if (!open) return;
    for (const entry of trainerLearnedLetters) {
      addLearnedLetter(entry.letter);
    }
  }, [trainerLearnedLetters, open, addLearnedLetter]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-auto">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition flex items-center justify-center text-slate-700 font-bold text-lg shadow"
          aria-label="Close trainer"
        >
          ×
        </button>

        <div className="container mx-auto px-4 py-8">
          <section className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Morse Code with
              <span className="block text-primary">Beep & Buzz</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Learn Morse code and chat with friends
            </p>

            <div className="max-w-4xl mx-auto mb-6">
              <div className="flex flex-col items-center mb-4">
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="bg-muted rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Gauge className="w-5 h-5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-52" align="start">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Speed</p>
                          <span className="text-sm text-muted-foreground">{speedLabels[morseSpeed]}</span>
                        </div>
                        <Slider
                          min={0}
                          max={3}
                          step={1}
                          value={[speedSteps.indexOf(morseSpeed)]}
                          onValueChange={([v]) => setMorseSpeed(speedSteps[v])}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>

                  <div className="inline-flex rounded-lg bg-muted p-1">
                    {trainerModes.map((mode) => (
                      <button
                        key={mode.value}
                        onClick={() => setTrainerMode(mode.value)}
                        className={cn(
                          "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                          trainerMode === mode.value
                            ? "bg-background text-foreground shadow-sm border border-primary"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="bg-muted rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-52" align="end">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Volume</p>
                          <span className="text-sm text-muted-foreground">{morseVolume}%</span>
                        </div>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[morseVolume]}
                          onValueChange={([v]) => setMorseVolume(v)}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {trainerModes.find((m) => m.value === trainerMode)?.description}
                </p>
              </div>

              <div className="h-[44rem] md:h-[48rem] lg:h-64">
                <MorseTrainer key="training" />
              </div>
            </div>

            <LearnedLetters
              className="mb-6"
              isLoading={learnedLettersQuery.isPending}
            />

            <div className="mt-8 mb-2 flex flex-col items-center gap-4">
              <div>
                <p className="text-lg text-muted-foreground">Ready to test your skills?</p>
                <p className="text-lg text-muted-foreground">Tap Morse code with an AI or with real users!</p>
              </div>
              <Link
                href="/chat"
                className="inline-flex items-center gap-3 rounded-full border px-12 py-4 text-lg font-semibold text-white hover:opacity-90 transition-opacity"
                style={{
                  borderColor: "var(--color-chart-4)",
                  backgroundColor: "var(--color-chart-4)",
                }}
              >
                <MessagesSquare className="h-6 w-6" strokeWidth={2.5} />
                Live chat in Morse code
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
