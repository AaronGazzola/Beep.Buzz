"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProfilePageAction,
  fetchUserStickerAction,
  placeStickerAction,
  removeStickerPlacementAction,
} from "./page.actions";
import type { StickerPlacementData } from "./page.types";

export function useProfilePage(username: string) {
  return useQuery({
    queryKey: ["profilePage", username],
    queryFn: () => fetchProfilePageAction(username),
  });
}

export function useUserSticker() {
  return useQuery({
    queryKey: ["userSticker"],
    queryFn: fetchUserStickerAction,
  });
}

export function useStickerPlacement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StickerPlacementData) => placeStickerAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profilePage"] });
    },
  });
}

export function useRemoveStickerPlacement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (placementId: string) => removeStickerPlacementAction(placementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profilePage"] });
    },
  });
}
