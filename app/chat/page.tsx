"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/layout.stores";
import { useGameStore } from "@/app/page.stores";
import { useProfileByUserId } from "@/app/page.hooks";
import { MorseChatAI } from "@/components/MorseChatAI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Bike, Bot, ChevronDown, Gauge, Info, Loader2, Rabbit, Rocket, Shuffle, Turtle, UserRound, Volume2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useChatLayoutStore } from "./layout.stores";
import { useDirectMatchmaking } from "./layout.hooks";
import type { ChatMode } from "./layout.stores";
import type { MorseSpeed } from "@/app/page.types";

const chatModeOptions: { value: ChatMode; label: string; icon: typeof Bot }[] = [
  { value: "ai", label: "Chat with AI", icon: Bot },
  { value: "random", label: "Chat with Random User", icon: Shuffle },
  { value: "friend", label: "Chat with a friend", icon: UserRound },
];

const speedSteps: MorseSpeed[] = ["slow", "medium", "fast", "fastest"];

const speedLabels: Record<MorseSpeed, string> = {
  slow: "Slow",
  medium: "Medium",
  fast: "Fast",
  fastest: "Fastest",
};

function RandomModeContent() {
  const { isAuthenticated } = useAuthStore();
  const { isSearching, setIsSearching } = useChatLayoutStore();
  const { partnerUserId, cancel } = useDirectMatchmaking({ enabled: isSearching && isAuthenticated });
  const partnerProfile = useProfileByUserId(partnerUserId);
  const router = useRouter();

  useEffect(() => {
    console.log("[matchmaking] partnerUserId changed", JSON.stringify({ partnerUserId, profileStatus: partnerProfile.status, username: partnerProfile.data?.username }));
  }, [partnerUserId, partnerProfile.status, partnerProfile.data?.username]);

  useEffect(() => {
    if (partnerProfile.data?.username) {
      console.log("[matchmaking] navigating to partner", partnerProfile.data.username);
      setIsSearching(false);
      router.push(`/chat/${partnerProfile.data.username}`);
    }
  }, [partnerProfile.data?.username, router, setIsSearching]);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-sm text-muted-foreground">Sign in to chat with other users</p>
        <Button asChild size="sm">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (isSearching) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Searching for a match...</p>
        <Button variant="outline" size="sm" onClick={() => { cancel(); setIsSearching(false); }}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground">Find someone to chat with in Morse code</p>
      <Button onClick={() => setIsSearching(true)}>Find Random Match</Button>
    </div>
  );
}

function FriendModeContent() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-sm text-muted-foreground">Sign in to chat with friends</p>
        <Button asChild size="sm">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/chat/${username.trim()}`);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground">Enter a username to start chatting</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-48"
        />
        <Button type="submit" disabled={!username.trim()}>Chat</Button>
      </form>
    </div>
  );
}

export default function ChatPage() {
  const { morseSpeed, setMorseSpeed, morseVolume, setMorseVolume } = useGameStore();
  const { chatMode, setChatMode } = useChatLayoutStore();

  const currentOption = chatModeOptions.find((o) => o.value === chatMode)!;
  const CurrentIcon = currentOption.icon;

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="relative flex items-center justify-between border-b px-4 py-2 shrink-0">
        <div className="hidden sm:block w-8" />
        <Popover>
          <PopoverTrigger asChild>
            <button className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex items-center gap-1.5 text-sm font-medium hover:text-muted-foreground transition-colors">
              <CurrentIcon className="h-4 w-4 flex-shrink-0" />
              <span className="hidden xs:inline">{currentOption.label}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-1" align="center">
            {chatModeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setChatMode(option.value)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                    chatMode === option.value
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
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <button className="bg-muted rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Gauge className="w-5 h-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-52" align="end">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Speed</p>
                  <span className="text-sm text-muted-foreground">{speedLabels[morseSpeed]}</span>
                </div>
                <Slider
                  min={0}
                  max={3}
                  step={1}
                  value={[speedSteps.indexOf(morseSpeed)]}
                  onValueChange={([v]) => setMorseSpeed(speedSteps[v])}
                />
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <button className="bg-muted rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Volume2 className="w-5 h-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-52" align="end">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Volume</p>
                  <span className="text-sm text-muted-foreground">{morseVolume}%</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[morseVolume]}
                  onValueChange={([v]) => setMorseVolume(v)}
                />
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <button className="bg-muted rounded-lg p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Info className="w-5 h-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Morse Code Input Guide</h4>
                <p className="text-sm text-muted-foreground">
                  Click/Tap anywhere or hit space bar to tap Morse code
                </p>
                <div className="space-y-1 pt-2">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">3 dit lengths</span> = space between characters in words
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">7 dit lengths</span> = space between words
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">14 dit lengths</span> = end of message
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">8 consecutive dits (........)</span> = error signal, clears your message
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {chatMode === "ai" && <MorseChatAI key="chatAI" />}
      {chatMode === "random" && <RandomModeContent />}
      {chatMode === "friend" && <FriendModeContent />}
    </div>
  );
}
