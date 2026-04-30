"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/layout.stores";
import { useGameStore } from "@/app/morse.stores";
import { useCurrentUserProfile } from "@/app/morse.hooks";
import { morseToText, SPEED_WPM } from "@/lib/morse.utils";
import { cn } from "@/lib/utils";
import { BuzzCharacter } from "./MorseCharacters";
import { UserCharacter } from "@/components/UserCharacter";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChatControls } from "@/components/ChatControls";
import { useChatLayoutStore } from "@/app/chat/layout.stores";
import { Bot, ChevronDown, Shuffle, UserRound } from "lucide-react";
import {
  useDirectMessages,
  useRealtimeDirectMessages,
  useSendDirectMessage,
  useMorseSignals,
} from "@/app/chat/[username]/page.hooks";
import type { DirectMessage } from "@/app/chat/[username]/page.types";
import type { ChatMode } from "@/app/chat/layout.stores";

const chatModeOptions: { value: ChatMode; label: string; icon: typeof Bot }[] = [
  { value: "ai", label: "Chat with AI", icon: Bot },
  { value: "random", label: "Chat with Random User", icon: Shuffle },
  { value: "friend", label: "Chat with a friend", icon: UserRound },
];

const DOT_THRESHOLD = 200;

interface ChatBubbleProps {
  speaker: "beep" | "buzz";
  morse: string;
  text: string;
  isVocalizing?: boolean;
  isActive?: boolean;
  showCharacter?: boolean;
  username?: string | null;
}

interface ChatBubbleInternalProps extends ChatBubbleProps {
  testId?: string;
}

