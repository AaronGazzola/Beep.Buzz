import { create } from "zustand";
import type { LevelData, PlopPhase, PlopState, Position } from "./page.types";

export const PLAYER_WIDTH = 80;
export const PLAYER_HEIGHT = 96;

export const PLOP_DISTANCE = 90;
export const PLOP_ARC_HEIGHT = 70;
export const PLOP_ANTICIPATION_MS = 100;
export const PLOP_AIRBORNE_MS = 380;
export const PLOP_LANDING_MS = 110;
export const PLOP_TOTAL_MS =
  PLOP_ANTICIPATION_MS + PLOP_AIRBORNE_MS + PLOP_LANDING_MS;

export const BUBBLE_FADE_MS = 1500;

interface GameWorldStore {
  level: LevelData | null;
  playerPos: Position;
  facing: 1 | -1;
  keyDir: -1 | 0 | 1;
  plop: PlopState;
  morseBuffer: string;
  bubbleText: string;
  bubbleUpdatedAt: number;
  initLevel: (level: LevelData) => void;
  setPlayerPos: (pos: Position) => void;
  setFacing: (facing: 1 | -1) => void;
  setKeyDir: (dir: -1 | 0 | 1) => void;
  startPlop: (dir: -1 | 1, fromX: number, toX: number, now: number) => void;
  setPlopPhase: (phase: PlopPhase) => void;
  endPlop: () => void;
  appendMorse: (signal: "." | "-") => void;
  resetMorseBuffer: () => void;
  setBubbleText: (text: string, now: number) => void;
  clearBubble: () => void;
}

const IDLE_PLOP: PlopState = {
  phase: "idle",
  startedAt: 0,
  fromX: 0,
  toX: 0,
  dir: 1,
};

const INITIAL_PLAYER_POS: Position = { x: 0, y: 0 };

export const useGameWorldStore = create<GameWorldStore>((set) => ({
  level: null,
  playerPos: INITIAL_PLAYER_POS,
  facing: 1,
  keyDir: 0,
  plop: IDLE_PLOP,
  morseBuffer: "",
  bubbleText: "",
  bubbleUpdatedAt: 0,

  initLevel: (level) =>
    set({
      level,
      playerPos: level.playerStart,
      facing: 1,
      keyDir: 0,
      plop: IDLE_PLOP,
      morseBuffer: "",
      bubbleText: "",
      bubbleUpdatedAt: 0,
    }),

  setPlayerPos: (playerPos) => set({ playerPos }),
  setFacing: (facing) => set({ facing }),
  setKeyDir: (keyDir) => set({ keyDir }),

  startPlop: (dir, fromX, toX, now) =>
    set({
      facing: dir,
      plop: { phase: "anticipation", startedAt: now, fromX, toX, dir },
      morseBuffer: "",
    }),

  setPlopPhase: (phase) =>
    set((state) => ({ plop: { ...state.plop, phase } })),

  endPlop: () => set({ plop: IDLE_PLOP }),

  appendMorse: (signal) =>
    set((state) => ({ morseBuffer: state.morseBuffer + signal })),

  resetMorseBuffer: () => set({ morseBuffer: "" }),

  setBubbleText: (bubbleText, bubbleUpdatedAt) =>
    set({ bubbleText, bubbleUpdatedAt }),

  clearBubble: () => set({ bubbleText: "", bubbleUpdatedAt: 0 }),
}));
