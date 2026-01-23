"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { validateUsernameAction, customizeStickerIdentityAction } from "./page.actions";
import { useUsernameValidationStore, useStickerIdentityStore } from "./page.stores";

export function useUsernameValidation(username: string) {
  const setValidation = useUsernameValidationStore((state) => state.setValidation);

  return useQuery({
    queryKey: ["usernameValidation", username],
    queryFn: async () => {
      const result = await validateUsernameAction(username);
      setValidation(result.isValid, result.isAvailable);
      return result;
    },
    enabled: username.length >= 3,
    staleTime: 0,
  });
}

export function useStickerIdentity() {
  const { beep_style, buzz_style } = useStickerIdentityStore();

  return useMutation({
    mutationFn: (username: string) =>
      customizeStickerIdentityAction({
        username,
        beep_style,
        buzz_style,
      }),
  });
}
