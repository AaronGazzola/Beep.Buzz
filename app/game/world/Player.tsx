"use client";

import { useCallback } from "react";
import { UserCharacter } from "@/components/UserCharacter";
import { cn } from "@/lib/utils";
import { useMorseInput } from "@/lib/useMorseInput";
import { useGameWorldStore, PLAYER_WIDTH, PLAYER_HEIGHT } from "../page.stores";

export function Player() {
  const playerPos = useGameWorldStore((s) => s.playerPos);
  const facing = useGameWorldStore((s) => s.facing);
  const moveTarget = useGameWorldStore((s) => s.moveTarget);
  const isGrounded = useGameWorldStore((s) => s.isGrounded);
  const activeChallenge = useGameWorldStore((s) => s.activeChallenge);
  const trainerOpen = useGameWorldStore((s) => s.trainerOpen);
  const dialog = useGameWorldStore((s) => s.signpostDialog);
  const appendMorse = useGameWorldStore((s) => s.appendMorse);

  const morseEnabled = !!activeChallenge && !trainerOpen && !dialog;

  const { begin, end, cancel, isPressed } = useMorseInput({
    enabled: morseEnabled,
    onSignal: appendMorse,
  });

  const moving = moveTarget !== null && isGrounded;

  const onPress = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!morseEnabled) return;
      begin();
    },
    [begin, morseEnabled]
  );

  const onRelease = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      end();
    },
    [end]
  );

  const onLeave = useCallback(() => {
    cancel();
  }, [cancel]);

  return (
    <div
      className="absolute"
      style={{
        left: playerPos.x,
        top: playerPos.y,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        willChange: "left, top",
        zIndex: 5,
      }}
    >
      <div
        onPointerDown={onPress}
        onPointerUp={onRelease}
        onPointerCancel={onLeave}
        onPointerLeave={onLeave}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute inset-0 select-none touch-none",
          morseEnabled ? "cursor-pointer" : "cursor-default"
        )}
        style={{
          pointerEvents: "auto",
          transform: `scaleX(${facing})`,
          transformOrigin: "center",
        }}
      >
        <UserCharacter
          className={cn(
            "w-full h-full pointer-events-none transition-transform",
            moving && "animate-pulse",
            isPressed && "scale-110"
          )}
          isSpeaking={isPressed}
        />
      </div>
      {morseEnabled && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap text-[10px] uppercase tracking-wider font-bold rounded-full px-2 py-0.5 bg-yellow-300 text-yellow-900 border border-yellow-500 shadow">
          tap me · morse
        </div>
      )}
    </div>
  );
}
