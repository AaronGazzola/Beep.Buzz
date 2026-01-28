"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateProfileIconsAction,
  getStickerActivityAction,
  removePlacedStickerAction,
  getStickerAnalyticsAction,
} from "./page.actions";
import { useSettingsStore } from "./page.stores";

export function useUpdateProfileIcons() {
  const queryClient = useQueryClient();
  const { setHasChanges } = useSettingsStore();

  return useMutation({
    mutationFn: ({
      beepDesign,
      buzzDesign,
    }: {
      beepDesign: { emoji: string; color: string };
      buzzDesign: { emoji: string; color: string };
    }) => updateProfileIconsAction(beepDesign, buzzDesign),
    onSuccess: () => {
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export function useStickerActivity() {
  return useQuery({
    queryKey: ["stickerActivity"],
    queryFn: getStickerActivityAction,
  });
}

export function useRemovePlacedSticker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stickerId: string) => removePlacedStickerAction(stickerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stickerActivity"] });
      queryClient.invalidateQueries({ queryKey: ["stickerAnalytics"] });
    },
  });
}

export function useStickerAnalytics() {
  return useQuery({
    queryKey: ["stickerAnalytics"],
    queryFn: getStickerAnalyticsAction,
  });
}
