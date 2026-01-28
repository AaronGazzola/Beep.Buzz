import { create } from "zustand";
import type { SettingsTab } from "./page.types";

type SettingsState = {
  activeTab: SettingsTab;
  beepEmoji: string;
  beepColor: string;
  buzzEmoji: string;
  buzzColor: string;
  hasChanges: boolean;
};

type SettingsStore = SettingsState & {
  setActiveTab: (tab: SettingsTab) => void;
  setBeepEmoji: (emoji: string) => void;
  setBeepColor: (color: string) => void;
  setBuzzEmoji: (emoji: string) => void;
  setBuzzColor: (color: string) => void;
  setFromProfile: (beepEmoji: string, beepColor: string, buzzEmoji: string, buzzColor: string) => void;
  setHasChanges: (value: boolean) => void;
  reset: () => void;
};

const initialState: SettingsState = {
  activeTab: "profile",
  beepEmoji: "👍",
  beepColor: "#22c55e",
  buzzEmoji: "👎",
  buzzColor: "#ef4444",
  hasChanges: false,
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...initialState,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setBeepEmoji: (emoji) => set({ beepEmoji: emoji, hasChanges: true }),

  setBeepColor: (color) => set({ beepColor: color, hasChanges: true }),

  setBuzzEmoji: (emoji) => set({ buzzEmoji: emoji, hasChanges: true }),

  setBuzzColor: (color) => set({ buzzColor: color, hasChanges: true }),

  setFromProfile: (beepEmoji, beepColor, buzzEmoji, buzzColor) =>
    set({ beepEmoji, beepColor, buzzEmoji, buzzColor, hasChanges: false }),

  setHasChanges: (value) => set({ hasChanges: value }),

  reset: () => set(initialState),
}));
