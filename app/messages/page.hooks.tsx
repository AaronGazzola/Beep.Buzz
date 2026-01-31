import { supabase } from "@/supabase/browser-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomToast } from "@/components/CustomToast";
import { create } from "zustand";
import type { MorseMessage } from "@/app/layout.types";

export type MessageHistory = {
  sent: MorseMessage[];
  received: MorseMessage[];
};

export type MessageDecoding = {
  messageId: string;
  decodedText: string;
};

type MessageStore = {
  messages: MorseMessage[];
  setMessages: (messages: MorseMessage[]) => void;
  addMessage: (message: MorseMessage) => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));

type HistoryStore = {
  sent: MorseMessage[];
  received: MorseMessage[];
  setSent: (messages: MorseMessage[]) => void;
  setReceived: (messages: MorseMessage[]) => void;
};

export const useHistoryStore = create<HistoryStore>((set) => ({
  sent: [],
  received: [],
  setSent: (messages) => set({ sent: messages }),
  setReceived: (messages) => set({ received: messages }),
}));

type DecodingStore = {
  decodedMessages: Record<string, string>;
  setDecoded: (messageId: string, text: string) => void;
};

export const useDecodingStore = create<DecodingStore>((set) => ({
  decodedMessages: {},
  setDecoded: (messageId, text) =>
    set((state) => ({
      decodedMessages: { ...state.decodedMessages, [messageId]: text },
    })),
}));

export async function sendMorseMessageAction(
  recipientId: string,
  message: string
): Promise<void> {
  return Promise.resolve();
}

export function useSendMorseMessage() {
  // const supabase = createClient(); // Already imported
  const queryClient = useQueryClient();
  const addMessage = useMessageStore((state) => state.addMessage);

  return useMutation({
    mutationFn: async ({
      recipientId,
      message,
    }: {
      recipientId: string;
      message: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase.from("morse_messages").insert({
        sender_id: user.id,
        recipient_id: recipientId,
        encoded_content: message,
      });

      if (error) {
        console.error(error);
        throw new Error("Failed to send message");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messageHistory"] });
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Message sent"
          message="Your morse code message has been sent"
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <CustomToast
          variant="error"
          title="Failed to send"
          message={error.message}
        />
      ));
    },
  });
}

export async function getMessageHistoryAction(): Promise<MessageHistory> {
  return {
    sent: [],
    received: [],
  };
}

export function useMessageHistory() {
  // const supabase = createClient(); // Already imported
  const { setSent, setReceived } = useHistoryStore();

  return useQuery({
    queryKey: ["messageHistory"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const { data: sent, error: sentError } = await supabase
        .from("morse_messages")
        .select("*")
        .eq("sender_id", user.id)
        .order("created_at", { ascending: false });

      if (sentError) {
        console.error(sentError);
        throw new Error("Failed to fetch sent messages");
      }

      const { data: received, error: receivedError } = await supabase
        .from("morse_messages")
        .select("*")
        .eq("recipient_id", user.id)
        .order("created_at", { ascending: false });

      if (receivedError) {
        console.error(receivedError);
        throw new Error("Failed to fetch received messages");
      }

      const history: MessageHistory = {
        sent: sent || [],
        received: received || [],
      };

      setSent(history.sent);
      setReceived(history.received);

      return history;
    },
  });
}

export async function decodeMessageAction(
  messageId: string,
  decodedText: string
): Promise<void> {
  return Promise.resolve();
}

export function useDecodeMessage() {
  // const supabase = createClient(); // Already imported
  const queryClient = useQueryClient();
  const setDecoded = useDecodingStore((state) => state.setDecoded);

  return useMutation({
    mutationFn: async ({
      messageId,
      decodedText,
    }: {
      messageId: string;
      decodedText: string;
    }) => {
      const { error } = await supabase
        .from("morse_messages")
        .update({
          decoded_content: decodedText,
          decoded_at: new Date().toISOString(),
        })
        .eq("id", messageId);

      if (error) {
        console.error(error);
        throw new Error("Failed to save decoded message");
      }

      setDecoded(messageId, decodedText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messageHistory"] });
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Message decoded"
          message="Your translation has been saved"
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <CustomToast
          variant="error"
          title="Failed to decode"
          message={error.message}
        />
      ));
    },
  });
}
