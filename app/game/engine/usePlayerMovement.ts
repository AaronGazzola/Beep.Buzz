import { useCallback, useLayoutEffect, useRef } from "react";
import {
  ARRIVE_THRESHOLD,
  PLAYER_SPEED,
  PLAYER_WIDTH,
  PROXIMITY_RADIUS,
  useGameWorldStore,
} from "@/app/page.stores";
import type { LevelData } from "@/app/page.types";
import { findNearestCell } from "./proximity";

export function usePlayerMovement(level: LevelData) {
  const levelRef = useRef(level);

  useLayoutEffect(() => {
    levelRef.current = level;
  });

  const update = useCallback((dt: number) => {
    const lvl = levelRef.current;
    const state = useGameWorldStore.getState();
    const { playerPos, moveTarget, keyDir, facing } = state;

    let vx = 0;
    if (keyDir !== 0) {
      vx = keyDir * PLAYER_SPEED;
    } else if (moveTarget !== null) {
      const centerX = playerPos.x + PLAYER_WIDTH / 2;
      const dx = moveTarget - centerX;
      if (Math.abs(dx) < ARRIVE_THRESHOLD) {
        state.setMoveTarget(null);
        vx = 0;
      } else {
        vx = Math.sign(dx) * PLAYER_SPEED;
      }
    }

    if (vx !== 0) {
      const dir = vx > 0 ? 1 : -1;
      if (facing !== dir) state.setFacing(dir);
    }

    const nextX = Math.max(0, Math.min(playerPos.x + vx * dt, lvl.width - PLAYER_WIDTH));
    if (nextX !== playerPos.x) {
      state.setPlayerPos({ x: nextX, y: playerPos.y });
    }

    const playerCx = nextX + PLAYER_WIDTH / 2;
    const nearestId = findNearestCell(playerCx, lvl.cells, PROXIMITY_RADIUS);
    if (nearestId !== state.targetCellId) {
      state.setTargetCell(nearestId);
    }
  }, []);

  const handleWorldClick = useCallback((worldX: number) => {
    const lvl = levelRef.current;
    const clamped = Math.max(0, Math.min(worldX, lvl.width));
    const state = useGameWorldStore.getState();
    state.setKeyDir(0);
    state.setMoveTarget(clamped);
  }, []);

  return { update, handleWorldClick };
}
