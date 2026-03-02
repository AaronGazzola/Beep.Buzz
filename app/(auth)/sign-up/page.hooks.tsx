import { supabase } from "@/supabase/browser-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { checkUsernameAvailableAction } from "./page.actions";
import { useGameStore } from "@/app/page.stores";

export function useEmailSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      username,
    }: {
      email: string;
      password: string;
      username: string;
    }) => {
      const learnedLetters = useGameStore.getState().learnedLetters;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/welcome`,
          data: {
            username,
            pending_learned_letters: learnedLetters,
          },
        },
      });

      if (error) {
        console.error("[SignUp] Error during sign up:", error);
        if (error.message.includes("already registered")) {
          throw new Error("An account with this email already exists");
        }
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Account created! Check your email to verify.");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/verify");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create account");
    },
  });
}

export function useMagicLinkSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/welcome`,
        },
      });

      if (error) {
        console.error("[MagicLink] Error sending magic link:", error);
        throw new Error("Failed to send magic link");
      }

      return { success: true };
    },
    onSuccess: () => {
      toast.success("Magic link sent! Check your email.");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/verify");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to send magic link");
    },
  });
}

export function useUsernameAvailability(username: string) {
  const [debouncedUsername, setDebouncedUsername] = useState(username);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(username);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  return useQuery({
    queryKey: ["username-availability", debouncedUsername],
    queryFn: async () => {
      if (!debouncedUsername || debouncedUsername.length < 3) {
        return { available: false, error: "Too short" };
      }
      return checkUsernameAvailableAction(debouncedUsername);
    },
    enabled: debouncedUsername.length >= 3,
    staleTime: 0,
    gcTime: 0,
  });
}
