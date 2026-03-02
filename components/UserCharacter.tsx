"use client";

import { useAuthStore } from "@/app/layout.stores";
import { BeepCharacter } from "@/components/MorseCharacters";
import { CustomCharacter } from "@/components/CustomCharacter";
import type { CharacterSettings } from "@/app/profile/page.types";
import { DEFAULT_CHARACTER_SETTINGS } from "@/app/profile/page.types";

interface UserCharacterProps {
  isSpeaking?: boolean;
  isVocalizing?: boolean;
  className?: string;
}

export function UserCharacter({ isSpeaking = false, isVocalizing = false, className }: UserCharacterProps) {
  const { isAuthenticated, profile } = useAuthStore();

  if (isAuthenticated && profile?.character_settings) {
    const settings = profile.character_settings as CharacterSettings;
    return (
      <CustomCharacter
        color={settings.color ?? DEFAULT_CHARACTER_SETTINGS.color}
        numPoints={settings.numPoints ?? DEFAULT_CHARACTER_SETTINGS.numPoints}
        spikeyness={settings.spikeyness ?? DEFAULT_CHARACTER_SETTINGS.spikeyness}
        eyeStyle={settings.eyeStyle ?? DEFAULT_CHARACTER_SETTINGS.eyeStyle}
        hat={settings.hat ?? DEFAULT_CHARACTER_SETTINGS.hat}
        glasses={settings.glasses ?? DEFAULT_CHARACTER_SETTINGS.glasses}
        makeup={settings.makeup ?? DEFAULT_CHARACTER_SETTINGS.makeup}
        shoes={settings.shoes ?? DEFAULT_CHARACTER_SETTINGS.shoes}
        isSpeaking={isSpeaking}
        className={className}
      />
    );
  }

  return <BeepCharacter isSpeaking={isSpeaking} isVocalizing={isVocalizing} className={className} />;
}
