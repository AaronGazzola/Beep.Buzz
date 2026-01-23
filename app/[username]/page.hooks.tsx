"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProfileAction, placeStickersAction } from "./page.actions";
import { usePlaceStickersStore } from "./page.stores";
import type { PlaceStickersData } from "./page.types";

export function useUserProfile(username: string) {
  const setStickers = usePlaceStickersStore((state) => state.setStickers);

  return useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const data = await getUserProfileAction(username);
      setStickers(data.stickers);
      return data;
    },
  });
}

export function usePlaceStickers() {
  const queryClient = useQueryClient();
  const addSticker = usePlaceStickersStore((state) => state.addSticker);

  return useMutation({
    mutationFn: (data: PlaceStickersData) => placeStickersAction(data),
    onSuccess: (newSticker) => {
      addSticker(newSticker);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
