"use client";

import { useGameWorldStore, PLAYER_WIDTH, PLAYER_HEIGHT } from "../page.stores";
import { cn } from "@/lib/utils";

interface InteractButtonProps {
  onInteract: () => void;
}

const KIND_LABEL: Record<string, string> = {
  npc: "Talk",
  enemy: "Engage",
  door: "Open",
  chest: "Open",
  signpost: "Read",
};

export function InteractButton({ onInteract }: InteractButtonProps) {
  const playerPos = useGameWorldStore((s) => s.playerPos);
  const nearbyId = useGameWorldStore((s) => s.nearbyEntityId);
  const nearbyKind = useGameWorldStore((s) => s.nearbyEntityKind);
  const trainerOpen = useGameWorldStore((s) => s.trainerOpen);
  const dialog = useGameWorldStore((s) => s.signpostDialog);

  if (!nearbyId || !nearbyKind || trainerOpen || dialog) return null;
  if (nearbyKind === "enemy" || nearbyKind === "door") return null;

  const label = KIND_LABEL[nearbyKind] ?? "Interact";
  const left = playerPos.x + PLAYER_WIDTH / 2;
  const top = playerPos.y + PLAYER_HEIGHT + 12;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onInteract();
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onInteract();
      }}
      className={cn(
        "absolute -translate-x-1/2 px-3 py-1.5 rounded-full font-semibold text-sm",
        "bg-indigo-600 text-white border-2 border-white shadow-lg",
        "hover:bg-indigo-700 active:scale-95 transition"
      )}
      style={{ left, top }}
    >
      {label}
    </button>
  );
}
