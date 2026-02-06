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
  isVocalizing?: boolean;
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

function BeepCharacter({ isSpeaking, isVocalizing, className }: CharacterProps) {
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
          className="fill-chart-3 stroke-chart-3"
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

        {isVocalizing && (
          <circle
            cx="50"
            cy="63"
            r="2.5"
            className="fill-white"
          />
        )}
      </g>
    </svg>
  );
}

function BuzzCharacter({ isSpeaking, isVocalizing, className }: CharacterProps) {
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

        {isVocalizing && (
          <circle
            cx="50"
            cy="63"
            r="2.5"
            className="fill-white"
          />
        )}
      </g>
    </svg>
  );
}

function SpeechBubble({
  speaker,
  message,
  showMorse,
  action,
  buttons,
  fillColor,
  textColor,
}: {
  speaker: Speaker;
  message: string | ReactNode;
  showMorse?: string;
  action?: ReactNode;
  buttons?: ReactNode;
  fillColor?: string;
  textColor?: string;
}) {
  const [bubblePath, setBubblePath] = useState("");
  const cornerOffsetsRef = useRef<{ phase: number; speed: number }[]>([]);
  const pointerOffsetRef = useRef({ phase: Math.random() * Math.PI * 2, speed: 0.8 });

  useEffect(() => {
    cornerOffsetsRef.current = Array.from({ length: 4 }, () => ({
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.8,
    }));
    pointerOffsetRef.current = { phase: Math.random() * Math.PI * 2, speed: 0.8 };
  }, []);

  const generateBubblePath = useCallback(
    (time: number, isMobile: boolean) => {
      const left = isMobile ? 20 : 60;
      const right = isMobile ? 380 : 340;
      const top = isMobile ? 12 : 2;
      const bottom = isMobile ? 328 : 198;
      const cornerRadius = speaker === "beep" ? 25 : 0;
      const centerY = isMobile ? 170 : 75;
      const centerX = 200;
      const pointerHeight = 40;
      const pointerWidth = 40;

      const variation = (index: number) => {
        const offset = cornerOffsetsRef.current[index];
        if (!offset) return 0;
        return Math.sin(time * 0.001 * offset.speed + offset.phase) * 3.5;
      };

      const pointerVariation = Math.sin(time * 0.001 * pointerOffsetRef.current.speed + pointerOffsetRef.current.phase) * 2.25;

      const corners = [
        { x: left + variation(0), y: top + variation(0) },
        { x: right + variation(1), y: top + variation(1) },
        { x: right + variation(2), y: bottom + variation(2) },
        { x: left + variation(3), y: bottom + variation(3) },
      ];

      if (isMobile) {
        if (speaker === "beep") {
          const [tl, tr, br, bl] = corners;
          const pointerLeftX = centerX - pointerWidth / 2;
          const pointerRightX = centerX + pointerWidth / 2;
          const tipY = -8 + pointerVariation;

          return `
            M ${tl.x + cornerRadius} ${tl.y}
            L ${pointerLeftX} ${tl.y}
            L ${centerX} ${tipY}
            L ${pointerRightX} ${tl.y}
            L ${tr.x - cornerRadius} ${tr.y}
            Q ${tr.x} ${tr.y}, ${tr.x} ${tr.y + cornerRadius}
            L ${br.x} ${br.y - cornerRadius}
            Q ${br.x} ${br.y}, ${br.x - cornerRadius} ${br.y}
            L ${bl.x + cornerRadius} ${bl.y}
            Q ${bl.x} ${bl.y}, ${bl.x} ${bl.y - cornerRadius}
            L ${tl.x} ${tl.y + cornerRadius}
            Q ${tl.x} ${tl.y}, ${tl.x + cornerRadius} ${tl.y}
            Z
          `;
        } else {
          const [tl, tr, br, bl] = corners;
          const pointerLeftX = centerX - pointerWidth / 2;
          const pointerRightX = centerX + pointerWidth / 2;
          const tipY = 348 + pointerVariation;

          return `
            M ${tl.x} ${tl.y}
            L ${tr.x} ${tr.y}
            L ${br.x} ${br.y}
            L ${pointerRightX} ${br.y}
            L ${centerX} ${tipY}
            L ${pointerLeftX} ${br.y}
            L ${bl.x} ${bl.y}
            Z
          `;
        }
      } else {
        if (speaker === "beep") {
          const [tl, tr, br, bl] = corners;
          const pointerTopY = centerY - pointerHeight / 2;
          const pointerBottomY = centerY + pointerHeight / 2;
          const tipX = 20 + pointerVariation;

          return `
            M ${tl.x + cornerRadius} ${tl.y}
            L ${tr.x - cornerRadius} ${tr.y}
            Q ${tr.x} ${tr.y}, ${tr.x} ${tr.y + cornerRadius}
            L ${br.x} ${br.y - cornerRadius}
            Q ${br.x} ${br.y}, ${br.x - cornerRadius} ${br.y}
            L ${bl.x + cornerRadius} ${bl.y}
            Q ${bl.x} ${bl.y}, ${bl.x} ${bl.y - cornerRadius}
            L ${tl.x} ${pointerBottomY}
            L ${tipX} ${centerY}
            L ${tl.x} ${pointerTopY}
            L ${tl.x} ${tl.y + cornerRadius}
            Q ${tl.x} ${tl.y}, ${tl.x + cornerRadius} ${tl.y}
            Z
          `;
        } else {
          const [tl, tr, br, bl] = corners;
          const pointerTopY = centerY - pointerHeight / 2;
          const pointerBottomY = centerY + pointerHeight / 2;
          const tipX = 380 + pointerVariation;

          return `
            M ${tl.x} ${tl.y}
            L ${tr.x} ${tr.y}
            L ${tr.x} ${pointerTopY}
            L ${tipX} ${centerY}
            L ${tr.x} ${pointerBottomY}
            L ${br.x} ${br.y}
            L ${bl.x} ${bl.y}
            Z
          `;
        }
      }
    },
    [speaker]
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useAnimationFrame((time) => {
    setBubblePath(generateBubblePath(time, isMobile));
  });

  const strokeColor = speaker === "beep" ? "stroke-chart-3" : "stroke-accent-foreground";
  const bubbleFillColor = fillColor || "fill-background";

  return (
    <div className="relative w-full h-full overflow-visible">
      <svg
        viewBox={isMobile ? "0 0 400 340" : "0 0 400 200"}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        style={{ overflow: "visible" }}
      >
        <path
          d={bubblePath}
          className={cn(bubbleFillColor, strokeColor)}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className={cn("absolute inset-0 flex items-center justify-center z-10 text-center px-12", textColor)}>
        <div className="max-w-[280px]">
          <div className="text-2xl font-medium leading-relaxed">
            {message}
          </div>
          {showMorse && (
            <p className="text-lg font-mono break-all mt-2 opacity-90">
              {showMorse}
            </p>
          )}
          {action && <div className="mt-2">{action}</div>}
          {buttons && <div className="mt-2">{buttons}</div>}
        </div>
      </div>
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
        <span className="text-lg font-semibold text-chart-3">Beep</span>
      </div>

      <div className="lg:order-2">
        <SpeechBubble speaker={currentSpeaker} message={message} />
      </div>

      <div className="flex flex-col items-center gap-1 lg:order-3">
        <div className="w-24 h-24 md:w-32 md:h-32">
          <BuzzCharacter isSpeaking={currentSpeaker === "buzz"} />
        </div>
        <span className="text-lg font-semibold text-accent-foreground">Buzz</span>
      </div>
    </div>
  );
}

export { BeepCharacter, BuzzCharacter, SpeechBubble };
export type { Speaker };
