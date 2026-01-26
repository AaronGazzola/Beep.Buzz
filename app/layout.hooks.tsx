"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/supabase/browser-client";
import { signOutUserAction } from "./layout.actions";
import type { User } from "@supabase/supabase-js";

export function useCurrentUser() {
  const supabase = createClient();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error(error);
        return null;
      }

      return user;
    },
  });
}

export function useUserProfile() {
  const supabase = createClient();
  const { data: user } = useCurrentUser();

  return useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error(error);
        return null;
      }

      return data;
    },
    enabled: !!user,
  });
}

export function useSignOutUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOutUserAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}
