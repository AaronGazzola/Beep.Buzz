import type { LevelData } from "../page.types";

const WORLD_WIDTH = 4200;
const WORLD_HEIGHT = 720;
const GROUND_Y = 600;
const GROUND_THICKNESS = 120;

export const HOME_GROUND_Y = GROUND_Y;

export const homeLevel: LevelData = {
  id: "home",
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
  background: "linear-gradient(180deg, #b9e3ff 0%, #e6f6ff 60%, #fff5d6 100%)",
  groundColor: "#7cc77a",
  platformColor: "#a4825c",
  playerStart: { x: 360, y: GROUND_Y - 80 },
  platforms: [
    { id: "ground", x: 0, y: GROUND_Y, width: WORLD_WIDTH, height: GROUND_THICKNESS },
  ],
  npcs: [
    { id: "npc-beep", npcKind: "beep", x: 760, y: GROUND_Y - 96 },
    { id: "npc-buzz", npcKind: "buzz", x: 920, y: GROUND_Y - 96 },
  ],
  signposts: [
    {
      id: "sign-walk",
      x: 200,
      y: GROUND_Y - 64,
      text: "Tap or click anywhere to walk there. Tap your character to send morse: short tap = dot, hold = dash.",
    },
    {
      id: "sign-talk",
      x: 540,
      y: GROUND_Y - 64,
      text: "Beep and Buzz teach morse. Walk up and tap the interact button to learn new letters.",
    },
  ],
  chests: [
    { id: "chest-starter", x: 1280, y: GROUND_Y - 56, reward: "heart" },
  ],
  enemies: [
    {
      id: "enemy-1",
      x: 1700,
      y: GROUND_Y - 80,
      behavior: "reactive",
      challengeMode: "morse+audio",
      challengeLetter: "E",
      hp: 2,
      color: "#ef4444",
      spikeyness: 70,
    },
    {
      id: "enemy-2",
      x: 2400,
      y: GROUND_Y - 80,
      behavior: "reactive",
      challengeMode: "morse+audio",
      challengeLetter: "T",
      hp: 2,
      color: "#a855f7",
      spikeyness: 60,
    },
  ],
  doors: [
    {
      id: "door-zone1",
      x: 3100,
      y: GROUND_Y - 180,
      width: 90,
      height: 180,
      challengeLetter: "E",
      challengeMode: "morse+audio",
      leadsTo: null,
    },
  ],
};
