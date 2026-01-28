"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUserAction,
  getProfileByUsernameAction,
  updateProfileAction,
  createProfileAction,
  checkUsernameAvailableAction,
} from "./layout.actions";
import { useAuthStore } from "./layout.stores";
import { useEffect } from "react";
import type { Profile } from "./layout.types";

export function useCurrentUser() {
  const { setUser, setProfile, setIsLoading } = useAuthStore();

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await getCurrentUserAction();
      setUser(result.user);
      setProfile(result.profile);
      setIsLoading(false);
      return result;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.isError) {
      setIsLoading(false);
    }
  }, [query.isError, setIsLoading]);

  return query;
}

export function useProfileByUsername(username: string) {
  return useQuery({
    queryKey: ["profile", username],
    queryFn: () => getProfileByUsernameAction(username),
    enabled: !!username,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setProfile } = useAuthStore();

  return useMutation({
    mutationFn: ({
      profileId,
      updates,
    }: {
      profileId: string;
      updates: Partial<Pick<Profile, "username" | "beep_design" | "buzz_design">>;
    }) => updateProfileAction(profileId, updates),
    onSuccess: (data) => {
      if (data) {
        setProfile(data);
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      }
    },
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  const { setProfile } = useAuthStore();

  return useMutation({
    mutationFn: (username: string) => createProfileAction(username),
    onSuccess: (data) => {
      if (data) {
        setProfile(data);
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      }
    },
  });
}

export function useCheckUsernameAvailable() {
  return useMutation({
    mutationFn: (username: string) => checkUsernameAvailableAction(username),
  });
}
