"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getFeaturedPagesAction,
  searchPagesAction,
  getRandomPageAction,
  getCategoriesAction,
} from "./page.actions";

export function useFeaturedPages() {
  return useQuery({
    queryKey: ["featuredPages"],
    queryFn: getFeaturedPagesAction,
  });
}

export function useSearchPages(query: string, categoryId?: string) {
  return useQuery({
    queryKey: ["searchPages", query, categoryId],
    queryFn: () => searchPagesAction(query, categoryId),
    enabled: !!query || !!categoryId,
  });
}

export function useRandomPage() {
  return useMutation({
    mutationFn: getRandomPageAction,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAction,
    staleTime: 1000 * 60 * 10,
  });
}
