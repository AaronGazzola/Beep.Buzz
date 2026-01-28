"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrCreatePageAction,
  savePageAction,
  updatePageVisibilityAction,
} from "./page.actions";
import { useEditorStore } from "./page.stores";
import { useEffect } from "react";
import type { DraftElement } from "./page.types";

export function useEditorPage() {
  const { setPage, setDraftElements, setHasUnsavedChanges } = useEditorStore();

  const query = useQuery({
    queryKey: ["editorPage"],
    queryFn: getOrCreatePageAction,
  });

  useEffect(() => {
    if (query.data) {
      setPage(query.data);
      const elements: DraftElement[] = query.data.page_elements.map((el) => ({
        id: el.id,
        element_type: el.element_type,
        content: el.content as Record<string, unknown>,
        position: el.position,
        properties: el.properties as Record<string, unknown>,
      }));
      setDraftElements(elements.sort((a, b) => a.position - b.position));
      setHasUnsavedChanges(false);
    }
  }, [query.data, setPage, setDraftElements, setHasUnsavedChanges]);

  return query;
}

export function useSavePage() {
  const queryClient = useQueryClient();
  const { setPage, setHasUnsavedChanges } = useEditorStore();

  return useMutation({
    mutationFn: ({
      pageId,
      title,
      elements,
    }: {
      pageId: string;
      title: string;
      elements: DraftElement[];
    }) => savePageAction(pageId, title, elements),
    onSuccess: (data) => {
      setPage(data);
      setHasUnsavedChanges(false);
      queryClient.invalidateQueries({ queryKey: ["editorPage"] });
      queryClient.invalidateQueries({ queryKey: ["profilePage"] });
    },
  });
}

export function useUpdatePageVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      visibility,
    }: {
      pageId: string;
      visibility: "public" | "private";
    }) => updatePageVisibilityAction(pageId, visibility),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editorPage"] });
    },
  });
}
