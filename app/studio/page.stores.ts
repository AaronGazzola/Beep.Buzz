import { create } from "zustand";
import type { PageElement, ContentType } from "./page.types";

type ContentBlocksStore = {
  elements: PageElement[];
  setElements: (elements: PageElement[]) => void;
  addElement: (element: PageElement) => void;
  updateElement: (elementId: string, updates: Partial<PageElement>) => void;
  removeElement: (elementId: string) => void;
  reorderElements: (startIndex: number, endIndex: number) => void;
};

export const useContentBlocksStore = create<ContentBlocksStore>((set) => ({
  elements: [],
  setElements: (elements) => set({ elements }),
  addElement: (element) =>
    set((state) => ({ elements: [...state.elements, element] })),
  updateElement: (elementId, updates) =>
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === elementId ? { ...el, ...updates } : el
      ),
    })),
  removeElement: (elementId) =>
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== elementId),
    })),
  reorderElements: (startIndex, endIndex) =>
    set((state) => {
      const result = Array.from(state.elements);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return {
        elements: result.map((el, index) => ({ ...el, position: index })),
      };
    }),
}));

type ElementDragStore = {
  isDragging: boolean;
  draggedElementId: string | null;
  setDragging: (isDragging: boolean, elementId?: string | null) => void;
};

export const useElementDragStore = create<ElementDragStore>((set) => ({
  isDragging: false,
  draggedElementId: null,
  setDragging: (isDragging, elementId = null) =>
    set({ isDragging, draggedElementId: elementId }),
}));

type ElementResizeStore = {
  isResizing: boolean;
  resizingElementId: string | null;
  setResizing: (isResizing: boolean, elementId?: string | null) => void;
};

export const useElementResizeStore = create<ElementResizeStore>((set) => ({
  isResizing: false,
  resizingElementId: null,
  setResizing: (isResizing, elementId = null) =>
    set({ isResizing, resizingElementId: elementId }),
}));

type AddBlockDialogStore = {
  isOpen: boolean;
  selectedType: ContentType | null;
  open: (type?: ContentType) => void;
  close: () => void;
  setSelectedType: (type: ContentType | null) => void;
};

export const useAddBlockDialogStore = create<AddBlockDialogStore>((set) => ({
  isOpen: false,
  selectedType: null,
  open: (type) => set({ isOpen: true, selectedType: type || null }),
  close: () => set({ isOpen: false, selectedType: null }),
  setSelectedType: (selectedType) => set({ selectedType }),
}));
