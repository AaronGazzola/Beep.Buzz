"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Zap, Trophy } from "lucide-react";
import { MorseTrainer } from "@/components/MorseTrainer";

export default function Home() {
  const modes = [
    {
      icon: BookOpen,
      title: "Training Mode",
      description: "Guided lessons with Beep and Buzz to learn Morse code fundamentals",
      href: "/training",
      color: "text-blue-500",
    },
    {
      icon: Zap,
      title: "Practice Mode",
      description: "Self-paced challenges to sharpen your translation skills",
      href: "/practice",
      color: "text-yellow-500",
    },
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

        <Card className="max-w-3xl mx-auto mb-8">
          <CardHeader>
            <CardTitle>Try It Out</CardTitle>
            <CardDescription>Learn Morse code with Beep and Buzz</CardDescription>
          </CardHeader>
          <CardContent>
            <MorseTrainer />
          </CardContent>
        </Card>

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
