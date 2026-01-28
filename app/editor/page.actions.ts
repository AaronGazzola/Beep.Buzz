"use server";

import { createClient } from "@/supabase/server-client";
import type { Page, PageElement } from "../layout.types";
import type { EditorPage, DraftElement } from "./page.types";
import type { Json } from "@/supabase/types";

export async function getOrCreatePageAction(): Promise<EditorPage | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("Profile not found");
  }

  const { data: existingPage } = await supabase
    .from("pages")
    .select("*, page_elements(*)")
    .eq("profile_id", profile.id)
    .single();

  if (existingPage) {
    return existingPage as EditorPage;
  }

  const { data: newPage, error: createError } = await supabase
    .from("pages")
    .insert({
      user_id: user.id,
      profile_id: profile.id,
      title: "My Page",
    })
    .select("*, page_elements(*)")
    .single();

  if (createError) {
    throw new Error(createError.message);
  }

  return newPage as EditorPage;
}

export async function savePageAction(
  pageId: string,
  title: string,
  elements: DraftElement[]
): Promise<EditorPage> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error: updateError } = await supabase
    .from("pages")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", pageId)
    .eq("user_id", user.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const { error: deleteError } = await supabase
    .from("page_elements")
    .delete()
    .eq("page_id", pageId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (elements.length > 0) {
    const elementsToInsert = elements.map((el) => ({
      page_id: pageId,
      user_id: user.id,
      element_type: el.element_type,
      content: el.content as Json,
      position: el.position,
      properties: el.properties as Json,
    }));

    const { error: insertError } = await supabase
      .from("page_elements")
      .insert(elementsToInsert);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  const { data: updatedPage, error: fetchError } = await supabase
    .from("pages")
    .select("*, page_elements(*)")
    .eq("id", pageId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  return updatedPage as EditorPage;
}

export async function updatePageVisibilityAction(
  pageId: string,
  visibility: "public" | "private"
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("pages")
    .update({ visibility })
    .eq("id", pageId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}
