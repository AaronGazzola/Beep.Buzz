"use client";

import { cn } from "@/lib/utils";
import type { PlatformData } from "../page.types";

interface PlatformProps {
  platform: PlatformData;
  isGround: boolean;
  groundColor: string;
  platformColor: string;
}

export function Platform({ platform, isGround, groundColor, platformColor }: PlatformProps) {
  return (
    <div
      className={cn(
        "absolute pointer-events-none",
        isGround ? "shadow-inner" : "rounded-md shadow-md"
      )}
      style={{
        left: platform.x,
        top: platform.y,
        width: platform.width,
        height: platform.height,
        backgroundColor: isGround ? groundColor : platformColor,
        backgroundImage: isGround
          ? "linear-gradient(180deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 8px, transparent 8px)"
          : "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.08) 100%)",
        borderTop: isGround ? "4px solid rgba(255,255,255,0.35)" : undefined,
      }}
    />
  );
}
