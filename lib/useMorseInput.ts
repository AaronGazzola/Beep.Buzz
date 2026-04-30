"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseMorseInputOptions {
  enabled: boolean;
  onSignal: (signal: "." | "-") => void;
  dotThresholdMs?: number;
  audioEnabled?: boolean;
  frequency?: number;
  volume?: number;
}

interface AudioRefs {
  ctx: AudioContext | null;
  osc: OscillatorNode | null;
  gain: GainNode | null;
}

export function useMorseInput({
  enabled,
  onSignal,
  dotThresholdMs = 220,
  audioEnabled = true,
  frequency = 600,
  volume = 0.18,
}: UseMorseInputOptions) {
  const [isPressed, setIsPressed] = useState(false);
  const pressStartRef = useRef<number>(0);
  const audioRef = useRef<AudioRefs>({ ctx: null, osc: null, gain: null });

  const startBeep = useCallback(() => {
    if (!audioEnabled || typeof window === "undefined") return;
    const audio = audioRef.current;
    if (!audio.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) {
        console.error("AudioContext not supported");
        return;
      }
      audio.ctx = new Ctor();
    }
    const ctx = audio.ctx;
    if (ctx.state === "suspended") void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = frequency;
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.005);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    audio.osc = osc;
    audio.gain = gain;
  }, [audioEnabled, frequency, volume]);

  const stopBeep = useCallback(() => {
    const audio = audioRef.current;
    const ctx = audio.ctx;
    if (!ctx) return;
    if (audio.gain) {
      audio.gain.gain.cancelScheduledValues(ctx.currentTime);
      audio.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.02);
    }
    if (audio.osc) {
      try {
        audio.osc.stop(ctx.currentTime + 0.04);
      } catch {
        // already stopped
      }
      audio.osc = null;
    }
  }, []);

  const begin = useCallback(() => {
    if (!enabled) return;
    if (isPressed) return;
    pressStartRef.current = performance.now();
    setIsPressed(true);
    startBeep();
  }, [enabled, isPressed, startBeep]);

  const end = useCallback(() => {
    if (!isPressed) return;
    const duration = performance.now() - pressStartRef.current;
    setIsPressed(false);
    stopBeep();
    if (!enabled) return;
    onSignal(duration < dotThresholdMs ? "." : "-");
  }, [enabled, isPressed, stopBeep, onSignal, dotThresholdMs]);

  const cancel = useCallback(() => {
    if (!isPressed) return;
    setIsPressed(false);
    stopBeep();
  }, [isPressed, stopBeep]);

  useEffect(() => {
    if (enabled) return;
    stopBeep();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPressed((prev) => (prev ? false : prev));
  }, [enabled, stopBeep]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      stopBeep();
      const ctx = audio.ctx;
      if (ctx) {
        try {
          void ctx.close();
        } catch {
          // ignore
        }
        audio.ctx = null;
      }
    };
  }, [stopBeep]);

  return { isPressed, begin, end, cancel };
}
