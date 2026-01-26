"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchFlaggedContentAction,
  moderateContentAction,
  fetchStickersForApprovalAction,
  approveStickerAction,
} from "./page.actions";
import type {
  ContentModerationData,
  FlagStatus,
  StickerApprovalData,
} from "./page.types";
import { useFlaggedContentStore } from "./page.stores";
import { useModerationQueueStore } from "./layout.stores";

export function useFlaggedContent(status?: FlagStatus) {
  const setItems = useFlaggedContentStore((state) => state.setItems);

  return useQuery({
    queryKey: ["flaggedContent", status],
    queryFn: async () => {
      const data = await fetchFlaggedContentAction(status);
      setItems(data);
      return data;
    },
  });
}

export function useContentModeration() {
  const queryClient = useQueryClient();
  const updateItemStatus = useFlaggedContentStore(
    (state) => state.updateItemStatus
  );
  const decrementPending = useModerationQueueStore(
    (state) => state.decrementPending
  );

  return useMutation({
    mutationFn: (data: ContentModerationData) => moderateContentAction(data),
    onSuccess: (_, { flagId, action }) => {
      updateItemStatus(flagId, action);
      decrementPending();
      queryClient.invalidateQueries({ queryKey: ["flaggedContent"] });
      queryClient.invalidateQueries({ queryKey: ["moderationQueue"] });
    },
  });
}

export function useStickerApproval() {
  const queryClient = useQueryClient();

  const stickersQuery = useQuery({
    queryKey: ["stickersForApproval"],
    queryFn: fetchStickersForApprovalAction,
  });

  const approveMutation = useMutation({
    mutationFn: (data: StickerApprovalData) => approveStickerAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stickersForApproval"] });
    },
  });

  return {
    stickers: stickersQuery,
    approve: approveMutation,
  };
}
