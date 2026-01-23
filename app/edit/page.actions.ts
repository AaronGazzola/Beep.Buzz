"use server";

import { createClient } from "@/supabase/server-client";
import type { ContentElementsData, ElementManipulationData, DeleteElementsData } from "./page.types";

export async function getUserPagesAction() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    console.error(profileError);
    throw new Error("Profile not found");
  }

  const { data: pages, error: pagesError } = await supabase
    .from("pages")
    .select("*")
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  if (pagesError) {
    console.error(pagesError);
    throw new Error("Failed to fetch pages");
  }

  return { profile, pages: pages || [] };
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

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError) {
    console.error(profileError);
    throw new Error("Profile not found");
  }

  const { data: page, error } = await supabase
    .from("pages")
    .insert({
      profile_id: profile.id,
      user_id: user.id,
      title,
      status: "ACTIVE",
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create page");
  }

  return page;
}

export async function getPageElementsAction(pageId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: elements, error } = await supabase
    .from("page_elements")
    .select("*")
    .eq("page_id", pageId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch elements");
  }

  return elements || [];
}

export async function addContentElementsAction(data: ContentElementsData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: element, error } = await supabase
    .from("page_elements")
    .insert({
      page_id: data.page_id,
      user_id: user.id,
      element_type: data.element_type,
      content: data.content,
      position: data.position,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to add element");
  }

  return element;
}

export async function manipulateElementsAction(data: ElementManipulationData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const updateData: any = {};
  if (data.content) updateData.content = data.content;
  if (data.position) updateData.position = data.position;

  const { data: element, error } = await supabase
    .from("page_elements")
    .update(updateData)
    .eq("id", data.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to update element");
  }

  return element;
}

export async function deleteElementsAction(data: DeleteElementsData) {
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
    .eq("id", data.id)
    .eq("user_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to delete element");
  }

  return { success: true };
}
