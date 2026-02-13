"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useGameStore, useUserChatStore } from "@/app/page.stores";
import { morseToText } from "@/lib/morse.utils";
import { useJoinChatQueue, useWaitForMatch, useLeaveChatQueue, useMorseBroadcast } from "@/app/page.hooks";
import { BeepCharacter, BuzzCharacter } from "./MorseCharacters";
import type { Speaker } from "./MorseCharacters";
import type { MorseSpeed } from "@/app/page.types";
import { Loader2 } from "lucide-react";

const DOT_THRESHOLD = 200;

const SPEED_WPM: Record<MorseSpeed, number> = {
  slow: 8,
  medium: 14,
  fast: 20,
  fastest: 28,
};

interface ChatBubbleProps {
  speaker: Speaker;
  morse: string;
  text: string;
  isComplete: boolean;
  showCharacter?: boolean;
  isVocalizing?: boolean;
  label?: string;
  sublabel?: string;
}

function ChatBubble({ speaker, morse, text, isComplete, showCharacter, isVocalizing, label, sublabel }: ChatBubbleProps) {
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
            {label || (isBeep ? "Beep" : "Buzz")}
          </span>
          <span className="text-xs text-muted-foreground">
            {sublabel || (isBeep ? "(You)" : "(Partner)")}
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

export function MorseChatUser({ className }: { className?: string }) {
  const {
    chatMessages,
    userInput,
    appendToUserInput,
    clearUserInput,
    addChatMessage,
    updateLastChatMessage,
    clearChatMessages,
  } = useGameStore();

  const {
    chatStatus,
    chatRoom,
    isMyTurn,
    isPartnerVocalizing,
    setChatStatus,
    setIsMyTurn,
    clearPartnerMorse,
    resetUserChat,
  } = useUserChatStore();

  const joinQueue = useJoinChatQueue();
  const leaveQueue = useLeaveChatQueue();
  useWaitForMatch();
  const { broadcastSignal } = useMorseBroadcast(
    chatStatus === "connected" ? chatRoom?.roomId ?? null : null
  );

  const [isVocalizing, setIsVocalizing] = useState(false);
  const pressStartRef = useRef<number | null>(null);
  const characterGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wordGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageEndTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const partnerAudioContextRef = useRef<AudioContext | null>(null);
  const partnerOscillatorRef = useRef<OscillatorNode | null>(null);
  const partnerGainNodeRef = useRef<GainNode | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const isLongPressRef = useRef(false);
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!hasJoinedRef.current) {
      hasJoinedRef.current = true;
      joinQueue.mutate();
    }

    return () => {
      leaveQueue.mutate();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [chatMessages, userInput]);

  useEffect(() => {
    if (isPartnerVocalizing) {
      startPartnerTone();
    } else {
      stopPartnerTone();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPartnerVocalizing]);

  const startPartnerTone = useCallback(async () => {
    if (!partnerAudioContextRef.current) {
      partnerAudioContextRef.current = new AudioContext();
    }
    const ctx = partnerAudioContextRef.current;
    if (ctx.state === "suspended") {
      try { await ctx.resume(); } catch (e) { console.error(e); return; }
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 600;
    osc.type = "sine";
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.01);
    osc.start();
    partnerOscillatorRef.current = osc;
    partnerGainNodeRef.current = gain;
  }, []);

  const stopPartnerTone = useCallback(() => {
    if (partnerOscillatorRef.current && partnerGainNodeRef.current && partnerAudioContextRef.current) {
      const t = partnerAudioContextRef.current.currentTime;
      partnerGainNodeRef.current.gain.setValueAtTime(partnerGainNodeRef.current.gain.value, t);
      partnerGainNodeRef.current.gain.linearRampToValueAtTime(0, t + 0.01);
      setTimeout(() => {
        partnerOscillatorRef.current?.stop();
        partnerOscillatorRef.current = null;
        partnerGainNodeRef.current = null;
      }, 20);
    }
  }, []);

  const startBeep = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const audioContext = audioContextRef.current;
    if (audioContext.state === "suspended") {
      try { await audioContext.resume(); } catch (error) { console.error(error); return; }
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

    broadcastSignal({ type: "message_end", timestamp: Date.now() });
    setIsMyTurn(false);
  }, [clearUserInput, updateLastChatMessage, broadcastSignal, setIsMyTurn]);

  const handlePressStart = useCallback(() => {
    if (!isMyTurn) return;
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
    broadcastSignal({ type: "tap_start", timestamp: Date.now() });
  }, [isMyTurn, startBeep, broadcastSignal]);

  const handlePressEnd = useCallback(() => {
    if (pressStartRef.current === null) return;

    stopBeep();
    setIsVocalizing(false);

    const pressDuration = Date.now() - pressStartRef.current;
    const signal: "." | "-" = pressDuration < DOT_THRESHOLD ? "." : "-";

    appendToUserInput(signal);
    pressStartRef.current = null;

    broadcastSignal({ type: "tap_end", timestamp: Date.now(), signal });

    const ui = useGameStore.getState().userInput + signal;
    const text = morseToText(ui);
    const messages = useGameStore.getState().chatMessages;
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.speaker !== "beep" || lastMsg.isComplete) {
      addChatMessage({ speaker: "beep", morse: ui, text, isComplete: false });
    } else {
      updateLastChatMessage(ui, text, false);
    }

    const currentWpm = SPEED_WPM[useGameStore.getState().morseSpeed];
    const ditDuration = 1200 / currentWpm;
    const charGap = ditDuration * 3;
    const wordGap = ditDuration * 7;
    const messageEnd = ditDuration * 14;

    characterGapTimerRef.current = setTimeout(() => {
      appendToUserInput(" ");
      broadcastSignal({ type: "char_gap", timestamp: Date.now() });
      characterGapTimerRef.current = null;

      const updatedMorse = useGameStore.getState().userInput;
      const updatedText = morseToText(updatedMorse);
      updateLastChatMessage(updatedMorse, updatedText, false);

      wordGapTimerRef.current = setTimeout(() => {
        appendToUserInput("/ ");
        broadcastSignal({ type: "word_gap", timestamp: Date.now() });
        wordGapTimerRef.current = null;

        const wUpdatedMorse = useGameStore.getState().userInput;
        const wUpdatedText = morseToText(wUpdatedMorse);
        updateLastChatMessage(wUpdatedMorse, wUpdatedText, false);

        messageEndTimerRef.current = setTimeout(() => {
          completeMessage();
        }, messageEnd);
      }, wordGap - charGap);
    }, charGap);
  }, [appendToUserInput, stopBeep, completeMessage, broadcastSignal, addChatMessage, updateLastChatMessage]);

  useEffect(() => {
    if (chatStatus !== "connected") return;

    const isInputFocused = () => {
      const active = document.activeElement;
      return active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement ||
        active?.getAttribute("contenteditable") === "true";
    };

    const isModifierKey = (e: KeyboardEvent) => {
      return e.key === "Meta" || e.key === "Control" || e.key === "Alt" ||
        e.key === "Shift" || e.key === "CapsLock" || e.key === "Escape" || e.key === "Tab";
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (isInputFocused()) return;
      if (isModifierKey(e)) return;
      if (!useUserChatStore.getState().isMyTurn) return;
      e.preventDefault();
      handlePressStart();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isInputFocused()) return;
      if (isModifierKey(e)) return;
      e.preventDefault();
      handlePressEnd();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handlePressStart, handlePressEnd, chatStatus]);

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    };
  }, [isMyTurn]);

  const handleContainerTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMyTurn) return;
    e.preventDefault();
    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => { isLongPressRef.current = true; }, DOT_THRESHOLD);
    handlePressStart();
  }, [isMyTurn, handlePressStart]);

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
    if (!isMyTurn) return;
    e.preventDefault();
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    handlePressEnd();
    touchStartPosRef.current = null;
    isLongPressRef.current = false;
  }, [isMyTurn, handlePressEnd]);

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
    if (!isMyTurn) return;
    e.preventDefault();
    handlePressStart();
  }, [isMyTurn, handlePressStart]);

  const handleContainerMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isMyTurn) return;
    e.preventDefault();
    handlePressEnd();
  }, [isMyTurn, handlePressEnd]);

  const handleContainerMouseLeave = useCallback(() => {
    if (pressStartRef.current !== null) {
      handlePressEnd();
    }
  }, [handlePressEnd]);

  const handleContextMenu = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
  }, []);

  const handleFindNewPartner = useCallback(() => {
    resetUserChat();
    clearChatMessages();
    hasJoinedRef.current = false;
    setTimeout(() => {
      hasJoinedRef.current = true;
      joinQueue.mutate();
    }, 0);
  }, [resetUserChat, clearChatMessages, joinQueue]);

  const handleCancel = useCallback(() => {
    leaveQueue.mutate();
  }, [leaveQueue]);

  if (chatStatus === "idle" || chatStatus === "searching") {
    return (
      <div className={cn("flex flex-col h-full items-center justify-center gap-6", className)}>
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Looking for a chat partner...</p>
        <button
          onClick={handleCancel}
          className="px-6 py-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (chatStatus === "disconnected") {
    return (
      <div className={cn("flex flex-col h-full items-center justify-center gap-6", className)}>
        <p className="text-lg text-muted-foreground">Partner disconnected</p>
        <button
          onClick={handleFindNewPartner}
          className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Find New Partner
        </button>
      </div>
    );
  }

  const partnerName = chatRoom?.isCreator
    ? chatRoom.partnerUsername || "Partner"
    : chatRoom?.username || "Partner";

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
          const showVocalizing = (isLastBeepMessage && isVocalizing) || (isLastBuzzMessage && isPartnerVocalizing);

          return (
            <ChatBubble
              key={index}
              speaker={message.speaker}
              morse={message.morse}
              text={message.text}
              isComplete={message.isComplete}
              showCharacter={showCharacter}
              isVocalizing={showVocalizing}
              label={message.speaker === "beep" ? "Beep" : "Buzz"}
              sublabel={message.speaker === "beep" ? "(You)" : `(${partnerName})`}
            />
          );
        })}

        {chatMessages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-lg">
              {isMyTurn ? "You go first! Tap to send morse code." : `Waiting for ${partnerName} to send a message...`}
            </p>
          </div>
        )}
      </div>

      <div className="border-t bg-background p-6">
        <div className="text-center space-y-2">
          <p className="text-base font-medium text-foreground">
            {isMyTurn ? "Your turn — click anywhere or hit any key to tap morse" : `${partnerName} is tapping...`}
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
