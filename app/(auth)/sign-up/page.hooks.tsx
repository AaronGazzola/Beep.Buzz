import { supabase } from "@/supabase/browser-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useEmailSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
        },
      });

      if (error) {
        console.error(error);
        if (error.message.includes("already registered")) {
          throw new Error("An account with this email already exists");
        }
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      router.push("/verify");
    },
  });
}

export function useMagicLinkSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
        },
      });

      if (error) {
        console.error(error);
        throw new Error("Failed to send magic link");
      }

      return { success: true };
    },
    onSuccess: () => {
      router.push("/verify");
    },
  });
}
