"use client";

import { cn } from "@/lib/utils";
import type { ChestConfig } from "../page.types";
import { useGameWorldStore } from "../page.stores";

const CHEST_W = 56;
const CHEST_H = 48;

interface ChestProps {
  chest: ChestConfig;
}

export function Chest({ chest }: ChestProps) {
  const opened = useGameWorldStore((s) => s.chests[chest.id]);
  const nearbyId = useGameWorldStore((s) => s.nearbyEntityId);
  const isNearby = nearbyId === chest.id;

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: chest.x - CHEST_W / 2,
        top: chest.y,
        width: CHEST_W,
        height: CHEST_H,
      }}
    >
      <div
        className={cn(
          "w-full h-full rounded-md border-2 relative overflow-hidden transition-transform",
          isNearby && !opened && "scale-110",
          opened && "opacity-70"
        )}
        style={{
          background: opened
            ? "linear-gradient(180deg, #d1c4a3 0%, #a89674 100%)"
            : "linear-gradient(180deg, #d4a437 0%, #a07820 100%)",
          borderColor: "#5a3216",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.3), 0 3px 6px rgba(0,0,0,0.25)",
        }}
      >
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-5 h-3 rounded-sm border"
          style={{ background: "#3a1f0c", borderColor: "#1e0f06" }}
        />
        {!opened && (
          <div
            aria-hidden
            className="absolute left-0 right-0 top-3 h-1.5"
            style={{ background: "#7a5612" }}
          />
        )}
      </div>
      {opened && (
        <div className="absolute inset-x-0 -top-6 text-center text-xs font-bold text-rose-600">
          ♥ +1
        </div>
      )}
    </div>
  );
}
