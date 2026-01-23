"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateStickerIdentityAction, fetchStickerActivityAction, getCurrentProfileAction } from "./page.actions";
import { useStickerIdentityStore } from "./page.stores";
import type { StickerIdentityData } from "./page.types";

export function useCurrentProfile() {
  const setStyles = useStickerIdentityStore((state) => state.setStyles);

  return useQuery({
    queryKey: ["currentProfile"],
    queryFn: async () => {
      const profile = await getCurrentProfileAction();
      setStyles(profile.beep_style as any, profile.buzz_style as any);
      return profile;
    },
  });
}

export function useUpdateStickerIdentity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StickerIdentityData) => updateStickerIdentityAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentProfile"] });
    },
  });
}

export function useStickerActivity() {
  return useQuery({
    queryKey: ["stickerActivity"],
    queryFn: () => fetchStickerActivityAction(),
  });
}
