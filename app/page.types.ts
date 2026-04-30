export type Position = { x: number; y: number };

export type CellAlignment = "beep" | "buzz" | "mixed";

export type CellStatus = "dormant" | "activating" | "active";

export type BuildKind = "sapling" | "turbine" | "combined";

export interface Currencies {
  beep: number;
  buzz: number;
}

export interface CellData {
  id: string;
  x: number;
  prompt: string;
  align: CellAlignment;
  build: BuildKind;
}

export interface CellRuntimeState {
  status: CellStatus;
  inputBuffer: string;
  shake: number;
  activatedAt: number | null;
}

export interface LevelData {
  id: string;
  width: number;
  height: number;
  groundY: number;
  playerStart: Position;
  background: string;
  groundColor: string;
  cells: CellData[];
}

export interface CurrencyConfig {
  burstBeep: number;
  burstBuzz: number;
  trickleBeep: number;
  trickleBuzz: number;
}

export const ALIGNMENT_CONFIG: Record<CellAlignment, CurrencyConfig> = {
  beep: { burstBeep: 10, burstBuzz: 0, trickleBeep: 0.5, trickleBuzz: 0 },
  buzz: { burstBeep: 0, burstBuzz: 10, trickleBeep: 0, trickleBuzz: 0.5 },
  mixed: { burstBeep: 5, burstBuzz: 5, trickleBeep: 0.25, trickleBuzz: 0.25 },
};
