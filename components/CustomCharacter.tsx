"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface CustomCharacterProps {
  color: string;
  numPoints: number;
  spikeyness: number;
  eyeStyle: number;
  hat: number;
  glasses: number;
  makeup: number;
  shoes: number;
  isSpeaking?: boolean;
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

function Eyes({ eyeStyle, isBlinking }: { eyeStyle: number; isBlinking: boolean }) {
  const eyePositions = [
    { x: 40, x2: 60 },
  ];
  const { x, x2 } = eyePositions[0];

  if (eyeStyle === 0) {
    return (
      <>
        <line x1={x} y1={isBlinking ? 44 : 38} x2={x} y2={isBlinking ? 44 : 52} strokeWidth="4" strokeLinecap="round" stroke="white" className="transition-all duration-75" />
        <line x1={x2} y1={isBlinking ? 44 : 38} x2={x2} y2={isBlinking ? 44 : 52} strokeWidth="4" strokeLinecap="round" stroke="white" className="transition-all duration-75" />
      </>
    );
  }

  if (eyeStyle === 1) {
    return (
      <>
        <circle cx={x} cy={isBlinking ? 44 : 45} r={isBlinking ? 0.5 : 4} fill="white" className="transition-all duration-75" />
        <circle cx={x2} cy={isBlinking ? 44 : 45} r={isBlinking ? 0.5 : 4} fill="white" className="transition-all duration-75" />
      </>
    );
  }

  if (eyeStyle === 2) {
    const size = isBlinking ? 0.5 : 4;
    return (
      <>
        {[x, x2].map((cx, i) => (
          <g key={i}>
            {[0, 60, 120].map((angle) => {
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={angle}
                  x1={cx - Math.cos(rad) * size}
                  y1={45 - Math.sin(rad) * size}
                  x2={cx + Math.cos(rad) * size}
                  y2={45 + Math.sin(rad) * size}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  stroke="white"
                />
              );
            })}
          </g>
        ))}
      </>
    );
  }

  if (eyeStyle === 3) {
    const s = isBlinking ? 0.5 : 4;
    return (
      <>
        {[x, x2].map((cx, i) => (
          <g key={i}>
            <line x1={cx - s} y1={45 - s} x2={cx + s} y2={45 + s} strokeWidth="3" strokeLinecap="round" stroke="white" />
            <line x1={cx + s} y1={45 - s} x2={cx - s} y2={45 + s} strokeWidth="3" strokeLinecap="round" stroke="white" />
          </g>
        ))}
      </>
    );
  }

  if (eyeStyle === 4) {
    return (
      <>
        {[x, x2].map((cx, i) => (
          <path
            key={i}
            d={isBlinking
              ? `M ${cx - 4} 44 Q ${cx} 44 ${cx + 4} 44`
              : `M ${cx - 4} 48 Q ${cx} 40 ${cx + 4} 48`}
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-75"
          />
        ))}
      </>
    );
  }

  return null;
}

function Hat({ hat }: { hat: number }) {
  if (hat === 0) return null;

  if (hat === 1) {
    return (
      <g>
        <polygon points="50,8 42,30 58,30" fill="white" opacity="0.9" />
        <circle cx="50" cy="8" r="2.5" fill="white" opacity="0.9" />
        <line x1="38" y1="30" x2="62" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      </g>
    );
  }

  if (hat === 2) {
    return (
      <g>
        <rect x="40" y="12" width="20" height="16" rx="1" fill="white" opacity="0.9" />
        <rect x="33" y="26" width="34" height="5" rx="2" fill="white" opacity="0.9" />
      </g>
    );
  }

  if (hat === 3) {
    return (
      <g>
        <ellipse cx="43" cy="22" rx="8" ry="5" fill="white" opacity="0.9" />
        <ellipse cx="57" cy="22" rx="8" ry="5" fill="white" opacity="0.9" />
        <circle cx="50" cy="22" r="3" fill="white" opacity="0.9" />
      </g>
    );
  }

  return null;
}

function Glasses({ glasses }: { glasses: number }) {
  if (glasses === 0) return null;

  if (glasses === 1) {
    return (
      <g fill="none" stroke="white" strokeWidth="2" opacity="0.9">
        <circle cx="40" cy="44" r="7" />
        <circle cx="60" cy="44" r="7" />
        <line x1="47" y1="44" x2="53" y2="44" />
        <line x1="26" y1="44" x2="33" y2="44" />
        <line x1="67" y1="44" x2="74" y2="44" />
      </g>
    );
  }

  if (glasses === 2) {
    return (
      <g fill="none" stroke="white" strokeWidth="2" opacity="0.9">
        <rect x="32" y="38" width="15" height="12" rx="2" />
        <rect x="52" y="38" width="15" height="12" rx="2" />
        <line x1="47" y1="44" x2="52" y2="44" />
        <line x1="26" y1="44" x2="32" y2="44" />
        <line x1="67" y1="44" x2="74" y2="44" />
      </g>
    );
  }

  if (glasses === 3) {
    return (
      <g opacity="0.9">
        <rect x="28" y="40" width="44" height="8" rx="4" fill="white" opacity="0.35" stroke="white" strokeWidth="1.5" />
      </g>
    );
  }

  return null;
}

