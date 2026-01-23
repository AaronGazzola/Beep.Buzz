"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserPagesAction,
  createPageAction,
  getPageElementsAction,
  addContentElementsAction,
  manipulateElementsAction,
  deleteElementsAction,
} from "./page.actions";
import { useContentElementsStore } from "./page.stores";
import type { ContentElementsData, ElementManipulationData, DeleteElementsData } from "./page.types";

export function useUserPages() {
  return useQuery({
    queryKey: ["userPages"],
    queryFn: () => getUserPagesAction(),
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => createPageAction(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPages"] });
    },
  });
}

export function usePageElements(pageId: string | null) {
  const setElements = useContentElementsStore((state) => state.setElements);

  return useQuery({
    queryKey: ["pageElements", pageId],
    queryFn: async () => {
      if (!pageId) return [];
      const elements = await getPageElementsAction(pageId);
      setElements(elements);
      return elements;
    },
    enabled: !!pageId,
  });
}

export function useContentElements() {
  const queryClient = useQueryClient();
  const addElement = useContentElementsStore((state) => state.addElement);

  return useMutation({
    mutationFn: (data: ContentElementsData) => addContentElementsAction(data),
    onSuccess: (newElement) => {
      addElement(newElement);
      queryClient.invalidateQueries({ queryKey: ["pageElements"] });
    },
  });
}

export function useElementManipulation() {
  const queryClient = useQueryClient();
  const updateElement = useContentElementsStore((state) => state.updateElement);

  return useMutation({
    mutationFn: (data: ElementManipulationData) => manipulateElementsAction(data),
    onSuccess: (updatedElement) => {
      updateElement(updatedElement.id, updatedElement);
      queryClient.invalidateQueries({ queryKey: ["pageElements"] });
    },
  });
}

export function useDeleteElements() {
  const queryClient = useQueryClient();
  const removeElement = useContentElementsStore((state) => state.removeElement);

  return useMutation({
    mutationFn: (data: DeleteElementsData) => deleteElementsAction(data),
    onSuccess: (_, variables) => {
      removeElement(variables.id);
      queryClient.invalidateQueries({ queryKey: ["pageElements"] });
    },
  });
}
