import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  savePracticeSessionAction,
  getPracticeHistoryAction,
} from "./page.actions";
import { usePracticeStore } from "./page.stores";
import type { PracticeSessionSubmission } from "./page.types";

export function usePracticeHistory() {
  return useQuery({
    queryKey: ["practiceHistory"],
    queryFn: getPracticeHistoryAction,
  });
}

export function useSavePracticeSession() {
  const queryClient = useQueryClient();
  const reset = usePracticeStore((state) => state.reset);

  return useMutation({
    mutationFn: (session: PracticeSessionSubmission) =>
      savePracticeSessionAction(session),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practiceHistory"] });
      reset();
    },
  });
}
