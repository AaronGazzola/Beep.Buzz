"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfilePageDataAction,
  addStickerAction,
  removeStickerAction,
} from "./page.actions";

export function useProfilePageData(username: string) {
  return useQuery({
    queryKey: ["profilePage", username],
    queryFn: () => getProfilePageDataAction(username),
    enabled: !!username,
  });
}

export function useAddSticker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      pageId,
      stickerType,
      positionX,
      positionY,
    }: {
      pageId: string;
      stickerType: "beep" | "buzz";
      positionX: number;
      positionY: number;
    }) => addStickerAction(pageId, stickerType, positionX, positionY),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profilePage"] });
    },
  });
}

export function useRemoveSticker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stickerId: string) => removeStickerAction(stickerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profilePage"] });
    },
  });
}
