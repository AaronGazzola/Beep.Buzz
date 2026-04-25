"use client";

import { useEffect, useRef } from "react";
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const nearbyId = useGameWorldStore((s) => s.nearbyEntityId);
  const nearbyKind = useGameWorldStore((s) => s.nearbyEntityKind);
  const trainerOpen = useGameWorldStore((s) => s.trainerOpen);
  const dialog = useGameWorldStore((s) => s.signpostDialog);

  const visible =
    !!nearbyId &&
    !!nearbyKind &&
    !trainerOpen &&
    !dialog &&
    nearbyKind !== "enemy" &&
    nearbyKind !== "door";

  useEffect(() => {
    if (!visible) return;
    const apply = () => {
      const el = buttonRef.current;
      if (!el) return;
      const { playerPos } = useGameWorldStore.getState();
      el.style.left = `${playerPos.x + PLAYER_WIDTH / 2}px`;
      el.style.top = `${playerPos.y + PLAYER_HEIGHT + 12}px`;
    };
    apply();
    const unsubscribe = useGameWorldStore.subscribe(apply);
    return unsubscribe;
  }, [visible]);

  if (!visible || !nearbyKind) return null;

  const label = KIND_LABEL[nearbyKind] ?? "Interact";

  return (
    <button
      ref={buttonRef}
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
      style={{ willChange: "left, top" }}
    >
      {label}
    </button>
  );
}
