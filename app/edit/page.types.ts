import type { Database } from "@/supabase/types";

export type Page = Database["public"]["Tables"]["pages"]["Row"];
export type PageInsert = Database["public"]["Tables"]["pages"]["Insert"];
export type PageElement = Database["public"]["Tables"]["page_elements"]["Row"];
export type PageElementInsert = Database["public"]["Tables"]["page_elements"]["Insert"];
export type PageElementUpdate = Database["public"]["Tables"]["page_elements"]["Update"];
export type ElementType = Database["public"]["Enums"]["element_type"];

export type ElementContent = {
  text?: string;
  fontSize?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  fillColor?: string;
  shape?: "circle" | "square";
  videoId?: string;
};

export type ElementPosition = {
  x: number;
  y: number;
  width?: number;
  height?: number;
};

export type ContentElementsData = {
  page_id: string;
  element_type: ElementType;
  content: ElementContent;
  position: ElementPosition;
};

export type ElementManipulationData = {
  id: string;
  content?: ElementContent;
  position?: ElementPosition;
};

export type DeleteElementsData = {
  id: string;
};
