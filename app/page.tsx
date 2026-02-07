"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { MorseTrainer } from "@/components/MorseTrainer";
import { InlineSignUp } from "@/components/InlineSignUp";
import { LearnedLetters } from "@/components/LearnedLetters";
import { useLearnedLetters, useLearnedLettersSync } from "./page.hooks";

export default function Home() {
  useLearnedLetters();
  useLearnedLettersSync();
  const modes = [
    {
      icon: Trophy,
      title: "Compete",
      description: "Real-time matches against other players to test your mastery",
      href: "/compete",
      color: "text-purple-500",
    },
  ];

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

        <LearnedLetters className="mb-8" />

        <InlineSignUp className="mb-8" />

        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Choose Your Learning Path</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Link key={mode.href} href={mode.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <Icon className={`h-12 w-12 mb-2 ${mode.color}`} />
                    <CardTitle>{mode.title}</CardTitle>
                    <CardDescription>{mode.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full">
                      Start Learning →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
