"use client";

import { MorseTrainer } from "@/components/MorseTrainer";
import { InlineSignUp } from "@/components/InlineSignUp";
import { LearnedLetters } from "@/components/LearnedLetters";
import { useLearnedLetters, useLearnedLettersSync } from "./page.hooks";
import { useAuthStore } from "./layout.stores";

export default function Home() {
  const learnedLettersQuery = useLearnedLetters();
  useLearnedLettersSync();
  const { isAuthenticated } = useAuthStore();

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

        <div className="max-w-4xl mx-auto mb-8 px-8 py-6 md:py-4 lg:py-2">
          <div className="h-[32rem] md:h-[36rem] lg:h-64">
            <MorseTrainer />
          </div>
        </div>

        <LearnedLetters className="mb-8" isLoading={learnedLettersQuery.isPending} />

        {!isAuthenticated && <InlineSignUp className="mb-8" />}
      </section>
    </div>
  );
}
