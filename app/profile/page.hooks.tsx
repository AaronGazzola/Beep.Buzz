import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/app/layout.stores";
import {
  getProfileAction,
  updateUsernameAction,
  updateCharacterSettingsAction,
} from "./page.actions";
import type { CharacterSettings } from "./page.types";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfileAction,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateUsername() {
  const queryClient = useQueryClient();
  const { setProfile } = useAuthStore();

  return useMutation({
    mutationFn: updateUsernameAction,
    onSuccess: async () => {
      toast.success("Username updated");
      const updated = await queryClient.fetchQuery({
        queryKey: ["profile"],
        queryFn: getProfileAction,
        staleTime: 0,
      });
      setProfile(updated);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update username");
    },
  });
}

export function useUpdateCharacter() {
  const queryClient = useQueryClient();
  const { profile, setProfile } = useAuthStore();

  return useMutation({
    mutationFn: (settings: CharacterSettings) =>
      updateCharacterSettingsAction(settings),
    onSuccess: (_, settings) => {
      if (profile) {
        setProfile({ ...profile, character_settings: settings });
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to save character");
    },
  });
}
