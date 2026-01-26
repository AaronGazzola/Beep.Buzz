"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchModerationQueueAction,
  checkAdminAccessAction,
} from "./layout.actions";
import { useModerationQueueStore } from "./layout.stores";

export function useModerationQueue() {
  const setQueueData = useModerationQueueStore((state) => state.setQueueData);

  return useQuery({
    queryKey: ["moderationQueue"],
    queryFn: async () => {
      const data = await fetchModerationQueueAction();
      setQueueData(data);
      return data;
    },
    refetchInterval: 30000,
  });
}

export function useAdminAccess() {
  return useQuery({
    queryKey: ["adminAccess"],
    queryFn: checkAdminAccessAction,
  });
}
