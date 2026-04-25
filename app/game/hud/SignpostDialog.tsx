"use client";

import { useGameWorldStore } from "../page.stores";

export function SignpostDialog() {
  const dialog = useGameWorldStore((s) => s.signpostDialog);
  const close = useGameWorldStore((s) => s.setSignpostDialog);

  if (!dialog) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={() => close(null)}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border-2 border-amber-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-3xl mb-2">📜</div>
        <p className="text-slate-800 leading-relaxed">{dialog.text}</p>
        <button
          type="button"
          onClick={() => close(null)}
          className="mt-5 w-full px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-95 transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
