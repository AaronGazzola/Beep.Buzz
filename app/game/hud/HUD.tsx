"use client";

import { useGameWorldStore } from "@/app/page.stores";
import { CurrencyCounter } from "./CurrencyCounter";

export function HUD() {
  const beep = useGameWorldStore((s) => s.currencies.beep);
  const buzz = useGameWorldStore((s) => s.currencies.buzz);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-6 pt-4 z-20">
      <CurrencyCounter label="Beep" value={beep} align="left" accent="#d97706" />
      <CurrencyCounter label="Buzz" value={buzz} align="right" accent="#0284c7" />
    </div>
  );
}
