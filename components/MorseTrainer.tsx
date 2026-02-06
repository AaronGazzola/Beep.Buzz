"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { RotateCcw, X, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/app/page.stores";
import {
  textToMorse,
  playMorseAudio,
  generateRandomCharacter,
} from "@/lib/morse.utils";
import { BeepCharacter, BuzzCharacter, SpeechBubble } from "./MorseCharacters";
import type { Speaker } from "./MorseCharacters";

const DOT_THRESHOLD = 200;
const DEMO_WPM = 8;

export function MorseTrainer({ className }: { className?: string }) {
  const {
    step,
    currentChallenge,
    currentMorse,
    userInput,
    isCorrect,
    isPlaying,
    setStep,
    setChallenge,
    appendToUserInput,
    clearUserInput,
    setIsCorrect,
    setIsPlaying,
    incrementScore,
    incrementStreak,
    resetStreak,
    recordAttempt,
  } = useGameStore();

  const [displayedMorse, setDisplayedMorse] = useState("");
  const [isVocalizing, setIsVocalizing] = useState(false);

  const pressStartRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSpeaker: Speaker = step === "user-input" ? "beep" : "buzz";

  const startNewChallenge = useCallback(() => {
    const challenge = generateRandomCharacter();
    const morse = textToMorse(challenge);
    setChallenge(challenge, morse);
    clearUserInput();
    setIsCorrect(null);
    setStep("demonstrate");
  }, [setChallenge, clearUserInput, setIsCorrect, setStep]);

  const playMorseWithAnimation = useCallback(async () => {
    if (isPlaying || !currentMorse) return;

    setIsPlaying(true);
    setDisplayedMorse("");
    setIsVocalizing(false);

    const wpm = DEMO_WPM;
    const dotDuration = 1200 / wpm;
    const dashDuration = dotDuration * 3;
    const symbolGap = dotDuration;
    const letterGap = dotDuration * 3;

    let currentTime = 0;
    const timeouts: NodeJS.Timeout[] = [];

    const symbols = currentMorse.split("");
    let displayIndex = 0;

    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];

      if (symbol === "." || symbol === "-") {
        const charIndex = displayIndex;
        const beepDuration = symbol === "." ? dotDuration : dashDuration;

        timeouts.push(setTimeout(() => {
          setDisplayedMorse(currentMorse.slice(0, charIndex + 1));
          setIsVocalizing(true);
        }, currentTime));

        timeouts.push(setTimeout(() => {
          setIsVocalizing(false);
        }, currentTime + beepDuration));

        if (symbol === ".") {
          currentTime += dotDuration + symbolGap;
        } else {
          currentTime += dashDuration + symbolGap;
        }
        displayIndex++;
      } else if (symbol === " ") {
        const charIndex = displayIndex;
        timeouts.push(setTimeout(() => {
          setDisplayedMorse(currentMorse.slice(0, charIndex + 1));
        }, currentTime));
        currentTime += letterGap;
        displayIndex++;
      }
    }

    try {
      await playMorseAudio(currentMorse, { volume: 0.5, wpm, frequency: 600 });
    } finally {
      setIsPlaying(false);
      setIsVocalizing(false);
      timeouts.forEach(clearTimeout);
    }
  }, [isPlaying, currentMorse, setIsPlaying]);

  useEffect(() => {
    if (step === "demonstrate" && currentMorse) {
      playMorseWithAnimation();
    }
  }, [step, currentMorse]);

  useEffect(() => {
    if (step === "your-turn") {
      const timer = setTimeout(() => {
        setStep("user-input");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, setStep]);

  useEffect(() => {
    if (step === "feedback") {
      const timer = setTimeout(() => {
        startNewChallenge();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, startNewChallenge]);

  useEffect(() => {
    if (step === "user-input" && userInput && userInput === currentMorse) {
      recordAttempt({
        challengeText: currentChallenge,
        expectedMorse: currentMorse,
        userInput: userInput,
        isCorrect: true,
        challengeType: "letter",
      });
      incrementScore();
      incrementStreak();
      setIsCorrect(true);
      setStep("feedback");
    }
  }, [step, userInput, currentMorse, recordAttempt, currentChallenge, incrementScore, incrementStreak, setIsCorrect, setStep]);

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

    oscillator.frequency.value = 600;
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

  const handlePressStart = useCallback(() => {
    if (step !== "user-input") return;
    if (pressStartRef.current !== null) return;

    pressStartRef.current = Date.now();
    setIsVocalizing(true);
    startBeep();
  }, [step, startBeep]);

  const handlePressEnd = useCallback(() => {
    if (step !== "user-input" || pressStartRef.current === null) return;

    stopBeep();
    setIsVocalizing(false);

    const pressDuration = Date.now() - pressStartRef.current;
    const signal = pressDuration < DOT_THRESHOLD ? "." : "-";

    appendToUserInput(signal);
    pressStartRef.current = null;
  }, [step, appendToUserInput, stopBeep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (step === "ready") {
        e.preventDefault();
        startNewChallenge();
      } else if (step === "demonstrate") {
        e.preventDefault();
        setStep("your-turn");
      } else if (step === "user-input") {
        e.preventDefault();
        handlePressStart();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (step === "user-input") {
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
  }, [step, handlePressStart, handlePressEnd, startNewChallenge, setStep]);

  const handleMainClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    if (step === "ready") {
      startNewChallenge();
    } else if (step === "demonstrate") {
      setStep("your-turn");
    }
  };

  const handleRepeatFromDemonstrate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await playMorseWithAnimation();
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    startNewChallenge();
  };

  const handleResetToDemonstrate = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearUserInput();
    setStep("demonstrate");
  };

  const handleClearInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearUserInput();
  };

  const handleDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    const userMorse = userInput.trim();
    const correct = userMorse === currentMorse;

    recordAttempt({
      challengeText: currentChallenge,
      expectedMorse: currentMorse,
      userInput: userMorse,
      isCorrect: correct,
      challengeType: "letter",
    });

    if (correct) {
      incrementScore();
      incrementStreak();
    } else {
      resetStreak();
    }

    setIsCorrect(correct);
    setStep("feedback");
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    startNewChallenge();
  };

  const getMessage = () => {
    if (step === "ready") {
      return (
        <>
          Ready to learn Morse code?
          <br />
          <span className="text-xl font-semibold text-accent-foreground">Click here or press any key to start</span>
        </>
      );
    }

    if (step === "demonstrate") {
      return (
        <>
          <div className="text-base font-semibold mb-3 opacity-90">Click or hit any key to continue</div>
          <div className="text-4xl mb-3 font-bold">{currentChallenge}</div>
          <div className="text-5xl font-mono min-h-[3rem]">{displayedMorse || "\u00A0"}</div>
        </>
      );
    }

    if (step === "your-turn") {
      return "Now it's your turn!";
    }

    if (step === "user-input") {
      return (
        <>
          <div className="text-base font-semibold mb-3 opacity-90">Click or hit any key to tap morse</div>
          <div className="text-4xl mb-3 font-bold">{currentChallenge}</div>
          <div className="text-5xl font-mono min-h-[3rem]">{userInput}</div>
        </>
      );
    }

    if (step === "feedback") {
      return (
        <>
          <div className={cn("text-3xl mb-3 font-bold", isCorrect ? "text-green-600" : "text-foreground")}>
            {isCorrect ? "Correct!" : "Not quite"}
          </div>
          <div className="text-4xl mb-3 font-bold">{currentChallenge}</div>
          <div className="text-5xl font-mono">{currentMorse}</div>
          {!isCorrect && (
            <div className="text-base opacity-70 mt-2">
              You entered: {userInput || "(nothing)"}
            </div>
          )}
          <div className="mt-6 h-9" />
        </>
      );
    }

    return "";
  };

  const getButtons = () => {
    if (step === "demonstrate") {
      return (
        <div className="flex gap-2 justify-center mt-6">
          <Button variant="ghost" size="sm" onClick={handleRepeatFromDemonstrate} disabled={isPlaying}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    if (step === "user-input") {
      return (
        <div className="flex gap-2 justify-center mt-6">
          <Button variant="ghost" size="sm" onClick={handleResetToDemonstrate}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClearInput}>
            <X className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    return undefined;
  };

  const getFillColor = () => {
    if (step === "demonstrate") {
      return "fill-accent-foreground";
    }
    if (step === "user-input") {
      return "fill-chart-3";
    }
    return undefined;
  };

  const getTextColor = () => {
    if (step === "demonstrate" || step === "user-input") {
      return "text-white";
    }
    return undefined;
  };

  const shouldBeClickable = step === "ready" || step === "demonstrate" || step === "user-input";

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 select-none h-full",
        shouldBeClickable && "cursor-pointer",
        className
      )}
      onClick={handleMainClick}
      onMouseDown={step === "user-input" ? (e) => { if (!(e.target as HTMLElement).closest('button')) { e.preventDefault(); handlePressStart(); } } : undefined}
      onMouseUp={step === "user-input" ? (e) => { if (!(e.target as HTMLElement).closest('button')) { e.preventDefault(); handlePressEnd(); } } : undefined}
      onMouseLeave={step === "user-input" ? () => { if (pressStartRef.current !== null) handlePressEnd(); } : undefined}
    >
      <div className="flex flex-col items-center gap-1 lg:order-1">
        <div className="w-24 h-24 md:w-32 md:h-32">
          <BeepCharacter isSpeaking={currentSpeaker === "beep"} isVocalizing={currentSpeaker === "beep" && isVocalizing} />
        </div>
        <span className="text-lg font-semibold text-chart-3">Beep</span>
        <span className="text-base text-muted-foreground">(You)</span>
      </div>

      <div className="lg:order-2 flex-1 flex items-center">
        <SpeechBubble
          speaker={currentSpeaker}
          message={getMessage()}
          buttons={getButtons()}
          fillColor={getFillColor()}
          textColor={getTextColor()}
        />
      </div>

      <div className="flex flex-col items-center gap-1 lg:order-3">
        <div className="w-24 h-24 md:w-32 md:h-32">
          <BuzzCharacter isSpeaking={currentSpeaker === "buzz"} isVocalizing={currentSpeaker === "buzz" && isVocalizing} />
        </div>
        <span className="text-lg font-semibold text-accent-foreground">Buzz</span>
        <span className="text-base text-muted-foreground">(Teacher)</span>
      </div>
    </div>
  );
}
