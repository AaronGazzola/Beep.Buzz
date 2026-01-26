"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserPageAction,
  createPageAction,
  updatePageStatusAction,
  contentBlocksAction,
  updateContentBlockAction,
  deleteContentBlockAction,
  elementDragAction,
  elementResizeAction,
} from "./page.actions";
import type {
  ContentBlockData,
  ElementDragData,
  ElementResizeData,
  PageStatus,
} from "./page.types";
import { useContentBlocksStore } from "./page.stores";

export function useUserPage() {
  const setElements = useContentBlocksStore((state) => state.setElements);

  return useQuery({
    queryKey: ["userPage"],
    queryFn: async () => {
      const result = await fetchUserPageAction();
      if (result.page?.page_elements) {
        setElements(result.page.page_elements);
      }
      return result;
    },
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => createPageAction(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPage"] });
    },
  });
}

export function useUpdatePageStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, status }: { pageId: string; status: PageStatus }) =>
      updatePageStatusAction(pageId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPage"] });
    },
  });
}

export function useContentBlocks() {
  const queryClient = useQueryClient();
  const addElement = useContentBlocksStore((state) => state.addElement);

  return useMutation({
    mutationFn: ({
      pageId,
      data,
    }: {
      pageId: string;
      data: ContentBlockData;
    }) => contentBlocksAction(pageId, data),
    onSuccess: (element) => {
      addElement(element);
      queryClient.invalidateQueries({ queryKey: ["userPage"] });
    },
  });
}

export function useUpdateContentBlock() {
  const queryClient = useQueryClient();
  const updateElement = useContentBlocksStore((state) => state.updateElement);

  return useMutation({
    mutationFn: ({
      elementId,
      content,
    }: {
      elementId: string;
      content: ContentBlockData["content"];
    }) => updateContentBlockAction(elementId, content),
    onSuccess: (_, { elementId, content }) => {
      updateElement(elementId, { content });
      queryClient.invalidateQueries({ queryKey: ["userPage"] });
    },
  });
}

export function useDeleteContentBlock() {
  const queryClient = useQueryClient();
  const removeElement = useContentBlocksStore((state) => state.removeElement);

  return useMutation({
    mutationFn: (elementId: string) => deleteContentBlockAction(elementId),
    onSuccess: (_, elementId) => {
      removeElement(elementId);
      queryClient.invalidateQueries({ queryKey: ["userPage"] });
    },
  });
}

export function useElementDrag() {
  const queryClient = useQueryClient();
  const reorderElements = useContentBlocksStore(
    (state) => state.reorderElements
  );

  return useMutation({
    mutationFn: (data: ElementDragData) => elementDragAction(data),
    onMutate: async ({ elementId, newPosition }) => {
      const elements = useContentBlocksStore.getState().elements;
      const currentIndex = elements.findIndex((el) => el.id === elementId);
      if (currentIndex !== -1) {
        reorderElements(currentIndex, newPosition);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPage"] });
    },
  });
}

export function useElementResize() {
  const queryClient = useQueryClient();
  const updateElement = useContentBlocksStore((state) => state.updateElement);

  return useMutation({
    mutationFn: (data: ElementResizeData) => elementResizeAction(data),
    onSuccess: (_, { elementId, width, height }) => {
      const element = useContentBlocksStore
        .getState()
        .elements.find((el) => el.id === elementId);
      if (element) {
        const updatedContent = {
          ...(element.content as object),
          ...(width !== undefined && { width }),
          ...(height !== undefined && { height }),
        };
        updateElement(elementId, { content: updatedContent });
      }
      queryClient.invalidateQueries({ queryKey: ["userPage"] });
    },
  });
}
