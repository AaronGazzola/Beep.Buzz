"use client";

import { cn } from "@/lib/utils";
import type { SignpostConfig } from "../page.types";
import { useGameWorldStore } from "../page.stores";

const SIGN_W = 48;
const SIGN_H = 64;

interface SignpostProps {
  signpost: SignpostConfig;
}

export function Signpost({ signpost }: SignpostProps) {
  const nearbyId = useGameWorldStore((s) => s.nearbyEntityId);
  const isNearby = nearbyId === signpost.id;

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: signpost.x - SIGN_W / 2,
        top: signpost.y,
        width: SIGN_W,
        height: SIGN_H,
      }}
    >
      <div
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2 h-10"
        style={{ background: "#5a3216" }}
      />
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-0 w-12 h-7 rounded-sm border-2 flex items-center justify-center text-[10px] font-bold transition-transform",
          isNearby && "scale-110"
        )}
        style={{
          background: "#d4a437",
          borderColor: "#5a3216",
          color: "#3a1f0c",
        }}
      >
        ?
      </div>
    </div>
  );
}
