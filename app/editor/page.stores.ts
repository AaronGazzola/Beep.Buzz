import { create } from "zustand";
import type { EditorState, DraftElement, EditorPage } from "./page.types";
import type { ElementType } from "../layout.types";

type EditorStore = EditorState & {
  setPage: (page: EditorPage | null) => void;
  setDraftElements: (elements: DraftElement[]) => void;
  addElement: (type: ElementType) => void;
  updateElement: (id: string, updates: Partial<DraftElement>) => void;
  removeElement: (id: string) => void;
  moveElement: (id: string, direction: "up" | "down") => void;
  selectElement: (id: string | null) => void;
  togglePreview: () => void;
  setHasUnsavedChanges: (value: boolean) => void;
  reset: () => void;
};

const initialState: EditorState = {
  page: null,
  draftElements: [],
  selectedElementId: null,
  isPreview: false,
  hasUnsavedChanges: false,
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...initialState,

  setPage: (page) => set({ page }),

  setDraftElements: (elements) => set({ draftElements: elements }),

  addElement: (type) => {
    const { draftElements } = get();
    const newElement: DraftElement = {
      id: crypto.randomUUID(),
      element_type: type,
      content: getDefaultContent(type),
      position: draftElements.length,
      properties: getDefaultProperties(type),
    };
    set({
      draftElements: [...draftElements, newElement],
      selectedElementId: newElement.id,
      hasUnsavedChanges: true,
    });
  },

  updateElement: (id, updates) => {
    const { draftElements } = get();
    set({
      draftElements: draftElements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
      hasUnsavedChanges: true,
    });
  },

  removeElement: (id) => {
    const { draftElements, selectedElementId } = get();
    const filtered = draftElements.filter((el) => el.id !== id);
    const reindexed = filtered.map((el, i) => ({ ...el, position: i }));
    set({
      draftElements: reindexed,
      selectedElementId: selectedElementId === id ? null : selectedElementId,
      hasUnsavedChanges: true,
    });
  },

  moveElement: (id, direction) => {
    const { draftElements } = get();
    const index = draftElements.findIndex((el) => el.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= draftElements.length) return;

    const newElements = [...draftElements];
    [newElements[index], newElements[newIndex]] = [
      newElements[newIndex],
      newElements[index],
    ];
    const reindexed = newElements.map((el, i) => ({ ...el, position: i }));
    set({ draftElements: reindexed, hasUnsavedChanges: true });
  },

  selectElement: (id) => set({ selectedElementId: id }),

  togglePreview: () => set((state) => ({ isPreview: !state.isPreview })),

  setHasUnsavedChanges: (value) => set({ hasUnsavedChanges: value }),

  reset: () => set(initialState),
}));

function getDefaultContent(type: ElementType): Record<string, unknown> {
  switch (type) {
    case "text":
      return { text: "Enter your text here" };
    case "shape":
      return { shape: "rectangle" };
    case "divider":
      return {};
    case "youtube":
      return { videoId: "" };
    default:
      return {};
  }
}

function getDefaultProperties(type: ElementType): Record<string, unknown> {
  switch (type) {
    case "text":
      return { fontSize: 16, color: "#000000" };
    case "shape":
      return { width: 100, height: 100, fill: "#3b82f6" };
    case "divider":
      return { style: "solid" };
    case "youtube":
      return {};
    default:
      return {};
  }
}
