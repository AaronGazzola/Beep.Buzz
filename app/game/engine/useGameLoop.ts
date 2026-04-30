import { useEffect, useLayoutEffect, useRef } from "react";

const MAX_DT = 1 / 30;

export function useGameLoop(update: (dt: number) => void, enabled: boolean) {
  const updateRef = useRef(update);

  useLayoutEffect(() => {
    updateRef.current = update;
  });

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const tick = (time: number) => {
      if (document.hidden) {
        lastTimeRef.current = time;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const rawDt = (time - lastTimeRef.current) / 1000;
      const dt = Math.min(rawDt, MAX_DT);
      lastTimeRef.current = time;

      updateRef.current(dt);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
    };
  }, [enabled]);
}
