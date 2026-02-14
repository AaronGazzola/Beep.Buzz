"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/app/page.stores";
import { morseToText, textToMorse, SPEED_WPM } from "@/lib/morse.utils";
import { useAIChat } from "@/app/page.hooks";
import { BeepCharacter, BuzzCharacter } from "./MorseCharacters";
import type { Speaker } from "./MorseCharacters";

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
    morseSpeed,
  } = useGameStore();

  const dotThreshold = (1200 / SPEED_WPM[morseSpeed]) * 2;

  const aiChat = useAIChat();
  const aiChatRef = useRef(aiChat);
  aiChatRef.current = aiChat;

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
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const isLongPressRef = useRef(false);

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
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [chatMessages.length, userInput]);

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

    const audioCtx = new AudioContext();
    const symbols = morse.split("");
    let builtMorse = "";
    let builtText = "";

    const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

    const wpm = SPEED_WPM[morseSpeed];
    const dit = 1200 / wpm;
    const durations = { dot: dit, dash: dit * 3, symbolGap: dit, letterGap: dit * 3 };

    const playTone = (duration: number) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = 600;
      osc.type = "sine";
      const now = audioCtx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.01);
      gain.gain.setValueAtTime(0.5, now + duration / 1000 - 0.01);
      gain.gain.linearRampToValueAtTime(0, now + duration / 1000);
      osc.start(now);
      osc.stop(now + duration / 1000);
    };

    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];

      if (symbol === "." || symbol === "-") {
        const beepDuration = symbol === "." ? durations.dot : durations.dash;
        builtMorse += symbol;
        setDisplayedAIMorse(builtMorse);
        updateLastChatMessage(builtMorse, builtText, false);
        setIsAIVocalizing(true);
        playTone(beepDuration);
        await wait(beepDuration);
        setIsAIVocalizing(false);
        await wait(durations.symbolGap);
      } else if (symbol === " ") {
        builtMorse += " ";
        builtText = morseToText(builtMorse);
        setDisplayedAIMorse(builtMorse);
        updateLastChatMessage(builtMorse, builtText, false);
        await wait(durations.letterGap);
      } else if (symbol === "/") {
        builtMorse += " / ";
        builtText = morseToText(builtMorse);
        setDisplayedAIMorse(builtMorse);
        updateLastChatMessage(builtMorse, builtText, false);
        await wait(durations.letterGap * 2.3);
      }
    }

    updateLastChatMessage(morse, text, true);
    setIsAITyping(false);
    setIsAIVocalizing(false);
    audioCtx.close();
  }, [addChatMessage, updateLastChatMessage, morseSpeed]);

  useEffect(() => {
    if (!hasInitialized.current && chatMessages.length === 0) {
      hasInitialized.current = true;
      playAIResponse(".... .. / - .... . .-. .", "HI THERE");
    }
  }, [chatMessages.length, playAIResponse]);

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

  const handlePressStart = useCallback(async () => {
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
    await startBeep();
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

    setTimeout(async () => {
      setIsAITyping(true);
      try {
        const currentMessages = useGameStore.getState().chatMessages;
        const responseText = await aiChatRef.current.mutateAsync(currentMessages);
        const responseMorse = textToMorse(responseText);
        playAIResponse(responseMorse, responseText);
      } catch (error) {
        console.error("Failed to get AI response:", error);
        setIsAITyping(false);
      }
    }, 500);
  }, [clearUserInput, updateLastChatMessage, playAIResponse]);

  const handlePressEnd = useCallback(() => {
    if (pressStartRef.current === null) return;

    stopBeep();
    setIsVocalizing(false);

    const pressDuration = Date.now() - pressStartRef.current;
    const signal = pressDuration < dotThreshold ? "." : "-";

    appendToUserInput(signal);
    pressStartRef.current = null;

    const ditDuration = 1200 / SPEED_WPM[morseSpeed];
    const charGap = ditDuration * 3;
    const wordGap = ditDuration * 7;
    const messageEnd = ditDuration * 14;

    characterGapTimerRef.current = setTimeout(() => {
      appendToUserInput(" ");
      characterGapTimerRef.current = null;

      wordGapTimerRef.current = setTimeout(() => {
        appendToUserInput("/ ");
        wordGapTimerRef.current = null;

        messageEndTimerRef.current = setTimeout(() => {
          completeMessage();
        }, messageEnd);
      }, wordGap - charGap);
    }, charGap);
  }, [appendToUserInput, stopBeep, completeMessage, dotThreshold, morseSpeed]);


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
      if (e.code !== "Space") return;

      e.preventDefault();
      handlePressStart();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isInputFocused()) return;
      if (isModifierKey(e)) return;
      if (currentSpeaker !== "beep" || isAITyping) return;
      if (e.code !== "Space") return;

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

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };
  }, [currentSpeaker, isAITyping]);

  useEffect(() => {
    return () => {
      if (pressStartRef.current !== null) {
        stopBeep();
        setIsVocalizing(false);
        pressStartRef.current = null;
      }
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
    };
  }, [stopBeep]);

  const handleContainerTouchStart = useCallback((e: React.TouchEvent) => {
    if (currentSpeaker !== "beep" || isAITyping) return;
    e.preventDefault();

    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    isLongPressRef.current = false;

    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
    }, dotThreshold);

    handlePressStart();
  }, [currentSpeaker, isAITyping, handlePressStart]);

  const handleContainerTouchMove = useCallback((e: React.TouchEvent) => {
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

  const handleContainerTouchEnd = useCallback((e: React.TouchEvent) => {
    if (currentSpeaker !== "beep" || isAITyping) return;
    e.preventDefault();

    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    handlePressEnd();
    touchStartPosRef.current = null;
    isLongPressRef.current = false;
  }, [currentSpeaker, isAITyping, handlePressEnd]);

  const handleContainerTouchCancel = useCallback(() => {
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
    <div className={cn("flex flex-col", className)}>
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
        onTouchMove={handleContainerTouchMove}
        onTouchEnd={handleContainerTouchEnd}
        onTouchCancel={handleContainerTouchCancel}
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
    </div>
  );
}
