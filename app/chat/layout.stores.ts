import { create } from "zustand";

type ChatLayoutStore = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
};

export const useChatLayoutStore = create<ChatLayoutStore>((set) => ({
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  isSearching: false,
  setIsSearching: (searching) => set({ isSearching: searching }),
}));
