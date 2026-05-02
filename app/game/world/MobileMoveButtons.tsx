"use client";

import { useCallback, useEffect, useState } from "react";
import { useGameWorldStore } from "@/app/page.stores";

const GROUND_BAND_HEIGHT = 160;

export function MobileMoveButtons() {
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: coarse)");
    const apply = () => setTouch(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const press = useCallback((dir: -1 | 1) => {
    useGameWorldStore.getState().setKeyDir(dir);
  }, []);

  const release = useCallback(() => {
    useGameWorldStore.getState().setKeyDir(0);
  }, []);

  if (!touch) return null;

  return (
    <div
      className="absolute left-0 right-0 bottom-0 flex"
      style={{ height: GROUND_BAND_HEIGHT, zIndex: 10 }}
    >
      <button
        type="button"
        aria-label="Move left"
        className="flex-1 select-none touch-none flex items-end justify-center pb-6 text-3xl text-white/70 active:bg-black/10"
        onPointerDown={(e) => {
          e.preventDefault();
          press(-1);
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          release();
        }}
        onPointerCancel={release}
        onPointerLeave={release}
      >
        ◀
      </button>
      <button
        type="button"
        aria-label="Move right"
        className="flex-1 select-none touch-none flex items-end justify-center pb-6 text-3xl text-white/70 active:bg-black/10"
        onPointerDown={(e) => {
          e.preventDefault();
          press(1);
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          release();
        }}
        onPointerCancel={release}
        onPointerLeave={release}
      >
        ▶
      </button>
    </div>
  );
}
