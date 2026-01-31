import { supabase } from "@/supabase/browser-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomToast } from "@/components/CustomToast";
import {
  getUserProgressAction,
  getLeaderboardSnapshotAction,
  updateAccountDetailsAction,
} from "./layout.actions";
import {
  useAuthStore,
  useProgressStore,
  useLeaderboardStore,
  useAccountStore,
} from "./layout.stores";
import type { AccountDetails, LeaderboardCategory } from "./layout.types";

export function useCurrentUser() {
  // const supabase = createClient(); // Already imported
  const setProfile = useAuthStore((state) => state.setProfile);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setProfile(null);
        return null;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        console.error(profileError);
        setProfile(null);
        return null;
      }

      setProfile(profile);
      return profile;
    },
  });
}

export function useSignOut() {
  // const supabase = createClient(); // Already imported
  const queryClient = useQueryClient();
  const setProfile = useAuthStore((state) => state.setProfile);

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error(error);
        throw new Error("Failed to sign out");
      }
    },
    onSuccess: () => {
      setProfile(null);
      queryClient.clear();
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Signed out"
          message="You have been signed out successfully"
        />
      ));
      window.location.href = "/";
    },
    onError: (error) => {
      toast.custom(() => (
        <CustomToast
          variant="error"
          title="Sign out failed"
          message={error.message}
        />
      ));
    },
  });
}

export function useUserProgress() {
  const setProgress = useProgressStore((state) => state.setProgress);

  return useQuery({
    queryKey: ["userProgress"],
    queryFn: async () => {
      const progress = await getUserProgressAction();
      setProgress(progress);
      return progress;
    },
  });
}

export function useLeaderboardSnapshot(
  category: LeaderboardCategory = "overall"
) {
  const setSnapshot = useLeaderboardStore((state) => state.setSnapshot);

  return useQuery({
    queryKey: ["leaderboardSnapshot", category],
    queryFn: async () => {
      const snapshot = await getLeaderboardSnapshotAction(category);
      setSnapshot(snapshot);
      return snapshot;
    },
    refetchInterval: 60000,
  });
}

export function useAccountDetails() {
  // const supabase = createClient(); // Already imported
  const setAccount = useAccountStore((state) => state.setAccount);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["accountDetails"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", user.id)
        .single();

      const details: AccountDetails = {
        email: user.email || "",
        username: profile?.username || "",
      };

      setAccount(details);
      return details;
    },
  });

  const mutation = useMutation({
    mutationFn: (details: Partial<AccountDetails>) =>
      updateAccountDetailsAction(details),
    onSuccess: (data) => {
      setAccount(data);
      queryClient.invalidateQueries({ queryKey: ["accountDetails"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Account updated"
          message="Your account details have been updated"
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <CustomToast
          variant="error"
          title="Update failed"
          message={error.message}
        />
      ));
    },
  });

  return { ...query, update: mutation };
}
