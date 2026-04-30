import { create } from "zustand";
import { ALIGNMENT_CONFIG } from "./page.types";
import type {
  CellRuntimeState,
  CellStatus,
  Currencies,
  LevelData,
  Position,
} from "./page.types";

export const PLAYER_WIDTH = 80;
export const PLAYER_HEIGHT = 96;
export const PROXIMITY_RADIUS = 120;
export const PLAYER_SPEED = 280;
export const ARRIVE_THRESHOLD = 6;

export type CurrencyBurst = {
  id: string;
  beep: number;
  buzz: number;
};

interface GameWorldStore {
  level: LevelData | null;
  playerPos: Position;
  facing: 1 | -1;
  moveTarget: number | null;
  keyDir: -1 | 0 | 1;
  cells: Record<string, CellRuntimeState>;
  currencies: Currencies;
  currencyBursts: CurrencyBurst[];
  targetCellId: string | null;
  initLevel: (level: LevelData) => void;
  setPlayerPos: (pos: Position) => void;
  setFacing: (facing: 1 | -1) => void;
  setMoveTarget: (x: number | null) => void;
  setKeyDir: (dir: -1 | 0 | 1) => void;
  setTargetCell: (id: string | null) => void;
  appendInput: (cellId: string, signal: "." | "-") => void;
  clearInput: (cellId: string) => void;
  shakeCell: (cellId: string) => void;
  setCellStatus: (cellId: string, status: CellStatus) => void;
  addCurrencies: (delta: { beep?: number; buzz?: number }) => void;
  pushBurst: (burst: Omit<CurrencyBurst, "id">) => void;
  consumeBurst: (id: string) => void;
}

const INITIAL_PLAYER_POS: Position = { x: 0, y: 0 };

export const useGameWorldStore = create<GameWorldStore>((set) => ({
  level: null,
  playerPos: INITIAL_PLAYER_POS,
  facing: 1,
  moveTarget: null,
  keyDir: 0,
  cells: {},
  currencies: { beep: 0, buzz: 0 },
  currencyBursts: [],
  targetCellId: null,

  initLevel: (level) => {
    const cells: Record<string, CellRuntimeState> = {};
    for (const cell of level.cells) {
      cells[cell.id] = {
        status: "dormant",
        inputBuffer: "",
        shake: 0,
        activatedAt: null,
      };
    }
    set({
      level,
      playerPos: level.playerStart,
      facing: 1,
      moveTarget: null,
      keyDir: 0,
      cells,
      currencies: { beep: 0, buzz: 0 },
      currencyBursts: [],
      targetCellId: null,
    });
  },

  setPlayerPos: (playerPos) => set({ playerPos }),
  setFacing: (facing) => set({ facing }),
  setMoveTarget: (moveTarget) => set({ moveTarget }),
  setKeyDir: (keyDir) => set({ keyDir }),
  setTargetCell: (targetCellId) =>
    set((state) => {
      if (state.targetCellId === targetCellId) return state;
      const next: Partial<GameWorldStore> = { targetCellId };
      if (state.targetCellId && state.cells[state.targetCellId]) {
        next.cells = {
          ...state.cells,
          [state.targetCellId]: { ...state.cells[state.targetCellId], inputBuffer: "" },
        };
      }
      return next as GameWorldStore;
    }),

  appendInput: (cellId, signal) =>
    set((state) => {
      const cell = state.cells[cellId];
      if (!cell || cell.status !== "dormant") return state;
      return {
        cells: {
          ...state.cells,
          [cellId]: { ...cell, inputBuffer: cell.inputBuffer + signal },
        },
      };
    }),

  clearInput: (cellId) =>
    set((state) => {
      const cell = state.cells[cellId];
      if (!cell) return state;
      return {
        cells: { ...state.cells, [cellId]: { ...cell, inputBuffer: "" } },
      };
    }),

  shakeCell: (cellId) =>
    set((state) => {
      const cell = state.cells[cellId];
      if (!cell) return state;
      return {
        cells: { ...state.cells, [cellId]: { ...cell, shake: cell.shake + 1, inputBuffer: "" } },
      };
    }),

  setCellStatus: (cellId, status) =>
    set((state) => {
      const cell = state.cells[cellId];
      if (!cell) return state;
      return {
        cells: {
          ...state.cells,
          [cellId]: {
            ...cell,
            status,
            activatedAt: status === "active" && cell.activatedAt === null ? performance.now() : cell.activatedAt,
            inputBuffer: status === "dormant" ? cell.inputBuffer : "",
          },
        },
      };
    }),

  addCurrencies: (delta) =>
    set((state) => ({
      currencies: {
        beep: state.currencies.beep + (delta.beep ?? 0),
        buzz: state.currencies.buzz + (delta.buzz ?? 0),
      },
    })),

  pushBurst: (burst) =>
    set((state) => ({
      currencyBursts: [
        ...state.currencyBursts,
        { id: `${performance.now()}-${Math.random().toString(36).slice(2, 6)}`, ...burst },
      ],
    })),

  consumeBurst: (id) =>
    set((state) => ({
      currencyBursts: state.currencyBursts.filter((b) => b.id !== id),
    })),
}));

export { ALIGNMENT_CONFIG };
