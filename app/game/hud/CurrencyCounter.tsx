"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CurrencyCounterProps {
  label: string;
  value: number;
  align: "left" | "right";
  accent: string;
}

export function CurrencyCounter({ label, value, align, accent }: CurrencyCounterProps) {
  const valueRef = useRef(value);
  const numberRef = useRef<HTMLSpanElement>(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    const prev = valueRef.current;
    const delta = value - prev;
    const isBurst = delta >= 1;

    valueRef.current = value;

    if (isBurst) {
      if (numberRef.current) {
        numberRef.current.textContent = String(Math.floor(value));
        numberRef.current.style.animation = "none";
        void numberRef.current.offsetWidth;
        numberRef.current.style.animation = "counter-pop 360ms ease-out";
      }
      return;
    }

    if (Math.abs(delta) < 0.01) {
      if (numberRef.current) numberRef.current.textContent = String(Math.floor(value));
      return;
    }

    if (animatingRef.current) {
      if (numberRef.current) numberRef.current.textContent = String(Math.floor(value));
      return;
    }

    animatingRef.current = true;
    let raf = 0;
    const start = performance.now();
    const duration = 220;
    const from = prev;
    const to = value;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const current = from + (to - from) * t;
      if (numberRef.current) numberRef.current.textContent = String(Math.floor(current));
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        animatingRef.current = false;
      }
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      animatingRef.current = false;
    };
  }, [value]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full bg-white/85 backdrop-blur-sm border-2 px-4 py-2 shadow-lg pointer-events-auto",
        align === "left" ? "" : "flex-row-reverse",
      )}
      style={{ borderColor: accent }}
    >
      <span
        className="font-bold text-sm uppercase tracking-wider"
        style={{ color: accent }}
      >
        {label}
      </span>
      <span ref={numberRef} className="text-xl font-bold tabular-nums text-slate-900">
        {Math.floor(value)}
      </span>
    </div>
  );
}
