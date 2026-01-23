"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchModerationQueueAction } from "./layout.actions";
import { useModerationQueueStore } from "./layout.stores";

export function useModerationQueue() {
  const setQueue = useModerationQueueStore((state) => state.setQueue);

  return useQuery({
    queryKey: ["moderationQueue"],
    queryFn: async () => {
      const data = await fetchModerationQueueAction();
      setQueue(data.items, data.count);
      return data;
    },
    refetchInterval: 30000,
  });
}
