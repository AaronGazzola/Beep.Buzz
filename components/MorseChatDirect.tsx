"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/app/layout.stores";
import { useGameStore } from "@/app/page.stores";
import { useCurrentUserProfile } from "@/app/page.hooks";
import { morseToText, SPEED_WPM } from "@/lib/morse.utils";
import { cn } from "@/lib/utils";
import { BeepCharacter, BuzzCharacter } from "./MorseCharacters";
import {
  useDirectMessages,
  useRealtimeDirectMessages,
  useSendDirectMessage,
  useMorseSignals,
} from "@/app/chat/[username]/page.hooks";
import type { DirectMessage } from "@/app/chat/[username]/page.types";

const DOT_THRESHOLD = 200;

interface ChatBubbleProps {
  speaker: "beep" | "buzz";
  morse: string;
  text: string;
  isVocalizing?: boolean;
  username?: string | null;
}

function ChatBubble({ speaker, morse, text, isVocalizing, username }: ChatBubbleProps) {
  const isBeep = speaker === "beep";
  const bubbleColor = isBeep ? "bg-chart-3" : "bg-accent-foreground";
  const alignment = isBeep ? "self-start" : "self-end";
  const pointerStyle = isBeep ? "chat-bubble-left" : "chat-bubble-right";

  const displayText = text || (morse ? morseToText(morse) : "");
  const displayTextWithSpaces = displayText.split(" ").join(" · ");

  return (
    <div className={cn("max-w-[80%] mb-4 flex items-start gap-3", alignment, isBeep ? "flex-row" : "flex-row-reverse")}>
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="w-16 h-16">
          {isBeep ? (
            <BeepCharacter isSpeaking={true} isVocalizing={isVocalizing} />
          ) : (
            <BuzzCharacter isSpeaking={true} isVocalizing={isVocalizing} />
          )}
        </div>
        <span className={cn("text-sm font-semibold", isBeep ? "text-chart-3" : "text-accent-foreground")}>
          {username || (isBeep ? "You" : "Partner")}
        </span>
      </div>
      <div className={cn("rounded-3xl px-6 py-4 text-white relative", bubbleColor, pointerStyle)}>
        <div className="font-mono text-2xl mb-2 min-h-[2rem] break-all">
          {morse || "\u00A0"}
        </div>
        {displayText && (
          <div className="text-base opacity-90 pt-2 mt-2 border-t border-white/20">
            {displayTextWithSpaces}
          </div>
        )}
      </div>
    </div>
  );
}

interface HistoryMessage {
  speaker: "beep" | "buzz";
  morse: string;
  text: string;
}

interface MorseChatDirectProps {
  partnerUserId: string;
  partnerUsername: string;
  className?: string;
}

