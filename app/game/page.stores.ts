import { create } from "zustand";
import type {
  Zone,
  EntityId,
  Position,
  Velocity,
  EnemyState,
  DoorState,
  UnlockedCosmetics,
  ActiveChallenge,
  SignpostDialog,
  InteractableKind,
} from "./page.types";

export const PLAYER_WIDTH = 56;
export const PLAYER_HEIGHT = 72;
export const INTERACT_RADIUS = 90;
export const MORSE_BUFFER_MAX = 8;

type GameWorldStore = {
  zone: Zone;
  playerPos: Position;
  playerVel: Velocity;
  moveTarget: number | null;
  isGrounded: boolean;
  facing: 1 | -1;
  lastSafePos: Position;
  hearts: number;
  isAlive: boolean;
  nearbyEntityId: EntityId | null;
  nearbyEntityKind: InteractableKind | null;
  interactingWithId: EntityId | null;
  trainerOpen: boolean;
  signpostDialog: SignpostDialog | null;
  activeChallenge: ActiveChallenge | null;
  morseBuffer: string;
  lastMorseResult: "hit" | "miss" | null;
  enemies: Record<EntityId, EnemyState>;
  doors: Record<EntityId, DoorState>;
  chests: Record<EntityId, boolean>;
  unlockedZones: Zone[];
  learnedLetters: string[];
  cosmetics: UnlockedCosmetics;

  setZone: (zone: Zone) => void;
  setPlayerPos: (pos: Position) => void;
  setPlayerVel: (vel: Velocity) => void;
  setMoveTarget: (x: number | null) => void;
  setGrounded: (grounded: boolean) => void;
  setFacing: (facing: 1 | -1) => void;
  setLastSafePos: (pos: Position) => void;
  setHearts: (hearts: number) => void;
  setAlive: (alive: boolean) => void;
  setNearby: (id: EntityId | null, kind: InteractableKind | null) => void;
  setInteracting: (id: EntityId | null) => void;
  setTrainerOpen: (open: boolean) => void;
  setSignpostDialog: (dialog: SignpostDialog | null) => void;
  setActiveChallenge: (c: ActiveChallenge | null) => void;
  appendMorse: (signal: "." | "-") => void;
  clearMorse: () => void;
  clearMorseResult: () => void;

  initLevel: (
    zone: Zone,
    playerStart: Position,
    enemies: Record<EntityId, EnemyState>,
    doors: Record<EntityId, DoorState>,
    chests: Record<EntityId, boolean>
  ) => void;
  loseHeart: () => void;
  gainHeart: () => void;
  damageEnemy: (id: EntityId) => void;
  openDoor: (id: EntityId) => void;
  collectChest: (id: EntityId) => void;
  addLearnedLetter: (letter: string) => void;
  respawnAt: (pos: Position) => void;
  resetToHome: (homeStart: Position) => void;
};

