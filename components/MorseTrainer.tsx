"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { RotateCcw, RotateCcw as RepeatIcon, X as CloseIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGameStore } from "@/app/page.stores";
import {
  textToMorse,
  playMorseAudio,
  generateRandomCharacter,
  generateRandomWord,
} from "@/lib/morse.utils";
import { BeepCharacter, BuzzCharacter, SpeechBubble } from "./MorseCharacters";
import type { Speaker } from "./MorseCharacters";
import type { Difficulty, GameMode, PracticeType } from "@/app/page.types";

function useTypingEffect(text: string, speed: number = 50) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayedText, isComplete };
}

const DOT_THRESHOLD = 200;
const CHARACTER_GAP_THRESHOLD = 400;
const WORD_GAP_THRESHOLD = 1000;
const BEEP_FREQUENCY = 600;

const SENTENCES = [
  "HELLO WORLD",
  "SOS",
  "GOOD JOB",
  "WELL DONE",
  "TRY AGAIN",
  "NICE WORK",
  "KEEP GOING",
];

function generateChallenge(difficulty: Difficulty): string {
  switch (difficulty) {
    case "letter":
      return generateRandomCharacter();
    case "word":
      return generateRandomWord("beginner");
    case "sentence":
      return SENTENCES[Math.floor(Math.random() * SENTENCES.length)];
  }
}

