"use client";

import { useGameStore } from "@/app/page.stores";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Gauge, Info, Volume2 } from "lucide-react";
import type { MorseSpeed } from "@/app/page.types";

const speedSteps: MorseSpeed[] = ["slow", "medium", "fast", "fastest"];

const speedLabels: Record<MorseSpeed, string> = {
  slow: "Slow",
  medium: "Medium",
  fast: "Fast",
  fastest: "Fastest",
};

export function ChatControls() {
  const { morseSpeed, setMorseSpeed, morseVolume, setMorseVolume } = useGameStore();

  return (
    <div data-testid="chat-controls" className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <button className="bg-muted rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Gauge className="w-5 h-5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-52" align="end">
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
      <Popover>
        <PopoverTrigger asChild>
          <button className="bg-muted rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Morse Code Input Guide</h4>
            <p className="text-sm text-muted-foreground">
              Click/Tap anywhere or hit space bar to tap Morse code
            </p>
            <div className="space-y-1 pt-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">3 dit lengths</span> = space between characters in words
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">7 dit lengths</span> = space between words
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">14 dit lengths</span> = end of message
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">8 consecutive dits (........)</span> = error signal, clears your message
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
