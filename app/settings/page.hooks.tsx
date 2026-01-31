import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CustomToast } from "@/components/CustomToast";
import {
  usePreferencesStore,
  useSettingsStore,
  useSoundStore,
} from "@/app/layout.stores";
import type {
  GamePreferences,
  NotificationSettings,
  SoundSettings,
} from "@/app/layout.types";

export async function updateGamePreferencesAction(
  preferences: GamePreferences
): Promise<void> {
  return Promise.resolve();
}

export function useGamePreferences() {
  const { preferences, setPreferences } = usePreferencesStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newPreferences: GamePreferences) => {
      setPreferences(newPreferences);
      await updateGamePreferencesAction(newPreferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamePreferences"] });
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Preferences saved"
          message="Your game preferences have been updated"
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <CustomToast
          variant="error"
          title="Save failed"
          message={error.message}
        />
      ));
    },
  });

  return { preferences, update: mutation };
}

export async function updateNotificationSettingsAction(
  settings: NotificationSettings
): Promise<void> {
  return Promise.resolve();
}

export function useNotificationSettings() {
  const { notifications, setNotifications } = useSettingsStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newSettings: NotificationSettings) => {
      setNotifications(newSettings);
      await updateNotificationSettingsAction(newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Settings saved"
          message="Notification settings have been updated"
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <CustomToast
          variant="error"
          title="Save failed"
          message={error.message}
        />
      ));
    },
  });

  return { notifications, update: mutation };
}

export async function updateSoundSettingsAction(
  settings: SoundSettings
): Promise<void> {
  return Promise.resolve();
}

export function useSoundSettings() {
  const { sound, setSound } = useSoundStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newSettings: SoundSettings) => {
      setSound(newSettings);
      await updateSoundSettingsAction(newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["soundSettings"] });
      toast.custom(() => (
        <CustomToast
          variant="success"
          title="Settings saved"
          message="Sound settings have been updated"
        />
      ));
    },
    onError: (error) => {
      toast.custom(() => (
        <CustomToast
          variant="error"
          title="Save failed"
          message={error.message}
        />
      ));
    },
  });

  return { sound, update: mutation };
}
