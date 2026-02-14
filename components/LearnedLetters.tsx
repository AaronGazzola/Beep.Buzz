"use client";

import { useGameStore } from "@/app/page.stores";
import { useAuthStore } from "@/app/layout.stores";
import { textToMorse } from "@/lib/morse.utils";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

function LearnedLetterSkeleton() {
  return (
    <div className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-muted animate-pulse">
      <div className="h-6 w-6 bg-muted rounded" />
      <div className="h-8 w-16 bg-muted rounded" />
    </div>
  );
}

function LearnedLetterItem({ letter }: { letter: string }) {
  const [showMorse, setShowMorse] = useState(false);

  const morseCode = textToMorse(letter);
  const morseChars = morseCode.split("");

  const [animationStyles] = useState(() =>
    morseChars.map(() => ({
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${2 + Math.random() * 2}s`,
    }))
  );

  useEffect(() => {
    if (showMorse) {
      const timer = setTimeout(() => {
        setShowMorse(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showMorse]);

  return (
    <div
      onClick={() => setShowMorse(true)}
      className={cn(
        "group flex items-center justify-between w-full px-4 py-3 rounded-lg border border-primary cursor-pointer transition-all",
        "hover:bg-primary",
        showMorse && "bg-primary",
      )}
    >
      <span
        className={cn(
          "text-xl font-bold transition-colors",
          showMorse ? "text-white" : "text-primary group-hover:text-white",
        )}
      >
        {letter}
      </span>
      <span
        className={cn(
          "text-3xl font-mono transition-all flex",
          showMorse ? "text-white blur-none" : "text-primary blur-xs group-hover:text-white",
        )}
      >
        {morseChars.map((char, index) => (
          <span
            key={index}
            className={cn(
              "inline-block",
              !showMorse && "animate-morse-float",
            )}
            style={!showMorse ? animationStyles[index] : undefined}
          >
            {char}
          </span>
        ))}
      </span>
    </div>
  );
}

interface LearnedLettersProps {
  className?: string;
  isLoading?: boolean;
}

export function LearnedLetters({ className, isLoading = false }: LearnedLettersProps) {
  const { isAuthenticated } = useAuthStore();
  const learnedLetters = useGameStore((state) => state.learnedLetters);

  const sortedLetters = [...learnedLetters].sort((a, b) =>
    a.letter.localeCompare(b.letter),
  );

  const showLoading = isAuthenticated && isLoading;
  const showLetters = learnedLetters.length > 0;

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>

      {showLoading && (
        <>
          <h3 className="text-lg font-semibold text-center mb-3 text-muted-foreground">
            Loading your progress...
          </h3>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <LearnedLetterSkeleton key={index} />
            ))}
          </div>
        </>
      )}

      {!showLoading && showLetters && (
        <>
          <h3 className="text-lg font-semibold text-center mb-3 text-muted-foreground">
            Letters You&apos;ve Learned ({learnedLetters.length})
          </h3>
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-3">
            {sortedLetters.map(({ letter }) => (
              <LearnedLetterItem
                key={letter}
                letter={letter}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