function Makeup({ makeup }: { makeup: number }) {
  if (makeup === 0) return null;

  if (makeup === 1) {
    return (
      <>
        <circle cx="30" cy="60" r="6" fill="white" opacity="0.25" />
        <circle cx="70" cy="60" r="6" fill="white" opacity="0.25" />
      </>
    );
  }

  if (makeup === 2) {
    return (
      <>
        {[30, 70].map((cx, i) => {
          const pts = Array.from({ length: 4 }, (_, j) => {
            const angle = (j * Math.PI) / 2;
            const r = j % 2 === 0 ? 5 : 2.5;
            return `${cx + r * Math.cos(angle)},${60 + r * Math.sin(angle)}`;
          }).join(" ");
          return <polygon key={i} points={pts} fill="white" opacity="0.5" />;
        })}
      </>
    );
  }

  if (makeup === 3) {
    return (
      <>
        {[28, 30, 32].map((x, i) => (
          <line key={`l-${i}`} x1={x} y1={57 + i * 2} x2={x + 4} y2={59 + i * 2} stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        ))}
        {[68, 70, 72].map((x, i) => (
          <line key={`r-${i}`} x1={x} y1={57 + i * 2} x2={x - 4} y2={59 + i * 2} stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        ))}
      </>
    );
  }

  return null;
}

function Shoes({ shoes }: { shoes: number }) {
  if (shoes === 0) return null;

  if (shoes === 1) {
    return (
      <g fill="white" opacity="0.85">
        <rect x="34" y="79" width="12" height="7" rx="3" />
        <rect x="54" y="79" width="12" height="7" rx="3" />
      </g>
    );
  }

  if (shoes === 2) {
    return (
      <g fill="white" opacity="0.85">
        <rect x="32" y="77" width="14" height="10" rx="4" />
        <rect x="54" y="77" width="14" height="10" rx="4" />
      </g>
    );
  }

  if (shoes === 3) {
    return (
      <g fill="white" opacity="0.85">
        <path d="M35 86 L35 79 Q39 78 43 80 L43 86 Z" />
        <path d="M43 83 L46 88" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M55 86 L55 79 Q59 78 63 80 L63 86 Z" />
        <path d="M63 83 L66 88" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </g>
    );
  }

  return null;
}

export function CustomCharacter({
  color,
  numPoints,
  spikeyness,
  eyeStyle,
  hat,
  glasses,
  makeup,
  shoes,
  isSpeaking = false,
  className,
}: CustomCharacterProps) {
  const [path, setPath] = useState("");
  const isBlinking = useBlink();
  const spikeRatio = spikeyness / 100;

  const offsetsRef = useRef<
    { phase: number; speed: number; amplitude: number }[]
  >([]);

  useEffect(() => {
    offsetsRef.current = Array.from({ length: 20 }, () => ({
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5,
      amplitude: 3 + Math.random() * 5,
    }));
  }, []);

  const generatePath = useCallback(
    (time: number) => {
      const cx = 50;
      const cy = 50;
      const baseRadius = 28;
      const n = Math.max(4, Math.min(16, numPoints));
      const innerRadius = baseRadius * (1 - spikeRatio * 0.65);
      const tension = (1 - spikeRatio) / 6;

      const points: { x: number; y: number }[] = [];

      for (let i = 0; i < n * 2; i++) {
        const pointIndex = Math.floor(i / 2);
        const offset = offsetsRef.current[pointIndex % offsetsRef.current.length];
        if (!offset) continue;

        const isOuter = i % 2 === 0;
        const baseAngle = (i * Math.PI) / n - Math.PI / 2;
        const radius = isOuter
          ? baseRadius + Math.sin(time * 0.001 * offset.speed + offset.phase) * offset.amplitude * (1 - spikeRatio * 0.5)
          : innerRadius + Math.sin(time * 0.001 * (offset.speed * 0.7) + offset.phase + 1) * offset.amplitude * 0.4;

        points.push({
          x: cx + radius * Math.cos(baseAngle),
          y: cy + radius * Math.sin(baseAngle),
        });
      }

      if (points.length === 0) return "";

      let d = "";
      for (let i = 0; i < points.length; i++) {
        const p0 = points[(i - 1 + points.length) % points.length];
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];
        const p3 = points[(i + 2) % points.length];

        if (i === 0) {
          d += `M ${p1.x} ${p1.y}`;
        }

        const cp1x = p1.x + (p2.x - p0.x) * tension;
        const cp1y = p1.y + (p2.y - p0.y) * tension;
        const cp2x = p2.x - (p3.x - p1.x) * tension;
        const cp2y = p2.y - (p3.y - p1.y) * tension;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
      }

      return d;
    },
    [numPoints, spikeRatio]
  );

  useAnimationFrame((time) => {
    setPath(generatePath(time));
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
          fill={color}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Hat hat={hat} />
        <Glasses glasses={glasses} />
        <Eyes eyeStyle={eyeStyle} isBlinking={isBlinking} />
        <Makeup makeup={makeup} />
        <Shoes shoes={shoes} />
      </g>
    </svg>
  );
}
