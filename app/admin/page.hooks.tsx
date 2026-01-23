"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFlaggedContentAction, moderateContentAction, manageUsersAction } from "./page.actions";
import { useFlaggedContentStore } from "./page.stores";
import type { ModerateContentData, UserManagementData, ContentStatus } from "./page.types";

export function useFlaggedContent(filterStatus?: ContentStatus | "ALL") {
  const setItems = useFlaggedContentStore((state) => state.setItems);

  return useQuery({
    queryKey: ["flaggedContent", filterStatus],
    queryFn: async () => {
      const data = await fetchFlaggedContentAction(filterStatus);
      setItems(data);
      return data;
    },
  });
}

export function useModerateContent() {
  const queryClient = useQueryClient();
  const removeItem = useFlaggedContentStore((state) => state.removeItem);

  return useMutation({
    mutationFn: (data: ModerateContentData) => moderateContentAction(data),
    onSuccess: (_, variables) => {
      removeItem(variables.id);
      queryClient.invalidateQueries({ queryKey: ["flaggedContent"] });
      queryClient.invalidateQueries({ queryKey: ["moderationQueue"] });
    },
  });
}

export function useUserManagement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserManagementData) => manageUsersAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flaggedContent"] });
    },
  });
}
