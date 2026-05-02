import { useCallback, useLayoutEffect, useRef } from "react";
import {
  PLAYER_WIDTH,
  PLOP_AIRBORNE_MS,
  PLOP_ANTICIPATION_MS,
  PLOP_DISTANCE,
  PLOP_LANDING_MS,
  PLOP_TOTAL_MS,
  useGameWorldStore,
} from "@/app/page.stores";
import type { LevelData } from "@/app/page.types";

export function usePlop(level: LevelData) {
  const levelRef = useRef(level);

  useLayoutEffect(() => {
    levelRef.current = level;
  });

  const tryStart = useCallback((now: number, dir: -1 | 1) => {
    const lvl = levelRef.current;
    const state = useGameWorldStore.getState();
    if (state.plop.phase !== "idle") return;
    const fromX = state.playerPos.x;
    const maxX = lvl.width - PLAYER_WIDTH;
    const rawTo = fromX + dir * PLOP_DISTANCE;
    const toX = Math.max(0, Math.min(rawTo, maxX));
    if (toX === fromX) return;
    state.startPlop(dir, fromX, toX, now);
  }, []);

  const update = useCallback((nowMs: number) => {
    const state = useGameWorldStore.getState();
    const { plop, keyDir } = state;

    if (plop.phase === "idle") {
      if (keyDir !== 0) tryStart(nowMs, keyDir);
      return;
    }

    const elapsed = nowMs - plop.startedAt;

    if (plop.phase === "anticipation") {
      if (elapsed >= PLOP_ANTICIPATION_MS) {
        state.setPlopPhase("airborne");
      }
      return;
    }

    if (plop.phase === "airborne") {
      const airborneElapsed = elapsed - PLOP_ANTICIPATION_MS;
      const t = Math.max(0, Math.min(1, airborneElapsed / PLOP_AIRBORNE_MS));
      const x = plop.fromX + (plop.toX - plop.fromX) * t;
      state.setPlayerPos({ x, y: state.playerPos.y });
      if (airborneElapsed >= PLOP_AIRBORNE_MS) {
        state.setPlayerPos({ x: plop.toX, y: state.playerPos.y });
        state.setPlopPhase("landing");
      }
      return;
    }

    if (plop.phase === "landing") {
      if (elapsed >= PLOP_TOTAL_MS) {
        state.endPlop();
        if (keyDir !== 0) tryStart(nowMs, keyDir);
      }
      return;
    }
  }, [tryStart]);

  return { update };
}

export function plopProgress(
  phase: "idle" | "anticipation" | "airborne" | "landing",
  startedAt: number,
  nowMs: number,
) {
  if (phase === "idle") return { phase: "idle" as const, t: 0 };
  const elapsed = nowMs - startedAt;
  if (phase === "anticipation") {
    return {
      phase: "anticipation" as const,
      t: Math.max(0, Math.min(1, elapsed / PLOP_ANTICIPATION_MS)),
    };
  }
  if (phase === "airborne") {
    const t = (elapsed - PLOP_ANTICIPATION_MS) / PLOP_AIRBORNE_MS;
    return { phase: "airborne" as const, t: Math.max(0, Math.min(1, t)) };
  }
  const t =
    (elapsed - PLOP_ANTICIPATION_MS - PLOP_AIRBORNE_MS) / PLOP_LANDING_MS;
  return { phase: "landing" as const, t: Math.max(0, Math.min(1, t)) };
}
