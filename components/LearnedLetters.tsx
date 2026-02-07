"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useGameStore } from "@/app/page.stores";
import { textToMorse } from "@/lib/morse.utils";
import { cn } from "@/lib/utils";
import { TrainerMode } from "@/app/page.types";

function LearnedLetterItem({ letter }: { letter: string }) {
  const [showMorse, setShowMorse] = useState(false);

  return (
    <div className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-primary/10 border border-primary/20">
      <span className="text-xl font-bold text-primary">{letter}</span>
      <div className="flex items-center gap-3">
        {showMorse && (
          <span className="text-2xl font-mono text-muted-foreground">{textToMorse(letter)}</span>
        )}
        <button
          onClick={() => setShowMorse(!showMorse)}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showMorse ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

const modes: { value: TrainerMode; label: string; description: string }[] = [
  { value: "learn", label: "Learn", description: "Learn new letters with guided demonstrations" },
  { value: "practice", label: "Practice", description: "Quiz yourself on letters you've learned" },
  { value: "mixed", label: "Mixed", description: "Learn new letters with occasional quizzes" },
];

export function LearnedLetters({ className }: { className?: string }) {
  const learnedLetters = useGameStore((state) => state.learnedLetters);
  const trainerMode = useGameStore((state) => state.trainerMode);
  const setTrainerMode = useGameStore((state) => state.setTrainerMode);

  const sortedLetters = [...learnedLetters].sort((a, b) => a.letter.localeCompare(b.letter));

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="flex flex-col items-center mb-4">
        <div className="inline-flex rounded-lg bg-muted p-1">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setTrainerMode(mode.value)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-colors",
                trainerMode === mode.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {modes.find((m) => m.value === trainerMode)?.description}
        </p>
      </div>

      {learnedLetters.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-center mb-3 text-muted-foreground">
            Letters You&apos;ve Learned ({learnedLetters.length})
          </h3>
          <div className="flex flex-col gap-2">
            {sortedLetters.map(({ letter }) => (
              <LearnedLetterItem key={letter} letter={letter} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
