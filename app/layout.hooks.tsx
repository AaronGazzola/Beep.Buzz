import { supabase } from "@/supabase/browser-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useAuthStore } from "./layout.stores";
import { getCurrentProfileAction } from "./layout.actions";
import {
  getLearnedLettersAction,
  saveLearnedLettersAction,
} from "./page.actions";
import { useGameStore } from "./page.stores";
import type { SignOutResult } from "./layout.types";
import type { LearnedLetter } from "./page.types";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { setUser, setProfile, setLoading } = useAuthStore();

  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      setLoading(true);

      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return null;
        }

        setUser(user);

        if (user) {
          const profile = await getCurrentProfileAction();
          setProfile(profile);
        } else {
          setProfile(null);
        }

        setLoading(false);
        return user;
      } catch (error) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    retry: false,
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const { setUser, setProfile } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (): Promise<SignOutResult> => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error(error);
        throw new Error("Failed to sign out");
      }

      return { success: true };
    },
    onSuccess: async () => {
      useGameStore.getState().setLearnedLetters([]);
      setUser(null);
      setProfile(null);
      queryClient.clear();

      await new Promise(resolve => setTimeout(resolve, 100));

      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useLearnedLetters() {
  const { isAuthenticated, user } = useAuthStore();
  const { setLearnedLetters } = useGameStore();

  return useQuery({
    queryKey: ["learnedLetters", user?.id],
    queryFn: async () => {
      const letters = await getLearnedLettersAction();
      setLearnedLetters(letters);
      return letters;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 1000 * 60 * 5,
  });
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
