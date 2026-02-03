"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/layout.stores";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Volume2, Gauge, Palette } from "lucide-react";

export default function SettingsPage() {
  const { profile } = useAuthStore();

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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize your Morse code learning experience
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Audio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Volume</Label>
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Morse Code Speed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Words Per Minute (WPM)</Label>
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" size="lg">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
