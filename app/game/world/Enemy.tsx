"use client";

import { useEffect } from "react";
import { CustomCharacter } from "@/components/CustomCharacter";
import { MORSE_ALPHABET } from "@/lib/morse.utils";
import { cn } from "@/lib/utils";
import type { EnemyConfig } from "../page.types";
import { useGameWorldStore } from "../page.stores";
import { SpeechBubble } from "./SpeechBubble";

const ENEMY_WIDTH = 88;
const ENEMY_HEIGHT = 88;

interface EnemyProps {
  enemy: EnemyConfig;
}

export function Enemy({ enemy }: EnemyProps) {
  const state = useGameWorldStore((s) => s.enemies[enemy.id]);
  const nearbyId = useGameWorldStore((s) => s.nearbyEntityId);
  const activeChallenge = useGameWorldStore((s) => s.activeChallenge);
  const lastMorseResult = useGameWorldStore((s) => s.lastMorseResult);
  const morseBuffer = useGameWorldStore((s) => s.morseBuffer);
  const clearMorseResult = useGameWorldStore((s) => s.clearMorseResult);

  const isFocus = activeChallenge?.entityId === enemy.id;
  const isNearby = nearbyId === enemy.id;

  useEffect(() => {
    if (!isFocus || !lastMorseResult) return;
    const t = setTimeout(() => clearMorseResult(), 600);
    return () => clearTimeout(t);
  }, [lastMorseResult, isFocus, clearMorseResult]);

  if (!state || !state.alive) return null;

  const expectedMorse = MORSE_ALPHABET[enemy.challengeLetter.toUpperCase()] ?? "";
  const variant: "challenge" | "hit" | "miss" =
    isFocus && lastMorseResult === "hit"
      ? "hit"
      : isFocus && lastMorseResult === "miss"
        ? "miss"
        : "challenge";

  const showLetter = enemy.challengeMode !== "morse+audio";
  const showMorse = enemy.challengeMode === "morse+audio";

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: enemy.x - ENEMY_WIDTH / 2,
        top: enemy.y,
        width: ENEMY_WIDTH,
        height: ENEMY_HEIGHT,
      }}
    >
      <div
        className={cn(
          "absolute -top-20 left-1/2 -translate-x-1/2",
          isFocus && "scale-110 transition-transform"
        )}
      >
        <SpeechBubble variant={variant}>
          {showLetter && (
            <div className="text-2xl font-bold leading-none">{enemy.challengeLetter.toUpperCase()}</div>
          )}
          {showMorse && (
            <div className="font-mono text-2xl leading-none tracking-widest">{expectedMorse}</div>
          )}
          {isFocus && morseBuffer && (
            <div className="mt-1 text-xs font-mono text-slate-500">{morseBuffer}</div>
          )}
          <div className="mt-1 flex gap-0.5 justify-center">
            {Array.from({ length: enemy.hp }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "block w-2 h-2 rounded-full",
                  i < state.hp ? "bg-rose-500" : "bg-slate-300"
                )}
              />
            ))}
          </div>
        </SpeechBubble>
      </div>
      <CustomCharacter
        className={cn(
          "w-full h-full",
          isNearby && "drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]",
          lastMorseResult === "hit" && isFocus && "animate-pulse"
        )}
        color={enemy.color ?? "#ef4444"}
        numPoints={8}
        spikeyness={enemy.spikeyness ?? 60}
        eyeStyle={3}
        hat={0}
        glasses={0}
        makeup={0}
        shoes={0}
        isSpeaking={isFocus}
      />
    </div>
  );
}
