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
    }: {
      email: string;
      password: string;
    }) => {
      console.log("[SignUp] Starting email sign up for:", email);
      console.log("[SignUp] Redirect URL:", `${window.location.origin}/welcome`);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
        },
      });

      console.log("[SignUp] Response data:", data);
      console.log("[SignUp] Response error:", error);

      if (error) {
        console.error("[SignUp] Error during sign up:", error);
        if (error.message.includes("already registered")) {
          throw new Error("An account with this email already exists");
        }
        throw new Error(error.message);
      }

      console.log("[SignUp] User created:", data.user?.id);
      console.log("[SignUp] User email:", data.user?.email);
      console.log("[SignUp] Email confirmed at:", data.user?.email_confirmed_at);
      console.log("[SignUp] Confirmation sent at:", data.user?.confirmation_sent_at);

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
      console.log("[MagicLink] Starting magic link sign up for:", email);
      console.log("[MagicLink] Redirect URL:", `${window.location.origin}/welcome`);

      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
        },
      });

      console.log("[MagicLink] Response data:", data);
      console.log("[MagicLink] Response error:", error);

      if (error) {
        console.error("[MagicLink] Error sending magic link:", error);
        throw new Error("Failed to send magic link");
      }

      console.log("[MagicLink] Magic link sent successfully");
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
