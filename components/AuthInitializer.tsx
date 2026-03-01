"use client";

import { useAuth, useLearnedLetters, useLearnedLettersSync } from "@/app/layout.hooks";

export function AuthInitializer() {
  useAuth();
  useLearnedLetters();
  useLearnedLettersSync();

  return null;
}
