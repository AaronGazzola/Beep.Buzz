"use client";

import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/supabase/browser-client";

export function useSignInWithOtp() {
  return useMutation({
    mutationFn: async (email: string) => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
        },
      });
      if (error) {
        throw new Error(error.message);
      }
      return { success: true };
    },
  });
}

export function useSignInWithPassword() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}
