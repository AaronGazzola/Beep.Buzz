export type CharacterSettings = {
  color: string;
  numPoints: number;
  spikeyness: number;
  eyeStyle: number;
  hat: number;
  glasses: number;
  makeup: number;
  shoes: number;
};

export const DEFAULT_CHARACTER_SETTINGS: CharacterSettings = {
  color: "#6366f1",
  numPoints: 8,
  spikeyness: 20,
  eyeStyle: 0,
  hat: 0,
  glasses: 0,
  makeup: 0,
  shoes: 0,
};

export type UpdateUsernameResult = { success: boolean };
export type UpdateCharacterResult = { success: boolean };
