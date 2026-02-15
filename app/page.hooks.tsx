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
        console.error("Chat API error:", errorText);
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

  useEffect(() => {
    if (!user) return;

    console.log("🎯 [MATCHMAKING] Joining queue, user:", user.id.substring(0, 8));

    const matchmakingChannel = supabase.channel("matchmaking:queue", {
      config: {
        presence: { key: user.id },
        broadcast: { self: false }
      },
    });

    matchmakingChannel
      .on("broadcast", { event: "match_created" }, ({ payload }) => {
        console.log("📨 [MATCH ID RECEIVED] From:", payload.userId?.substring(0, 8), "Match ID:", payload.matchId?.substring(0, 8));
        if (payload.userId === partnerIdRef.current && payload.matchId) {
          console.log("✅ [MATCH ID] Confirmed, setting shared match ID:", payload.matchId.substring(0, 8));
          setSharedMatchId(payload.matchId);
          queryClient.invalidateQueries({ queryKey: ["currentMatch", payload.matchId] });
        }
      })
      .on("presence", { event: "sync" }, () => {
        const state = matchmakingChannel.presenceState();
        const users = Object.keys(state);

        console.log("👥 [PRESENCE SYNC] Users in queue:", users.length, users.map(id => id.substring(0, 8)));
        console.log("🔍 [PRESENCE SYNC] Current partner ref:", partnerIdRef.current?.substring(0, 8) || "none");
        console.log("🔍 [PRESENCE SYNC] Matching in progress:", matchingInProgressRef.current);

        if (users.length >= 2 && !partnerIdRef.current && !matchingInProgressRef.current) {
          const otherUsers = users.filter((id) => id !== user.id);
          console.log("🔍 [PAIRING CHECK] Other users:", otherUsers.map(id => id.substring(0, 8)));

          if (otherUsers.length > 0) {
            const partner = otherUsers[0];
            console.log("🤝 [PAIRING] Selected partner:", partner.substring(0, 8));

            partnerIdRef.current = partner;
            setPartnerId(partner);
            matchingInProgressRef.current = true;

            const sortedIds = [user.id, partner].sort();
            console.log("📋 [PAIRING] My ID:", user.id.substring(0, 8), "Partner:", partner.substring(0, 8), "Am I first?", sortedIds[0] === user.id);

            if (sortedIds[0] === user.id) {
              const matchId = crypto.randomUUID();
              console.log("🆔 [MATCH ID] Generated:", matchId.substring(0, 8));
              console.log("📝 [CREATING MATCH] Creating match with ID:", matchId.substring(0, 8));

              setSharedMatchId(matchId);

              createMatchAction(partner, matchId).then((match) => {
                console.log("✅ [MATCH CREATED]", match.id.substring(0, 8));
                console.log("📤 [BROADCASTING] Sending match ID to partner");
                matchmakingChannel.send({
                  type: "broadcast",
                  event: "match_created",
                  payload: { userId: user.id, matchId: match.id },
                });
                queryClient.setQueryData(["currentMatch", matchId], match);
                queryClient.invalidateQueries({ queryKey: ["currentMatch", matchId] });
              }).catch((error) => {
                console.error("❌ [MATCH ERROR]", error);
                matchingInProgressRef.current = false;
              });
            } else {
              console.log("⏳ [WAITING] Partner will create match and broadcast ID");
            }
          }
        } else if (users.length >= 2) {
          console.log("⏭️ [SKIP] Already have partner, ignoring sync");
        } else {
          console.log("⏳ [WAITING] Not enough users yet");
        }
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        console.log("👋 [USER LEFT]", key.substring(0, 8));
        if (key === partnerIdRef.current) {
          console.log("💔 [PARTNER LEFT] Resetting partner state");
          partnerIdRef.current = null;
          setPartnerId(null);
          setSharedMatchId(null);
          matchingInProgressRef.current = false;
        }
      })
      .subscribe(async (status) => {
        console.log("📡 [SUBSCRIPTION STATUS]", status);
        if (status === "SUBSCRIBED") {
          console.log("✅ [TRACKING] Announcing presence");
          await matchmakingChannel.track({ status: "searching" });
        }
      });

    setChannel(matchmakingChannel);

    return () => {
      console.log("🚪 [LEAVING QUEUE]", user.id.substring(0, 8));
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
        console.log("🔍 [QUERY] No match ID provided, skipping fetch");
        return null;
      }
      console.log("🔍 [QUERY] Fetching match with ID:", matchId.substring(0, 8));
      const result = await getCurrentMatchAction(matchId);
      console.log("📥 [QUERY] Current match result:", result ? {
        id: result.id.substring(0, 8),
        status: result.status,
        user_id: result.user_id.substring(0, 8),
        opponent_id: result.opponent_id?.substring(0, 8)
      } : "null");
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
      console.log("📻 [MORSE SIGNALS] Not subscribing - matchId:", matchId?.substring(0, 8), "user:", !!user);
      return;
    }

    console.log("📻 [MORSE SIGNALS] Subscribing to channel for match:", matchId.substring(0, 8), "partnerId:", partnerId?.substring(0, 8));

    const morseChannel = supabase.channel(`match:${matchId}:morse`, {
      config: { broadcast: { self: false } },
    });

    morseChannel
      .on("broadcast", { event: "signal" }, ({ payload }) => {
        console.log("📨 [MORSE RECEIVED] Signal:", payload.signal, "from:", payload.userId?.substring(0, 8), "expected partner:", partnerId?.substring(0, 8));
        if (payload.userId === partnerId) {
          console.log("✅ [MORSE RECEIVED] Valid partner, processing signal");
          if (payload.signal === "COMPLETE") {
            setPartnerInput("");
          } else {
            appendToPartnerInput(payload.signal);
          }
        } else {
          console.log("❌ [MORSE RECEIVED] Ignoring - not from partner");
        }
      })
      .subscribe((status) => {
        console.log("📻 [MORSE SIGNALS] Subscription status:", status);
      });

    setChannel(morseChannel);

    return () => {
      console.log("📻 [MORSE SIGNALS] Unsubscribing from channel");
      supabase.removeChannel(morseChannel);
    };
  }, [matchId, partnerId, user, appendToPartnerInput, setPartnerInput]);

  const broadcastSignal = useCallback(
    (signal: string) => {
      if (!channel || !user) {
        console.log("⚠️ [MORSE SEND] Cannot send - channel:", !!channel, "user:", !!user);
        return;
      }

      console.log("📤 [MORSE SEND] Broadcasting signal:", signal, "from:", user.id.substring(0, 8));
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
