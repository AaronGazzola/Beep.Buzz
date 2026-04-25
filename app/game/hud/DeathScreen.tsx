"use client";

import { useGameWorldStore } from "../page.stores";
import { homeLevel } from "../levels/home";

export function DeathScreen() {
  const isAlive = useGameWorldStore((s) => s.isAlive);
  const resetToHome = useGameWorldStore((s) => s.resetToHome);

  if (isAlive) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/85 backdrop-blur flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center">
        <div className="text-5xl mb-3">💔</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">You fell!</h2>
        <p className="text-slate-600 mb-6">All hearts are gone. Return to home?</p>
        <button
          type="button"
          onClick={() => resetToHome(homeLevel.playerStart)}
          className="w-full px-4 py-2.5 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-95 transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
