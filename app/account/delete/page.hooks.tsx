import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/browser-client";
import { useAuthStore } from "@/app/layout.stores";
import { deleteAccountAction } from "./page.actions";

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const { setUser, setProfile } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: deleteAccountAction,
    onSuccess: async () => {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      queryClient.clear();
      router.push("/?deleted=1");
      router.refresh();
    },
  });
}