export function MorseChatDirect({ partnerUserId, partnerUsername, className }: MorseChatDirectProps) {
  const { user } = useAuthStore();
  const { userInput, appendToUserInput, clearUserInput, partnerInput, setPartnerInput, appendToPartnerInput, morseSpeed } = useGameStore();
  const [isVocalizing, setIsVocalizing] = useState(false);
  const [isPartnerVocalizing, setIsPartnerVocalizing] = useState(false);
  const [localMessages, setLocalMessages] = useState<HistoryMessage[]>([]);

  const currentUserProfile = useCurrentUserProfile();

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const pressStartRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const startBeepPromiseRef = useRef<Promise<void> | null>(null);
  const shouldStopBeepRef = useRef(false);
  const topSentinelRef = useRef<HTMLDivElement>(null);

  const characterGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wordGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageEndTimerRef = useRef<NodeJS.Timeout | null>(null);
  const partnerCharGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const partnerWordGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const partnerMessageEndTimerRef = useRef<NodeJS.Timeout | null>(null);

  const morseSpeedRef = useRef(morseSpeed);
  morseSpeedRef.current = morseSpeed;

  const completePartnerMessageRef = useRef<() => void>(() => {});

  const messagesQuery = useDirectMessages(partnerUserId);
  useRealtimeDirectMessages(partnerUserId);
  const sendMessage = useSendDirectMessage();

  const playBeepShort = useCallback((duration: number = 100) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = 600;
    oscillator.type = "sine";
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  }, []);

  const stopBeep = useCallback(() => {
    shouldStopBeepRef.current = true;
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

  const startBeep = useCallback(async () => {
    shouldStopBeepRef.current = false;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const audioContext = audioContextRef.current;
    if (audioContext.state === "suspended") {
      try {
        await audioContext.resume();
      } catch {
        return;
      }
    }
    if (shouldStopBeepRef.current) return;
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
    if (shouldStopBeepRef.current) {
      stopBeep();
    }
  }, [stopBeep]);

  const handleSignal = useCallback(
    (signal: string, fromUserId: string) => {
      if (fromUserId !== partnerUserId) return;

      if (partnerCharGapTimerRef.current) { clearTimeout(partnerCharGapTimerRef.current); partnerCharGapTimerRef.current = null; }
      if (partnerWordGapTimerRef.current) { clearTimeout(partnerWordGapTimerRef.current); partnerWordGapTimerRef.current = null; }
      if (partnerMessageEndTimerRef.current) { clearTimeout(partnerMessageEndTimerRef.current); partnerMessageEndTimerRef.current = null; }

      appendToPartnerInput(signal);
      setIsPartnerVocalizing(true);
      setTimeout(() => setIsPartnerVocalizing(false), signal === "." ? 100 : 300);
      playBeepShort(signal === "." ? 100 : 300);

      const ditDuration = 1200 / SPEED_WPM[morseSpeedRef.current];
      const charGap = ditDuration * 3;
      const wordGap = ditDuration * 7;
      const messageEnd = ditDuration * 14;

      partnerCharGapTimerRef.current = setTimeout(() => {
        appendToPartnerInput(" ");
        partnerCharGapTimerRef.current = null;

        partnerWordGapTimerRef.current = setTimeout(() => {
          appendToPartnerInput("/ ");
          partnerWordGapTimerRef.current = null;

          partnerMessageEndTimerRef.current = setTimeout(() => {
            completePartnerMessageRef.current();
          }, messageEnd);
        }, wordGap - charGap);
      }, charGap);
    },
    [partnerUserId, appendToPartnerInput, playBeepShort]
  );

  const { broadcastSignal } = useMorseSignals(partnerUserId, handleSignal);

  useEffect(() => {
    clearUserInput();
    setPartnerInput("");
    setLocalMessages([]);
  }, [partnerUserId, clearUserInput, setPartnerInput]);

  const allHistoryMessages: HistoryMessage[] = (() => {
    if (!messagesQuery.data) return localMessages;
    return messagesQuery.data.pages
      .flatMap((page) => [...page].reverse())
      .map((msg: DirectMessage) => ({
        speaker: msg.sender_id === user?.id ? ("beep" as const) : ("buzz" as const),
        morse: msg.morse_code,
        text: msg.message,
      }));
  })();

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [userInput, partnerInput, allHistoryMessages.length]);

  useEffect(() => {
    const sentinel = topSentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && messagesQuery.hasNextPage && !messagesQuery.isFetchingNextPage) {
          messagesQuery.fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [messagesQuery.hasNextPage, messagesQuery.isFetchingNextPage, messagesQuery.fetchNextPage]);

  const completeMyMessage = useCallback(() => {
    if (characterGapTimerRef.current) { clearTimeout(characterGapTimerRef.current); characterGapTimerRef.current = null; }
    if (wordGapTimerRef.current) { clearTimeout(wordGapTimerRef.current); wordGapTimerRef.current = null; }
    if (messageEndTimerRef.current) { clearTimeout(messageEndTimerRef.current); messageEndTimerRef.current = null; }

    const currentMorse = useGameStore.getState().userInput;
    if (!currentMorse || currentMorse.trim().length === 0) return;

    const finalText = morseToText(currentMorse);
    setLocalMessages((prev) => [...prev, { speaker: "beep", morse: currentMorse, text: finalText }]);
    clearUserInput();

    if (user) {
      sendMessage.mutate({ recipientId: partnerUserId, message: finalText, morseCode: currentMorse });
    }
  }, [clearUserInput, user, partnerUserId, sendMessage]);

  const completePartnerMessage = useCallback(() => {
    if (partnerCharGapTimerRef.current) { clearTimeout(partnerCharGapTimerRef.current); partnerCharGapTimerRef.current = null; }
    if (partnerWordGapTimerRef.current) { clearTimeout(partnerWordGapTimerRef.current); partnerWordGapTimerRef.current = null; }
    if (partnerMessageEndTimerRef.current) { clearTimeout(partnerMessageEndTimerRef.current); partnerMessageEndTimerRef.current = null; }

    const currentMorse = useGameStore.getState().partnerInput;
    if (!currentMorse || currentMorse.trim().length === 0) return;

    const finalText = morseToText(currentMorse);
    setLocalMessages((prev) => [...prev, { speaker: "buzz", morse: currentMorse, text: finalText }]);
    setPartnerInput("");
  }, [setPartnerInput]);

  useEffect(() => {
    completePartnerMessageRef.current = completePartnerMessage;
  }, [completePartnerMessage]);

  const handlePressStart = useCallback(async () => {
    if (pressStartRef.current !== null) return;

    if (characterGapTimerRef.current) { clearTimeout(characterGapTimerRef.current); characterGapTimerRef.current = null; }
    if (wordGapTimerRef.current) { clearTimeout(wordGapTimerRef.current); wordGapTimerRef.current = null; }
    if (messageEndTimerRef.current) { clearTimeout(messageEndTimerRef.current); messageEndTimerRef.current = null; }

    pressStartRef.current = Date.now();
    setIsVocalizing(true);
    const beepPromise = startBeep();
    startBeepPromiseRef.current = beepPromise;
    await beepPromise;
  }, [startBeep]);

  const handlePressEnd = useCallback(async () => {
    if (pressStartRef.current === null) return;

    if (startBeepPromiseRef.current) {
      await startBeepPromiseRef.current;
      startBeepPromiseRef.current = null;
    }

    stopBeep();
    setIsVocalizing(false);

    const pressDuration = Date.now() - pressStartRef.current;
    const signal = pressDuration < DOT_THRESHOLD ? "." : "-";

    appendToUserInput(signal);
    pressStartRef.current = null;

    broadcastSignal(signal);

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
          completeMyMessage();
        }, messageEnd);
      }, wordGap - charGap);
    }, charGap);
  }, [appendToUserInput, stopBeep, morseSpeed, completeMyMessage, broadcastSignal]);

  useEffect(() => {
    const isInputFocused = () => {
      const active = document.activeElement;
      return (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement ||
        active?.getAttribute("contenteditable") === "true"
      );
    };

    const isModifierKey = (e: KeyboardEvent) =>
      ["Meta", "Control", "Alt", "Shift", "CapsLock", "Escape", "Tab"].includes(e.key);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || isInputFocused() || isModifierKey(e) || e.code !== "Space") return;
      e.preventDefault();
      handlePressStart();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isInputFocused() || isModifierKey(e) || e.code !== "Space") return;
      e.preventDefault();
      handlePressEnd();
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
      if (characterGapTimerRef.current) clearTimeout(characterGapTimerRef.current);
      if (wordGapTimerRef.current) clearTimeout(wordGapTimerRef.current);
      if (messageEndTimerRef.current) clearTimeout(messageEndTimerRef.current);
      if (partnerCharGapTimerRef.current) clearTimeout(partnerCharGapTimerRef.current);
      if (partnerWordGapTimerRef.current) clearTimeout(partnerWordGapTimerRef.current);
      if (partnerMessageEndTimerRef.current) clearTimeout(partnerMessageEndTimerRef.current);
    };
  }, []);

  const handleContainerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handlePressStart();
  }, [handlePressStart]);

  const handleContainerMouseUp = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handlePressEnd();
  }, [handlePressEnd]);

  const handleContainerMouseLeave = useCallback(() => {
    if (pressStartRef.current !== null) {
      handlePressEnd();
    }
  }, [handlePressEnd]);

  const handleContainerTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handlePressStart();
  }, [handlePressStart]);

  const handleContainerTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handlePressEnd();
  }, [handlePressEnd]);

  const handleContextMenu = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
  }, []);

  const myUsername = currentUserProfile.data?.username ?? user?.email ?? "You";
  const myMorse = userInput;
  const myText = morseToText(myMorse);
  const partnerMorse = partnerInput;
  const partnerText = morseToText(partnerMorse);

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="border-b px-4 py-3 flex items-center gap-2">
        <span className="font-semibold">{partnerUsername}</span>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 flex flex-col cursor-pointer"
        style={{
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
          touchAction: "none",
        }}
        onTouchStart={handleContainerTouchStart}
        onTouchEnd={handleContainerTouchEnd}
        onMouseDown={handleContainerMouseDown}
        onMouseUp={handleContainerMouseUp}
        onMouseLeave={handleContainerMouseLeave}
        onContextMenu={handleContextMenu}
      >
        <div ref={topSentinelRef} className="h-1" />
        {messagesQuery.isFetchingNextPage && (
          <div className="flex justify-center py-2">
            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
          </div>
        )}
        {allHistoryMessages.map((message, index) => (
          <ChatBubble
            key={index}
            speaker={message.speaker}
            morse={message.morse}
            text={message.text}
            isVocalizing={false}
            username={message.speaker === "beep" ? myUsername : partnerUsername}
          />
        ))}
        {myMorse && (
          <ChatBubble
            speaker="beep"
            morse={myMorse}
            text={myText}
            isVocalizing={isVocalizing}
            username={myUsername}
          />
        )}
        {partnerMorse && (
          <ChatBubble
            speaker="buzz"
            morse={partnerMorse}
            text={partnerText}
            isVocalizing={isPartnerVocalizing}
            username={partnerUsername}
          />
        )}
      </div>
    </div>
  );
}
