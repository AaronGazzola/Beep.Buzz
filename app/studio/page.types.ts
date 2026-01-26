import type { Database } from "@/supabase/types";

export type ContentType = Database["public"]["Enums"]["content_type"];

export type PageElement = Database["public"]["Tables"]["page_elements"]["Row"];

export type PageElementInsert =
  Database["public"]["Tables"]["page_elements"]["Insert"];

export type PageElementUpdate =
  Database["public"]["Tables"]["page_elements"]["Update"];

export type Page = Database["public"]["Tables"]["pages"]["Row"];

export type PageStatus = Database["public"]["Enums"]["page_status"];

export type ContentBlockData = {
  type: ContentType;
  content: TextContent | ShapeContent | DividerContent | YoutubeContent;
};

export type TextContent = {
  text: string;
  fontSize?: number;
  fontWeight?: string;
  textAlign?: "left" | "center" | "right";
};

export type ShapeContent = {
  shape: "circle" | "square" | "rectangle" | "triangle";
  color: string;
  width?: number;
  height?: number;
};

export type DividerContent = {
  style: "solid" | "dashed" | "dotted";
  color?: string;
};

export type YoutubeContent = {
  videoId: string;
  width?: number;
  height?: number;
};

export type ElementDragData = {
  elementId: string;
  newPosition: number;
};

export type ElementResizeData = {
  elementId: string;
  width?: number;
  height?: number;
};
