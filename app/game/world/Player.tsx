"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UserCharacter } from "@/components/UserCharacter";
import { cn } from "@/lib/utils";
import { useMorseInput } from "@/lib/useMorseInput";
import { morseToText, SPEED_WPM } from "@/lib/morse.utils";
import { useGameStore } from "@/app/page.stores";
import {
  useGameWorldStore,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  type SentMessage,
} from "../page.stores";

const SENT_FADE_MS = 1500;
const ACTIVE_BUBBLE_OFFSET = 160;
const SENT_BUBBLE_RISE = 130;

export function Player() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const { x, y } = useGameWorldStore.getState().playerPos;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    apply();
    const unsubscribe = useGameWorldStore.subscribe(apply);
    return unsubscribe;
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="absolute top-0 left-0"
      style={{
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        zIndex: 5,
        willChange: "transform",
      }}
    >
      <PlayerCharacter />
      <PlayerSpeechBubbles />
    </div>
  );
}

function PlayerCharacter() {
  const facingRef = useRef<HTMLDivElement>(null);
  const trainerOpen = useGameWorldStore((s) => s.trainerOpen);
  const dialog = useGameWorldStore((s) => s.signpostDialog);
  const isAlive = useGameWorldStore((s) => s.isAlive);
  const morseSpeed = useGameStore((s) => s.morseSpeed);

  const morseEnabled = isAlive && !trainerOpen && !dialog;

  const charTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const msgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAllTimers = useCallback(() => {
    if (charTimerRef.current) {
      clearTimeout(charTimerRef.current);
      charTimerRef.current = null;
    }
    if (wordTimerRef.current) {
      clearTimeout(wordTimerRef.current);
      wordTimerRef.current = null;
    }
    if (msgTimerRef.current) {
      clearTimeout(msgTimerRef.current);
      msgTimerRef.current = null;
    }
  }, []);

  const onSignal = useCallback(
    (signal: "." | "-") => {
      clearAllTimers();
      useGameWorldStore.getState().appendMorse(signal);

      const ditDur = 1200 / SPEED_WPM[morseSpeed];
      const charGap = ditDur * 3;
      const wordGap = ditDur * 7;
      const messageEnd = ditDur * 14;

      charTimerRef.current = setTimeout(() => {
        useGameWorldStore.getState().commitMorseLetter();
        charTimerRef.current = null;

        wordTimerRef.current = setTimeout(() => {
          useGameWorldStore.getState().commitMorseWord();
          wordTimerRef.current = null;

          msgTimerRef.current = setTimeout(() => {
            useGameWorldStore.getState().finishMorseMessage();
            msgTimerRef.current = null;
          }, messageEnd);
        }, wordGap - charGap);
      }, charGap);
    },
    [clearAllTimers, morseSpeed]
  );

  const { begin, end, cancel, isPressed } = useMorseInput({
    enabled: morseEnabled,
    onSignal,
  });

  useEffect(() => {
    return clearAllTimers;
  }, [clearAllTimers]);

  useEffect(() => {
    const apply = () => {
      const el = facingRef.current;
      if (!el) return;
      const { facing } = useGameWorldStore.getState();
      el.style.transform = `scaleX(${facing})`;
    };
    apply();
    const unsubscribe = useGameWorldStore.subscribe(apply);
    return unsubscribe;
  }, []);

  const onPress = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!morseEnabled) return;
      begin();
    },
    [begin, morseEnabled]
  );

  const onRelease = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      end();
    },
    [end]
  );

  const onLeave = useCallback(() => {
    cancel();
  }, [cancel]);

  return (
    <div
      ref={facingRef}
      onPointerDown={onPress}
      onPointerUp={onRelease}
      onPointerCancel={onLeave}
      onPointerLeave={onLeave}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "absolute inset-0 select-none touch-none",
        morseEnabled ? "cursor-pointer" : "cursor-default"
      )}
      style={{
        pointerEvents: "auto",
        transformOrigin: "center",
      }}
    >
      <UserCharacter
        className={cn(
          "w-full h-full pointer-events-none transition-transform",
          isPressed && "scale-110"
        )}
        isSpeaking={isPressed}
      />
    </div>
  );
}

function PlayerSpeechBubbles() {
  const morseBuffer = useGameWorldStore((s) => s.morseBuffer);
  const sentMessages = useGameWorldStore((s) => s.sentMessages);
  const trimmed = morseBuffer.trim();

  return (
    <>
      {sentMessages.map((msg) => (
        <SentBubble key={msg.id} message={msg} />
      ))}
      {trimmed && <ActiveBubble morse={trimmed} />}
    </>
  );
}

function ActiveBubble({ morse }: { morse: string }) {
  const decoded = morseToText(morse).trim();
  return (
    <div
      className="absolute pointer-events-none top-0 left-1/2 animate-in fade-in zoom-in duration-150"
      style={{
        transform: `translate(-50%, -${ACTIVE_BUBBLE_OFFSET}px)`,
        willChange: "transform",
      }}
    >
      <BubbleContent morse={morse} text={decoded} />
    </div>
  );
}

function SentBubble({ message }: { message: SentMessage }) {
  const [exiting, setExiting] = useState(false);
  const removeSentMessage = useGameWorldStore((s) => s.removeSentMessage);

  useEffect(() => {
    const startTimer = setTimeout(() => setExiting(true), 30);
    const removeTimer = setTimeout(() => removeSentMessage(message.id), SENT_FADE_MS + 100);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(removeTimer);
    };
  }, [message.id, removeSentMessage]);

  const offset = exiting ? ACTIVE_BUBBLE_OFFSET + SENT_BUBBLE_RISE : ACTIVE_BUBBLE_OFFSET;

  return (
    <div
      className="absolute pointer-events-none top-0 left-1/2"
      style={{
        transform: `translate(-50%, -${offset}px)`,
        opacity: exiting ? 0 : 1,
        transition: `transform ${SENT_FADE_MS}ms ease-out, opacity ${SENT_FADE_MS}ms ease-out`,
        willChange: "transform, opacity",
      }}
    >
      <BubbleContent morse={message.morse} text={message.text} />
    </div>
  );
}

function BubbleContent({ morse, text }: { morse: string; text: string }) {
  const words = morse.split(" / ").filter((w) => w.trim().length > 0);

  return (
    <div className="bg-white border-2 border-slate-300 rounded-2xl px-5 py-3 shadow-xl text-center relative w-max max-w-[min(80vw,560px)]">
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
        {words.map((word, wi) => (
          <div key={wi} className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            {word
              .split(" ")
              .filter((l) => l.length > 0)
              .map((letter, li) => (
                <span
                  key={li}
                  className="font-mono text-5xl tracking-widest leading-none text-slate-900"
                >
                  {letter}
                </span>
              ))}
          </div>
        ))}
      </div>
      {text && (
        <div className="mt-2 text-xl font-bold uppercase tracking-wide text-emerald-600 break-words">
          {text}
        </div>
      )}
      <span
        aria-hidden
        className="absolute left-1/2 -translate-x-1/2 top-full block w-3.5 h-3.5 rotate-45 bg-white border-r-2 border-b-2 border-slate-300 -mt-2"
      />
    </div>
  );
}
