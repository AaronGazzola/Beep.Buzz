import type { Page, PageElement, ElementType } from "../layout.types";

export type EditorPage = Page & {
  page_elements: PageElement[];
};

export type DraftElement = {
  id: string;
  element_type: ElementType;
  content: Record<string, unknown>;
  position: number;
  properties: Record<string, unknown>;
};

export type EditorState = {
  page: EditorPage | null;
  draftElements: DraftElement[];
  selectedElementId: string | null;
  isPreview: boolean;
  hasUnsavedChanges: boolean;
};
