"use client";

import { useAuthStore } from "@/app/layout.stores";
import { useGameStore } from "@/app/page.stores";
import { MorseChatAI } from "@/components/MorseChatAI";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bike, Info, MessagesSquare, Rabbit, Rocket, Turtle } from "lucide-react";
import Link from "next/link";
import type { MorseSpeed } from "@/app/page.types";

const speedCycle: MorseSpeed[] = ["slow", "medium", "fast", "fastest"];

const speedIcons: Record<MorseSpeed, typeof Turtle> = {
  slow: Turtle,
  medium: Rabbit,
  fast: Bike,
  fastest: Rocket,
};

export default function ChatPage() {
  const { isAuthenticated } = useAuthStore();
  const { morseSpeed, setMorseSpeed } = useGameStore();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <MessagesSquare className="h-12 w-12 text-muted-foreground" />
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Sign in to tap Morse code with other users
          </p>
          <Button asChild size="sm">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    );
  }

  const SpeedIcon = speedIcons[morseSpeed];

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex items-center justify-between border-b px-4 py-2 shrink-0">
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
                Click/Tap anywhere or hit space bar to tap Morse code
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
      </div>
      <MorseChatAI key="chatAI" />
    </div>
  );
}
