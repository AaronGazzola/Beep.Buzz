import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/supabase/browser-client";
import { useMatchStore } from "./page.stores";
import {
  getMatchAction,
  getMatchMessagesAction,
  submitTranslationAction,
  endMatchAction,
} from "./page.actions";
import type { TranslationSubmission, MatchMessage } from "./page.types";

export function useMatchState(matchId: string) {
  const { setMatch, setMessages } = useMatchStore();

  const matchQuery = useQuery({
    queryKey: ["match", matchId],
    queryFn: () => getMatchAction(matchId),
  });

  const messagesQuery = useQuery({
    queryKey: ["matchMessages", matchId],
    queryFn: () => getMatchMessagesAction(matchId),
  });

  useEffect(() => {
    if (matchQuery.data) {
      setMatch(matchQuery.data);
    }
  }, [matchQuery.data, setMatch]);

  useEffect(() => {
    if (messagesQuery.data) {
      setMessages(messagesQuery.data);
    }
  }, [messagesQuery.data, setMessages]);

  return {
    match: matchQuery.data,
    messages: messagesQuery.data,
    isLoading: matchQuery.isLoading || messagesQuery.isLoading,
    error: matchQuery.error || messagesQuery.error,
  };
}

export function useMatchMessages(matchId: string, userId: string) {
  const queryClient = useQueryClient();
  const { addMessage } = useMatchStore();

  useEffect(() => {
    const channel = supabase
      .channel(`match:${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "match_messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMessage = payload.new as MatchMessage;
          addMessage(newMessage);
          queryClient.invalidateQueries({ queryKey: ["matchMessages", matchId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, userId, addMessage, queryClient]);
}

export function useSubmitTranslation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (submission: TranslationSubmission) =>
      submitTranslationAction(submission),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["matchMessages", variables.matchId],
      });
    },
  });
}

export function useEndMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: string) => endMatchAction(matchId),
    onSuccess: (_, matchId) => {
      queryClient.invalidateQueries({ queryKey: ["match", matchId] });
    },
  });
}
