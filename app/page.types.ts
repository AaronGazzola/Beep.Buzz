export type Difficulty = "letter" | "word" | "sentence";

export type GamePhase = "idle" | "presenting" | "responding" | "feedback";

export type Speaker = "beep" | "buzz";

export type GameMode = "training" | "practice";

export type PracticeType = "text-to-morse" | "morse-to-text";

export interface ChallengeAttempt {
  challengeText: string;
  expectedMorse: string;
  userInput: string;
  isCorrect: boolean;
  challengeType: Difficulty;
  attemptNumber: number;
  responseTimeMs?: number;
  timestamp: number;
}

export interface GameState {
  phase: GamePhase;
  mode: GameMode;
  practiceType: PracticeType;
  difficulty: Difficulty;
  currentChallenge: string;
  currentMorse: string;
  userInput: string;
  userTextInput: string;
  isCorrect: boolean | null;
  isPlaying: boolean;
  score: number;
  streak: number;
  maxStreak: number;
  attempts: ChallengeAttempt[];
  sessionStartTime: number | null;
  challengeStartTime: number | null;
}

export interface MorseInputState {
  isPressed: boolean;
  pressStartTime: number | null;
  lastReleaseTime: number | null;
  currentSignals: string;
}
