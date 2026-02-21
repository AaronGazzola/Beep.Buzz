import { create } from "zustand";

export type ChatMode = "ai" | "random" | "friend";

type ChatLayoutStore = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
  isCheatSheetCollapsed: boolean;
  setIsCheatSheetCollapsed: (collapsed: boolean) => void;
};

export const useChatLayoutStore = create<ChatLayoutStore>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  isSearching: false,
  setIsSearching: (searching) => set({ isSearching: searching }),
  chatMode: "ai",
  setChatMode: (mode) => set({ chatMode: mode }),
  isCheatSheetCollapsed: true,
  setIsCheatSheetCollapsed: (collapsed) => set({ isCheatSheetCollapsed: collapsed }),
}));
