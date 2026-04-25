import { useCallback, useRef } from "react";
import { useGameWorldStore, PLAYER_WIDTH, PLAYER_HEIGHT, INTERACT_RADIUS } from "../page.stores";
import { clampToWorldBounds, resolveGroundCollision } from "./collision";
import { MORSE_ALPHABET } from "@/lib/morse.utils";
import type {
  LevelData,
  Position,
  ActiveChallenge,
  InteractableKind,
  EntityId,
} from "../page.types";

const GRAVITY = 1800;
const MOVE_SPEED = 280;
const ARRIVE_THRESHOLD = 6;
const TERMINAL_VELOCITY = 1400;
const DEATH_FLOOR_OFFSET = 240;

type InteractablePoint = {
  id: EntityId;
  kind: InteractableKind;
  x: number;
};

export function usePlayerMovement(level: LevelData) {
  const levelRef = useRef(level);
  levelRef.current = level;

  const update = useCallback((dt: number) => {
    const lvl = levelRef.current;
    const state = useGameWorldStore.getState();
    if (!state.isAlive) return;

    const { playerPos, playerVel, moveTarget, isGrounded, lastSafePos } = state;

    let vx = 0;
    let vy = playerVel.y;
    let px = playerPos.x;
    let py = playerPos.y;

    if (moveTarget !== null) {
      const centerX = px + PLAYER_WIDTH / 2;
      const dx = moveTarget - centerX;
      if (Math.abs(dx) < ARRIVE_THRESHOLD) {
        vx = 0;
        state.setMoveTarget(null);
      } else {
        const dir = Math.sign(dx) as 1 | -1;
        vx = dir * MOVE_SPEED;
        if (state.facing !== dir) state.setFacing(dir);
      }
    }

    vy = Math.min(vy + GRAVITY * dt, TERMINAL_VELOCITY);

    const nextX = px + vx * dt;
    const nextY = py + vy * dt;

    const clamped = clampToWorldBounds(nextX, vx, PLAYER_WIDTH, lvl.width);
    const collided = resolveGroundCollision(
      py,
      clamped.x,
      nextY,
      vy,
      PLAYER_WIDTH,
      PLAYER_HEIGHT,
      lvl.platforms
    );

    const resolvedX = clamped.x;
    const resolvedY = collided.y;
    const resolvedVX = clamped.vx;
    const resolvedVY = collided.vy;
    const grounded = collided.grounded;

    const deathFloor = lvl.height + DEATH_FLOOR_OFFSET;
    if (resolvedY > deathFloor) {
      state.loseHeart();
      const next = useGameWorldStore.getState();
      if (next.isAlive) {
        state.respawnAt(lastSafePos);
      }
      return;
    }

    state.setPlayerPos({ x: resolvedX, y: resolvedY });
    state.setPlayerVel({ x: resolvedVX, y: resolvedVY });

    if (grounded !== isGrounded) state.setGrounded(grounded);
    if (grounded) state.setLastSafePos({ x: resolvedX, y: resolvedY });

    const playerCx = resolvedX + PLAYER_WIDTH / 2;
    const interactables: InteractablePoint[] = [];

    for (const npc of lvl.npcs) {
      interactables.push({ id: npc.id, kind: "npc", x: npc.x });
    }
    for (const enemy of lvl.enemies) {
      const es = state.enemies[enemy.id];
      if (!es || !es.alive) continue;
      interactables.push({ id: enemy.id, kind: "enemy", x: enemy.x });
    }
    for (const door of lvl.doors) {
      const ds = state.doors[door.id];
      if (ds?.open) continue;
      interactables.push({ id: door.id, kind: "door", x: door.x });
    }
    for (const chest of lvl.chests) {
      if (state.chests[chest.id]) continue;
      interactables.push({ id: chest.id, kind: "chest", x: chest.x });
    }
    for (const sign of lvl.signposts) {
      interactables.push({ id: sign.id, kind: "signpost", x: sign.x });
    }

    let nearestId: EntityId | null = null;
    let nearestKind: InteractableKind | null = null;
    let nearestDist = INTERACT_RADIUS;

    for (const p of interactables) {
      const d = Math.abs(p.x - playerCx);
      if (d < nearestDist) {
        nearestDist = d;
        nearestId = p.id;
        nearestKind = p.kind;
      }
    }

    state.setNearby(nearestId, nearestKind);

    let challenge: ActiveChallenge | null = null;
    if (nearestKind === "enemy" && nearestId) {
      const enemy = lvl.enemies.find((e) => e.id === nearestId);
      if (enemy) {
        const es = state.enemies[enemy.id];
        if (es?.alive) {
          challenge = {
            kind: "enemy",
            entityId: enemy.id,
            expectedMorse: MORSE_ALPHABET[enemy.challengeLetter.toUpperCase()] ?? "",
            expectedLetter: enemy.challengeLetter.toUpperCase(),
            challengeMode: enemy.challengeMode,
          };
        }
      }
    } else if (nearestKind === "door" && nearestId) {
      const door = lvl.doors.find((d) => d.id === nearestId);
      if (door) {
        const ds = state.doors[door.id];
        if (!ds?.open) {
          challenge = {
            kind: "door",
            entityId: door.id,
            expectedMorse: MORSE_ALPHABET[door.challengeLetter.toUpperCase()] ?? "",
            expectedLetter: door.challengeLetter.toUpperCase(),
            challengeMode: door.challengeMode,
          };
        }
      }
    }

    state.setActiveChallenge(challenge);
  }, []);

  const handleWorldClick = useCallback((worldX: number) => {
    const lvl = levelRef.current;
    const clamped = Math.max(0, Math.min(worldX, lvl.width));
    useGameWorldStore.getState().setMoveTarget(clamped);
  }, []);

  const teleport = useCallback((pos: Position) => {
    useGameWorldStore.getState().respawnAt(pos);
  }, []);

  return { update, handleWorldClick, teleport };
}
