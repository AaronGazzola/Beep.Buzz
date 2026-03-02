"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CharacterCreator } from "@/components/CharacterCreator";
import { useAuthStore } from "@/app/layout.stores";
import { useProfile, useUpdateCharacter } from "@/app/profile/page.hooks";
import { DEFAULT_CHARACTER_SETTINGS } from "@/app/profile/page.types";
import type { CharacterSettings } from "@/app/profile/page.types";
import { Skeleton } from "@/components/ui/skeleton";

export default function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { data: profile, isLoading } = useProfile();
  const updateCharacter = useUpdateCharacter();
  const [settings, setSettings] = useState<CharacterSettings>(DEFAULT_CHARACTER_SETTINGS);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (profile?.character_settings) {
      setSettings(profile.character_settings as CharacterSettings);
    }
  }, [profile]);

  const handleGetStarted = async () => {
    await updateCharacter.mutateAsync(settings);
    router.push("/");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-10 space-y-3">
        <h1 className="text-4xl font-bold">Welcome to Beep.Buzz!</h1>
        <p className="text-muted-foreground text-lg">
          Design your character before you start. You can always change it later in your profile.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col items-center gap-3 lg:w-56 shrink-0">
            <Skeleton className="w-48 h-48 rounded-full" />
            <Skeleton className="w-20 h-4" />
          </div>
          <div className="flex-1 space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-full h-4" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <CharacterCreator value={settings} onChange={setSettings} />
      )}

      <div className="mt-10 flex justify-center">
        <Button
          size="lg"
          onClick={handleGetStarted}
          disabled={updateCharacter.isPending}
          className="min-w-40"
        >
          {updateCharacter.isPending ? "Saving..." : "Save & Get Started"}
        </Button>
      </div>
    </div>
  );
}
