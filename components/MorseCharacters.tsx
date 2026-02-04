"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Speaker = "beep" | "buzz";

interface MorseCharactersProps {
  className?: string;
  currentSpeaker?: Speaker;
  message?: string;
  onSpeakerChange?: (speaker: Speaker) => void;
  interactive?: boolean;
}

interface CharacterProps {
  isSpeaking: boolean;
  className?: string;
}

function useAnimationFrame(callback: (time: number) => void) {
  const requestRef = useRef<number>(null);
  const startTimeRef = useRef<number>(null);

  const animate = useCallback(
    (time: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = time;
      }
      callback(time - startTimeRef.current);
      requestRef.current = requestAnimationFrame(animate);
    },
    [callback]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
}

function useBlink() {
  const [isBlinking, setIsBlinking] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const scheduleBlink = () => {
      const nextBlinkDelay = 2000 + Math.random() * 4000;
      timeoutRef.current = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 150);
      }, nextBlinkDelay);
    };

    scheduleBlink();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return isBlinking;
}

function BeepCharacter({ isSpeaking, className }: CharacterProps) {
  const [path, setPath] = useState("");
  const isBlinking = useBlink();
  const offsetsRef = useRef<{ phase: number; speed: number; amplitude: number }[]>([]);

  useEffect(() => {
    const numPoints = 8;
    offsetsRef.current = Array.from({ length: numPoints }, () => ({
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
      amplitude: 3 + Math.random() * 5,
    }));
  }, []);

  const generateBlobPath = useCallback((time: number) => {
    const cx = 50;
    const cy = 50;
    const baseRadius = 30;
    const numPoints = 8;
    const points: { x: number; y: number }[] = [];

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
      const offset = offsetsRef.current[i];
      if (!offset) continue;

      const radiusVariation =
        Math.sin(time * 0.001 * offset.speed + offset.phase) * offset.amplitude;
      const radius = baseRadius + radiusVariation;

      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      points.push({ x, y });
    }

    if (points.length < numPoints) return "";

    let d = "";
    for (let i = 0; i < points.length; i++) {
      const p0 = points[(i - 1 + points.length) % points.length];
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const p3 = points[(i + 2) % points.length];

      if (i === 0) {
        d += `M ${p1.x} ${p1.y}`;
      }

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return d;
  }, []);

  useAnimationFrame((time) => {
    setPath(generateBlobPath(time));
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-full h-full", className)}
      style={{ overflow: "visible" }}
    >
      <g
        className={cn(
          "origin-center transition-transform duration-300",
          isSpeaking && "scale-105"
        )}
        style={{ transformOrigin: "50px 50px" }}
      >
        <path
          d={path}
          className="fill-primary stroke-primary"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <line
          x1="40"
          y1={isBlinking ? 45 : 38}
          x2="40"
          y2={isBlinking ? 45 : 52}
          strokeWidth="4"
          strokeLinecap="round"
          className="stroke-white transition-all duration-75"
        />
        <line
          x1="60"
          y1={isBlinking ? 45 : 38}
          x2="60"
          y2={isBlinking ? 45 : 52}
          strokeWidth="4"
          strokeLinecap="round"
          className="stroke-white transition-all duration-75"
        />
      </g>
    </svg>
  );
}

function BuzzCharacter({ isSpeaking, className }: CharacterProps) {
  const [path, setPath] = useState("");
  const isBlinking = useBlink();
  const offsetsRef = useRef<
    { outerPhase: number; outerSpeed: number; innerPhase: number; innerSpeed: number; anglePhase: number; angleSpeed: number }[]
  >([]);

  useEffect(() => {
    const numPoints = 8;
    offsetsRef.current = Array.from({ length: numPoints }, () => ({
      outerPhase: Math.random() * Math.PI * 2,
      outerSpeed: 0.8 + Math.random() * 1.2,
      innerPhase: Math.random() * Math.PI * 2,
      innerSpeed: 0.6 + Math.random() * 1.4,
      anglePhase: Math.random() * Math.PI * 2,
      angleSpeed: 0.3 + Math.random() * 0.6,
    }));
  }, []);

  const generateSpikeyPath = useCallback((time: number) => {
    const cx = 50;
    const cy = 50;
    const baseOuterRadius = 40;
    const baseInnerRadius = 22;
    const numPoints = 8;
    const points: string[] = [];

    for (let i = 0; i < numPoints * 2; i++) {
      const pointIndex = Math.floor(i / 2);
      const offset = offsetsRef.current[pointIndex];
      if (!offset) continue;

      const isOuter = i % 2 === 0;
      const baseAngle = (i * Math.PI) / numPoints - Math.PI / 2;

      const angleVariation =
        Math.sin(time * 0.001 * offset.angleSpeed + offset.anglePhase) * 0.1;
      const angle = baseAngle + angleVariation;

      let radius: number;
      if (isOuter) {
        const radiusVariation =
          Math.sin(time * 0.001 * offset.outerSpeed + offset.outerPhase) * 6;
        radius = baseOuterRadius + radiusVariation;
      } else {
        const radiusVariation =
          Math.sin(time * 0.001 * offset.innerSpeed + offset.innerPhase) * 4;
        radius = baseInnerRadius + radiusVariation;
      }

      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      if (i === 0) {
        points.push(`M ${x} ${y}`);
      } else {
        points.push(`L ${x} ${y}`);
      }
    }
    points.push("Z");
    return points.join(" ");
  }, []);

  useAnimationFrame((time) => {
    setPath(generateSpikeyPath(time));
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-full h-full", className)}
      style={{ overflow: "visible" }}
    >
      <g
        className={cn(
          "origin-center transition-transform duration-300",
          isSpeaking && "scale-105"
        )}
        style={{ transformOrigin: "50px 50px" }}
      >
        <path
          d={path}
          className="fill-accent-foreground stroke-accent-foreground"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <line
          x1="42"
          y1={isBlinking ? 45 : 39}
          x2="42"
          y2={isBlinking ? 45 : 51}
          strokeWidth="3.5"
          strokeLinecap="round"
          className="stroke-white transition-all duration-75"
        />
        <line
          x1="58"
          y1={isBlinking ? 45 : 39}
          x2="58"
          y2={isBlinking ? 45 : 51}
          strokeWidth="3.5"
          strokeLinecap="round"
          className="stroke-white transition-all duration-75"
        />
      </g>
    </svg>
  );
}

function SpeechBubble({
  speaker,
  message,
  showMorse,
  action,
}: {
  speaker: Speaker;
  message: string;
  showMorse?: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative w-full max-w-[280px] mx-auto">
      <div
        className={cn(
          "bg-white dark:bg-gray-800 rounded-2xl px-5 py-4",
          "border-2 border-gray-300 dark:border-gray-600",
          "text-center transition-all duration-300",
          "min-h-[80px] flex flex-col items-center justify-center gap-2"
        )}
      >
        <p className="text-base font-medium text-gray-800 dark:text-gray-100">
          {message}
        </p>
        {showMorse && (
          <p className="text-sm font-mono text-muted-foreground break-all">
            {showMorse}
          </p>
        )}
        {action}
      </div>

      {speaker === "beep" && (
        <>
          <div
            className={cn(
              "absolute w-0 h-0 lg:hidden",
              "border-l-[10px] border-l-transparent",
              "border-r-[10px] border-r-transparent",
              "border-b-[12px] border-b-gray-300 dark:border-b-gray-600",
              "left-1/2 -translate-x-1/2 top-0 -translate-y-full"
            )}
          />
          <div
            className={cn(
              "absolute w-0 h-0 lg:hidden",
              "border-l-[8px] border-l-transparent",
              "border-r-[8px] border-r-transparent",
              "border-b-[10px] border-b-white dark:border-b-gray-800",
              "left-1/2 -translate-x-1/2 top-0 -translate-y-[calc(100%-2px)]"
            )}
          />
        </>
      )}

      {speaker === "buzz" && (
        <>
          <div
            className={cn(
              "absolute w-0 h-0 lg:hidden",
              "border-l-[10px] border-l-transparent",
              "border-r-[10px] border-r-transparent",
              "border-t-[12px] border-t-gray-300 dark:border-t-gray-600",
              "left-1/2 -translate-x-1/2 bottom-0 translate-y-full"
            )}
          />
          <div
            className={cn(
              "absolute w-0 h-0 lg:hidden",
              "border-l-[8px] border-l-transparent",
              "border-r-[8px] border-r-transparent",
              "border-t-[10px] border-t-white dark:border-t-gray-800",
              "left-1/2 -translate-x-1/2 bottom-0 translate-y-[calc(100%-2px)]"
            )}
          />
        </>
      )}

      <div
        className={cn(
          "hidden lg:block absolute w-0 h-0",
          "border-t-[10px] border-t-transparent",
          "border-b-[10px] border-b-transparent",
          "top-1/2 -translate-y-1/2",
          speaker === "beep"
            ? "border-r-[12px] border-r-gray-300 dark:border-r-gray-600 left-0 -translate-x-full"
            : "border-l-[12px] border-l-gray-300 dark:border-l-gray-600 right-0 translate-x-full"
        )}
      />
      <div
        className={cn(
          "hidden lg:block absolute w-0 h-0",
          "border-t-[8px] border-t-transparent",
          "border-b-[8px] border-b-transparent",
          "top-1/2 -translate-y-1/2",
          speaker === "beep"
            ? "border-r-[10px] border-r-white dark:border-r-gray-800 left-0 -translate-x-[calc(100%-2px)]"
            : "border-l-[10px] border-l-white dark:border-l-gray-800 right-0 translate-x-[calc(100%-2px)]"
        )}
      />
    </div>
  );
}

export function MorseCharacters({
  className,
  currentSpeaker: controlledSpeaker,
  message: controlledMessage,
  onSpeakerChange,
  interactive = true,
}: MorseCharactersProps) {
  const [internalSpeaker, setInternalSpeaker] = useState<Speaker>("beep");

  const currentSpeaker = controlledSpeaker ?? internalSpeaker;

  const defaultMessages = {
    beep: "Hi! I'm Beep! I represent the dots in Morse code.",
    buzz: "And I'm Buzz! I represent the dashes!",
  };

  const message = controlledMessage ?? defaultMessages[currentSpeaker];

  const handleClick = () => {
    if (!interactive) return;

    const newSpeaker = currentSpeaker === "beep" ? "buzz" : "beep";
    if (onSpeakerChange) {
      onSpeakerChange(newSpeaker);
    } else {
      setInternalSpeaker(newSpeaker);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8",
        interactive && "cursor-pointer",
        "select-none p-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-1 lg:order-1">
        <div className="w-24 h-24 md:w-32 md:h-32">
          <BeepCharacter isSpeaking={currentSpeaker === "beep"} />
        </div>
        <span className="text-sm font-semibold text-primary">Beep</span>
      </div>

      <div className="lg:order-2">
        <SpeechBubble speaker={currentSpeaker} message={message} />
      </div>

      <div className="flex flex-col items-center gap-1 lg:order-3">
        <div className="w-24 h-24 md:w-32 md:h-32">
          <BuzzCharacter isSpeaking={currentSpeaker === "buzz"} />
        </div>
        <span className="text-sm font-semibold text-accent-foreground">Buzz</span>
      </div>
    </div>
  );
}

export { BeepCharacter, BuzzCharacter, SpeechBubble };
export type { Speaker };
