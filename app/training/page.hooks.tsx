import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  submitTrainingAction,
  getTrainingProgressAction,
} from "./page.actions";
import { useTrainingStore } from "./page.stores";
import type { TrainingSubmission } from "./page.types";

export function useTrainingProgress() {
  return useQuery({
    queryKey: ["trainingProgress"],
    queryFn: getTrainingProgressAction,
  });
}

export function useSubmitTraining() {
  const queryClient = useQueryClient();
  const reset = useTrainingStore((state) => state.reset);

  return useMutation({
    mutationFn: (submission: TrainingSubmission) =>
      submitTrainingAction(submission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainingProgress"] });
      reset();
    },
  });
}
