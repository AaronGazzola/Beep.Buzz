"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { RotateCcw, X, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameStore } from "@/app/page.stores";
import {
  textToMorse,
  playMorseAudio,
  generateRandomCharacter,
  SPEED_WPM,
} from "@/lib/morse.utils";
import { BeepCharacter, BuzzCharacter, SpeechBubble } from "./MorseCharacters";
import type { Speaker } from "./MorseCharacters";

const QUIZ_CHANCE = 1 / 3;

export function MorseTrainer({ className }: { className?: string }) {
  const {
    step,
    currentChallenge,
    currentMorse,
    userInput,
    userTextInput,
    isCorrect,
    isPlaying,
    learnedLetters,
    quizMode,
    lastLearnedLetter,
    trainerMode,
    morseSpeed,
    setStep,
    setChallenge,
    appendToUserInput,
    clearUserInput,
    setUserTextInput,
    clearUserTextInput,
    setIsCorrect,
    setIsPlaying,
    incrementScore,
    incrementStreak,
    resetStreak,
    recordAttempt,
    addLearnedLetter,
    incrementPracticeCount,
    setQuizMode,
  } = useGameStore();

  const [displayedMorse, setDisplayedMorse] = useState("");
  const [isVocalizing, setIsVocalizing] = useState(false);

  const dotThreshold = (1200 / SPEED_WPM[morseSpeed]) * 2;

  const pressStartRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const isLongPressRef = useRef(false);

  const currentSpeaker: Speaker = step === "user-input" ? "beep" : "buzz";

  const startNewChallenge = useCallback(() => {
    clearUserInput();
    clearUserTextInput();
    setIsCorrect(null);

    const eligibleForQuiz = learnedLetters.filter((l) => l.letter !== lastLearnedLetter);
    const hasEligibleLetters = eligibleForQuiz.length > 0;

    let shouldQuiz = false;
    if (trainerMode === "practice") {
      if (!hasEligibleLetters) {
        setStep("ready");
        return;
      }
      shouldQuiz = true;
    } else if (trainerMode === "learn") {
      shouldQuiz = false;
    } else {
      shouldQuiz = hasEligibleLetters && Math.random() < QUIZ_CHANCE;
    }

    if (shouldQuiz) {
      const minPracticeCount = Math.min(...eligibleForQuiz.map((l) => l.practiceCount));
      const leastPracticed = eligibleForQuiz.filter((l) => l.practiceCount === minPracticeCount);
      const selected = leastPracticed[Math.floor(Math.random() * leastPracticed.length)];
      const morse = textToMorse(selected.letter);
      setChallenge(selected.letter, morse);

      const quizType = Math.random() < 0.5 ? "letter-to-morse" : "morse-to-letter";
      setQuizMode(quizType);
      setStep("demonstrate");
    } else {
      const learnedChars = learnedLetters.map((l) => l.letter);
      const challenge = generateRandomCharacter(learnedChars);
      const morse = textToMorse(challenge);
      setChallenge(challenge, morse);
      setQuizMode(null);
      setStep("demonstrate");
    }
  }, [setChallenge, clearUserInput, clearUserTextInput, setIsCorrect, setStep, learnedLetters, lastLearnedLetter, setQuizMode, trainerMode]);

  const playMorseWithAnimation = useCallback(async () => {
    if (isPlaying || !currentMorse) return;

    setIsPlaying(true);
    setDisplayedMorse("");
    setIsVocalizing(false);

    const wpm = SPEED_WPM[morseSpeed];
    const dotDuration = 1200 / wpm;
    const dashDuration = dotDuration * 3;
    const symbolGap = dotDuration;
    const letterGap = dotDuration * 3;

    let currentTime = 0;
    const timeouts: NodeJS.Timeout[] = [];

    const symbols = currentMorse.split("");
    let displayIndex = 0;

    const shouldShowMorse = quizMode !== "morse-to-letter";

    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];

      if (symbol === "." || symbol === "-") {
        const charIndex = displayIndex;
        const beepDuration = symbol === "." ? dotDuration : dashDuration;

        timeouts.push(setTimeout(() => {
          if (shouldShowMorse) {
            setDisplayedMorse(currentMorse.slice(0, charIndex + 1));
          }
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
          if (shouldShowMorse) {
            setDisplayedMorse(currentMorse.slice(0, charIndex + 1));
          }
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
  }, [isPlaying, currentMorse, setIsPlaying, quizMode, morseSpeed]);

  useEffect(() => {
    if (step === "demonstrate" && currentMorse && quizMode !== "letter-to-morse") {
      playMorseWithAnimation();
    }
  }, [step, currentMorse, quizMode]);

  useEffect(() => {
    if (step === "your-turn") {
      const timer = setTimeout(() => {
        setStep("user-input");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, setStep]);

  useEffect(() => {
    if (step === "user-input" && quizMode === "morse-to-letter" && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [step, quizMode]);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };
  }, [step]);

  useEffect(() => {
    if (step === "feedback") {
      const timer = setTimeout(() => {
        startNewChallenge();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, startNewChallenge]);

  useEffect(() => {
    if (step === "user-input" && quizMode !== "morse-to-letter" && userInput && userInput === currentMorse) {
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
      if (quizMode) {
        incrementPracticeCount(currentChallenge);
      } else {
        addLearnedLetter(currentChallenge);
      }
      setStep("feedback");
    }
  }, [step, userInput, currentMorse, recordAttempt, currentChallenge, incrementScore, incrementStreak, setIsCorrect, setStep, quizMode, addLearnedLetter, incrementPracticeCount]);

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
    if (quizMode === "morse-to-letter") return;
    if (pressStartRef.current !== null) return;

    pressStartRef.current = Date.now();
    setIsVocalizing(true);
    startBeep();
  }, [step, startBeep, quizMode]);

  const handlePressEnd = useCallback(() => {
    if (step !== "user-input" || pressStartRef.current === null) return;
    if (quizMode === "morse-to-letter") return;

    stopBeep();
    setIsVocalizing(false);

    const pressDuration = Date.now() - pressStartRef.current;
    const signal = pressDuration < dotThreshold ? "." : "-";

    appendToUserInput(signal);
    pressStartRef.current = null;
  }, [step, appendToUserInput, stopBeep, quizMode]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (step !== "user-input") return;
    if (quizMode === "morse-to-letter") return;

    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) return;

    e.preventDefault();

    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    isLongPressRef.current = false;

    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
    }, dotThreshold);

    pressStartRef.current = Date.now();
    setIsVocalizing(true);
    startBeep();
  }, [step, startBeep, quizMode]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartPosRef.current || !longPressTimerRef.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPosRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPosRef.current.y);

    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (step !== "user-input" || pressStartRef.current === null) return;
    if (quizMode === "morse-to-letter") return;

    e.preventDefault();

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    stopBeep();
    setIsVocalizing(false);

    const pressDuration = Date.now() - pressStartRef.current;
    const signal = pressDuration < dotThreshold ? "." : "-";

    appendToUserInput(signal);
    pressStartRef.current = null;
    touchStartPosRef.current = null;
    isLongPressRef.current = false;
  }, [step, appendToUserInput, stopBeep, quizMode]);

  const handleTouchCancel = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    if (pressStartRef.current !== null) {
      stopBeep();
      setIsVocalizing(false);
      pressStartRef.current = null;
    }

    touchStartPosRef.current = null;
    isLongPressRef.current = false;
  }, [stopBeep]);

  useEffect(() => {
    const isInputFocused = () => {
      const active = document.activeElement;
      return active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement ||
        active?.getAttribute("contenteditable") === "true";
    };

    const isModifierKey = (e: KeyboardEvent) => {
      return e.key === "Meta" ||
        e.key === "Control" ||
        e.key === "Alt" ||
        e.key === "Shift" ||
        e.key === "CapsLock" ||
        e.key === "Escape" ||
        e.key === "Tab";
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (isInputFocused()) return;
      if (isModifierKey(e)) return;

      if (quizMode === "morse-to-letter" && step === "user-input") {
        return;
      }

      if (step === "ready") {
        e.preventDefault();
        startNewChallenge();
      } else if (step === "demonstrate") {
        e.preventDefault();
        setStep("your-turn");
      } else if (step === "user-input") {
        if (e.code !== "Space") return;
        e.preventDefault();
        handlePressStart();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isInputFocused()) return;
      if (isModifierKey(e)) return;

      if (quizMode === "morse-to-letter" && step === "user-input") {
        return;
      }

      if (step === "user-input") {
        if (e.code !== "Space") return;
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
  }, [step, handlePressStart, handlePressEnd, startNewChallenge, setStep, quizMode]);

  const handleMainClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) return;

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
    clearUserTextInput();
    setStep("demonstrate");
  };

  const handleClearInput = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearUserInput();
    clearUserTextInput();
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 1);
    setUserTextInput(value);

    if (value && value === currentChallenge.toUpperCase()) {
      recordAttempt({
        challengeText: currentChallenge,
        expectedMorse: currentMorse,
        userInput: value,
        isCorrect: true,
        challengeType: "letter",
      });
      incrementScore();
      incrementStreak();
      setIsCorrect(true);
      incrementPracticeCount(currentChallenge);
      setStep("feedback");
    }
  };

  const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userTextInput) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const handleTextSubmit = () => {
    const correct = userTextInput.toUpperCase() === currentChallenge.toUpperCase();

    recordAttempt({
      challengeText: currentChallenge,
      expectedMorse: currentMorse,
      userInput: userTextInput,
      isCorrect: correct,
      challengeType: "letter",
    });

    if (correct) {
      incrementScore();
      incrementStreak();
      incrementPracticeCount(currentChallenge);
    } else {
      resetStreak();
    }

    setIsCorrect(correct);
    setStep("feedback");
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
      if (quizMode) {
        incrementPracticeCount(currentChallenge);
      } else {
        addLearnedLetter(currentChallenge);
      }
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
      if (trainerMode === "practice" && learnedLetters.length === 0) {
        return (
          <>
            No letters learned yet!
            <br />
            <span className="text-xl font-semibold text-accent-foreground">Switch to Learn mode first</span>
          </>
        );
      }
      return (
        <>
          Ready to learn Morse code?
          <br />
          <span className="text-xl font-semibold text-accent-foreground">Click here or press any key to start</span>
        </>
      );
    }

    if (step === "demonstrate") {
      if (quizMode === "morse-to-letter") {
        return (
          <>
            <div className="text-base font-semibold mb-3 opacity-90">What letter is this?</div>
            <div className="text-4xl mb-3 font-bold">?</div>
            <div className="text-base opacity-90">Click or press any key when ready</div>
          </>
        );
      }

      if (quizMode === "letter-to-morse") {
        return (
          <>
            <div className="text-base font-semibold mb-3 opacity-90">Tap the morse for this letter</div>
            <div className="text-4xl mb-3 font-bold">{currentChallenge}</div>
            <div className="text-base opacity-90">Click or press any key when ready</div>
          </>
        );
      }

      return (
        <>
          <div className="text-base font-semibold mb-3 opacity-90">Click or hit any key to continue</div>
          <div className="text-4xl mb-3 font-bold">{currentChallenge}</div>
          <div className="text-5xl font-mono min-h-[3rem]">{displayedMorse || "\u00A0"}</div>
        </>
      );
    }

    if (step === "your-turn") {
      if (quizMode === "morse-to-letter") return "What letter was that?";
      if (quizMode === "letter-to-morse") return "Tap the morse!";
      return "Now it's your turn!";
    }

    if (step === "user-input") {
      if (quizMode === "morse-to-letter") {
        return (
          <>
            <div className="text-base font-semibold mb-3 opacity-90">Type the letter you heard</div>
            <div className="text-4xl mb-3 font-bold">
              <Input
                ref={textInputRef}
                type="text"
                value={userTextInput}
                onChange={handleTextInputChange}
                onKeyDown={handleTextInputKeyDown}
                onClick={(e) => e.stopPropagation()}
                className="!text-[2.25rem] !leading-[2.5rem] font-bold uppercase text-center bg-transparent border-none shadow-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-2 h-auto w-[3ch] mx-auto"
                style={{ fontSize: '2.25rem', lineHeight: '2.5rem' }}
                maxLength={1}
              />
            </div>
          </>
        );
      }

      if (quizMode === "letter-to-morse") {
        return (
          <>
            <div className="text-base font-semibold mb-3 opacity-90">What&apos;s the morse for this letter?</div>
            <div className="text-4xl mb-3 font-bold">{currentChallenge}</div>
            <div className="text-5xl font-mono min-h-[3rem]">{userInput || "\u00A0"}</div>
          </>
        );
      }

      return (
        <>
          <div className="text-base font-semibold mb-3 opacity-90">Click or press space bar to tap morse</div>
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
              You entered: {quizMode === "morse-to-letter" ? userTextInput || "(nothing)" : userInput || "(nothing)"}
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
      if (quizMode === "morse-to-letter") {
        return (
          <div className="flex gap-2 justify-center mt-6">
            <Button variant="ghost" size="sm" onClick={handleResetToDemonstrate}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
        );
      }

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

  const shouldBeClickable = step === "ready" || step === "demonstrate" || (step === "user-input" && quizMode !== "morse-to-letter");

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 select-none h-full",
        shouldBeClickable && "cursor-pointer",
        className
      )}
      style={step === "user-input" && quizMode !== "morse-to-letter" ? { touchAction: "none" } : undefined}
      onClick={handleMainClick}
      onMouseDown={step === "user-input" && quizMode !== "morse-to-letter" ? (e) => { if (!(e.target as HTMLElement).closest('button') && !(e.target as HTMLElement).closest('input')) { e.preventDefault(); handlePressStart(); } } : undefined}
      onMouseUp={step === "user-input" && quizMode !== "morse-to-letter" ? (e) => { if (!(e.target as HTMLElement).closest('button') && !(e.target as HTMLElement).closest('input')) { e.preventDefault(); handlePressEnd(); } } : undefined}
      onMouseLeave={step === "user-input" && quizMode !== "morse-to-letter" ? () => { if (pressStartRef.current !== null) handlePressEnd(); } : undefined}
      onTouchStart={step === "user-input" && quizMode !== "morse-to-letter" ? handleTouchStart : undefined}
      onTouchMove={step === "user-input" && quizMode !== "morse-to-letter" ? handleTouchMove : undefined}
      onTouchEnd={step === "user-input" && quizMode !== "morse-to-letter" ? handleTouchEnd : undefined}
      onTouchCancel={step === "user-input" && quizMode !== "morse-to-letter" ? handleTouchCancel : undefined}
    >
      <div className="flex flex-col items-center gap-1 order-3 lg:order-1">
        <div className="w-24 h-24 md:w-32 md:h-32">
          <BeepCharacter isSpeaking={currentSpeaker === "beep"} isVocalizing={currentSpeaker === "beep" && isVocalizing} />
        </div>
        <span className="text-lg font-semibold text-chart-3">Beep</span>
        <span className="text-base text-muted-foreground">(You)</span>
      </div>

      <div className="order-2 flex-1 flex items-center">
        <SpeechBubble
          speaker={currentSpeaker}
          message={getMessage()}
          buttons={getButtons()}
          fillColor={getFillColor()}
          textColor={getTextColor()}
        />
      </div>

      <div className="flex flex-col-reverse lg:flex-col items-center gap-1 order-1 lg:order-3">
        <div className="w-24 h-24 md:w-32 md:h-32">
          <BuzzCharacter isSpeaking={currentSpeaker === "buzz"} isVocalizing={currentSpeaker === "buzz" && isVocalizing} />
        </div>
        <span className="text-base text-muted-foreground">(Teacher)</span>
        <span className="text-lg font-semibold text-accent-foreground">Buzz</span>
      </div>
    </div>
  );
}
