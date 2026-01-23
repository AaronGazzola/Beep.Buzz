import { create } from "zustand";
import type { PageElement } from "./page.types";

type ContentElementsStore = {
  elements: PageElement[];
  selectedElementId: string | null;
  setElements: (elements: PageElement[]) => void;
  addElement: (element: PageElement) => void;
  updateElement: (id: string, updates: Partial<PageElement>) => void;
  removeElement: (id: string) => void;
  setSelectedElementId: (id: string | null) => void;
};

export const useContentElementsStore = create<ContentElementsStore>((set) => ({
  elements: [],
  selectedElementId: null,
  setElements: (elements) => set({ elements }),
  addElement: (element) =>
    set((state) => ({ elements: [...state.elements, element] })),
  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    })),
  removeElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
    })),
  setSelectedElementId: (id) => set({ selectedElementId: id }),
}));

type ElementManipulationStore = {
  isDragging: boolean;
  dragElementId: string | null;
  setIsDragging: (isDragging: boolean) => void;
  setDragElementId: (id: string | null) => void;
};

export const useElementManipulationStore = create<ElementManipulationStore>((set) => ({
  isDragging: false,
  dragElementId: null,
  setIsDragging: (isDragging) => set({ isDragging }),
  setDragElementId: (id) => set({ dragElementId: id }),
}));
