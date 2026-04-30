"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/app/layout.stores";
import { useMatchmakingPresence, useCurrentMatch, useCurrentUserProfile, useProfileByUserId, useReportUser } from "@/app/morse.hooks";
import { useGameStore } from "@/app/morse.stores";
import { supabase } from "@/supabase/browser-client";
import { morseToText, SPEED_WPM } from "@/lib/morse.utils";
import { cn } from "@/lib/utils";
import { BeepCharacter, BuzzCharacter } from "./MorseCharacters";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flag } from "lucide-react";
import Link from "next/link";

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
          {username || (isBeep ? "Beep" : "Buzz")}
        </span>
        {!username && (
          <span className="text-xs text-muted-foreground">
            {isBeep ? "(You)" : "(Partner)"}
          </span>
        )}
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
  const [targetUsername, setTargetUsername] = useState("");
  const [matchMode, setMatchMode] = useState<"random" | "username">("random");
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const pressStartRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const startBeepPromiseRef = useRef<Promise<void> | null>(null);
  const shouldStopBeepRef = useRef(false);

  const characterGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wordGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messageEndTimerRef = useRef<NodeJS.Timeout | null>(null);
  const partnerCharGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const partnerWordGapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const partnerMessageEndTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { partnerId, sharedMatchId, channel: matchmakingChannel } = useMatchmakingPresence(
    matchMode === "username" ? targetUsername : undefined
  );
  const currentMatch = useCurrentMatch(sharedMatchId);
  const matchId = sharedMatchId;

  const currentUserProfile = useCurrentUserProfile();
  const partnerProfile = useProfileByUserId(partnerId);
  const reportUser = useReportUser();
  const [showReportPanel, setShowReportPanel] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const isConnected = !!partnerId && !!matchId;

  useEffect(() => {
    if (isConnected && matchmakingChannel) {
      console.error("[USER CHAT CONNECTION] ✅ CONNECTED! Match established - partnerId:", partnerId, "matchId:", matchId);
      matchmakingChannel.untrack();
    } else {
      console.error("[USER CHAT CONNECTION] ⏳ Waiting for connection - partnerId:", partnerId, "matchId:", matchId, "isConnected:", isConnected);
    }
  }, [isConnected, matchmakingChannel, partnerId, matchId]);

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

    const currentMorse = useGameStore.getState().userInput;
    if (!currentMorse || currentMorse.trim().length === 0) return;

    const finalText = morseToText(currentMorse);
    setMessageHistory(prev => [...prev, { speaker: "beep", morse: currentMorse, text: finalText }]);
    clearUserInput();
  }, [clearUserInput]);

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

    const currentMorse = useGameStore.getState().partnerInput;
    if (!currentMorse || currentMorse.trim().length === 0) return;

    const finalText = morseToText(currentMorse);
    setMessageHistory(prev => [...prev, { speaker: "buzz", morse: currentMorse, text: finalText }]);
    setPartnerInput("");
  }, [setPartnerInput]);

  useEffect(() => {
    if (!matchId || !user || !partnerId) {
      console.error("[USER CHAT MORSE CHANNEL] Missing requirements - matchId:", matchId, "user:", !!user, "partnerId:", partnerId, "Need all three to establish connection");
      return;
    }

    console.error("[USER CHAT MORSE CHANNEL] ✅ All requirements met! Setting up channel - matchId:", matchId, "partnerId:", partnerId);
    const tapChannel = supabase.channel(`match:${matchId}:morse`, {
      config: { broadcast: { self: false } },
    });

    tapChannel
      .on("broadcast", { event: "signal" }, ({ payload }) => {
        console.error("[USER CHAT MORSE RECEIVED] Signal:", payload.signal, "from userId:", payload.userId, "expected partnerId:", partnerId);
        if (payload.userId === partnerId) {
          console.error("[USER CHAT MORSE RECEIVED] Valid partner signal, processing");
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
        } else {
          console.error("[USER CHAT MORSE RECEIVED] Ignoring signal from non-partner userId:", payload.userId);
        }
      })
      .subscribe((status) => {
        console.error("[USER CHAT MORSE CHANNEL] Subscription status:", status);
      });

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
    shouldStopBeepRef.current = false;

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

    if (shouldStopBeepRef.current) {
      return;
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

    if (shouldStopBeepRef.current) {
      stopBeep();
    }
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

  const handlePressStart = useCallback(async () => {
    if (!isConnected) return;
    if (pressStartRef.current !== null) {
      return;
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

    pressStartRef.current = Date.now();
    setIsVocalizing(true);
    const beepPromise = startBeep();
    startBeepPromiseRef.current = beepPromise;
    await beepPromise;
  }, [isConnected, startBeep]);

  const handlePressEnd = useCallback(async () => {
    if (pressStartRef.current === null) {
      return;
    }

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

    if (channel && user) {
      console.error("[USER CHAT MORSE SEND] Sending signal:", signal, "userId:", user.id, "channel exists:", !!channel);
      channel.send({
        type: "broadcast",
        event: "signal",
        payload: { userId: user.id, signal },
      });
    } else {
      console.error("[USER CHAT MORSE SEND] Cannot send - channel:", !!channel, "user:", !!user);
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
  }, [appendToUserInput, stopBeep, channel, user, morseSpeed, completeMyMessage]);

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
      <div className={cn("flex flex-col", className)}>
        <div className="min-h-fit max-h-[calc(100vh-250px)] overflow-y-auto px-4 py-6 flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Sign in to tap Morse code with other users</p>
          <Button asChild>
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className={cn("flex flex-col", className)}>
        <div className="min-h-fit max-h-[calc(100vh-250px)] overflow-y-auto px-4 py-6 flex flex-col items-center justify-center gap-6">
          <p className="text-muted-foreground mb-4">Find a partner to chat</p>

          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="target-username">Match with specific user</Label>
              <Input
                id="target-username"
                type="text"
                placeholder="Enter username"
                value={targetUsername}
                onChange={(e) => setTargetUsername(e.target.value.toLowerCase())}
              />
            </div>

            <Button
              className="w-full"
              onClick={() => setMatchMode("username")}
              disabled={!targetUsername || targetUsername.length < 3}
            >
              Match with {targetUsername || "Username"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setMatchMode("random")}
            >
              Random Match
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const myMorse = userInput;
  const myText = morseToText(myMorse);
  const partnerMorse = partnerInput;
  const partnerText = morseToText(partnerMorse);

  const handleReportSubmit = () => {
    if (!partnerId) return;
    reportUser.mutate(
      { reportedUserId: partnerId, matchId: matchId ?? null, reason: reportReason || null },
      {
        onSuccess: () => {
          setReportSubmitted(true);
          setShowReportPanel(false);
          setReportReason("");
        },
      }
    );
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-sm text-muted-foreground">
          Chatting with{" "}
          <span className="font-medium text-foreground">
            {partnerProfile.data?.username || "partner"}
          </span>
        </span>
        <div className="flex items-center gap-2">
          {reportSubmitted && (
            <span className="text-xs text-muted-foreground">Report submitted</span>
          )}
          {!reportSubmitted && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-muted-foreground hover:text-destructive"
              onClick={() => setShowReportPanel((v) => !v)}
            >
              <Flag className="h-3.5 w-3.5 mr-1" />
              Report
            </Button>
          )}
        </div>
      </div>

      {showReportPanel && (
        <div className="mx-4 mb-2 p-3 border border-destructive/30 rounded-lg bg-destructive/5 space-y-2">
          <p className="text-sm font-medium text-destructive">
            Report {partnerProfile.data?.username || "this user"}
          </p>
          <select
            className="w-full text-sm border rounded px-2 py-1.5 bg-background"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          >
            <option value="">Select a reason (optional)</option>
            <option value="Harassment">Harassment</option>
            <option value="Spam">Spam</option>
            <option value="Inappropriate content">Inappropriate content</option>
            <option value="Other">Other</option>
          </select>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => setShowReportPanel(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={handleReportSubmit}
              disabled={reportUser.isPending}
            >
              Submit Report
            </Button>
          </div>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="min-h-fit max-h-[calc(100vh-250px)] overflow-y-auto px-4 py-6 flex flex-col cursor-pointer"
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
            username={
              message.speaker === "beep"
                ? currentUserProfile.data?.username
                : partnerProfile.data?.username
            }
          />
        ))}
        {myMorse && (
          <ChatBubble
            speaker="beep"
            morse={myMorse}
            text={myText}
            isVocalizing={isVocalizing}
            username={currentUserProfile.data?.username}
          />
        )}
        {partnerMorse && (
          <ChatBubble
            speaker="buzz"
            morse={partnerMorse}
            text={partnerText}
            isVocalizing={isPartnerVocalizing}
            username={partnerProfile.data?.username}
          />
        )}
      </div>
    </div>
  );
}
