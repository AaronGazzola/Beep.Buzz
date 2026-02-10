"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/app/page.stores";
import { morseToText, playMorseAudio } from "@/lib/morse.utils";
import { BeepCharacter, BuzzCharacter } from "./MorseCharacters";
import type { Speaker } from "./MorseCharacters";

const DOT_THRESHOLD = 200;
const AI_WPM = 8;
const DIT_DURATION = 1200 / AI_WPM;
const CHARACTER_GAP_DURATION = DIT_DURATION * 3;
const WORD_GAP_DURATION = DIT_DURATION * 7;
const MESSAGE_END_DURATION = DIT_DURATION * 14;

const AI_RESPONSES = [
  { morse: ".... .. / - .... . .-. .", text: "HI THERE" },
  { morse: ".... --- .-- / .- .-. . / -.-- --- ..-", text: "HOW ARE YOU" },
  { morse: "--. .-. . .- -", text: "GREAT" },
  { morse: "-. .. -.-. . / .--- --- -...", text: "NICE JOB" },
  { morse: "-.- . . .--. / --. --- .. -. --.", text: "KEEP GOING" },
  { morse: ".-- . .-.. .-.. / -.. --- -. .", text: "WELL DONE" },
];

interface ChatBubbleProps {
  speaker: Speaker;
  morse: string;
  text: string;
  isComplete: boolean;
  showCharacter?: boolean;
  isVocalizing?: boolean;
}

function ChatBubble({ speaker, morse, text, isComplete, showCharacter, isVocalizing }: ChatBubbleProps) {
  const isBeep = speaker === "beep";
  const bubbleColor = isBeep ? "bg-chart-3" : "bg-accent-foreground";
  const alignment = isBeep ? "self-start" : "self-end";
  const pointerStyle = isBeep ? "chat-bubble-left" : "chat-bubble-right";

  const displayText = text || (morse ? morseToText(morse) : "");
  const displayTextWithSpaces = displayText.split(' ').join(' · ');

  return (
    <div className={cn("max-w-[80%] mb-4 flex items-start gap-3", alignment, isBeep ? "flex-row" : "flex-row-reverse")}>
      {showCharacter && (
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-16 h-16">
            {isBeep ? (
              <BeepCharacter isSpeaking={true} isVocalizing={isVocalizing} />
            ) : (
              <BuzzCharacter isSpeaking={true} isVocalizing={isVocalizing} />
            )}
          </div>
          <span className={cn(
            "text-sm font-semibold",
            isBeep ? "text-chart-3" : "text-accent-foreground"
          )}>
            {isBeep ? "Beep" : "Buzz"}
          </span>
          <span className="text-xs text-muted-foreground">
            {isBeep ? "(You)" : "(AI)"}
          </span>
        </div>
      )}
      <div className={cn("rounded-3xl px-6 py-4 text-white relative", bubbleColor, pointerStyle)}>
        <div className="font-mono text-2xl mb-2 min-h-[2rem] break-all">
          {morse || "\u00A0"}
        </div>
        {displayText && (
          <div className={cn(
            "text-base opacity-90 pt-2 mt-2",
            isComplete && "border-t border-white/20"
          )}>
            {displayTextWithSpaces}
          </div>
        )}
      </div>
    </div>
  );
}

