"use client";

import { MORSE_ALPHABET } from "@/lib/morse.utils";
import { cn } from "@/lib/utils";
import type { DoorConfig } from "../page.types";
import { useGameWorldStore } from "../page.stores";
import { SpeechBubble } from "./SpeechBubble";

interface DoorProps {
  door: DoorConfig;
}

export function Door({ door }: DoorProps) {
  const state = useGameWorldStore((s) => s.doors[door.id]);
  const activeChallenge = useGameWorldStore((s) => s.activeChallenge);
  const morseBuffer = useGameWorldStore((s) => s.morseBuffer);

  const isOpen = state?.open ?? false;
  const isFocus = activeChallenge?.entityId === door.id;
  const expectedMorse = MORSE_ALPHABET[door.challengeLetter.toUpperCase()] ?? "";

  const showLetter = door.challengeMode !== "morse+audio";
  const showMorse = door.challengeMode === "morse+audio";

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: door.x - door.width / 2,
        top: door.y,
        width: door.width,
        height: door.height,
      }}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-t-3xl border-4 transition-transform origin-bottom",
          isOpen ? "scale-y-0 opacity-30" : "scale-y-100"
        )}
        style={{
          background: "linear-gradient(180deg, #6b3f1d 0%, #8c5a2e 60%, #5a3216 100%)",
          borderColor: "#3a1f0c",
          boxShadow: "inset 0 4px 0 rgba(255,255,255,0.18), 0 4px 8px rgba(0,0,0,0.25)",
        }}
      >
        <div
          aria-hidden
          className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-yellow-400 border border-yellow-700"
        />
      </div>
      {!isOpen && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2">
          <SpeechBubble variant={isFocus ? "challenge" : "default"}>
            {showLetter && (
              <div className="text-2xl font-bold leading-none">{door.challengeLetter.toUpperCase()}</div>
            )}
            {showMorse && (
              <div className="font-mono text-2xl leading-none tracking-widest">{expectedMorse}</div>
            )}
            {isFocus && morseBuffer && (
              <div className="mt-1 text-xs font-mono text-slate-500">{morseBuffer}</div>
            )}
          </SpeechBubble>
        </div>
      )}
    </div>
  );
}
