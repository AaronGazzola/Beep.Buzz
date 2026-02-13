export type Difficulty = "letter" | "word" | "sentence";

export type TrainingStep = "ready" | "demonstrate" | "your-turn" | "user-input" | "feedback";

export type Speaker = "beep" | "buzz";

export type GameMode = "training" | "practice";

export type PracticeType = "text-to-morse" | "morse-to-text";

export type QuizMode = "letter-to-morse" | "morse-to-letter" | null;

export type TrainerMode = "learn" | "practice" | "mixed";

export type InterfaceMode = "training" | "chatAI" | "chatPerson";

export type MorseSpeed = "slow" | "medium" | "fast" | "fastest";

export interface ChatMessage {
  speaker: Speaker;
  morse: string;
  text: string;
  isComplete: boolean;
}

export interface LearnedLetter {
  letter: string;
  practiceCount: number;
}

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
  step: TrainingStep;
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
  learnedLetters: LearnedLetter[];
  quizMode: QuizMode;
  lastLearnedLetter: string | null;
  trainerMode: TrainerMode;
  interfaceMode: InterfaceMode;
  chatMessages: ChatMessage[];
  morseSpeed: MorseSpeed;
}

export interface MorseInputState {
  isPressed: boolean;
  pressStartTime: number | null;
  lastReleaseTime: number | null;
  currentSignals: string;
}

export type UserChatStatus = "idle" | "searching" | "connected" | "disconnected";

export interface ChatRoom {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  partnerId: string | null;
  partnerUsername: string | null;
  isCreator: boolean;
}

export interface MorseSignal {
  type: "tap_start" | "tap_end" | "char_gap" | "word_gap" | "message_end";
  timestamp: number;
  signal?: "." | "-";
}
