"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/app/layout.stores";
import { supabase } from "@/supabase/browser-client";
import { getDirectMessagesAction, sendDirectMessageAction } from "./page.actions";
import type { DirectMessage } from "./page.types";

export function useDirectMessages(partnerUserId: string) {
  return useInfiniteQuery({
    queryKey: ["directMessages", partnerUserId],
    queryFn: async ({ pageParam }) => {
      return getDirectMessagesAction(partnerUserId, pageParam as string | undefined);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1].created_at ?? undefined;
    },
    staleTime: 0,
  });
}

export function useRealtimeDirectMessages(partnerUserId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user || !partnerUserId) return;

    const channel = supabase
      .channel(`direct-messages:${[user.id, partnerUserId].sort().join(":")}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "direct_messages",
        },
        (payload) => {
          const msg = payload.new as DirectMessage;
          const isRelevant =
            (msg.sender_id === user.id && msg.recipient_id === partnerUserId) ||
            (msg.sender_id === partnerUserId && msg.recipient_id === user.id);

          if (!isRelevant) return;

          queryClient.setQueryData(
            ["directMessages", partnerUserId],
            (old: { pages: DirectMessage[][]; pageParams: unknown[] } | undefined) => {
              if (!old) return old;
              const alreadyExists = old.pages.some((page) => page.some((m) => m.id === msg.id));
              if (alreadyExists) return old;
              const firstPage = [msg, ...(old.pages[0] ?? [])].sort(
                (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
              );
              return { ...old, pages: [firstPage, ...old.pages.slice(1)] };
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, partnerUserId, queryClient]);
}

export function useSendDirectMessage(partnerUserId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      recipientId,
      message,
      morseCode,
    }: {
      recipientId: string;
      message: string;
      morseCode: string;
    }) => sendDirectMessageAction(recipientId, message, morseCode),
    onSuccess: (newMessage) => {
      queryClient.setQueryData(
        ["directMessages", partnerUserId],
        (old: { pages: DirectMessage[][]; pageParams: unknown[] } | undefined) => {
          if (!old) return old;
          const alreadyExists = old.pages.some((page) => page.some((m) => m.id === newMessage.id));
          if (alreadyExists) return old;
          const firstPage = [newMessage, ...(old.pages[0] ?? [])].sort(
            (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
          );
          return { ...old, pages: [firstPage, ...old.pages.slice(1)] };
        }
      );
    },
  });
}

export function useMorseSignals(
  partnerUserId: string,
  onSignal: (signal: string, fromUserId: string) => void
) {
  const { user } = useAuthStore();
  const broadcastChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const onSignalRef = useRef(onSignal);
  onSignalRef.current = onSignal;

  useEffect(() => {
    if (!user || !partnerUserId) return;

    const channelName = `direct:${[user.id, partnerUserId].sort().join(":")}`;
    const tapChannel = supabase
      .channel(channelName, {
        config: { broadcast: { self: false } },
      })
      .on("broadcast", { event: "signal" }, ({ payload }) => {
        onSignalRef.current(payload.signal, payload.userId);
      })
      .subscribe();

    broadcastChannelRef.current = tapChannel;

    return () => {
      supabase.removeChannel(tapChannel);
      broadcastChannelRef.current = null;
    };
  }, [user, partnerUserId]);

  const broadcastSignal = useCallback(
    (signal: string) => {
      if (!broadcastChannelRef.current || !user) return;
      broadcastChannelRef.current.send({
        type: "broadcast",
        event: "signal",
        payload: { userId: user.id, signal },
      });
    },
    [user]
  );

  return { broadcastSignal };
}
