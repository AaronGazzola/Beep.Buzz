"use client";

import { useEffect } from "react";
import { MorseTrainer } from "@/components/MorseTrainer";
import { useGameWorldStore } from "../page.stores";
import { useGameStore } from "@/app/page.stores";

export function TrainerModal() {
  const open = useGameWorldStore((s) => s.trainerOpen);
  const setOpen = useGameWorldStore((s) => s.setTrainerOpen);
  const addLearnedLetter = useGameWorldStore((s) => s.addLearnedLetter);

  const trainerLearnedLetters = useGameStore((s) => s.learnedLetters);

  useEffect(() => {
    if (!open) return;
    for (const entry of trainerLearnedLetters) {
      addLearnedLetter(entry.letter);
    }
  }, [trainerLearnedLetters, open, addLearnedLetter]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-auto">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition flex items-center justify-center text-slate-700 font-bold text-lg shadow"
          aria-label="Close trainer"
        >
          ×
        </button>
        <MorseTrainer />
      </div>
    </div>
  );
}
