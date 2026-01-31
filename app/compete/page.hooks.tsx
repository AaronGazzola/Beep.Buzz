import { supabase } from "@/supabase/browser-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomToast } from "@/components/CustomToast";
import {
  useQueueStore,
  useSolutionStore,
  useMatchChatStore,
  useProgressTrackingStore,
} from "./page.stores";

export type QueueStatus = {
  inQueue: boolean;
  matchId?: string;
};

export type MatchSolution = {
  matchId: string;
  solution: string;
  wpm: number;
  accuracy: number;
};

export type MatchChatMessage = {
  matchId: string;
  message: string;
};

export type OpponentProgress = {
  progress: number;
  isComplete: boolean;
};

export async function joinQueueAction(): Promise<QueueStatus> {
  return { inQueue: true };
}

export function useJoinQueue() {
  const setInQueue = useQueueStore((state) => state.setInQueue);

  return useMutation({
    mutationFn: async () => {
      const status = await joinQueueAction();
      setInQueue(status.inQueue);
      return status;
    },
    onSuccess: () => {
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Joined queue"
          message="Searching for an opponent..."
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <CustomToast
          variant="error"
          title="Failed to join queue"
          message={error.message}
        />
      ));
    },
  });
}

export async function submitSolutionAction(
  solution: MatchSolution
): Promise<void> {
  return Promise.resolve();
}

export function useSubmitSolution() {
  const setProgress = useSolutionStore((state) => state.setProgress);

  return useMutation({
    mutationFn: async (solution: MatchSolution) => {
      await submitSolutionAction(solution);
      setProgress(100);
    },
    onSuccess: () => {
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Solution submitted"
          message="Waiting for opponent to finish..."
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <CustomToast
          variant="error"
          title="Submission failed"
          message={error.message}
        />
      ));
    },
  });
}

export async function sendMatchChatAction(
  chat: MatchChatMessage
): Promise<void> {
  return Promise.resolve();
}

export function useMatchChat() {
  const addMessage = useMatchChatStore((state) => state.addMessage);

  return useMutation({
    mutationFn: async (chat: MatchChatMessage) => {
      await sendMatchChatAction(chat);
      addMessage({
        id: Math.random().toString(),
        senderId: "current-user",
        message: chat.message,
        timestamp: new Date().toISOString(),
      });
    },
  });
}

export async function getOpponentProgressAction(): Promise<OpponentProgress> {
  return {
    progress: Math.floor(Math.random() * 100),
    isComplete: false,
  };
}

export function useOpponentProgress(matchId?: string) {
  const setOpponentProgress = useProgressTrackingStore(
    (state) => state.setOpponentProgress
  );

  return useQuery({
    queryKey: ["opponentProgress", matchId],
    queryFn: async () => {
      const progress = await getOpponentProgressAction();
      setOpponentProgress(progress.progress);
      return progress;
    },
    enabled: !!matchId,
    refetchInterval: 2000,
  });
}
