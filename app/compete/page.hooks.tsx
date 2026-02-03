import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  createMatchAction,
  getAvailableMatchesAction,
  getUserMatchesAction,
  joinMatchAction,
} from "./page.actions";

export function useAvailableMatches() {
  return useQuery({
    queryKey: ["availableMatches"],
    queryFn: getAvailableMatchesAction,
    refetchInterval: 5000,
  });
}

export function useUserMatches() {
  return useQuery({
    queryKey: ["userMatches"],
    queryFn: getUserMatchesAction,
    refetchInterval: 5000,
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (opponentId: string) => createMatchAction(opponentId),
    onSuccess: (match) => {
      queryClient.invalidateQueries({ queryKey: ["availableMatches"] });
      queryClient.invalidateQueries({ queryKey: ["userMatches"] });
      router.push(`/compete/${match.id}`);
    },
  });
}

export function useJoinMatch() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (matchId: string) => joinMatchAction(matchId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["availableMatches"] });
      queryClient.invalidateQueries({ queryKey: ["userMatches"] });
      router.push(`/compete/${data.matchId}`);
    },
  });
}
