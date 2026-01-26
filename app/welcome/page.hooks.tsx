"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import {
  validateUsernameAction,
  customizeStickerIdentityAction,
} from "./page.actions";
import type { UsernameValidationData, StickerIdentityData } from "./page.types";
import { useStickerIdentityStore } from "./page.stores";

export function useUsernameValidation(username: string) {
  return useQuery({
    queryKey: ["usernameValidation", username],
    queryFn: () =>
      validateUsernameAction({ username } as UsernameValidationData),
    enabled: username.length >= 3,
    staleTime: 5000,
  });
}

export function useStickerIdentity() {
  const queryClient = useQueryClient();
  const reset = useStickerIdentityStore((state) => state.reset);

  return useMutation({
    mutationFn: (data: StickerIdentityData) =>
      customizeStickerIdentityAction(data),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
