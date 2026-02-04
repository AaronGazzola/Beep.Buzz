"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/app/page.stores";
import {
  textToMorse,
  playMorseAudio,
  generateRandomCharacter,
  generateRandomWord,
} from "@/lib/morse.utils";
import { BeepCharacter, BuzzCharacter, SpeechBubble } from "./MorseCharacters";
import type { Speaker } from "./MorseCharacters";
import type { Difficulty } from "@/app/page.types";

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
    difficulty,
    currentChallenge,
    currentMorse,
    userInput,
    isCorrect,
    isPlaying,
    score,
    streak,
    setPhase,
    setDifficulty,
    setChallenge,
    appendToUserInput,
    addCharacterGap,
    clearUserInput,
    setIsCorrect,
    setIsPlaying,
    incrementScore,
    incrementStreak,
    resetStreak,
    resetGame,
  } = useGameStore();

  const pressStartRef = useRef<number | null>(null);
  const lastReleaseRef = useRef<number | null>(null);
  const gapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wordGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const currentSpeaker: Speaker = phase === "responding" ? "beep" : "buzz";

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

  const startNewChallenge = useCallback(async () => {
    const challenge = generateChallenge(difficulty);
    const morse = textToMorse(challenge);

    setChallenge(challenge, morse);
    setPhase("presenting");
    clearUserInput();
    setIsCorrect(null);

    setIsPlaying(true);
    try {
      await playMorseAudio(morse, { volume: 0.5, wpm: 15, frequency: 600 });
    } finally {
      setIsPlaying(false);
    }
  }, [difficulty, setChallenge, setPhase, clearUserInput, setIsCorrect, setIsPlaying]);

  const handleReadyToRespond = () => {
    setPhase("responding");
    containerRef.current?.focus();
  };

  const handleSubmit = () => {
    clearGapTimers();

    const userMorse = userInput.trim();
    const expectedMorse = currentMorse;
    const correct = userMorse === expectedMorse;

    setIsCorrect(correct);
    setPhase("feedback");

    if (correct) {
      incrementScore();
      incrementStreak();
    } else {
      resetStreak();
    }
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

  const getMessage = (): string => {
    switch (phase) {
      case "idle":
        return "Ready to learn Morse code? Click Start to begin!";
      case "presenting":
        return isPlaying
          ? `Listen carefully: "${currentChallenge}"`
          : `Did you hear that? The letter was "${currentChallenge}"`;
      case "responding":
        return userInput || "Your turn! Click anywhere or hold SPACE";
      case "feedback":
        if (isCorrect) {
          return `Correct! "${currentChallenge}" = ${currentMorse}`;
        }
        return `Not quite. "${currentChallenge}" = ${currentMorse}. You entered: ${userInput || "(nothing)"}`;
      default:
        return "";
    }
  };

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="flex items-center gap-4 text-sm">
        <span className="font-medium">Score: {score}</span>
        <span className="text-muted-foreground">|</span>
        <span className="font-medium">Streak: {streak}</span>
      </div>

      <div className="flex gap-2">
        {(["letter", "word", "sentence"] as Difficulty[]).map((d) => (
          <Button
            key={d}
            variant={difficulty === d ? "default" : "outline"}
            size="sm"
            onClick={() => setDifficulty(d)}
            disabled={phase !== "idle"}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </Button>
        ))}
      </div>

      <div
        ref={containerRef}
        tabIndex={phase === "responding" ? 0 : -1}
        onMouseDown={phase === "responding" ? handlePressStart : undefined}
        onMouseUp={phase === "responding" ? handlePressEnd : undefined}
        onMouseLeave={
          phase === "responding"
            ? () => {
                if (pressStartRef.current !== null) {
                  handlePressEnd();
                }
              }
            : undefined
        }
        onTouchStart={
          phase === "responding"
            ? (e) => {
                e.preventDefault();
                handlePressStart();
              }
            : undefined
        }
        onTouchEnd={
          phase === "responding"
            ? (e) => {
                e.preventDefault();
                handlePressEnd();
              }
            : undefined
        }
        className={cn(
          "flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 select-none p-4 rounded-2xl transition-all",
          phase === "responding" && "cursor-pointer bg-muted/50 hover:bg-muted/70 active:bg-muted",
          phase === "responding" && "focus:outline-none focus:ring-4 focus:ring-primary/50"
        )}
      >
        <div className="flex flex-col items-center gap-1 lg:order-1">
          <div className="w-24 h-24 md:w-32 md:h-32">
            <BeepCharacter isSpeaking={currentSpeaker === "beep"} />
          </div>
          <span className="text-sm font-semibold text-primary">Beep</span>
          <span className="text-xs text-muted-foreground">(You)</span>
        </div>

        <div className="lg:order-2">
          <SpeechBubble
            speaker={currentSpeaker}
            message={getMessage()}
            showMorse={phase === "responding" ? userInput : undefined}
            action={
              phase === "presenting" && !isPlaying ? (
                <button
                  onClick={handleReplayAudio}
                  className="text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors"
                >
                  Repeat Sound
                </button>
              ) : undefined
            }
          />
        </div>

        <div className="flex flex-col items-center gap-1 lg:order-3">
          <div className="w-24 h-24 md:w-32 md:h-32">
            <BuzzCharacter isSpeaking={currentSpeaker === "buzz"} />
          </div>
          <span className="text-sm font-semibold text-accent-foreground">Buzz</span>
          <span className="text-xs text-muted-foreground">(Teacher)</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {phase === "idle" && (
          <Button onClick={startNewChallenge} size="lg">
            Start Training
          </Button>
        )}

        {phase === "presenting" && !isPlaying && (
          <Button onClick={handleReadyToRespond} size="lg">
            I&apos;m Ready to Respond
          </Button>
        )}

        {phase === "responding" && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Short press = dot (.) | Long press = dash (-)
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={(e) => { e.stopPropagation(); clearUserInput(); }}>
                Clear
              </Button>
              <Button onClick={(e) => { e.stopPropagation(); handleSubmit(); }} disabled={!userInput}>
                Submit
              </Button>
            </div>
          </div>
        )}

        {phase === "feedback" && (
          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                "text-2xl font-bold",
                isCorrect ? "text-green-500" : "text-red-500"
              )}
            >
              {isCorrect ? "Correct!" : "Try Again!"}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetGame}>
                End Session
              </Button>
              <Button onClick={handleNextChallenge}>
                Next Challenge
              </Button>
            </div>
          </div>
        )}

        {phase === "presenting" && isPlaying && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-pulse">Playing audio...</div>
          </div>
        )}
      </div>
    </div>
  );
}