function ChatBubble({ speaker, morse, text, isVocalizing, isActive, showCharacter, username, testId }: ChatBubbleInternalProps) {
  const isBeep = speaker === "beep";
  const bubbleColor = isBeep ? "bg-chart-3" : "bg-accent-foreground";
  const alignment = isBeep ? "self-start" : "self-end";
  const pointerStyle = isBeep ? "chat-bubble-left" : "chat-bubble-right";

  const displayText = text || (morse ? morseToText(morse) : "");
  const displayTextWithSpaces = displayText.split(" ").join(" · ");

  return (
    <div data-testid={testId} className={cn("max-w-[80%] mb-4 flex items-start gap-3", alignment, isBeep ? "flex-row" : "flex-row-reverse")}>
      {showCharacter && (
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="w-16 h-16">
            {isBeep ? (
              <UserCharacter isSpeaking={true} isVocalizing={isVocalizing} />
            ) : (
              <BuzzCharacter isSpeaking={true} isVocalizing={isVocalizing} />
            )}
          </div>
          <span className={cn("text-sm font-semibold", isBeep ? "text-chart-3" : "text-accent-foreground")}>
            {username || (isBeep ? "You" : "Partner")}
          </span>
        </div>
      )}
      <div className={cn("rounded-3xl px-6 py-4 text-white relative", bubbleColor, isActive && pointerStyle)}>
        <div data-testid={testId ? `${testId}-morse` : undefined} className="font-mono text-2xl mb-2 min-h-[2rem] break-all">
          {morse || "\u00A0"}
        </div>
        {displayText && (
          <div data-testid={testId ? `${testId}-translation` : undefined} className="text-base opacity-90 pt-2 mt-2 border-t border-white/20">
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
  createdAt: string;
}

interface MorseChatDirectProps {
  partnerUserId: string;
  partnerUsername: string;
  className?: string;
}

export function MorseChatDirect({ partnerUserId, partnerUsername, className }: MorseChatDirectProps) {
  const router = useRouter();
  const { setChatMode } = useChatLayoutStore();
  const { user } = useAuthStore();
  const { userInput, appendToUserInput, clearUserInput, partnerInput, setPartnerInput, appendToPartnerInput, morseSpeed, morseVolume } = useGameStore();
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

  const morseSpeedRef = useRef(morseSpeed);
  morseSpeedRef.current = morseSpeed;
  const morseVolumeRef = useRef(morseVolume);
  morseVolumeRef.current = morseVolume;

  const completePartnerMessageRef = useRef<() => void>(() => {});
  const broadcastSignalRef = useRef<(signal: string) => void>(() => {});

  const messagesQuery = useDirectMessages(partnerUserId);
  useRealtimeDirectMessages(partnerUserId);
  const sendMessage = useSendDirectMessage(partnerUserId);

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
    gainNode.gain.setValueAtTime(morseVolumeRef.current / 100, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
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
    gainNode.gain.linearRampToValueAtTime(morseVolumeRef.current / 100, audioContext.currentTime + 0.01);
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

      if (signal === "complete") {
        completePartnerMessageRef.current();
        return;
      }

      if (signal === "cancel") {
        setPartnerInput("");
        return;
      }

      appendToPartnerInput(signal);

      if (signal === "." || signal === "-") {
        setIsPartnerVocalizing(true);
        setTimeout(() => setIsPartnerVocalizing(false), signal === "." ? 100 : 300);
        playBeepShort(signal === "." ? 100 : 300);
      }
    },
    [partnerUserId, appendToPartnerInput, setPartnerInput, playBeepShort]
  );

  const { broadcastSignal } = useMorseSignals(partnerUserId, handleSignal);
  broadcastSignalRef.current = broadcastSignal;

  useEffect(() => {
    clearUserInput();
    setPartnerInput("");
    setLocalMessages([]);
  }, [partnerUserId, clearUserInput, setPartnerInput]);

  const allHistoryMessages: HistoryMessage[] = (() => {
    const dbMessages = messagesQuery.data
      ? messagesQuery.data.pages
          .flatMap((page) => [...page].reverse())
          .map((msg: DirectMessage) => ({
            speaker: msg.sender_id === user?.id ? ("beep" as const) : ("buzz" as const),
            morse: msg.morse_code,
            text: msg.message,
            createdAt: msg.created_at ?? new Date().toISOString(),
          }))
      : [];
    return [...dbMessages, ...localMessages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  })();

  useEffect(() => {
    if (!messagesQuery.data || localMessages.length === 0) return;
    const cachedMorses = new Set(
      messagesQuery.data.pages.flatMap((page) => page.map((m) => m.morse_code))
    );
    setLocalMessages((prev) => prev.filter((m) => !cachedMorses.has(m.morse)));
  }, [messagesQuery.data]);

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
    setLocalMessages((prev) => [...prev, { speaker: "beep", morse: currentMorse, text: finalText, createdAt: new Date().toISOString() }]);
    clearUserInput();
    broadcastSignalRef.current("complete");

    if (user) {
      sendMessage.mutate({ recipientId: partnerUserId, message: finalText, morseCode: currentMorse });
    }
  }, [clearUserInput, user, partnerUserId, sendMessage]);

  const completePartnerMessage = useCallback(() => {
    const currentMorse = useGameStore.getState().partnerInput;
    if (!currentMorse || currentMorse.trim().length === 0) return;

    const finalText = morseToText(currentMorse);
    setLocalMessages((prev) => [...prev, { speaker: "buzz", morse: currentMorse, text: finalText, createdAt: new Date().toISOString() }]);
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

  const cancelMyMessage = useCallback(() => {
    if (characterGapTimerRef.current) { clearTimeout(characterGapTimerRef.current); characterGapTimerRef.current = null; }
    if (wordGapTimerRef.current) { clearTimeout(wordGapTimerRef.current); wordGapTimerRef.current = null; }
    if (messageEndTimerRef.current) { clearTimeout(messageEndTimerRef.current); messageEndTimerRef.current = null; }
    clearUserInput();
    broadcastSignalRef.current("cancel");
  }, [clearUserInput]);

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

    broadcastSignalRef.current(signal);

    const ditDuration = 1200 / SPEED_WPM[morseSpeed];
    const charGap = ditDuration * 3;
    const wordGap = ditDuration * 7;
    const messageEnd = ditDuration * 14;

    characterGapTimerRef.current = setTimeout(() => {
      const currentInput = useGameStore.getState().userInput;
      const tokens = currentInput.split(" ").filter((t) => t !== "" && t !== "/");
      const lastChar = tokens[tokens.length - 1] ?? "";
      characterGapTimerRef.current = null;

      if (lastChar === "........") {
        cancelMyMessage();
        return;
      }

      appendToUserInput(" ");
      broadcastSignalRef.current(" ");

      wordGapTimerRef.current = setTimeout(() => {
        appendToUserInput("/ ");
        broadcastSignalRef.current("/ ");
        wordGapTimerRef.current = null;

        messageEndTimerRef.current = setTimeout(() => {
          completeMyMessage();
        }, messageEnd);
      }, wordGap - charGap);
    }, charGap);
  }, [appendToUserInput, stopBeep, morseSpeed, completeMyMessage, cancelMyMessage]);

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
    <div className={cn("flex flex-col min-h-0", className)}>
      <div className="relative border-b px-4 py-2 flex items-center justify-between">
        <div className="w-8" />
        <Popover>
          <PopoverTrigger asChild>
            <button className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-sm font-medium hover:text-muted-foreground transition-colors">
              Chat with {partnerUsername}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-1" align="center">
            {chatModeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = option.value === "friend";
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setChatMode(option.value);
                    if (option.value !== "friend") {
                      router.push("/chat");
                    }
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              );
            })}
          </PopoverContent>
        </Popover>
        <ChatControls />
      </div>
      <div
        ref={scrollContainerRef}
        data-testid="chat-area"
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
        {allHistoryMessages.length === 0 && !myMorse && !partnerMorse ? (
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-16 h-16">
                <UserCharacter isSpeaking={false} isVocalizing={false} />
              </div>
              <span className="text-sm font-semibold text-chart-3">{myUsername}</span>
            </div>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div className="w-16 h-16">
                <BuzzCharacter isSpeaking={false} isVocalizing={false} />
              </div>
              <span className="text-sm font-semibold text-accent-foreground">{partnerUsername}</span>
            </div>
          </div>
        ) : (
          <>
            {allHistoryMessages.map((message, index) => (
              <ChatBubble
                key={index}
                speaker={message.speaker}
                morse={message.morse}
                text={message.text}
                isVocalizing={false}
                username={message.speaker === "beep" ? myUsername : partnerUsername}
                testId={`message-${index}`}
              />
            ))}
            {myMorse && (
              <ChatBubble
                speaker="beep"
                morse={myMorse}
                text={myText}
                isVocalizing={isVocalizing}
                isActive
                showCharacter
                username={myUsername}
                testId="user-morse-input"
              />
            )}
            {partnerMorse && (
              <ChatBubble
                speaker="buzz"
                morse={partnerMorse}
                text={partnerText}
                isVocalizing={isPartnerVocalizing}
                isActive
                showCharacter
                username={partnerUsername}
                testId="partner-morse-input"
              />
            )}
            <div className="flex items-start mb-4">
              {!myMorse && (
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-16 h-16">
                    <UserCharacter isSpeaking={false} isVocalizing={false} />
                  </div>
                  <span className="text-sm font-semibold text-chart-3">{myUsername}</span>
                </div>
              )}
              {!partnerMorse && (
                <div className="flex flex-col items-center gap-1 flex-shrink-0 ml-auto">
                  <div className="w-16 h-16">
                    <BuzzCharacter isSpeaking={false} isVocalizing={false} />
                  </div>
                  <span className="text-sm font-semibold text-accent-foreground">{partnerUsername}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
