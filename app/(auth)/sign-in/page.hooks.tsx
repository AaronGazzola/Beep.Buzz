import { supabase } from "@/supabase/browser-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomToast } from "@/components/CustomToast";

export function useSendMagicLink() {
  // const supabase = createClient(); // Already imported

  return useMutation({
    mutationFn: async (email: string) => {
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
    },
    onSuccess: () => {
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Magic link sent"
          message="Check your email for the sign-in link"
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <CustomToast
          variant="error"
          title="Failed to send link"
          message={error.message}
        />
      ));
    },
  });
}