export function MorseChatAI({ className }: { className?: string }) {
  const {
    chatMessages,
    userInput,
    appendToUserInput,
    clearUserInput,
    addChatMessage,
    updateLastChatMessage,
  } = useGameStore();

  const [isVocalizing, setIsVocalizing] = useState(false);
  const [isAITyping, setIsAITyping] = useState(false);
  const [isAIVocalizing, setIsAIVocalizing] = useState(false);
  const [displayedAIMorse, setDisplayedAIMorse] = useState("");
  const pressStartRef = useRef<number | null>(null);
  const characterGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wordGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageEndTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const hasInitialized = useRef(false);

  const currentSpeaker: Speaker = (() => {
    if (chatMessages.length === 0) return "buzz";
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (!lastMessage.isComplete) {
      return lastMessage.speaker;
    }
    return lastMessage.speaker === "buzz" ? "beep" : "buzz";
  })();

  useEffect(() => {
    if (!hasInitialized.current && chatMessages.length === 0) {
      hasInitialized.current = true;
      playAIResponse(".... .. / - .... . .-. .", "HI THERE");
    }
  }, [chatMessages.length]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [chatMessages, userInput]);

  const playAIResponse = useCallback(async (morse: string, text: string) => {
    setIsAITyping(true);
    setIsAIVocalizing(false);
    setDisplayedAIMorse("");

    addChatMessage({
      speaker: "buzz",
      morse: "",
      text: "",
      isComplete: false,
    });

    const dotDuration = DIT_DURATION;
    const dashDuration = dotDuration * 3;
    const symbolGap = dotDuration;
    const letterGap = dotDuration * 3;

    let currentTime = 0;
    const timeouts: NodeJS.Timeout[] = [];

    const symbols = morse.split("");
    let displayIndex = 0;
    let builtMorse = "";
    let builtText = "";

    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];

      if (symbol === "." || symbol === "-") {
        const beepDuration = symbol === "." ? dotDuration : dashDuration;

        timeouts.push(setTimeout(() => {
          builtMorse += symbol;
          setDisplayedAIMorse(builtMorse);
          updateLastChatMessage(builtMorse, builtText, false);
          setIsAIVocalizing(true);
        }, currentTime));

        timeouts.push(setTimeout(() => {
          setIsAIVocalizing(false);
        }, currentTime + beepDuration));

        if (symbol === ".") {
          currentTime += dotDuration + symbolGap;
        } else {
          currentTime += dashDuration + symbolGap;
        }
        displayIndex++;
      } else if (symbol === " ") {
        timeouts.push(setTimeout(() => {
          builtMorse += " ";
          builtText = morseToText(builtMorse);
          setDisplayedAIMorse(builtMorse);
          updateLastChatMessage(builtMorse, builtText, false);
        }, currentTime));
        currentTime += letterGap;
        displayIndex++;
      } else if (symbol === "/") {
        timeouts.push(setTimeout(() => {
          builtMorse += " / ";
          builtText = morseToText(builtMorse);
          setDisplayedAIMorse(builtMorse);
          updateLastChatMessage(builtMorse, builtText, false);
        }, currentTime));
        currentTime += letterGap * 2.3;
        displayIndex++;
      }
    }

    timeouts.push(setTimeout(() => {
      updateLastChatMessage(morse, text, true);
      setIsAITyping(false);
      setIsAIVocalizing(false);
    }, currentTime));

    try {
      await playMorseAudio(morse, { volume: 0.5, wpm: AI_WPM, frequency: 600 });
    } catch (error) {
      timeouts.forEach(clearTimeout);
      setIsAITyping(false);
      setIsAIVocalizing(false);
    }
  }, [addChatMessage, updateLastChatMessage]);

  useEffect(() => {
    if (currentSpeaker === "beep" && userInput) {
      const text = morseToText(userInput);
      const messages = useGameStore.getState().chatMessages;
      const lastMessage = messages[messages.length - 1];

      if (!lastMessage || lastMessage.speaker !== "beep" || lastMessage.isComplete) {
        addChatMessage({
          speaker: "beep",
          morse: userInput,
          text,
          isComplete: false,
        });
      } else {
        updateLastChatMessage(userInput, text, false);
      }
    }
  }, [userInput, currentSpeaker, addChatMessage, updateLastChatMessage]);

  const startBeep = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;

    if (audioContext.state === "suspended") {
      try {
        await audioContext.resume();
      } catch (error) {
        console.error("Failed to resume audio context:", error);
        return;
      }
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
    if (currentSpeaker !== "beep" || isAITyping) return;
    if (pressStartRef.current !== null) return;

    if (characterGapTimerRef.current) {
      clearTimeout(characterGapTimerRef.current);
      characterGapTimerRef.current = null;
    }
    if (wordGapTimerRef.current) {
      clearTimeout(wordGapTimerRef.current);
      wordGapTimerRef.current = null;
    }
    if (messageEndTimerRef.current) {
      clearTimeout(messageEndTimerRef.current);
      messageEndTimerRef.current = null;
    }

    pressStartRef.current = Date.now();
    setIsVocalizing(true);
    startBeep();
  }, [currentSpeaker, isAITyping, startBeep]);

  const completeMessage = useCallback(() => {
    if (characterGapTimerRef.current) {
      clearTimeout(characterGapTimerRef.current);
      characterGapTimerRef.current = null;
    }
    if (wordGapTimerRef.current) {
      clearTimeout(wordGapTimerRef.current);
      wordGapTimerRef.current = null;
    }
    if (messageEndTimerRef.current) {
      clearTimeout(messageEndTimerRef.current);
      messageEndTimerRef.current = null;
    }

    const currentMorse = useGameStore.getState().userInput;
    if (!currentMorse || currentMorse.trim().length === 0) return;

    const finalText = morseToText(currentMorse);
    updateLastChatMessage(currentMorse, finalText, true);
    clearUserInput();

    setTimeout(() => {
      const nextResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      playAIResponse(nextResponse.morse, nextResponse.text);
    }, 500);
  }, [clearUserInput, updateLastChatMessage, playAIResponse]);

  const handlePressEnd = useCallback(() => {
    if (pressStartRef.current === null) return;

    stopBeep();
    setIsVocalizing(false);

    const pressDuration = Date.now() - pressStartRef.current;
    const signal = pressDuration < DOT_THRESHOLD ? "." : "-";

    appendToUserInput(signal);
    pressStartRef.current = null;

    characterGapTimerRef.current = setTimeout(() => {
      appendToUserInput(" ");
      characterGapTimerRef.current = null;

      wordGapTimerRef.current = setTimeout(() => {
        appendToUserInput("/ ");
        wordGapTimerRef.current = null;

        messageEndTimerRef.current = setTimeout(() => {
          completeMessage();
        }, WORD_GAP_DURATION);
      }, WORD_GAP_DURATION - CHARACTER_GAP_DURATION);
    }, CHARACTER_GAP_DURATION);
  }, [appendToUserInput, stopBeep, completeMessage]);


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
      if (currentSpeaker !== "beep" || isAITyping) return;

      e.preventDefault();
      handlePressStart();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isInputFocused()) return;
      if (isModifierKey(e)) return;
      if (currentSpeaker !== "beep" || isAITyping) return;

      e.preventDefault();
      handlePressEnd();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handlePressStart, handlePressEnd, currentSpeaker, isAITyping]);

  const handleContainerTouchStart = useCallback((e: React.TouchEvent) => {
    if (currentSpeaker !== "beep" || isAITyping) return;
    e.preventDefault();
    handlePressStart();
  }, [currentSpeaker, isAITyping, handlePressStart]);

  const handleContainerTouchEnd = useCallback((e: React.TouchEvent) => {
    if (currentSpeaker !== "beep" || isAITyping) return;
    e.preventDefault();
    handlePressEnd();
  }, [currentSpeaker, isAITyping, handlePressEnd]);

  const handleContainerMouseDown = useCallback((e: React.MouseEvent) => {
    if (currentSpeaker !== "beep" || isAITyping) return;
    e.preventDefault();
    handlePressStart();
  }, [currentSpeaker, isAITyping, handlePressStart]);

  const handleContainerMouseUp = useCallback((e: React.MouseEvent) => {
    if (currentSpeaker !== "beep" || isAITyping) return;
    e.preventDefault();
    handlePressEnd();
  }, [currentSpeaker, isAITyping, handlePressEnd]);

  const handleContainerMouseLeave = useCallback(() => {
    if (pressStartRef.current !== null) {
      handlePressEnd();
    }
  }, [handlePressEnd]);

  const handleContextMenu = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 flex flex-col cursor-pointer"
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          touchAction: 'none',
        }}
        onTouchStart={handleContainerTouchStart}
        onTouchEnd={handleContainerTouchEnd}
        onMouseDown={handleContainerMouseDown}
        onMouseUp={handleContainerMouseUp}
        onMouseLeave={handleContainerMouseLeave}
        onContextMenu={handleContextMenu}
      >
        {chatMessages.map((message, index) => {
          const isLastBeepMessage = message.speaker === "beep" &&
            index === chatMessages.map((m, i) => m.speaker === "beep" ? i : -1).filter(i => i >= 0).pop();
          const isLastBuzzMessage = message.speaker === "buzz" &&
            index === chatMessages.map((m, i) => m.speaker === "buzz" ? i : -1).filter(i => i >= 0).pop();
          const showCharacter = isLastBeepMessage || isLastBuzzMessage;
          const showVocalizing = (isLastBeepMessage && isVocalizing) || (isLastBuzzMessage && isAIVocalizing);

          return (
            <ChatBubble
              key={index}
              speaker={message.speaker}
              morse={message.morse}
              text={message.text}
              isComplete={message.isComplete}
              showCharacter={showCharacter}
              isVocalizing={showVocalizing}
            />
          );
        })}
      </div>

      <div className="border-t bg-background p-6">
        <div className="text-center space-y-2">
          <p className="text-base font-medium text-foreground">
            Click anywhere or hit any key to tap morse
          </p>
          <p className="text-sm text-muted-foreground">
            3 dit lengths = space between characters in words
          </p>
          <p className="text-sm text-muted-foreground">
            7 dit lengths = space between words
          </p>
          <p className="text-sm text-muted-foreground">
            14 dit lengths = end of message
          </p>
        </div>
      </div>
    </div>
  );
}