export function MorseTrainer({ className }: { className?: string }) {
  const {
    phase,
    mode,
    practiceType,
    difficulty,
    currentChallenge,
    currentMorse,
    userInput,
    userTextInput,
    isCorrect,
    isPlaying,
    score,
    streak,
    attempts,
    setPhase,
    setMode,
    setPracticeType,
    setDifficulty,
    setChallenge,
    appendToUserInput,
    addCharacterGap,
    clearUserInput,
    setUserTextInput,
    clearUserTextInput,
    setIsCorrect,
    setIsPlaying,
    incrementScore,
    incrementStreak,
    resetStreak,
    startSession,
    startChallenge,
    recordAttempt,
    getSessionSummary,
    resetGame,
  } = useGameStore();

  const [subPhase, setSubPhase] = useState<"ready" | "showing-challenge" | "showing-morse" | "ready-to-respond" | "responding">("ready");
  const [typingText, setTypingText] = useState("");
  const [showMorseTyping, setShowMorseTyping] = useState(false);
  const [typedMorse, setTypedMorse] = useState("");

  const { displayedText: typedDisplayText, isComplete: typingComplete } = useTypingEffect(typingText, 50);

  const pressStartRef = useRef<number | null>(null);
  const lastReleaseRef = useRef<number | null>(null);
  const gapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wordGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const currentSpeaker: Speaker = phase === "responding" || (phase === "presenting" && subPhase === "ready-to-respond") ? "beep" : "buzz";

  const getButtons = () => {
    if (phase === "responding") {
      return (
        <div className="flex gap-2 justify-center mt-4">
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleRepeat(); }}>
            <RepeatIcon className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleClear(); }}>
            <CloseIcon className="w-4 h-4" />
          </Button>
          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleSubmit(); }} disabled={!userInput}>
            Submit
          </Button>
        </div>
      );
    }
    return undefined;
  };

  const clearGapTimers = useCallback(() => {
    if (gapTimerRef.current) {
      clearTimeout(gapTimerRef.current);
      gapTimerRef.current = null;
    }
    if (wordGapTimerRef.current) {
      clearTimeout(wordGapTimerRef.current);
      wordGapTimerRef.current = null;
    }
  }, []);

  const startBeep = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = BEEP_FREQUENCY;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.01);

    oscillator.start();

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
  }, []);

  const stopBeep = useCallback(() => {
    if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
      const currentTime = audioContextRef.current.currentTime;
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(0, currentTime + 0.01);

      setTimeout(() => {
        oscillatorRef.current?.stop();
        oscillatorRef.current = null;
        gainNodeRef.current = null;
      }, 20);
    }
  }, []);

  const scheduleGapDetection = useCallback(() => {
    clearGapTimers();

    gapTimerRef.current = setTimeout(() => {
      addCharacterGap();

      wordGapTimerRef.current = setTimeout(() => {
      }, WORD_GAP_THRESHOLD - CHARACTER_GAP_THRESHOLD);
    }, CHARACTER_GAP_THRESHOLD);
  }, [clearGapTimers, addCharacterGap]);

  const handlePressStart = useCallback(() => {
    if (phase !== "responding") return;
    if (pressStartRef.current !== null) return;

    clearGapTimers();
    pressStartRef.current = Date.now();
    startBeep();
  }, [phase, clearGapTimers, startBeep]);

  const handlePressEnd = useCallback(() => {
    if (phase !== "responding" || pressStartRef.current === null) return;

    stopBeep();

    const pressDuration = Date.now() - pressStartRef.current;
    const signal = pressDuration < DOT_THRESHOLD ? "." : "-";

    appendToUserInput(signal);
    pressStartRef.current = null;
    lastReleaseRef.current = Date.now();

    scheduleGapDetection();
  }, [phase, appendToUserInput, scheduleGapDetection, stopBeep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        handlePressStart();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        handlePressEnd();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handlePressStart, handlePressEnd]);

  useEffect(() => {
    return () => {
      clearGapTimers();
    };
  }, [clearGapTimers]);

  const startNewChallenge = useCallback(async (isFirstChallenge = false) => {
    if (isFirstChallenge) {
      startSession();
    }

    const challenge = generateChallenge(difficulty);
    const morse = textToMorse(challenge);

    setChallenge(challenge, morse);
    setPhase("presenting");
    clearUserInput();
    clearUserTextInput();
    setIsCorrect(null);

    if (mode === "training") {
      setIsPlaying(true);
      try {
        await playMorseAudio(morse, { volume: 0.5, wpm: 15, frequency: 600 });
      } finally {
        setIsPlaying(false);
      }
    } else if (mode === "practice" && practiceType === "morse-to-text") {
      setIsPlaying(true);
      try {
        await playMorseAudio(morse, { volume: 0.5, wpm: 15, frequency: 600 });
      } finally {
        setIsPlaying(false);
      }
    }
  }, [difficulty, mode, practiceType, setChallenge, setPhase, clearUserInput, clearUserTextInput, setIsCorrect, setIsPlaying, startSession]);

  const handleReadyToRespond = () => {
    setPhase("responding");
    startChallenge();
    if (mode === "practice" && practiceType === "morse-to-text") {
      return;
    }
    containerRef.current?.focus();
  };

  const handleNextChallenge = () => {
    startNewChallenge();
  };

  const handleReplayAudio = useCallback(async () => {
    if (isPlaying || !currentMorse) return;

    setIsPlaying(true);
    try {
      await playMorseAudio(currentMorse, { volume: 0.5, wpm: 15, frequency: 600 });
    } finally {
      setIsPlaying(false);
    }
  }, [isPlaying, currentMorse, setIsPlaying]);

  const getMessage = (): React.ReactNode => {
    if (phase === "idle") {
      return (
        <>
          Ready to learn Morse code?
          <br />
          <span className="text-accent-foreground">Click here or hit any key to start!</span>
        </>
      );
    }

    if (phase === "presenting") {
      if (subPhase === "ready") {
        return typedDisplayText;
      } else if (subPhase === "showing-challenge") {
        return (
          <>
            <div className="text-lg mb-2">{typedDisplayText}</div>
          </>
        );
      } else if (subPhase === "showing-morse") {
        return (
          <>
            <div className="text-lg mb-2">{currentChallenge}</div>
            <div className="text-2xl font-mono my-4">{typedMorse}</div>
            {typingComplete && <div className="text-sm text-muted-foreground mt-4">Click or hit any key to continue</div>}
          </>
        );
      } else if (subPhase === "ready-to-respond") {
        return typedDisplayText;
      }
    }

    if (phase === "responding") {
      return (
        <>
          <div className="text-lg mb-2">{currentChallenge}</div>
          <div className="text-2xl font-mono my-4">{userInput || "_"}</div>
          <div className="text-sm text-muted-foreground mb-3">Click or hit any key to send morse code</div>
        </>
      );
    }

    return "";
  };

  const playMorseCharacterWithSound = useCallback(async (morseChar: string, index: number) => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < morseChar.length; i++) {
      const symbol = morseChar[i];
      if (symbol === " ") {
        await delay(400);
      } else {
        setTypedMorse(prev => prev + symbol);
        await playMorseAudio(symbol, { volume: 0.5, wpm: 15, frequency: 600 });
        await delay(200);
      }
    }

    if (index < currentMorse.split(" ").length - 1) {
      setTypedMorse(prev => prev + " ");
      await delay(400);
    }
  }, [currentMorse]);

  const handleInteraction = useCallback(async () => {
    if (phase === "idle") {
      setPhase("presenting");
      setSubPhase("ready");
      setTypingText("Ready? Listen up!");

      const challenge = generateChallenge(difficulty);
      const morse = textToMorse(challenge);
      setChallenge(challenge, morse);
      startSession();
    } else if (phase === "presenting" && subPhase === "showing-morse" && typingComplete) {
      setSubPhase("ready-to-respond");
      setTypingText("Your turn!");
    } else if (phase === "presenting" && subPhase === "ready-to-respond" && typingComplete) {
      setPhase("responding");
      clearUserInput();
    }
  }, [phase, subPhase, typingComplete, difficulty, setPhase, setChallenge, startSession, clearUserInput]);

  useEffect(() => {
    if (subPhase === "ready" && typingComplete) {
      setTimeout(() => {
        setSubPhase("showing-challenge");
        setTypingText(currentChallenge);
      }, 500);
    } else if (subPhase === "showing-challenge" && typingComplete) {
      setTimeout(async () => {
        setSubPhase("showing-morse");
        setTypedMorse("");
        const morseChars = currentMorse.split(" ");
        for (let i = 0; i < morseChars.length; i++) {
          await playMorseCharacterWithSound(morseChars[i], i);
        }
      }, 500);
    }
  }, [subPhase, typingComplete, currentChallenge, currentMorse, playMorseCharacterWithSound]);

  const handleRepeat = useCallback(() => {
    setSubPhase("showing-challenge");
    setTypingText(currentChallenge);
  }, [currentChallenge]);

  const handleClear = useCallback(() => {
    clearUserInput();
  }, [clearUserInput]);

  const handleSubmit = useCallback(() => {
    const userMorse = userInput.trim();
    const correct = userMorse === currentMorse;

    recordAttempt({
      challengeText: currentChallenge,
      expectedMorse: currentMorse,
      userInput: userMorse,
      isCorrect: correct,
      challengeType: difficulty,
    });

    if (correct) {
      incrementScore();
      incrementStreak();
    } else {
      resetStreak();
    }

    setPhase("idle");
    setSubPhase("ready");
    clearUserInput();
  }, [userInput, currentMorse, currentChallenge, difficulty, recordAttempt, incrementScore, incrementStreak, resetStreak, setPhase, clearUserInput]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === "idle" || (phase === "presenting" && (subPhase === "showing-morse" || subPhase === "ready-to-respond") && typingComplete)) {
        e.preventDefault();
        handleInteraction();
      } else if (phase === "responding") {
        if (e.code === "Space" || e.key === " ") {
          e.preventDefault();
          handlePressStart();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (phase === "responding" && (e.code === "Space" || e.key === " ")) {
        e.preventDefault();
        handlePressEnd();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [phase, subPhase, typingComplete, handleInteraction, handlePressStart, handlePressEnd]);

  const shouldBeClickable = phase === "idle" ||
    (phase === "presenting" && ((subPhase === "showing-morse" && typingComplete) || (subPhase === "ready-to-respond" && typingComplete)));

  const handleClick = () => {
    if (shouldBeClickable) {
      handleInteraction();
    } else if (phase === "responding") {
      handlePressStart();
      setTimeout(handlePressEnd, 100);
    }
  };

  return (
    <div
      className={cn("flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 select-none h-full", shouldBeClickable && "cursor-pointer", className)}
      onClick={handleClick}
      onMouseDown={phase === "responding" ? (e) => { e.preventDefault(); handlePressStart(); } : undefined}
      onMouseUp={phase === "responding" ? (e) => { e.preventDefault(); handlePressEnd(); } : undefined}
      onMouseLeave={phase === "responding" ? () => { if (pressStartRef.current !== null) handlePressEnd(); } : undefined}
    >
      <div className="flex flex-col items-center gap-1 lg:order-1">
        <div className="w-24 h-24 md:w-32 md:h-32">
          <BeepCharacter isSpeaking={currentSpeaker === "beep"} />
        </div>
        <span className="text-lg font-semibold text-chart-3">Beep</span>
        <span className="text-base text-muted-foreground">(You)</span>
      </div>

      <div className="lg:order-2 flex-1 flex items-center">
        <SpeechBubble
          speaker={currentSpeaker}
          message={getMessage()}
          buttons={getButtons()}
        />
      </div>

      <div className="flex flex-col items-center gap-1 lg:order-3">
        <div className="w-24 h-24 md:w-32 md:h-32">
          <BuzzCharacter isSpeaking={currentSpeaker === "buzz"} />
        </div>
        <span className="text-lg font-semibold text-accent-foreground">Buzz</span>
        <span className="text-base text-muted-foreground">(Teacher)</span>
      </div>
    </div>
  );
}
