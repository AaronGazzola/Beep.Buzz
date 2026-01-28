"use server";

import { createClient } from "@/supabase/server-client";
import type { Category } from "./layout.types";
import type { PageWithProfile } from "./page.types";

export async function getFeaturedPagesAction(): Promise<PageWithProfile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pages")
    .select("*, profiles(*)")
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) {
    throw new Error(error.message);
  }

  return data as PageWithProfile[];
}

export async function searchPagesAction(
  query: string,
  categoryId?: string
): Promise<PageWithProfile[]> {
  const supabase = await createClient();

  let queryBuilder = supabase
    .from("pages")
    .select("*, profiles(*)")
    .eq("visibility", "public");

  if (query) {
    queryBuilder = queryBuilder.or(
      `title.ilike.%${query}%,meta_description.ilike.%${query}%`
    );
  }

  if (categoryId) {
    const { data: pageCategories } = await supabase
      .from("page_categories")
      .select("page_id")
      .eq("category_id", categoryId);

    if (pageCategories && pageCategories.length > 0) {
      const pageIds = pageCategories.map((pc) => pc.page_id);
      queryBuilder = queryBuilder.in("id", pageIds);
    } else {
      return [];
    }
  }

  const { data, error } = await queryBuilder
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  return data as PageWithProfile[];
}

export async function getRandomPageAction(): Promise<PageWithProfile | null> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("pages")
    .select("*", { count: "exact", head: true })
    .eq("visibility", "public");

  if (!count || count === 0) {
    return null;
  }

  const randomOffset = Math.floor(Math.random() * count);

  const { data, error } = await supabase
    .from("pages")
    .select("*, profiles(*)")
    .eq("visibility", "public")
    .range(randomOffset, randomOffset)
    .single();

  if (error) {
    return null;
  }

  return data as PageWithProfile;
}

export async function getCategoriesAction(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
