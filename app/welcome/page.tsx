"use client";

import { useState, useEffect } from "react";
import { useCurrentProfile, useUpdateProfile } from "./page.hooks";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Volume2, Gauge } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function WelcomePage() {
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const updateProfile = useUpdateProfile();

  const [audioVolume, setAudioVolume] = useState(50);
  const [morseWPM, setMorseWPM] = useState(20);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    if (profile?.audio_settings) {
      const settings = profile.audio_settings as any;
      setAudioVolume((settings.volume || 0.5) * 100);
      setMorseWPM(settings.wpm || 20);
    }
    if (profile?.visual_settings) {
      const settings = profile.visual_settings as any;
      setTheme(settings.theme || "system");
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      audioVolume: audioVolume / 100,
      morseWPM,
      theme,
    });
  };

  if (profileLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome to Beep.Buzz!</CardTitle>
          <CardDescription>
            Let's customize your Morse code learning experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                  <Label>Audio Volume</Label>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[audioVolume]}
                    onValueChange={(value) => setAudioVolume(value[0])}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {audioVolume}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Adjust the volume for Morse code audio playback
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-muted-foreground" />
                  <Label>Morse Code Speed (WPM)</Label>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[morseWPM]}
                    onValueChange={(value) => setMorseWPM(value[0])}
                    min={5}
                    max={40}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {morseWPM}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Words per minute - start slow and increase as you improve
                </p>
              </div>

              <div className="space-y-3">
                <Label>Theme</Label>
                <Select
                  value={theme}
                  onValueChange={(value: "light" | "dark" | "system") =>
                    setTheme(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Continue to App
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
