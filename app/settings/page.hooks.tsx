"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserSettingsAction,
  updateIdentityAction,
  manageStickerAction,
  fetchAnalyticsAction,
} from "./page.actions";
import type { IdentityUpdateData, StickerManagementData } from "./page.types";
import { useIdentityStore } from "./page.stores";

export function useUserSettings() {
  const { setProfile, setSticker, setEmail } = useIdentityStore();

  return useQuery({
    queryKey: ["userSettings"],
    queryFn: async () => {
      const data = await fetchUserSettingsAction();
      setProfile(data.profile);
      setSticker(data.sticker);
      setEmail(data.email || null);
      return data;
    },
  });
}

export function useIdentityUpdate() {
  const queryClient = useQueryClient();
  const { updateUsername, updateStickerType, updateStickerStyle } =
    useIdentityStore();

  return useMutation({
    mutationFn: (data: IdentityUpdateData) => updateIdentityAction(data),
    onSuccess: (_, data) => {
      if (data.username) {
        updateUsername(data.username);
      }
      if (data.stickerType) {
        updateStickerType(data.stickerType);
      }
      if (data.stickerStyle) {
        updateStickerStyle(data.stickerStyle);
      }
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useStickerManagement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StickerManagementData) => manageStickerAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stickerAnalytics"] });
    },
  });
}

export function useStickerAnalytics() {
  return useQuery({
    queryKey: ["stickerAnalytics"],
    queryFn: fetchAnalyticsAction,
  });
}
