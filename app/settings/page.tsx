"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  useGamePreferences,
  useNotificationSettings,
  useSoundSettings,
} from "./page.hooks";
import { useAccountDetails } from "@/app/layout.hooks";

export default function SettingsPage() {
  const { preferences, update: updatePreferences } = useGamePreferences();
  const { notifications, update: updateNotifications } =
    useNotificationSettings();
  const { sound, update: updateSound } = useSoundSettings();
  const { data: account, update: updateAccount } = useAccountDetails();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Customize your Beep.Buzz experience
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Update your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={account?.email || ""}
              onChange={(e) =>
                updateAccount.mutate({ email: e.target.value })
              }
              disabled={updateAccount.isPending}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input
              value={account?.username || ""}
              onChange={(e) =>
                updateAccount.mutate({ username: e.target.value })
              }
              disabled={updateAccount.isPending}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Game Preferences</CardTitle>
          <CardDescription>
            Customize your gameplay experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Default Difficulty
              </label>
              <span className="text-sm text-muted-foreground">
                {preferences.difficulty}
              </span>
            </div>
            <Slider
              value={[preferences.difficulty]}
              onValueChange={([value]) =>
                updatePreferences.mutate({
                  ...preferences,
                  difficulty: value,
                })
              }
              min={1}
              max={10}
              step={1}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Sound Effects</label>
              <p className="text-sm text-muted-foreground">
                Enable morse code audio playback
              </p>
            </div>
            <Switch
              checked={preferences.soundEnabled}
              onCheckedChange={(checked) =>
                updatePreferences.mutate({
                  ...preferences,
                  soundEnabled: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Visual Feedback</label>
              <p className="text-sm text-muted-foreground">
                Show visual indicators during practice
              </p>
            </div>
            <Switch
              checked={preferences.visualFeedback}
              onCheckedChange={(checked) =>
                updatePreferences.mutate({
                  ...preferences,
                  visualFeedback: checked,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sound Settings</CardTitle>
          <CardDescription>Customize morse code audio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Volume</label>
              <span className="text-sm text-muted-foreground">
                {Math.round(sound.volume * 100)}%
              </span>
            </div>
            <Slider
              value={[sound.volume * 100]}
              onValueChange={([value]) =>
                updateSound.mutate({
                  ...sound,
                  volume: value / 100,
                })
              }
              min={0}
              max={100}
              step={5}
            />
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Dit Sound</label>
              <p className="text-xs text-muted-foreground">
                Currently: {sound.ditSound}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dah Sound</label>
              <p className="text-xs text-muted-foreground">
                Currently: {sound.dahSound}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Email Notifications</label>
              <p className="text-sm text-muted-foreground">
                Receive updates via email
              </p>
            </div>
            <Switch
              checked={notifications.email}
              onCheckedChange={(checked) =>
                updateNotifications.mutate({
                  ...notifications,
                  email: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Match Invites</label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone invites you to a match
              </p>
            </div>
            <Switch
              checked={notifications.matchInvites}
              onCheckedChange={(checked) =>
                updateNotifications.mutate({
                  ...notifications,
                  matchInvites: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Achievement Unlocks</label>
              <p className="text-sm text-muted-foreground">
                Get notified when you unlock achievements
              </p>
            </div>
            <Switch
              checked={notifications.achievements}
              onCheckedChange={(checked) =>
                updateNotifications.mutate({
                  ...notifications,
                  achievements: checked,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" disabled>
            Delete Account
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Contact support to delete your account
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
