"use client";

import { useCallback, useEffect, useRef } from "react";
import { UserCharacter } from "@/components/UserCharacter";
import { cn } from "@/lib/utils";
import { useMorseInput } from "@/lib/useMorseInput";
import { SPEED_WPM } from "@/lib/morse.utils";
import { useGameStore } from "@/app/morse.stores";
import {
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  useGameWorldStore,
} from "@/app/page.stores";

interface PlayerProps {
  onSubmit: (cellId: string, buffer: string) => void;
}

export function Player({ onSubmit }: PlayerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const { x, y } = useGameWorldStore.getState().playerPos;
      el.style.transform = `translate3d(${x}px, ${y - PLAYER_HEIGHT}px, 0)`;
    };
    apply();
    const unsubscribe = useGameWorldStore.subscribe(apply);
    return unsubscribe;
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute top-0 left-0"
      style={{
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        zIndex: 5,
        willChange: "transform",
      }}
    >
      <PlayerCharacter onSubmit={onSubmit} />
    </div>
  );
}

function PlayerCharacter({ onSubmit }: { onSubmit: (cellId: string, buffer: string) => void }) {
  const facingRef = useRef<HTMLDivElement>(null);
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const morseSpeed = useGameStore((s) => s.morseSpeed);
  const targetCellId = useGameWorldStore((s) => s.targetCellId);
  const targetCell = useGameWorldStore((s) =>
    s.targetCellId ? s.cells[s.targetCellId] : null,
  );

  const morseEnabled =
    targetCellId !== null && targetCell !== null && targetCell.status === "dormant";
  const ditDur = 1200 / SPEED_WPM[morseSpeed];
  const dotThreshold = ditDur * 2;
  const interCharGap = ditDur * 5;

  const clearTimer = useCallback(() => {
    if (submitTimerRef.current) {
      clearTimeout(submitTimerRef.current);
      submitTimerRef.current = null;
    }
  }, []);

  const onSignal = useCallback(
    (signal: "." | "-") => {
      const state = useGameWorldStore.getState();
      const cellId = state.targetCellId;
      if (!cellId) return;
      const cell = state.cells[cellId];
      if (!cell || cell.status !== "dormant") return;

      state.appendInput(cellId, signal);
      clearTimer();
      submitTimerRef.current = setTimeout(() => {
        const latest = useGameWorldStore.getState();
        const latestId = latest.targetCellId;
        if (!latestId) return;
        const buf = latest.cells[latestId]?.inputBuffer ?? "";
        if (buf.length > 0) onSubmit(latestId, buf);
        submitTimerRef.current = null;
      }, interCharGap);
    },
    [clearTimer, interCharGap, onSubmit],
  );

  const { begin, end, cancel, isPressed } = useMorseInput({
    enabled: morseEnabled,
    onSignal,
    dotThresholdMs: dotThreshold,
  });

  useEffect(() => () => clearTimer(), [clearTimer]);

  useEffect(() => {
    const apply = () => {
      const el = facingRef.current;
      if (!el) return;
      const { facing } = useGameWorldStore.getState();
      el.style.transform = `scaleX(${facing})`;
    };
    apply();
    const unsubscribe = useGameWorldStore.subscribe(apply);
    return unsubscribe;
  }, []);

  const onPress = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!morseEnabled) return;
      begin();
    },
    [begin, morseEnabled],
  );

  const onRelease = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      end();
    },
    [end],
  );

  const onLeave = useCallback(() => {
    cancel();
  }, [cancel]);

  return (
    <div
      ref={facingRef}
      onPointerDown={onPress}
      onPointerUp={onRelease}
      onPointerCancel={onLeave}
      onPointerLeave={onLeave}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "absolute inset-0 select-none touch-none",
        morseEnabled ? "cursor-pointer" : "cursor-default",
      )}
      style={{
        pointerEvents: "auto",
        transformOrigin: "center",
      }}
    >
      <UserCharacter
        className={cn(
          "w-full h-full pointer-events-none transition-transform",
          isPressed && "scale-110",
        )}
        isSpeaking={isPressed}
      />
    </div>
  );
}
