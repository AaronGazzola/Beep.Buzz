"use client";

import { useCallback, useEffect, useRef } from "react";
import { homeLevel } from "../levels/home";
import { useGameWorldStore, PLAYER_WIDTH } from "../page.stores";
import { useGameLoop } from "../engine/useGameLoop";
import { usePlayerMovement } from "../engine/usePlayerMovement";
import type { DoorState, EnemyState, EntityId } from "../page.types";
import { Platform } from "./Platform";
import { Player } from "./Player";
import { NPC } from "./NPC";
import { Enemy } from "./Enemy";
import { Door } from "./Door";
import { Chest } from "./Chest";
import { Signpost } from "./Signpost";
import { InteractButton } from "./InteractButton";
import { HUD } from "../hud/HUD";
import { TrainerModal } from "../hud/TrainerModal";
import { SignpostDialog } from "../hud/SignpostDialog";
import { DeathScreen } from "../hud/DeathScreen";

const CAMERA_LERP = 0.15;

export default function GameWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const cameraXRef = useRef(0);
  const viewportRef = useRef({ width: 0, height: 0 });

  const level = homeLevel;

  const trainerOpen = useGameWorldStore((s) => s.trainerOpen);
  const dialog = useGameWorldStore((s) => s.signpostDialog);
  const isAlive = useGameWorldStore((s) => s.isAlive);
  const initLevel = useGameWorldStore((s) => s.initLevel);
  const setTrainerOpen = useGameWorldStore((s) => s.setTrainerOpen);
  const setSignpostDialog = useGameWorldStore((s) => s.setSignpostDialog);
  const collectChest = useGameWorldStore((s) => s.collectChest);
  const nearbyId = useGameWorldStore((s) => s.nearbyEntityId);
  const nearbyKind = useGameWorldStore((s) => s.nearbyEntityKind);

  const { update, handleWorldClick } = usePlayerMovement(level);

  useEffect(() => {
    const enemies: Record<EntityId, EnemyState> = {};
    for (const e of level.enemies) {
      enemies[e.id] = { hp: e.hp, alive: true };
    }
    const doors: Record<EntityId, DoorState> = {};
    for (const d of level.doors) {
      doors[d.id] = { open: false };
    }
    const chests: Record<EntityId, boolean> = {};
    for (const c of level.chests) {
      chests[c.id] = false;
    }
    initLevel("home", level.playerStart, enemies, doors, chests);
  }, [initLevel, level]);

  useEffect(() => {
    const onResize = () => {
      if (!containerRef.current) return;
      viewportRef.current = {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      };
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useGameLoop(
    useCallback(
      (dt: number) => {
        update(dt);

        const playerPos = useGameWorldStore.getState().playerPos;
        const vw = viewportRef.current.width;
        if (vw === 0) return;

        const target = playerPos.x + PLAYER_WIDTH / 2 - vw / 2;
        const max = Math.max(0, level.width - vw);
        const clamped = Math.max(0, Math.min(target, max));
        cameraXRef.current += (clamped - cameraXRef.current) * CAMERA_LERP;

        if (worldRef.current) {
          worldRef.current.style.transform = `translate3d(${-cameraXRef.current}px, 0, 0)`;
        }
      },
      [update, level.width]
    ),
    !trainerOpen && !dialog && isAlive
  );

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (trainerOpen || dialog || !isAlive) return;
      const worldX = e.clientX + cameraXRef.current;
      handleWorldClick(worldX);
    },
    [handleWorldClick, trainerOpen, dialog, isAlive]
  );

  const onTouch = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (trainerOpen || dialog || !isAlive) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const worldX = t.clientX + cameraXRef.current;
      handleWorldClick(worldX);
    },
    [handleWorldClick, trainerOpen, dialog, isAlive]
  );

  const onInteract = useCallback(() => {
    if (!nearbyId || !nearbyKind) return;
    if (nearbyKind === "npc") {
      setTrainerOpen(true);
    } else if (nearbyKind === "signpost") {
      const sign = level.signposts.find((s) => s.id === nearbyId);
      if (sign) setSignpostDialog({ id: sign.id, text: sign.text });
    } else if (nearbyKind === "chest") {
      collectChest(nearbyId);
    }
  }, [nearbyId, nearbyKind, setTrainerOpen, setSignpostDialog, collectChest, level.signposts]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden touch-none select-none"
      style={{ background: level.background }}
      onClick={onClick}
      onTouchEnd={onTouch}
    >
      <div
        ref={worldRef}
        className="absolute top-0 left-0"
        style={{
          width: level.width,
          height: level.height,
          willChange: "transform",
        }}
      >
        {level.platforms.map((p) => (
          <Platform
            key={p.id}
            platform={p}
            isGround={p.id === "ground"}
            groundColor={level.groundColor}
            platformColor={level.platformColor}
          />
        ))}
        {level.signposts.map((s) => (
          <Signpost key={s.id} signpost={s} />
        ))}
        {level.doors.map((d) => (
          <Door key={d.id} door={d} />
        ))}
        {level.chests.map((c) => (
          <Chest key={c.id} chest={c} />
        ))}
        {level.npcs.map((n) => (
          <NPC key={n.id} npc={n} />
        ))}
        {level.enemies.map((e) => (
          <Enemy key={e.id} enemy={e} />
        ))}
        <Player />
        <InteractButton onInteract={onInteract} />
      </div>
      <HUD />
      <TrainerModal />
      <SignpostDialog />
      <DeathScreen />
    </div>
  );
}
