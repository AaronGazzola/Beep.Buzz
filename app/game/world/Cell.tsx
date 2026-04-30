"use client";

import { cn } from "@/lib/utils";
import { useGameWorldStore, PLAYER_HEIGHT } from "@/app/page.stores";
import type { CellData } from "@/app/page.types";
import { SpeechBubble } from "./SpeechBubble";

interface CellProps {
  cell: CellData;
  groundY: number;
}

const BUILD_SPRITES: Record<CellData["build"], { emoji: string; height: number; color: string }> = {
  sapling: { emoji: "🌱", height: 110, color: "text-emerald-600" },
  turbine: { emoji: "🌀", height: 140, color: "text-sky-600" },
  combined: { emoji: "🌳", height: 160, color: "text-amber-700" },
};

export function Cell({ cell, groundY }: CellProps) {
  const runtime = useGameWorldStore((s) => s.cells[cell.id]);
  const targetCellId = useGameWorldStore((s) => s.targetCellId);

  if (!runtime) return null;

  const isTarget = targetCellId === cell.id;
  const showBubble = isTarget && runtime.status !== "active";
  const status = runtime.status;
  const variant = status === "activating" ? "hit" : "challenge";
  const sprite = BUILD_SPRITES[cell.build];
  const dotPattern = renderMorseDots(cell.prompt);

  return (
    <div
      className="absolute"
      style={{
        left: cell.x,
        top: groundY,
        transform: "translateX(-50%)",
        zIndex: 3,
      }}
    >
      <div className="relative">
        {status === "dormant" && (
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-0 rounded-full border-2 border-dashed border-slate-400/70 bg-slate-200/40"
            style={{ width: 96, height: 28 }}
          />
        )}

        {(status === "activating" || status === "active") && (
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-0 select-none pointer-events-none"
            style={{
              fontSize: sprite.height,
              lineHeight: 1,
              animation: status === "activating" ? "build-pop 600ms ease-out" : undefined,
            }}
          >
            <span className={cn("drop-shadow-md", sprite.color)}>{sprite.emoji}</span>
          </div>
        )}

        {showBubble && (
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: PLAYER_HEIGHT + 32 }}
          >
            <SpeechBubble variant={variant} shakeKey={runtime.shake}>
              <div className="flex flex-col items-center gap-1 px-2 py-1">
                <div className="font-mono text-3xl tracking-widest text-slate-900">
                  {dotPattern}
                </div>
                {runtime.inputBuffer && (
                  <div className="font-mono text-lg tracking-widest text-emerald-600 min-h-[1.5rem]">
                    {runtime.inputBuffer || " "}
                  </div>
                )}
              </div>
            </SpeechBubble>
          </div>
        )}
      </div>
    </div>
  );
}

function renderMorseDots(prompt: string): string {
  return prompt
    .split(" ")
    .map((letter) => letter || " ")
    .join("   ");
}
