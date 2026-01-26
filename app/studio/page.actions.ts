"use server";

import { createClient } from "@/supabase/server-client";
import type {
  ContentBlockData,
  ElementDragData,
  ElementResizeData,
  PageElementInsert,
  PageStatus,
} from "./page.types";

export async function fetchUserPageAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    throw new Error("Profile not found");
  }

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("*, page_elements(*)")
    .eq("profile_id", profile.id)
    .order("position", { referencedTable: "page_elements", ascending: true })
    .single();

  if (pageError && pageError.code !== "PGRST116") {
    console.error(pageError);
    throw new Error("Failed to fetch page");
  }

  return { page, profileId: profile.id, userId: user.id };
}

export async function createPageAction(title: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    throw new Error("Profile not found");
  }

  const { data, error } = await supabase
    .from("pages")
    .insert({
      profile_id: profile.id,
      user_id: user.id,
      title,
      status: "DRAFT",
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create page");
  }

  return data;
}

export async function updatePageStatusAction(
  pageId: string,
  status: PageStatus
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("pages")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", pageId)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to update page status");
  }

  return { success: true };
}

export async function contentBlocksAction(
  pageId: string,
  data: ContentBlockData
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: elements } = await supabase
    .from("page_elements")
    .select("position")
    .eq("page_id", pageId)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = elements && elements.length > 0 ? elements[0].position + 1 : 0;

  const elementData: PageElementInsert = {
    page_id: pageId,
    user_id: user.id,
    type: data.type,
    content: data.content,
    position: nextPosition,
    updated_at: new Date().toISOString(),
  };

  const { data: element, error } = await supabase
    .from("page_elements")
    .insert(elementData)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create content block");
  }

  return element;
}

export async function updateContentBlockAction(
  elementId: string,
  content: ContentBlockData["content"]
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("page_elements")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", elementId)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to update content block");
  }

  return { success: true };
}

export async function deleteContentBlockAction(elementId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("page_elements")
    .delete()
    .eq("id", elementId)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to delete content block");
  }

  return { success: true };
}

export async function elementDragAction(data: ElementDragData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("page_elements")
    .update({
      position: data.newPosition,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.elementId)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to reorder element");
  }

  return { success: true };
}

export async function elementResizeAction(data: ElementResizeData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: element } = await supabase
    .from("page_elements")
    .select("content")
    .eq("id", data.elementId)
    .eq("user_id", user.id)
    .single();

  if (!element) {
    throw new Error("Element not found");
  }

  const updatedContent = {
    ...(element.content as object),
    ...(data.width !== undefined && { width: data.width }),
    ...(data.height !== undefined && { height: data.height }),
  };

  const { error } = await supabase
    .from("page_elements")
    .update({
      content: updatedContent,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.elementId)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to resize element");
  }

  return { success: true };
}
