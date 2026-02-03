import { supabase } from "@/supabase/browser-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./layout.stores";
import { getCurrentProfileAction } from "./layout.actions";
import type { SignOutResult } from "./layout.types";

export function useAuth() {
  const { setUser, setProfile, setLoading } = useAuthStore();

  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      setLoading(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error(error);
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
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const { setUser, setProfile } = useAuthStore();

  return useMutation({
    mutationFn: async (): Promise<SignOutResult> => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error(error);
        throw new Error("Failed to sign out");
      }

      return { success: true };
    },
    onSuccess: () => {
      setUser(null);
      setProfile(null);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      window.location.href = "/";
    },
    onError: (error) => {
      console.error(error);
    },
  });
}
