export type Difficulty = "letter" | "word" | "sentence";

export type GamePhase = "idle" | "presenting" | "responding" | "feedback";

export type Speaker = "beep" | "buzz";

export interface GameState {
  phase: GamePhase;
  difficulty: Difficulty;
  currentChallenge: string;
  currentMorse: string;
  userInput: string;
  isCorrect: boolean | null;
  isPlaying: boolean;
  score: number;
  streak: number;
}

export interface MorseInputState {
  isPressed: boolean;
  pressStartTime: number | null;
  lastReleaseTime: number | null;
  currentSignals: string;
}
