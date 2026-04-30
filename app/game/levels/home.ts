import type { LevelData } from "@/app/page.types";

export const homeLevel: LevelData = {
  id: "home",
  width: 3200,
  height: 720,
  groundY: 540,
  playerStart: { x: 240, y: 540 },
  background: "linear-gradient(180deg, #cfe6ff 0%, #e7f4ff 60%, #f4f8ec 100%)",
  groundColor: "#7aa564",
  cells: [
    { id: "cell-1", x: 720, prompt: ".", align: "beep", build: "sapling" },
    { id: "cell-2", x: 1500, prompt: "-", align: "buzz", build: "turbine" },
    { id: "cell-3", x: 2360, prompt: ".. -", align: "mixed", build: "combined" },
  ],
};
