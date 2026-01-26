"use client";

import { useEffect, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/app/layout.hooks";
import {
  useUserSettings,
  useIdentityUpdate,
  useStickerManagement,
  useStickerAnalytics,
} from "./page.hooks";
import { useIdentityStore } from "./page.stores";
import type { StickerStyle, StickerType } from "./page.types";
import {
  Loader2,
  Save,
  User,
  Sticker,
  BarChart3,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

export default function SettingsPage() {
  const router = useRouter();
  const { data: user, isPending: isUserLoading } = useCurrentUser();
  const { isPending: isSettingsLoading } = useUserSettings();
  const { profile, sticker, email } = useIdentityStore();
  const identityUpdate = useIdentityUpdate();
  const stickerManagement = useStickerManagement();
  const { data: analytics, isPending: isAnalyticsLoading } =
    useStickerAnalytics();

  const [editUsername, setEditUsername] = useState("");
  const [editStickerType, setEditStickerType] = useState<StickerType>("BEEP");
  const [editStickerStyle, setEditStickerStyle] = useState<StickerStyle>({
    size: "medium",
    color: STICKER_COLORS[0],
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (profile) {
      setEditUsername(profile.username);
    }
    if (sticker) {
      setEditStickerType(sticker.type);
      setEditStickerStyle(sticker.style as StickerStyle);
    }
  }, [profile, sticker]);

  if (isUserLoading || isSettingsLoading) {
    return (
      <div className="container py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const handleSaveUsername = () => {
    if (!editUsername.trim() || editUsername === profile.username) return;
    identityUpdate.mutate({ username: editUsername });
  };

  const handleSaveSticker = () => {
    identityUpdate.mutate({
      stickerType: editStickerType,
      stickerStyle: editStickerStyle,
    });
  };

  const handleRemovePlacement = (placementId: string) => {
    stickerManagement.mutate({ placementId, action: "remove" });
  };

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and sticker identity
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email || ""} disabled />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                placeholder="username"
              />
            </div>
            <Button
              onClick={handleSaveUsername}
              disabled={
                identityUpdate.isPending ||
                !editUsername.trim() ||
                editUsername === profile.username
              }
            >
              {identityUpdate.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Username
                </>
              )}
            </Button>
            {identityUpdate.isError && (
              <p className="text-sm text-destructive">
                {identityUpdate.error.message}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sticker className="h-5 w-5" />
              Sticker Identity
            </CardTitle>
            <CardDescription>Customize your sticker appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Sticker Type</Label>
              <Select
                value={editStickerType}
                onValueChange={(value) =>
                  setEditStickerType(value as StickerType)
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
              <Label>Size</Label>
              <Select
                value={editStickerStyle.size}
                onValueChange={(value) =>
                  setEditStickerStyle({
                    ...editStickerStyle,
                    size: value as StickerStyle["size"],
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
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {STICKER_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      setEditStickerStyle({ ...editStickerStyle, color })
                    }
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                      editStickerStyle.color === color
                        ? "border-primary scale-110"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center py-4">
              <div
                className={cn(
                  "flex items-center justify-center rounded-full font-bold text-white",
                  editStickerStyle.size === "small" && "h-12 w-12 text-xs",
                  editStickerStyle.size === "medium" && "h-16 w-16 text-sm",
                  editStickerStyle.size === "large" && "h-20 w-20 text-base"
                )}
                style={{ backgroundColor: editStickerStyle.color }}
              >
                {editStickerType}
              </div>
            </div>

            <Button
              onClick={handleSaveSticker}
              disabled={identityUpdate.isPending}
              className="w-full"
            >
              {identityUpdate.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Sticker
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sticker Analytics
          </CardTitle>
          <CardDescription>
            See where you&apos;ve placed your stickers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAnalyticsLoading ? (
            <div className="space-y-4">
              <div className="flex gap-4">
                <Skeleton className="h-16 w-32" />
                <Skeleton className="h-16 w-32" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">
                    {analytics.totalPlacements}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Placements
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{analytics.uniquePages}</p>
                  <p className="text-sm text-muted-foreground">Unique Pages</p>
                </div>
              </div>

              {analytics.recentPlacements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Recent Placements</h4>
                  <div className="space-y-2">
                    {analytics.recentPlacements.map((placement) => (
                      <div
                        key={placement.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {placement.pageElement?.page?.title || "Unknown Page"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            @
                            {placement.pageElement?.page?.profile?.username ||
                              "unknown"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {placement.pageElement?.page?.profile?.username && (
                            <Button variant="ghost" size="icon" asChild>
                              <Link
                                href={`/${placement.pageElement.page.profile.username}`}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemovePlacement(placement.id)}
                            disabled={stickerManagement.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analytics.recentPlacements.length === 0 && (
                <p className="text-muted-foreground text-center py-8">
                  You haven&apos;t placed any stickers yet. Visit other users&apos;
                  pages to leave your mark!
                </p>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Unable to load analytics
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
