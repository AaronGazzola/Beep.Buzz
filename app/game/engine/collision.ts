import type { PlatformData, Rect } from "../page.types";

export function rectsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function resolveGroundCollision(
  prevY: number,
  nextX: number,
  nextY: number,
  vy: number,
  playerW: number,
  playerH: number,
  platforms: PlatformData[]
): { y: number; vy: number; grounded: boolean } {
  let resolvedY = nextY;
  let resolvedVY = vy;
  let grounded = false;

  if (vy < 0) {
    return { y: resolvedY, vy: resolvedVY, grounded: false };
  }

  const playerLeft = nextX;
  const playerRight = nextX + playerW;
  const prevBottom = prevY + playerH;
  const nextBottom = nextY + playerH;

  for (const plat of platforms) {
    const platRight = plat.x + plat.width;
    const horizontalOverlap = playerRight > plat.x && playerLeft < platRight;
    if (!horizontalOverlap) continue;

    const wasAboveOrOn = prevBottom <= plat.y + 0.5;
    const nowBelowTop = nextBottom >= plat.y;

    if (wasAboveOrOn && nowBelowTop) {
      resolvedY = plat.y - playerH;
      resolvedVY = 0;
      grounded = true;
      break;
    }
  }

  return { y: resolvedY, vy: resolvedVY, grounded };
}

export function clampToWorldBounds(
  x: number,
  vx: number,
  playerW: number,
  worldWidth: number
): { x: number; vx: number } {
  if (x < 0) return { x: 0, vx: 0 };
  if (x + playerW > worldWidth) return { x: worldWidth - playerW, vx: 0 };
  return { x, vx };
}
