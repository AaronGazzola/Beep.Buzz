"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpeechBubbleProps {
  children: ReactNode;
  variant?: "default" | "challenge" | "hit" | "miss";
  className?: string;
  shakeKey?: number;
}

export function SpeechBubble({ children, variant = "challenge", className, shakeKey }: SpeechBubbleProps) {
  const tone = {
    default: "bg-white border-slate-300 text-slate-900",
    challenge: "bg-yellow-50 border-yellow-400 text-slate-900",
    hit: "bg-green-100 border-green-500 text-green-900",
    miss: "bg-red-100 border-red-500 text-red-900",
  }[variant];

  const tail = {
    default: "bg-white border-slate-300",
    challenge: "bg-yellow-50 border-yellow-400",
    hit: "bg-green-100 border-green-500",
    miss: "bg-red-100 border-red-500",
  }[variant];

  return (
    <div
      key={shakeKey}
      className={cn(
        "relative pointer-events-none select-none rounded-2xl border-2 px-3 py-2 text-center shadow-md",
        tone,
        shakeKey !== undefined && shakeKey > 0 && "animate-[shake_220ms_ease-in-out]",
        variant === "hit" && "animate-[pop_360ms_ease-out]",
        className,
      )}
      style={{ minWidth: 80 }}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-full block w-3 h-3 rotate-45 border-r-2 border-b-2 -mt-1.5",
          tail,
        )}
      />
    </div>
  );
}
