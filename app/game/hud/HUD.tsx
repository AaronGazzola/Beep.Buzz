"use client";

import { cn } from "@/lib/utils";
import { useGameWorldStore } from "../page.stores";

export function HUD() {
  const hearts = useGameWorldStore((s) => s.hearts);
  const zone = useGameWorldStore((s) => s.zone);
  const morseBuffer = useGameWorldStore((s) => s.morseBuffer);
  const activeChallenge = useGameWorldStore((s) => s.activeChallenge);
  const learnedLetters = useGameWorldStore((s) => s.learnedLetters);

  return (
    <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none flex items-start justify-between z-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur rounded-full px-3 py-1.5 shadow-md border border-white">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "text-2xl leading-none transition-transform",
                i < hearts ? "text-rose-500" : "text-slate-300"
              )}
            >
              ♥
            </span>
          ))}
        </div>
        {learnedLetters.length > 0 && (
          <div className="bg-white/85 backdrop-blur rounded-full px-3 py-1.5 shadow border border-white text-xs font-mono text-slate-700">
            Learned: {learnedLetters.join(" ")}
          </div>
        )}
      </div>

      <div className="bg-white/85 backdrop-blur rounded-full px-4 py-1.5 shadow-md border border-white text-sm font-bold text-slate-700 capitalize">
        {zone === "home" ? "Home" : zone}
      </div>

      <div className="flex flex-col items-end gap-2 min-w-[120px]">
        {activeChallenge && (
          <div
            className={cn(
              "bg-yellow-50 border-2 border-yellow-400 rounded-2xl px-3 py-2 shadow-md min-w-[120px] text-center"
            )}
          >
            <div className="text-[10px] uppercase tracking-wider text-yellow-700 font-semibold">
              Tap morse
            </div>
            <div className="font-mono text-xl tracking-widest text-slate-900 min-h-[24px]">
              {morseBuffer || "·"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
