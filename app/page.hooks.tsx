import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { textToMorse, playMorseAudio, morseToText } from "@/lib/morse.utils";
import { useAuthStore } from "./layout.stores";
import { useGameStore } from "./page.stores";
import {
  getLearnedLettersAction,
  saveLearnedLettersAction,
  createMatchAction,
  getCurrentMatchAction,
  cancelMatchAction,
  getPartnerProfileAction,
  sendMatchMessageAction,
  getMatchMessagesAction,
} from "./page.actions";
import { supabase } from "@/supabase/browser-client";
import type { ChatMessage, LearnedLetter, Match, MatchMessage } from "./page.types";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function useMorseDemo() {
  const [inputText, setInputText] = useState("");
  const [morseCode, setMorseCode] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTextChange = (text: string) => {
    setInputText(text);
    setMorseCode(textToMorse(text));
  };

  const handlePlayAudio = async () => {
    if (!morseCode || isPlaying) return;

    setIsPlaying(true);
    try {
      await playMorseAudio(morseCode, {
        volume: 0.5,
        wpm: 20,
        frequency: 600,
      });
    } finally {
      setIsPlaying(false);
    }
  };

  return {
    inputText,
    morseCode,
    isPlaying,
    handleTextChange,
    handlePlayAudio,
  };
}

export function useLearnedLetters() {
  const { isAuthenticated, user } = useAuthStore();
  const { setLearnedLetters } = useGameStore();

  const query = useQuery({
    queryKey: ["learnedLetters", user?.id],
    queryFn: async () => {
      const letters = await getLearnedLettersAction();
      return letters;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data && query.data.length > 0) {
      setLearnedLetters(query.data);
    }
  }, [query.data, setLearnedLetters]);

  return query;
}

export function useSaveLearnedLetters() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (learnedLetters: LearnedLetter[]) => {
      return saveLearnedLettersAction(learnedLetters);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learnedLetters"] });
    },
  });
}

export function useLearnedLettersSync() {
  const { isAuthenticated } = useAuthStore();
  const learnedLetters = useGameStore((state) => state.learnedLetters);
  const saveLearnedLetters = useSaveLearnedLetters();
  const prevLettersRef = useRef<string>("");

  useEffect(() => {
    if (!isAuthenticated || learnedLetters.length === 0) return;

    const currentLetters = JSON.stringify(learnedLetters);
    if (currentLetters === prevLettersRef.current) return;

    prevLettersRef.current = currentLetters;
    saveLearnedLetters.mutate(learnedLetters);
  }, [isAuthenticated, learnedLetters, saveLearnedLetters]);
}

export function useAIChat() {
  return useMutation({
    mutationFn: async (chatMessages: ChatMessage[]) => {
      const apiMessages = chatMessages
        .filter((msg) => msg.isComplete && msg.text.trim().length > 0)
        .map((msg) => ({
          role: msg.speaker === "beep" ? ("user" as const) : ("assistant" as const),
          content: msg.text,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      return data.text as string;
    },
  });
}

export function useMatchmakingPresence() {
  const { user } = useAuthStore();
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [sharedMatchId, setSharedMatchId] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const queryClient = useQueryClient();
  const partnerIdRef = useRef<string | null>(null);
  const matchingInProgressRef = useRef(false);
  const matchIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      console.error("[MATCHMAKING] No user, skipping matchmaking");
      return;
    }

    console.error("[MATCHMAKING] Joining queue, user:", user.id);

    const matchmakingChannel = supabase.channel("matchmaking:queue", {
      config: {
        presence: { key: user.id },
        broadcast: { self: false }
      },
    });

    matchmakingChannel
      .on("broadcast", { event: "match_created" }, ({ payload }) => {
        console.error("[MATCHMAKING] Match ID received from:", payload.userId, "Match ID:", payload.matchId);
        if (payload.userId === partnerIdRef.current && payload.matchId) {
          console.error("[MATCHMAKING] Confirmed match ID, setting shared match ID:", payload.matchId);
          matchIdRef.current = payload.matchId;
          setSharedMatchId(payload.matchId);
          queryClient.invalidateQueries({ queryKey: ["currentMatch", payload.matchId] });
        }
      })
      .on("presence", { event: "sync" }, () => {
        const state = matchmakingChannel.presenceState();
        const users = Object.keys(state);

        console.error("[MATCHMAKING] Users in queue:", users.length, "Current partner ref:", partnerIdRef.current, "Matching in progress:", matchingInProgressRef.current);

        if (users.length >= 2 && !partnerIdRef.current && !matchingInProgressRef.current) {
          const otherUsers = users.filter((id) => id !== user.id);
          console.error("[MATCHMAKING] ✅ PARTNER AVAILABLE! Other users found:", otherUsers.length);

          if (otherUsers.length > 0) {
            const partner = otherUsers[0];
            console.error("[MATCHMAKING] Selected partner:", partner);

            partnerIdRef.current = partner;
            setPartnerId(partner);
            matchingInProgressRef.current = true;

            const sortedIds = [user.id, partner].sort();
            console.error("[MATCHMAKING] Am I first?", sortedIds[0] === user.id);

            if (sortedIds[0] === user.id) {
              const matchId = crypto.randomUUID();
              console.error("[MATCHMAKING] Creating match with ID:", matchId);

              createMatchAction(partner, matchId).then((match) => {
                console.error("[MATCHMAKING] Match created, broadcasting ID to partner");
                matchmakingChannel.send({
                  type: "broadcast",
                  event: "match_created",
                  payload: { userId: user.id, matchId: match.id },
                });

                console.error("[MATCHMAKING] Setting match ID after broadcast");
                matchIdRef.current = matchId;
                setSharedMatchId(matchId);

                queryClient.setQueryData(["currentMatch", matchId], match);
                queryClient.invalidateQueries({ queryKey: ["currentMatch", matchId] });
              }).catch((error) => {
                console.error("[MATCHMAKING] Error creating match:", error);
                matchingInProgressRef.current = false;
              });
            } else {
              console.error("[MATCHMAKING] Waiting for partner to create match");
            }
          }
        }
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        console.error("[MATCHMAKING] User left:", key);
        if (key === partnerIdRef.current) {
          if (matchIdRef.current) {
            console.error("[MATCHMAKING] Match already established, ignoring leave");
          } else {
            console.error("[MATCHMAKING] Partner left, resetting state");
            partnerIdRef.current = null;
            setPartnerId(null);
            setSharedMatchId(null);
            matchingInProgressRef.current = false;
          }
        }
      })
      .subscribe(async (status) => {
        console.error("[MATCHMAKING] Subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.error("[MATCHMAKING] Announcing presence");
          await matchmakingChannel.track({ status: "searching" });
        } else if (status === "CHANNEL_ERROR") {
          console.error("[MATCHMAKING] Channel error - check Supabase auth and realtime settings");
        } else if (status === "TIMED_OUT") {
          console.error("[MATCHMAKING] Connection timed out");
        } else if (status === "CLOSED") {
          console.error("[MATCHMAKING] Channel closed");
        }
      });

    setChannel(matchmakingChannel);

    return () => {
      console.error("[MATCHMAKING] Leaving queue");
      matchmakingChannel.untrack();
      supabase.removeChannel(matchmakingChannel);
    };
  }, [user, queryClient]);

  return { partnerId, sharedMatchId, channel };
}

