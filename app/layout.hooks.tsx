import { supabase } from "@/supabase/browser-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "./layout.stores";
import { getCurrentProfileAction } from "./layout.actions";
import type { SignOutResult } from "./layout.types";
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
