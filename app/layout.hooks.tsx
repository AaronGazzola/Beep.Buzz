"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOutUserAction } from "./layout.actions";
import { useRouter } from "next/navigation";

export function useSignOutUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => signOutUserAction(),
    onSuccess: () => {
      queryClient.clear();
      router.push("/sign-in");
    },
  });
}
