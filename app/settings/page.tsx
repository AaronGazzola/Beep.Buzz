"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useUpdateProfileIcons,
  useStickerActivity,
  useRemovePlacedSticker,
  useStickerAnalytics,
} from "./page.hooks";
import { useSettingsStore } from "./page.stores";
import { useCurrentUser } from "../layout.hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Home,
  User,
  Sticker,
  BarChart3,
  Save,
  Trash2,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import type { SettingsTab } from "./page.types";

const EMOJI_OPTIONS = ["👍", "👎", "❤️", "⭐", "🔥", "💯", "🎉", "👏", "🙌", "💪"];

type DesignData = { emoji?: string; color?: string };

export default function SettingsPage() {
  const router = useRouter();

  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const { data: stickerActivity, isLoading: isActivityLoading } = useStickerActivity();
  const { data: analytics, isLoading: isAnalyticsLoading } = useStickerAnalytics();

  const updateIcons = useUpdateProfileIcons();
  const removeSticker = useRemovePlacedSticker();

  const {
    activeTab,
    setActiveTab,
    beepEmoji,
    beepColor,
    buzzEmoji,
    buzzColor,
    hasChanges,
    setBeepEmoji,
    setBeepColor,
    setBuzzEmoji,
    setBuzzColor,
    setFromProfile,
  } = useSettingsStore();

  useEffect(() => {
    if (!isUserLoading && !currentUser?.user) {
      router.push("/sign-in");
    }
    if (!isUserLoading && currentUser?.user && !currentUser.profile) {
      router.push("/welcome");
    }
  }, [isUserLoading, currentUser, router]);

  useEffect(() => {
    if (currentUser?.profile) {
      const beepDesign = currentUser.profile.beep_design as DesignData | null;
      const buzzDesign = currentUser.profile.buzz_design as DesignData | null;
      setFromProfile(
        beepDesign?.emoji || "👍",
        beepDesign?.color || "#22c55e",
        buzzDesign?.emoji || "👎",
        buzzDesign?.color || "#ef4444"
      );
    }
  }, [currentUser?.profile, setFromProfile]);

  const handleSaveIcons = () => {
    updateIcons.mutate(
      {
        beepDesign: { emoji: beepEmoji, color: beepColor },
        buzzDesign: { emoji: buzzEmoji, color: buzzColor },
      },
      {
        onSuccess: () => {
          toast.success("Icons updated!");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleRemoveSticker = (stickerId: string) => {
    removeSticker.mutate(stickerId, {
      onSuccess: () => {
        toast.success("Sticker removed");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-[600px] w-full" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold">
              Beep.Buzz
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Settings</span>
          </div>
          <nav className="flex items-center gap-2">
            {currentUser?.profile && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${currentUser.profile.username}`}>View Profile</Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="size-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile icons and view your sticker activity
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SettingsTab)}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="size-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="stickers" className="flex items-center gap-2">
              <Sticker className="size-4" />
              Stickers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="size-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Customize Your Icons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <ThumbsUp className="size-4" />
                        Beep Icon (Positive)
                      </h3>
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded flex items-center justify-center text-2xl"
                          style={{ backgroundColor: beepColor }}
                        >
                          {beepEmoji}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div>
                            <Label>Color</Label>
                            <Input
                              type="color"
                              value={beepColor}
                              onChange={(e) => setBeepColor(e.target.value)}
                              className="h-10 w-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Emoji</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setBeepEmoji(emoji)}
                              className={`w-10 h-10 text-xl rounded border-2 transition-colors ${
                                beepEmoji === emoji
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <ThumbsDown className="size-4" />
                        Buzz Icon (Negative)
                      </h3>
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded flex items-center justify-center text-2xl"
                          style={{ backgroundColor: buzzColor }}
                        >
                          {buzzEmoji}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div>
                            <Label>Color</Label>
                            <Input
                              type="color"
                              value={buzzColor}
                              onChange={(e) => setBuzzColor(e.target.value)}
                              className="h-10 w-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Emoji</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setBuzzEmoji(emoji)}
                              className={`w-10 h-10 text-xl rounded border-2 transition-colors ${
                                buzzEmoji === emoji
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button
                      onClick={handleSaveIcons}
                      disabled={!hasChanges || updateIcons.isPending}
                    >
                      <Save className="size-4 mr-2" />
                      {updateIcons.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stickers">
            <Card>
              <CardHeader>
                <CardTitle>Sticker Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {isActivityLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : stickerActivity && stickerActivity.length > 0 ? (
                  <div className="space-y-4">
                    {stickerActivity.map((sticker) => (
                      <div
                        key={sticker.id}
                        className="flex items-center justify-between p-4 rounded border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded flex items-center justify-center text-lg ${
                              sticker.sticker_type === "beep" ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {sticker.sticker_type === "beep" ? "👍" : "👎"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant={sticker.sticker_type === "beep" ? "default" : "secondary"}>
                                {sticker.sticker_type}
                              </Badge>
                              <span className="text-sm">
                                on @{sticker.target_page?.profile?.username || "Unknown"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(sticker.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Sticker</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove this sticker? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveSticker(sticker.id)}
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sticker className="size-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      You haven&apos;t placed any stickers yet
                    </p>
                    <Button variant="outline" className="mt-4" asChild>
                      <Link href="/">Explore Pages</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-4">
              {isAnalyticsLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </>
              ) : analytics ? (
                <>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-green-500/10 flex items-center justify-center">
                          <ThumbsUp className="size-6 text-green-500" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold">{analytics.totalBeeps}</p>
                          <p className="text-sm text-muted-foreground">Beeps Given</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-red-500/10 flex items-center justify-center">
                          <ThumbsDown className="size-6 text-red-500" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold">{analytics.totalBuzzes}</p>
                          <p className="text-sm text-muted-foreground">Buzzes Given</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center">
                          <Sticker className="size-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold">{analytics.totalGiven}</p>
                          <p className="text-sm text-muted-foreground">Total Stickers Given</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-purple-500/10 flex items-center justify-center">
                          <BarChart3 className="size-6 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold">{analytics.totalReceived}</p>
                          <p className="text-sm text-muted-foreground">Stickers Received</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="md:col-span-2">
                  <CardContent className="py-12 text-center">
                    <BarChart3 className="size-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No analytics available</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
