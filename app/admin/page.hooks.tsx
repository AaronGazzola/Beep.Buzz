"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFlaggedContentAction,
  updateFlagStatusAction,
  getPendingStickerDesignsAction,
  updateStickerApprovalAction,
  getModerationLogsAction,
  removeContentAction,
} from "./page.actions";
import type { FlagStatus, ApprovalStatus, ContentType } from "../layout.types";

export function useFlaggedContent() {
  return useQuery({
    queryKey: ["flaggedContent"],
    queryFn: getFlaggedContentAction,
  });
}

export function useUpdateFlagStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ flagId, status }: { flagId: string; status: FlagStatus }) =>
      updateFlagStatusAction(flagId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flaggedContent"] });
    },
  });
}

export function usePendingStickerDesigns() {
  return useQuery({
    queryKey: ["pendingStickerDesigns"],
    queryFn: getPendingStickerDesignsAction,
  });
}

export function useUpdateStickerApproval() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ designId, status }: { designId: string; status: ApprovalStatus }) =>
      updateStickerApprovalAction(designId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingStickerDesigns"] });
    },
  });
}

export function useModerationLogs() {
  return useQuery({
    queryKey: ["moderationLogs"],
    queryFn: getModerationLogsAction,
  });
}

export function useRemoveContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contentType,
      contentId,
      reason,
    }: {
      contentType: ContentType;
      contentId: string;
      reason: string;
    }) => removeContentAction(contentType, contentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderationLogs"] });
      queryClient.invalidateQueries({ queryKey: ["flaggedContent"] });
    },
  });
}
