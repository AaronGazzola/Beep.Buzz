"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/app/layout.stores";
import { useMatchmakingPresence, useCurrentMatch } from "@/app/page.hooks";
import { useGameStore } from "@/app/page.stores";
import { supabase } from "@/supabase/browser-client";
import { morseToText, SPEED_WPM } from "@/lib/morse.utils";
import { cn } from "@/lib/utils";
import { BeepCharacter, BuzzCharacter } from "./MorseCharacters";
import type { RealtimeChannel } from "@supabase/supabase-js";

const DOT_THRESHOLD = 200;

interface ChatBubbleProps {
  speaker: "beep" | "buzz";
  morse: string;
  text: string;
  isVocalizing?: boolean;
}

function ChatBubble({ speaker, morse, text, isVocalizing }: ChatBubbleProps) {
  const isBeep = speaker === "beep";
  const bubbleColor = isBeep ? "bg-chart-3" : "bg-accent-foreground";
  const alignment = isBeep ? "self-start" : "self-end";
  const pointerStyle = isBeep ? "chat-bubble-left" : "chat-bubble-right";

  const displayText = text || (morse ? morseToText(morse) : "");
  const displayTextWithSpaces = displayText.split(' ').join(' · ');

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
        <span className={cn(
          "text-sm font-semibold",
          isBeep ? "text-chart-3" : "text-accent-foreground"
        )}>
          {isBeep ? "Beep" : "Buzz"}
        </span>
        <span className="text-xs text-muted-foreground">
          {isBeep ? "(You)" : "(Partner)"}
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

interface Message {
  speaker: "beep" | "buzz";
  morse: string;
  text: string;
}

export function MorseChatUser({ className }: { className?: string }) {
  const { user } = useAuthStore();
  const { userInput, appendToUserInput, clearUserInput, partnerInput, setPartnerInput, appendToPartnerInput, morseSpeed } = useGameStore();
  const [isVocalizing, setIsVocalizing] = useState(false);
  const [isPartnerVocalizing, setIsPartnerVocalizing] = useState(false);
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const pressStartRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const characterGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wordGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageEndTimerRef = useRef<NodeJS.Timeout | null>(null);
  const partnerCharGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const partnerWordGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const partnerMessageEndTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { partnerId, sharedMatchId, channel: matchmakingChannel } = useMatchmakingPresence();
  const currentMatch = useCurrentMatch(sharedMatchId);
  const matchId = sharedMatchId;

  const isConnected = !!partnerId && !!matchId;

  useEffect(() => {
    if (isConnected && matchmakingChannel) {
      console.log("🎉 [CONNECTED] Match established, leaving matchmaking queue");
      matchmakingChannel.untrack();
    }
  }, [isConnected, matchmakingChannel]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [userInput, partnerInput, messageHistory]);

  const completeMyMessage = useCallback(() => {
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

    const currentMorse = userInput;
    if (!currentMorse || currentMorse.trim().length === 0) return;

    const finalText = morseToText(currentMorse);
    setMessageHistory(prev => [...prev, { speaker: "beep", morse: currentMorse, text: finalText }]);
    clearUserInput();
  }, [userInput, clearUserInput]);

  const completePartnerMessage = useCallback(() => {
    if (partnerCharGapTimerRef.current) {
      clearTimeout(partnerCharGapTimerRef.current);
      partnerCharGapTimerRef.current = null;
    }
    if (partnerWordGapTimerRef.current) {
      clearTimeout(partnerWordGapTimerRef.current);
      partnerWordGapTimerRef.current = null;
    }
    if (partnerMessageEndTimerRef.current) {
      clearTimeout(partnerMessageEndTimerRef.current);
      partnerMessageEndTimerRef.current = null;
    }

    const currentMorse = partnerInput;
    if (!currentMorse || currentMorse.trim().length === 0) return;

    const finalText = morseToText(currentMorse);
    setMessageHistory(prev => [...prev, { speaker: "buzz", morse: currentMorse, text: finalText }]);
    setPartnerInput("");
  }, [partnerInput, setPartnerInput]);

  useEffect(() => {
    if (!matchId || !user || !partnerId) {
      return;
    }

    const tapChannel = supabase.channel(`match:${matchId}:morse`, {
      config: { broadcast: { self: false } },
    });

    tapChannel
      .on("broadcast", { event: "signal" }, ({ payload }) => {
        if (payload.userId === partnerId) {
          if (partnerCharGapTimerRef.current) {
            clearTimeout(partnerCharGapTimerRef.current);
            partnerCharGapTimerRef.current = null;
          }
          if (partnerWordGapTimerRef.current) {
            clearTimeout(partnerWordGapTimerRef.current);
            partnerWordGapTimerRef.current = null;
          }
          if (partnerMessageEndTimerRef.current) {
            clearTimeout(partnerMessageEndTimerRef.current);
            partnerMessageEndTimerRef.current = null;
          }

          appendToPartnerInput(payload.signal);
          setIsPartnerVocalizing(true);
          setTimeout(() => setIsPartnerVocalizing(false), payload.signal === "." ? 100 : 300);
          playBeep(payload.signal === "." ? 100 : 300);

          const ditDuration = 1200 / SPEED_WPM[morseSpeed];
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
                completePartnerMessage();
              }, messageEnd);
            }, wordGap - charGap);
          }, charGap);
        }
      })
      .subscribe();

    setChannel(tapChannel);

    return () => {
      supabase.removeChannel(tapChannel);
      if (partnerCharGapTimerRef.current) clearTimeout(partnerCharGapTimerRef.current);
      if (partnerWordGapTimerRef.current) clearTimeout(partnerWordGapTimerRef.current);
      if (partnerMessageEndTimerRef.current) clearTimeout(partnerMessageEndTimerRef.current);
    };
  }, [matchId, user, partnerId, appendToPartnerInput, morseSpeed]);

  const playBeep = useCallback((duration: number = 100) => {
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

  const startBeep = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const audioContext = audioContextRef.current;

    if (audioContext.state === "suspended") {
      try {
        await audioContext.resume();
      } catch (error) {
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
    if (!isConnected) return;
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
  }, [isConnected, startBeep]);

  const handlePressEnd = useCallback(() => {
    if (pressStartRef.current === null) return;

    stopBeep();
    setIsVocalizing(false);

    const pressDuration = Date.now() - pressStartRef.current;
    const signal = pressDuration < DOT_THRESHOLD ? "." : "-";

    appendToUserInput(signal);
    pressStartRef.current = null;

    if (channel && user) {
      channel.send({
        type: "broadcast",
        event: "signal",
        payload: { userId: user.id, signal },
      });
    }

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
  }, [appendToUserInput, stopBeep, channel, user, morseSpeed]);

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
      if (!isConnected) return;
      if (e.code !== "Space") return;

      e.preventDefault();
      handlePressStart();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (isInputFocused()) return;
      if (isModifierKey(e)) return;
      if (!isConnected) return;
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
  }, [handlePressStart, handlePressEnd, isConnected]);

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
    if (!isConnected) return;
    e.preventDefault();
    handlePressStart();
  }, [isConnected, handlePressStart]);

  const handleContainerMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isConnected) return;
    e.preventDefault();
    handlePressEnd();
  }, [isConnected, handlePressEnd]);

  const handleContainerMouseLeave = useCallback(() => {
    if (pressStartRef.current !== null) {
      handlePressEnd();
    }
  }, [handlePressEnd]);

  const handleContainerTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isConnected) return;
    e.preventDefault();
    handlePressStart();
  }, [isConnected, handlePressStart]);

  const handleContainerTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isConnected) return;
    e.preventDefault();
    handlePressEnd();
  }, [isConnected, handlePressEnd]);

  const handleContextMenu = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
  }, []);

  if (!user) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <p className="text-muted-foreground">Please sign in to connect</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <p className="text-muted-foreground">Searching for partner...</p>
      </div>
    );
  }

  const myMorse = userInput;
  const myText = morseToText(myMorse);
  const partnerMorse = partnerInput;
  const partnerText = morseToText(partnerMorse);

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
        {messageHistory.map((message, index) => (
          <ChatBubble
            key={index}
            speaker={message.speaker}
            morse={message.morse}
            text={message.text}
            isVocalizing={false}
          />
        ))}
        {myMorse && (
          <ChatBubble
            speaker="beep"
            morse={myMorse}
            text={myText}
            isVocalizing={isVocalizing}
          />
        )}
        {partnerMorse && (
          <ChatBubble
            speaker="buzz"
            morse={partnerMorse}
            text={partnerText}
            isVocalizing={isPartnerVocalizing}
          />
        )}
      </div>

      <div className="border-t bg-background p-6">
        <div className="text-center space-y-2">
          <p className="text-base font-medium text-foreground">
            Click anywhere or hit spacebar to tap morse
          </p>
          <p className="text-sm text-muted-foreground">
            3 dit lengths = space between characters
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
