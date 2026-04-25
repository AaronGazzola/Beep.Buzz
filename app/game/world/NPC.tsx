"use client";

import { BeepCharacter, BuzzCharacter } from "@/components/MorseCharacters";
import { cn } from "@/lib/utils";
import type { NPCConfig } from "../page.types";
import { useGameWorldStore } from "../page.stores";

const NPC_WIDTH = 88;
const NPC_HEIGHT = 96;

interface NPCProps {
  npc: NPCConfig;
}

export function NPC({ npc }: NPCProps) {
  const nearbyId = useGameWorldStore((s) => s.nearbyEntityId);
  const Char = npc.npcKind === "beep" ? BeepCharacter : BuzzCharacter;
  const isNearby = nearbyId === npc.id;

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: npc.x - NPC_WIDTH / 2,
        top: npc.y,
        width: NPC_WIDTH,
        height: NPC_HEIGHT,
      }}
    >
      <Char
        isSpeaking={isNearby}
        className={cn("w-full h-full", isNearby && "drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]")}
      />
    </div>
  );
}
