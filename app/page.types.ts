export type Position = { x: number; y: number };

export type PlopPhase = "idle" | "anticipation" | "airborne" | "landing";

export interface PlopState {
  phase: PlopPhase;
  startedAt: number;
  fromX: number;
  toX: number;
  dir: -1 | 1;
}

export interface LevelData {
  id: string;
  width: number;
  height: number;
  groundY: number;
  playerStart: Position;
  background: string;
  groundColor: string;
}
