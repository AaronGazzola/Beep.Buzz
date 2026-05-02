"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { UserCharacter } from "@/components/UserCharacter";
import { cn } from "@/lib/utils";
import { useMorseInput } from "@/lib/useMorseInput";
import { MORSE_TO_TEXT, SPEED_WPM } from "@/lib/morse.utils";
import { useGameStore } from "@/app/morse.stores";
import {
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  PLOP_AIRBORNE_MS,
  PLOP_ANTICIPATION_MS,
  PLOP_ARC_HEIGHT,
  PLOP_LANDING_MS,
  useGameWorldStore,
} from "@/app/page.stores";
import { SpeechBubble } from "./SpeechBubble";

export function Player() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = arcRef.current;
      if (el) {
        const { plop } = useGameWorldStore.getState();
        const t = plop.phase === "idle" ? 0 : performance.now() - plop.startedAt;
        const { arcY, rot } = computeArcAndRotation(plop.phase, t, plop.dir);
        el.style.transform = `translate3d(0, ${arcY}px, 0) rotate(${rot}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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
      <div
        ref={arcRef}
        className="absolute inset-0"
        style={{ willChange: "transform", transformOrigin: "50% 80%" }}
      >
        <PlayerCharacter />
      </div>
      <PlayerBubble />
    </div>
  );
}

function PlayerCharacter() {
  const facingRef = useRef<HTMLDivElement>(null);

  const morseSpeed = useGameStore((s) => s.morseSpeed);
  const ditDur = 1200 / SPEED_WPM[morseSpeed];
  const dotThreshold = ditDur * 2;
  const interCharGap = ditDur * 5;

  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (submitTimerRef.current) {
      clearTimeout(submitTimerRef.current);
      submitTimerRef.current = null;
    }
  }, []);

  const onSignal = useCallback(
    (signal: "." | "-") => {
      const state = useGameWorldStore.getState();
      if (state.plop.phase !== "idle") return;
      state.appendMorse(signal);
      clearTimer();
      submitTimerRef.current = setTimeout(() => {
        const latest = useGameWorldStore.getState();
        const buf = latest.morseBuffer;
        if (buf.length === 0) return;
        const decoded = MORSE_TO_TEXT[buf];
        const now = performance.now();
        if (decoded) {
          const next =
            now - latest.bubbleUpdatedAt > 2000 ? decoded : latest.bubbleText + decoded;
          latest.setBubbleText(next, now);
        }
        latest.resetMorseBuffer();
        submitTimerRef.current = null;
      }, interCharGap);
    },
    [clearTimer, interCharGap],
  );

  const morseEnabled = useGameWorldStore((s) => s.plop.phase === "idle");

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
      e.stopPropagation();
      if (!morseEnabled) return;
      begin();
    },
    [begin, morseEnabled],
  );

  const onRelease = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      end();
    },
    [end],
  );

  const onLeave = useCallback(() => {
    cancel();
  }, [cancel]);

  const getSquash = useMemo(
    () => () => {
      const { plop } = useGameWorldStore.getState();
      if (plop.phase === "idle") return { sx: 1, sy: 1 };
      const t = performance.now() - plop.startedAt;
      return computeSquash(plop.phase, t);
    },
    [],
  );

  return (
    <div
      ref={facingRef}
      onPointerDown={onPress}
      onPointerUp={onRelease}
      onPointerCancel={onLeave}
      onPointerLeave={onLeave}
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
        className="w-full h-full pointer-events-none"
        isSpeaking={isPressed}
        getSquash={getSquash}
      />
    </div>
  );
}

function PlayerBubble() {
  const text = useGameWorldStore((s) => s.bubbleText);
  const buffer = useGameWorldStore((s) => s.morseBuffer);
  const updatedAt = useGameWorldStore((s) => s.bubbleUpdatedAt);
  const clearBubble = useGameWorldStore((s) => s.clearBubble);

  useEffect(() => {
    if (!text || buffer.length > 0) return;
    const handle = setTimeout(() => {
      const latest = useGameWorldStore.getState();
      if (latest.morseBuffer.length > 0) return;
      if (latest.bubbleUpdatedAt !== updatedAt) return;
      clearBubble();
    }, 1500);
    return () => clearTimeout(handle);
  }, [text, buffer, updatedAt, clearBubble]);

  const display = buffer || text;
  if (!display) return null;

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
      style={{ bottom: PLAYER_HEIGHT + 12, zIndex: 6 }}
    >
      <SpeechBubble variant={buffer ? "challenge" : "hit"}>
        <span className="font-mono text-sm whitespace-pre">{display}</span>
      </SpeechBubble>
    </div>
  );
}

function computeArcAndRotation(
  phase: "idle" | "anticipation" | "airborne" | "landing",
  t: number,
  dir: -1 | 1,
) {
  if (phase === "idle") return { arcY: 0, rot: 0 };
  if (phase === "anticipation") return { arcY: 0, rot: 0 };
  if (phase === "airborne") {
    const elapsed = t - PLOP_ANTICIPATION_MS;
    const p = clamp01(elapsed / PLOP_AIRBORNE_MS);
    const arcY = -PLOP_ARC_HEIGHT * Math.sin(p * Math.PI);
    const rot = dir * 360 * p;
    return { arcY, rot };
  }
  return { arcY: 0, rot: dir * 360 };
}

function computeSquash(
  phase: "anticipation" | "airborne" | "landing",
  t: number,
) {
  if (phase === "anticipation") {
    const p = clamp01(t / PLOP_ANTICIPATION_MS);
    const e = easeOut(p);
    return { sx: lerp(1, 1.18, e), sy: lerp(1, 0.78, e) };
  }
  if (phase === "airborne") {
    const elapsed = t - PLOP_ANTICIPATION_MS;
    const p = clamp01(elapsed / PLOP_AIRBORNE_MS);
    const stretch = 1 - Math.abs(p * 2 - 1);
    return {
      sx: lerp(1, 0.85, stretch),
      sy: lerp(1, 1.25, stretch),
    };
  }
  const elapsed = t - PLOP_ANTICIPATION_MS - PLOP_AIRBORNE_MS;
  const p = clamp01(elapsed / PLOP_LANDING_MS);
  if (p < 0.4) {
    const k = p / 0.4;
    return { sx: lerp(1.0, 1.3, k), sy: lerp(1.0, 0.65, k) };
  }
  const k = (p - 0.4) / 0.6;
  return {
    sx: lerp(1.3, 1.0, easeOut(k)),
    sy: lerp(0.65, 1.0, easeOut(k)),
  };
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeOut(t: number) {
  return 1 - (1 - t) * (1 - t);
}

