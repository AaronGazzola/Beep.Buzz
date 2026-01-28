import { create } from "zustand";
import type { AdminTab } from "./page.types";

type AdminState = {
  activeTab: AdminTab;
  selectedFlagId: string | null;
  selectedDesignId: string | null;
};

type AdminStore = AdminState & {
  setActiveTab: (tab: AdminTab) => void;
  setSelectedFlagId: (id: string | null) => void;
  setSelectedDesignId: (id: string | null) => void;
  reset: () => void;
};

const initialState: AdminState = {
  activeTab: "flags",
  selectedFlagId: null,
  selectedDesignId: null,
};

export const useAdminStore = create<AdminStore>((set) => ({
  ...initialState,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedFlagId: (id) => set({ selectedFlagId: id }),

  setSelectedDesignId: (id) => set({ selectedDesignId: id }),

  reset: () => set(initialState),
}));
