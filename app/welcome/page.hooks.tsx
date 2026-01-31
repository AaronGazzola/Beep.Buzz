import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomToast } from "@/components/CustomToast";
import { createProfileAction } from "@/app/layout.actions";
import { useProfileStore } from "@/app/layout.stores";

export function useCreateProfile() {
  const queryClient = useQueryClient();
  const setUsername = useProfileStore((state) => state.setUsername);

  return useMutation({
    mutationFn: async ({
      username,
      settings,
    }: {
      username: string;
      settings?: Record<string, unknown>;
    }) => {
      await createProfileAction(username, settings);
    },
    onSuccess: (_, variables) => {
      setUsername(variables.username);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Welcome to Beep.Buzz!"
          message="Your profile has been created"
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <CustomToast
          variant="error"
          title="Failed to create profile"
          message={error.message}
        />
      ));
    },
  });
}

export function useUploadProfilePicture() {
  const setAvatarUrl = useProfileStore((state) => state.setAvatarUrl);

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      return file;
    },
    onSuccess: (file) => {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Profile picture uploaded"
          message="Your avatar has been updated"
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <CustomToast
          variant="error"
          title="Upload failed"
          message={error.message}
        />
      ));
    },
  });
}
