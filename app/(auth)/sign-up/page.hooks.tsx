import { supabase } from "@/supabase/browser-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
          data: {
            pending_username: username,
          },
        },
      });

      if (error) {
        console.error("[SignUp] Error during sign up:", error);
        throw new Error(error.message);
      }

      if (data.user?.identities?.length === 0) {
        throw new Error("An account with this email already exists");
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
    mutationFn: async ({
      email,
      username,
    }: {
      email: string;
      username: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
          data: {
            pending_username: username,
          },
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