export function useCurrentMatch(matchId?: string | null) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ["currentMatch", matchId],
    queryFn: async () => {
      if (!matchId) {
        return null;
      }
      const result = await getCurrentMatchAction(matchId);
      return result;
    },
    enabled: !!user && !!matchId,
    staleTime: 0,
    refetchInterval: 2000,
  });
}

export function useCancelMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: string) => cancelMatchAction(matchId),
    onSuccess: () => {
      queryClient.setQueryData(["currentMatch"], null);
      queryClient.invalidateQueries({ queryKey: ["currentMatch"] });
    },
  });
}

export function usePartnerProfile(userId: string | null | undefined) {
  return useQuery({
    queryKey: ["partnerProfile", userId],
    queryFn: () => getPartnerProfileAction(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useSendMatchMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      matchId,
      message,
      morseCode,
    }: {
      matchId: string;
      message: string;
      morseCode: string;
    }) => sendMatchMessageAction(matchId, message, morseCode),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["matchMessages", variables.matchId],
      });
    },
  });
}

export function useMatchMessages(matchId: string | undefined) {
  const { user } = useAuthStore();
  const { setMatchMessages } = useGameStore();

  const query = useQuery({
    queryKey: ["matchMessages", matchId],
    queryFn: async () => {
      if (!matchId) return [];
      const messages = await getMatchMessagesAction(matchId);
      return messages;
    },
    enabled: !!matchId,
  });

  useEffect(() => {
    if (query.data && user) {
      const chatMessages: ChatMessage[] = query.data.map((msg) => ({
        speaker: msg.user_id === user.id ? "beep" : "buzz",
        morse: msg.morse_code,
        text: msg.message,
        isComplete: true,
      }));

      setMatchMessages(chatMessages);
    }
  }, [query.data, setMatchMessages, user]);

  return query;
}

export function useRealtimeMatchMessages(matchId: string | undefined) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { addChatMessage } = useGameStore();

  return useQuery({
    queryKey: ["realtimeMatchMessages", matchId],
    queryFn: () => {
      if (!matchId) return () => {};

      const channel = supabase
        .channel(`match-messages:${matchId}`)
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

            const chatMessage: ChatMessage = {
              speaker: newMessage.user_id === user?.id ? "beep" : "buzz",
              morse: newMessage.morse_code,
              text: newMessage.message,
              isComplete: true,
            };

            addChatMessage(chatMessage);

            queryClient.invalidateQueries({
              queryKey: ["matchMessages", matchId],
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    },
    enabled: !!matchId && !!user,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
}

export function useRealtimeMorseSignals(
  matchId: string | undefined,
  partnerId: string | undefined
) {
  const { appendToPartnerInput, setPartnerInput } = useGameStore();
  const { user } = useAuthStore();
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!matchId || !user) {
      return;
    }

    const morseChannel = supabase.channel(`match:${matchId}:morse`, {
      config: { broadcast: { self: false } },
    });

    morseChannel
      .on("broadcast", { event: "signal" }, ({ payload }) => {
        if (payload.userId === partnerId) {
          if (payload.signal === "COMPLETE") {
            setPartnerInput("");
          } else {
            appendToPartnerInput(payload.signal);
          }
        }
      })
      .subscribe();

    setChannel(morseChannel);

    return () => {
      supabase.removeChannel(morseChannel);
    };
  }, [matchId, partnerId, user, appendToPartnerInput, setPartnerInput]);

  const broadcastSignal = useCallback(
    (signal: string) => {
      if (!channel || !user) {
        return;
      }

      channel.send({
        type: "broadcast",
        event: "signal",
        payload: { userId: user.id, signal },
      });
    },
    [channel, user]
  );

  return { broadcastSignal };
}
