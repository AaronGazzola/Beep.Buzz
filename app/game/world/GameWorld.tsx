"use client";

import { useCallback, useEffect, useRef } from "react";
import { homeLevel } from "../levels/home";
import {
  ALIGNMENT_CONFIG,
  PLAYER_WIDTH,
  useGameWorldStore,
} from "@/app/page.stores";
import { useGameLoop } from "../engine/useGameLoop";
import { usePlayerMovement } from "../engine/usePlayerMovement";
import { Cell } from "./Cell";
import { Player } from "./Player";
import { HUD } from "../hud/HUD";

const CAMERA_LERP = 0.12;
const HORIZON_HEIGHT = 200;

export default function GameWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const cameraXRef = useRef(0);
  const viewportRef = useRef({ width: 0, height: 0 });

  const level = homeLevel;

  const initLevel = useGameWorldStore((s) => s.initLevel);

  const { update, handleWorldClick } = usePlayerMovement(level);

  useEffect(() => {
    initLevel(level);
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (e.repeat) return;
      const state = useGameWorldStore.getState();
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        state.setMoveTarget(null);
        state.setKeyDir(-1);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        state.setMoveTarget(null);
        state.setKeyDir(1);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const state = useGameWorldStore.getState();
      if (
        e.key === "ArrowLeft" ||
        e.key === "a" ||
        e.key === "A" ||
        e.key === "ArrowRight" ||
        e.key === "d" ||
        e.key === "D"
      ) {
        state.setKeyDir(0);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const handleSubmit = useCallback((cellId: string, buffer: string) => {
    const state = useGameWorldStore.getState();
    const lvl = state.level;
    if (!lvl) return;
    const cell = lvl.cells.find((c) => c.id === cellId);
    if (!cell) return;
    const runtime = state.cells[cellId];
    if (!runtime || runtime.status !== "dormant") return;

    if (buffer === cell.prompt) {
      state.setCellStatus(cellId, "activating");
      const cfg = ALIGNMENT_CONFIG[cell.align];
      state.addCurrencies({ beep: cfg.burstBeep, buzz: cfg.burstBuzz });
      state.pushBurst({ beep: cfg.burstBeep, buzz: cfg.burstBuzz });
      setTimeout(() => {
        useGameWorldStore.getState().setCellStatus(cellId, "active");
      }, 600);
    } else {
      state.shakeCell(cellId);
    }
  }, []);

  useGameLoop(
    useCallback(
      (dt: number) => {
        update(dt);

        const state = useGameWorldStore.getState();
        const lvl = state.level;
        if (!lvl) return;

        let trickleBeep = 0;
        let trickleBuzz = 0;
        for (const cell of lvl.cells) {
          const runtime = state.cells[cell.id];
          if (!runtime || runtime.status !== "active") continue;
          const cfg = ALIGNMENT_CONFIG[cell.align];
          trickleBeep += cfg.trickleBeep;
          trickleBuzz += cfg.trickleBuzz;
        }
        if (trickleBeep > 0 || trickleBuzz > 0) {
          state.addCurrencies({ beep: trickleBeep * dt, buzz: trickleBuzz * dt });
        }

        const playerPos = state.playerPos;
        const vw = viewportRef.current.width;
        if (vw === 0) return;

        const target = playerPos.x + PLAYER_WIDTH / 2 - vw / 2;
        const max = Math.max(0, lvl.width - vw);
        const clamped = Math.max(0, Math.min(target, max));
        cameraXRef.current += (clamped - cameraXRef.current) * CAMERA_LERP;

        if (worldRef.current) {
          worldRef.current.style.transform = `translate3d(${-cameraXRef.current}px, 0, 0)`;
        }
      },
      [update],
    ),
    true,
  );

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-player]")) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const worldX = e.clientX - rect.left + cameraXRef.current;
      handleWorldClick(worldX);
    },
    [handleWorldClick],
  );

  const groundHeight = 64;
  const skyHeight = level.groundY - HORIZON_HEIGHT;

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden touch-none select-none"
      style={{ background: level.background, minHeight: "calc(100vh - 64px)" }}
      onClick={onClick}
    >
      <div
        ref={worldRef}
        className="absolute bottom-0 left-0"
        style={{
          width: level.width,
          height: level.height,
          willChange: "transform",
        }}
      >
        <div
          className="absolute left-0"
          style={{
            top: skyHeight,
            width: level.width,
            height: HORIZON_HEIGHT,
            background:
              "linear-gradient(180deg, rgba(122,165,100,0.0) 0%, rgba(122,165,100,0.35) 70%, rgba(122,165,100,0.6) 100%)",
          }}
        />
        <div
          className="absolute left-0"
          style={{
            top: level.groundY,
            width: level.width,
            height: groundHeight,
            background: level.groundColor,
            boxShadow: "inset 0 6px 0 rgba(0,0,0,0.06)",
          }}
        />
        <div
          className="absolute left-0"
          style={{
            top: level.groundY + groundHeight,
            width: level.width,
            height: 9999,
            background: "#5e8a4e",
          }}
        />

        {level.cells.map((cell) => (
          <Cell key={cell.id} cell={cell} groundY={level.groundY} />
        ))}

        <div data-player className="absolute inset-0 pointer-events-none">
          <Player onSubmit={handleSubmit} />
        </div>
      </div>
      <HUD />
    </div>
  );
}
