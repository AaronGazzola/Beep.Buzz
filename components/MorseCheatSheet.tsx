"use client";

import { useChatLayoutStore } from "@/app/chat/layout.stores";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

export function MorseCheatSheet() {
  const { isCheatSheetCollapsed, setIsCheatSheetCollapsed } = useChatLayoutStore();

  return (
    <button
      onClick={() => setIsCheatSheetCollapsed(!isCheatSheetCollapsed)}
      className={cn(
        "bg-muted rounded-lg p-2 transition-colors",
        !isCheatSheetCollapsed ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <BookOpen className="w-5 h-5" />
    </button>
  );
}
