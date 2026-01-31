import { supabase } from "@/supabase/browser-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomToast } from "@/components/CustomToast";
import {
  useTranslationStore,
  useDifficultyStore,
  useContentStore,
} from "./page.stores";

export type TranslationSubmission = {
  text: string;
  morseCode: string;
  accuracy: number;
  wpm: number;
};

export type DifficultySettings = {
  difficulty: number;
  speed: number;
  characterSet: string[];
};

export type PracticeContent = {
  text: string;
  morseCode: string;
};

export async function submitTranslationAction(
  submission: TranslationSubmission
): Promise<void> {
  return Promise.resolve();
}

export function useSubmitTranslation() {
  // const supabase = createClient(); // Already imported

  return useMutation({
    mutationFn: async (submission: TranslationSubmission) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase.from("practice_sessions").insert({
        user_id: user.id,
        wpm: submission.wpm,
        accuracy: submission.accuracy,
        character_set: [],
        difficulty: 5,
        duration_seconds: 60,
      });

      if (error) {
        console.error(error);
        throw new Error("Failed to submit practice session");
      }
    },
    onSuccess: () => {
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Practice completed"
          message="Your session has been saved"
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

export async function updateDifficultyAction(
  settings: DifficultySettings
): Promise<void> {
  return Promise.resolve();
}

export function useUpdateDifficulty() {
  const { setDifficulty, setSpeed, setCharacterSet } = useDifficultyStore();

  return useMutation({
    mutationFn: async (settings: DifficultySettings) => {
      setDifficulty(settings.difficulty);
      setSpeed(settings.speed);
      setCharacterSet(settings.characterSet);
    },
    onSuccess: () => {
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Settings updated"
          message="Difficulty settings have been changed"
        />
      ));
    },
  });
}

export async function getPracticeContentAction(): Promise<PracticeContent> {
  const chars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const text = Array.from(
    { length: 10 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");

  const morseCode: Record<string, string> = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
  };

  const morse = text
    .split("")
    .map((char) => morseCode[char] || "")
    .join(" ");

  return { text, morseCode: morse };
}

export function usePracticeContent() {
  const { setPracticeText, setMorseCode } = useContentStore();

  return useQuery({
    queryKey: ["practiceContent"],
    queryFn: async () => {
      const content = await getPracticeContentAction();
      setPracticeText(content.text);
      setMorseCode(content.morseCode);
      return content;
    },
  });
}
