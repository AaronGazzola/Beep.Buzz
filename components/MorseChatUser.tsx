"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "@/app/layout.stores";
import { useMatchmakingPresence, useCurrentMatch } from "@/app/page.hooks";
import { supabase } from "@/supabase/browser-client";
import { cn } from "@/lib/utils";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function MorseChatUser({ className }: { className?: string }) {
  const { user } = useAuthStore();
  const [myBeep, setMyBeep] = useState(false);
  const [partnerBeep, setPartnerBeep] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const { partnerId } = useMatchmakingPresence();
  const currentMatch = useCurrentMatch();
  const matchId = currentMatch.data?.id;

  const isConnected = !!partnerId && !!matchId;

  console.log("🔵 [USER CHAT] State:", {
    user: user?.id.substring(0, 8),
    partnerId: partnerId?.substring(0, 8),
    matchId: matchId?.substring(0, 8),
    isConnected
  });

  useEffect(() => {
    if (!matchId || !user || !partnerId) {
      console.log("⚠️ [BROADCAST] Not ready - matchId:", !!matchId, "user:", !!user, "partnerId:", !!partnerId);
      return;
    }

    console.log("📡 [BROADCAST] Setting up channel for match:", matchId.substring(0, 8));

    const tapChannel = supabase.channel(`match:${matchId}:taps`, {
      config: { broadcast: { self: false } },
    });

    tapChannel
      .on("broadcast", { event: "tap" }, ({ payload }) => {
        console.log("📨 [TAP RECEIVED] From:", payload.userId?.substring(0, 8), "Expected partner:", partnerId.substring(0, 8));

        if (payload.userId === partnerId) {
          console.log("✅ [TAP RECEIVED] Valid partner - playing beep and animating");

          setPartnerBeep(true);
          setTimeout(() => setPartnerBeep(false), 200);

          playBeep();
        } else {
          console.log("❌ [TAP RECEIVED] Not from partner, ignoring");
        }
      })
      .subscribe((status) => {
        console.log("📡 [BROADCAST] Channel status:", status);
      });

    setChannel(tapChannel);

    return () => {
      console.log("📡 [BROADCAST] Cleaning up channel");
      supabase.removeChannel(tapChannel);
    };
  }, [matchId, user, partnerId]);

  const playBeep = useCallback(() => {
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

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }, []);

  const handleTap = useCallback(() => {
    if (!isConnected) {
      console.log("⚠️ [TAP] Not connected, ignoring tap");
      return;
    }

    console.log("📤 [TAP SEND] Sending tap to partner");

    setMyBeep(true);
    setTimeout(() => setMyBeep(false), 200);

    playBeep();

    if (channel && user) {
      console.log("📤 [TAP SEND] Broadcasting tap event from:", user.id.substring(0, 8));
      channel.send({
        type: "broadcast",
        event: "tap",
        payload: { userId: user.id },
      });
    } else {
      console.log("⚠️ [TAP SEND] Cannot send - channel:", !!channel, "user:", !!user);
    }
  }, [isConnected, channel, user, playBeep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        handleTap();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleTap]);

  if (!user) {
    return (
      <div className={cn("flex items-center justify-center h-64", className)}>
        <p className="text-muted-foreground">Please sign in to connect</p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="bg-muted rounded-lg p-4 mb-4 text-center">
        <p className="text-sm text-muted-foreground">
          {isConnected ? "Connected! Tap anywhere or press space to send morse" : "Searching for partner..."}
        </p>
      </div>

      <div
        onClick={handleTap}
        className="flex items-center justify-around bg-background border-2 border-muted rounded-lg p-12 cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              "w-24 h-24 rounded-full bg-orange-500 transition-all duration-200",
              myBeep && "scale-125 shadow-lg shadow-orange-500/50"
            )}
          />
          <p className="text-sm font-medium">You</p>
        </div>

        {isConnected && (
          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                "w-24 h-24 rounded-full bg-blue-500 transition-all duration-200",
                partnerBeep && "scale-125 shadow-lg shadow-blue-500/50"
              )}
            />
            <p className="text-sm font-medium">Partner</p>
          </div>
        )}
      </div>
    </div>
  );
}
