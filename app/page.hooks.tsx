import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { textToMorse, playMorseAudio, morseToText } from "@/lib/morse.utils";
import { supabase } from "@/supabase/browser-client";
import { useAuthStore } from "./layout.stores";
import { useGameStore, useUserChatStore } from "./page.stores";
import { getLearnedLettersAction, saveLearnedLettersAction, joinChatQueueAction, leaveChatQueueAction, getChatQueueEntryAction } from "./page.actions";
import type { ChatMessage, LearnedLetter, MorseSignal } from "./page.types";

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

export function useJoinChatQueue() {
  const { setChatStatus, setChatRoom, setIsMyTurn, setQueueEntryId } = useUserChatStore();
  const { clearChatMessages } = useGameStore();

  return useMutation({
    mutationFn: joinChatQueueAction,
    onSuccess: (room) => {
      if (room.partnerId) {
        setChatRoom(room);
        setChatStatus("connected");
        setIsMyTurn(room.isCreator);
      } else {
        setQueueEntryId(room.id);
        setChatRoom(room);
        setChatStatus("searching");
      }
      clearChatMessages();
    },
    onError: (error) => {
      console.error("Failed to join chat queue:", error);
      setChatStatus("idle");
    },
  });
}

export function useWaitForMatch() {
  const { queueEntryId, chatStatus, setChatStatus, setChatRoom, setIsMyTurn, setQueueEntryId } = useUserChatStore();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (chatStatus !== "searching" || !queueEntryId) return;

    const channel = supabase
      .channel(`queue-watch:${queueEntryId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "chat_queue",
          filter: `id=eq.${queueEntryId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            room_id: string;
            user_id: string;
            username: string;
            partner_id: string | null;
            partner_username: string | null;
            status: string;
          };

          if (row.status === "matched" && row.partner_id) {
            setChatRoom({
              id: row.id,
              roomId: row.room_id,
              userId: row.user_id,
              username: row.username,
              partnerId: row.partner_id,
              partnerUsername: row.partner_username,
              isCreator: true,
            });
            setChatStatus("connected");
            setIsMyTurn(true);
            setQueueEntryId(null);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    const pollInterval = setInterval(async () => {
      try {
        const entry = await getChatQueueEntryAction(queueEntryId);
        if (entry && entry.partnerId) {
          setChatRoom(entry);
          setChatStatus("connected");
          setIsMyTurn(entry.isCreator);
          setQueueEntryId(null);
        }
      } catch {}
    }, 5000);

    return () => {
      clearInterval(pollInterval);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [chatStatus, queueEntryId, setChatStatus, setChatRoom, setIsMyTurn, setQueueEntryId]);
}

export function useLeaveChatQueue() {
  const { resetUserChat } = useUserChatStore();
  const { clearChatMessages } = useGameStore();

  return useMutation({
    mutationFn: leaveChatQueueAction,
    onSuccess: () => {
      resetUserChat();
      clearChatMessages();
    },
    onError: (error) => {
      console.error("Failed to leave chat queue:", error);
      resetUserChat();
      clearChatMessages();
    },
  });
}

export function useMorseBroadcast(roomId: string | null) {
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const {
    setChatStatus,
    setIsMyTurn,
    setIsPartnerVocalizing,
    appendToPartnerMorse,
    addPartnerCharGap,
    addPartnerWordGap,
    clearPartnerMorse,
  } = useUserChatStore();
  const { addChatMessage, updateLastChatMessage } = useGameStore();

  useEffect(() => {
    if (!roomId) return;

    const channel = supabase.channel(`morse-room:${roomId}`, {
      config: {
        broadcast: { self: false },
        presence: { key: "" },
      },
    });

    channel
      .on("broadcast", { event: "morse_signal" }, (payload) => {
        const signal = payload.payload as MorseSignal;
        const store = useUserChatStore.getState();
        const gameStore = useGameStore.getState();

        if (signal.type === "tap_start") {
          setIsPartnerVocalizing(true);

          const messages = gameStore.chatMessages;
          const lastMsg = messages[messages.length - 1];
          if (!lastMsg || lastMsg.speaker !== "buzz" || lastMsg.isComplete) {
            addChatMessage({ speaker: "buzz", morse: "", text: "", isComplete: false });
          }
        } else if (signal.type === "tap_end" && signal.signal) {
          setIsPartnerVocalizing(false);
          const newMorse = store.partnerMorse + signal.signal;
          appendToPartnerMorse(signal.signal);
          const text = morseToText(newMorse);
          updateLastChatMessage(newMorse, text, false);
        } else if (signal.type === "char_gap") {
          addPartnerCharGap();
          const updatedMorse = useUserChatStore.getState().partnerMorse;
          const text = morseToText(updatedMorse);
          updateLastChatMessage(updatedMorse, text, false);
        } else if (signal.type === "word_gap") {
          addPartnerWordGap();
          const updatedMorse = useUserChatStore.getState().partnerMorse;
          const text = morseToText(updatedMorse);
          updateLastChatMessage(updatedMorse, text, false);
        } else if (signal.type === "message_end") {
          setIsPartnerVocalizing(false);
          const finalMorse = useUserChatStore.getState().partnerMorse;
          const finalText = morseToText(finalMorse);
          updateLastChatMessage(finalMorse, finalText, true);
          clearPartnerMorse();
          setIsMyTurn(true);
        }
      })
      .on("presence", { event: "leave" }, () => {
        setChatStatus("disconnected");
      })
      .on("broadcast", { event: "user_disconnect" }, () => {
        setChatStatus("disconnected");
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({});
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "user_disconnect",
          payload: {},
        });
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomId, setChatStatus, setIsMyTurn, setIsPartnerVocalizing, appendToPartnerMorse, addPartnerCharGap, addPartnerWordGap, clearPartnerMorse, addChatMessage, updateLastChatMessage]);

  const broadcastSignal = useCallback(
    (signal: MorseSignal) => {
      if (channelRef.current) {
        channelRef.current.send({
          type: "broadcast",
          event: "morse_signal",
          payload: signal,
        });
      }
    },
    []
  );

  return { broadcastSignal };
}
