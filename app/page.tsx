"use client";

import Link from "next/link";
import { useMorseDemo } from "./page.hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, BookOpen, Zap, Trophy } from "lucide-react";
import { MorseCharacters } from "@/components/MorseCharacters";

export default function Home() {
  const { inputText, morseCode, isPlaying, handleTextChange, handlePlayAudio } = useMorseDemo();

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

        <MorseCharacters className="mb-12" />

        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle>Try It Out</CardTitle>
            <CardDescription>Type some text and see it converted to Morse code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => handleTextChange(e.target.value)}
              className="text-lg"
            />
            {morseCode && (
              <div className="space-y-2">
                <div className="font-mono text-2xl p-4 bg-muted rounded-lg break-all">
                  {morseCode}
                </div>
                <Button
                  onClick={handlePlayAudio}
                  disabled={isPlaying}
                  variant="outline"
                  className="w-full"
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  {isPlaying ? "Playing..." : "Play Audio"}
                </Button>
              </div>
            )}
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