export const useGameWorldStore = create<GameWorldStore>((set, get) => ({
  zone: "home",
  playerPos: { x: 360, y: 520 },
  playerVel: { x: 0, y: 0 },
  moveTarget: null,
  isGrounded: false,
  facing: 1,
  lastSafePos: { x: 360, y: 520 },
  hearts: 3,
  isAlive: true,
  nearbyEntityId: null,
  nearbyEntityKind: null,
  interactingWithId: null,
  trainerOpen: false,
  signpostDialog: null,
  activeChallenge: null,
  morseBuffer: "",
  lastMorseResult: null,
  enemies: {},
  doors: {},
  chests: {},
  unlockedZones: ["home"],
  learnedLetters: [],
  cosmetics: { hats: [], glasses: [], eyeStyles: [], makeups: [], shoes: [] },

  setZone: (zone) => set({ zone }),
  setPlayerPos: (playerPos) => set({ playerPos }),
  setPlayerVel: (playerVel) => set({ playerVel }),
  setMoveTarget: (moveTarget) => set({ moveTarget }),
  setGrounded: (isGrounded) => set({ isGrounded }),
  setFacing: (facing) => set({ facing }),
  setLastSafePos: (lastSafePos) => set({ lastSafePos }),
  setHearts: (hearts) => set({ hearts }),
  setAlive: (isAlive) => set({ isAlive }),
  setNearby: (id, kind) => {
    const { nearbyEntityId, nearbyEntityKind } = get();
    if (id !== nearbyEntityId || kind !== nearbyEntityKind) {
      set({ nearbyEntityId: id, nearbyEntityKind: kind });
    }
  },
  setInteracting: (interactingWithId) => set({ interactingWithId }),
  setTrainerOpen: (trainerOpen) => set({ trainerOpen }),
  setSignpostDialog: (signpostDialog) => set({ signpostDialog }),

  setActiveChallenge: (activeChallenge) => {
    const current = get().activeChallenge;
    if (current?.entityId === activeChallenge?.entityId) return;
    set({ activeChallenge, morseBuffer: "" });
  },

  appendMorse: (signal) => {
    const { morseBuffer, activeChallenge } = get();
    if (!activeChallenge) {
      set({ morseBuffer: (morseBuffer + signal).slice(-MORSE_BUFFER_MAX) });
      return;
    }
    const expected = activeChallenge.expectedMorse;
    const next = (morseBuffer + signal).slice(-Math.max(expected.length, MORSE_BUFFER_MAX));
    if (next === expected || next.endsWith(expected)) {
      set({ morseBuffer: "", lastMorseResult: "hit" });
      if (activeChallenge.kind === "enemy") {
        get().damageEnemy(activeChallenge.entityId);
      } else if (activeChallenge.kind === "door") {
        get().openDoor(activeChallenge.entityId);
      }
      return;
    }
    if (next.length >= expected.length) {
      set({ morseBuffer: "", lastMorseResult: "miss" });
      if (activeChallenge.kind === "enemy") {
        get().loseHeart();
      }
      return;
    }
    set({ morseBuffer: next });
  },

  clearMorse: () => set({ morseBuffer: "" }),
  clearMorseResult: () => set({ lastMorseResult: null }),

  initLevel: (zone, playerStart, enemies, doors, chests) =>
    set({
      zone,
      playerPos: playerStart,
      playerVel: { x: 0, y: 0 },
      moveTarget: null,
      isGrounded: false,
      lastSafePos: playerStart,
      nearbyEntityId: null,
      nearbyEntityKind: null,
      interactingWithId: null,
      activeChallenge: null,
      morseBuffer: "",
      lastMorseResult: null,
      enemies,
      doors,
      chests,
    }),

  loseHeart: () => {
    const next = Math.max(0, get().hearts - 1);
    set({ hearts: next, isAlive: next > 0 });
  },

  gainHeart: () => {
    const next = Math.min(3, get().hearts + 1);
    set({ hearts: next });
  },

  damageEnemy: (id) => {
    const enemies = get().enemies;
    const current = enemies[id];
    if (!current || !current.alive) return;
    const nextHp = Math.max(0, current.hp - 1);
    const alive = nextHp > 0;
    set({
      enemies: { ...enemies, [id]: { hp: nextHp, alive } },
    });
    if (!alive) {
      set({ activeChallenge: null, nearbyEntityId: null, nearbyEntityKind: null });
    }
  },

  openDoor: (id) => {
    const doors = get().doors;
    const current = doors[id];
    if (!current || current.open) return;
    set({
      doors: { ...doors, [id]: { open: true } },
      activeChallenge: null,
    });
  },

  collectChest: (id) => {
    const chests = get().chests;
    if (chests[id]) return;
    set({ chests: { ...chests, [id]: true } });
    get().gainHeart();
  },

  addLearnedLetter: (letter) => {
    const upper = letter.toUpperCase();
    const learned = get().learnedLetters;
    if (learned.includes(upper)) return;
    set({ learnedLetters: [...learned, upper] });
  },

  respawnAt: (pos) =>
    set({
      playerPos: pos,
      playerVel: { x: 0, y: 0 },
      moveTarget: null,
      isGrounded: false,
      morseBuffer: "",
    }),

  resetToHome: (homeStart) =>
    set({
      zone: "home",
      playerPos: homeStart,
      playerVel: { x: 0, y: 0 },
      moveTarget: null,
      isGrounded: false,
      lastSafePos: homeStart,
      hearts: 3,
      isAlive: true,
      nearbyEntityId: null,
      nearbyEntityKind: null,
      interactingWithId: null,
      activeChallenge: null,
      morseBuffer: "",
      lastMorseResult: null,
    }),
}));
