import type { CellData } from "@/app/page.types";

export function findNearestCell(
  playerCenterX: number,
  cells: CellData[],
  radius: number,
): string | null {
  let nearestId: string | null = null;
  let nearestDist = radius;
  for (const cell of cells) {
    const dist = Math.abs(cell.x - playerCenterX);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearestId = cell.id;
    }
  }
  return nearestId;
}
