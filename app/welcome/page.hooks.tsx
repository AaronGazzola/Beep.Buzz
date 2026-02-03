import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getCurrentProfileAction } from "@/app/layout.actions";
import { updateProfileSettingsAction } from "./page.actions";
import type { ProfileUpdateParams } from "./page.types";

export function useCurrentProfile() {
  return useQuery({
    queryKey: ["currentProfile"],
    queryFn: getCurrentProfileAction,
  });
}

export function useUpdateProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ProfileUpdateParams) =>
      updateProfileSettingsAction(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentProfile"] });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/");
    },
  });
}
