export type Zone = "home" | "zone1";

export type EntityId = string;

export type Position = { x: number; y: number };

export type Velocity = { x: number; y: number };

export type Rect = { x: number; y: number; width: number; height: number };

export type PlatformData = {
  id: EntityId;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type EnemyBehavior = "reactive" | "timer";

export type ChallengeMode = "morse+audio" | "letter+audio" | "letter-only";

export type EnemyConfig = {
  id: EntityId;
  x: number;
  y: number;
  behavior: EnemyBehavior;
  challengeMode: ChallengeMode;
  timerMs?: number;
  challengeLetter: string;
  hp: number;
  color?: string;
  spikeyness?: number;
};

export type DoorConfig = {
  id: EntityId;
  x: number;
  y: number;
  width: number;
  height: number;
  challengeLetter: string;
  challengeMode: ChallengeMode;
  leadsTo: Zone | null;
  unlockRequiresLetters?: string[];
};

export type ChestConfig = {
  id: EntityId;
  x: number;
  y: number;
  reward: "heart";
};

export type SignpostConfig = {
  id: EntityId;
  x: number;
  y: number;
  text: string;
};

export type NPCKind = "beep" | "buzz";

export type NPCConfig = {
  id: EntityId;
  npcKind: NPCKind;
  x: number;
  y: number;
};

export type LevelData = {
  id: Zone;
  width: number;
  height: number;
  background: string;
  groundColor: string;
  platformColor: string;
  platforms: PlatformData[];
  enemies: EnemyConfig[];
  doors: DoorConfig[];
  chests: ChestConfig[];
  signposts: SignpostConfig[];
  npcs: NPCConfig[];
  playerStart: Position;
};

export type EnemyState = {
  hp: number;
  alive: boolean;
};

export type DoorState = {
  open: boolean;
};

export type UnlockedCosmetics = {
  hats: number[];
  glasses: number[];
  eyeStyles: number[];
  makeups: number[];
  shoes: number[];
};

export type InteractableKind = "npc" | "enemy" | "door" | "chest" | "signpost";

export type InteractablePoint = {
  id: EntityId;
  kind: InteractableKind;
  x: number;
  y: number;
};

export type ChallengeKind = "enemy" | "door";

export type ActiveChallenge = {
  kind: ChallengeKind;
  entityId: EntityId;
  expectedMorse: string;
  expectedLetter: string;
  challengeMode: ChallengeMode;
};

export type SignpostDialog = {
  id: EntityId;
  text: string;
};
