"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useCurrentUser, useUserProfile } from "@/app/layout.hooks";
import { useUsernameValidation, useStickerIdentity } from "./page.hooks";
import { useStickerIdentityStore } from "./page.stores";
import { Loader2, Check, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const STICKER_COLORS = [
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#96ceb4",
  "#ffeaa7",
  "#dfe6e9",
  "#fd79a8",
  "#a29bfe",
];

export default function WelcomePage() {
  const router = useRouter();
  const { data: user, isPending: isUserLoading } = useCurrentUser();
  const { data: profile, isPending: isProfileLoading } = useUserProfile();

  const {
    username,
    stickerType,
    stickerStyle,
    setUsername,
    setStickerType,
    setStickerStyle,
  } = useStickerIdentityStore();

  const { data: validation, isPending: isValidating } =
    useUsernameValidation(username);
  const stickerIdentity = useStickerIdentity();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!isProfileLoading && profile?.username) {
      router.push("/studio");
    }
  }, [profile, isProfileLoading, router]);

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation?.isValid || !validation?.isAvailable) return;

    stickerIdentity.mutate(
      {
        username,
        stickerType,
        stickerStyle,
      },
      {
        onSuccess: () => {
          router.push("/studio");
        },
      }
    );
  };

  const canSubmit =
    validation?.isValid && validation?.isAvailable && !stickerIdentity.isPending;

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Sparkles className="h-12 w-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-2xl">Welcome to Beep.Buzz!</CardTitle>
          <CardDescription>
            Let&apos;s set up your profile and sticker identity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Choose your username</Label>
              <div className="relative">
                <Input
                  id="username"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={cn(
                    "pr-10",
                    validation?.isValid &&
                      validation?.isAvailable &&
                      "border-green-500",
                    validation?.isValid &&
                      !validation?.isAvailable &&
                      "border-destructive"
                  )}
                />
                {username.length >= 3 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isValidating ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : validation?.isValid && validation?.isAvailable ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                )}
              </div>
              {validation?.message && (
                <p
                  className={cn(
                    "text-sm",
                    validation.isAvailable
                      ? "text-green-500"
                      : "text-destructive"
                  )}
                >
                  {validation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Choose your sticker type</Label>
              <Select
                value={stickerType}
                onValueChange={(value) =>
                  setStickerType(value as "BEEP" | "BUZZ")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEEP">Beep</SelectItem>
                  <SelectItem value="BUZZ">Buzz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Choose your sticker size</Label>
              <Select
                value={stickerStyle.size}
                onValueChange={(value) =>
                  setStickerStyle({
                    size: value as "small" | "medium" | "large",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Choose your sticker color</Label>
              <div className="flex flex-wrap gap-2">
                {STICKER_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setStickerStyle({ color })}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                      stickerStyle.color === color
                        ? "border-primary scale-110"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center">
              <div
                className={cn(
                  "flex items-center justify-center rounded-full font-bold text-white",
                  stickerStyle.size === "small" && "h-12 w-12 text-xs",
                  stickerStyle.size === "medium" && "h-16 w-16 text-sm",
                  stickerStyle.size === "large" && "h-20 w-20 text-base"
                )}
                style={{ backgroundColor: stickerStyle.color }}
              >
                {stickerType}
              </div>
            </div>

            {stickerIdentity.isError && (
              <p className="text-sm text-destructive text-center">
                {stickerIdentity.error.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit}
            >
              {stickerIdentity.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
