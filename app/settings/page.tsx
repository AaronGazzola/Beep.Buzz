"use client";

import { useCurrentProfile, useUpdateStickerIdentity, useStickerActivity } from "./page.hooks";
import { useStickerIdentityStore } from "./page.stores";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function SettingsPage() {
  const { data: profile, isPending: isProfileLoading } = useCurrentProfile();
  const { mutate: updateStickers, isPending: isUpdating } = useUpdateStickerIdentity();
  const { data: activity, isPending: isActivityLoading } = useStickerActivity();
  const { beep_style, buzz_style, setBeepStyle, setBuzzStyle } = useStickerIdentityStore();

  const handleUpdate = () => {
    updateStickers({
      beep_style,
      buzz_style,
    });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Settings</h1>

        <Tabs defaultValue="identity" className="w-full">
          <TabsList className="grid grid-cols-2 w-full sm:w-auto">
            <TabsTrigger value="identity">Sticker Identity</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="identity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Update Your Sticker Identity</CardTitle>
                <CardDescription>
                  Customize the appearance of your beep and buzz stickers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isProfileLoading ? (
                  <>
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Beep Sticker</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Background Color</Label>
                          <Input
                            type="color"
                            value={beep_style.backgroundColor}
                            onChange={(e) => setBeepStyle({ backgroundColor: e.target.value })}
                            className="h-10 w-full"
                          />
                        </div>
                        <div>
                          <Label>Border Color</Label>
                          <Input
                            type="color"
                            value={beep_style.borderColor}
                            onChange={(e) => setBeepStyle({ borderColor: e.target.value })}
                            className="h-10 w-full"
                          />
                        </div>
                        <div>
                          <Label>Text Color</Label>
                          <Input
                            type="color"
                            value={beep_style.textColor}
                            onChange={(e) => setBeepStyle({ textColor: e.target.value })}
                            className="h-10 w-full"
                          />
                        </div>
                        <div>
                          <Label>Shape</Label>
                          <select
                            value={beep_style.shape}
                            onChange={(e) => setBeepStyle({ shape: e.target.value as "circle" | "square" | "rounded" })}
                            className="w-full h-10 px-3 border rounded-md"
                          >
                            <option value="circle">Circle</option>
                            <option value="square">Square</option>
                            <option value="rounded">Rounded</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <div
                          className="w-24 h-24 flex items-center justify-center text-xl font-bold"
                          style={{
                            backgroundColor: beep_style.backgroundColor,
                            borderColor: beep_style.borderColor,
                            color: beep_style.textColor,
                            borderWidth: "3px",
                            borderStyle: "solid",
                            borderRadius: beep_style.shape === "circle" ? "50%" : beep_style.shape === "rounded" ? "12px" : "0",
                          }}
                        >
                          BEEP
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Buzz Sticker</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label>Background Color</Label>
                          <Input
                            type="color"
                            value={buzz_style.backgroundColor}
                            onChange={(e) => setBuzzStyle({ backgroundColor: e.target.value })}
                            className="h-10 w-full"
                          />
                        </div>
                        <div>
                          <Label>Border Color</Label>
                          <Input
                            type="color"
                            value={buzz_style.borderColor}
                            onChange={(e) => setBuzzStyle({ borderColor: e.target.value })}
                            className="h-10 w-full"
                          />
                        </div>
                        <div>
                          <Label>Text Color</Label>
                          <Input
                            type="color"
                            value={buzz_style.textColor}
                            onChange={(e) => setBuzzStyle({ textColor: e.target.value })}
                            className="h-10 w-full"
                          />
                        </div>
                        <div>
                          <Label>Shape</Label>
                          <select
                            value={buzz_style.shape}
                            onChange={(e) => setBuzzStyle({ shape: e.target.value as "circle" | "square" | "rounded" })}
                            className="w-full h-10 px-3 border rounded-md"
                          >
                            <option value="circle">Circle</option>
                            <option value="square">Square</option>
                            <option value="rounded">Rounded</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center">
                        <div
                          className="w-24 h-24 flex items-center justify-center text-xl font-bold"
                          style={{
                            backgroundColor: buzz_style.backgroundColor,
                            borderColor: buzz_style.borderColor,
                            color: buzz_style.textColor,
                            borderWidth: "3px",
                            borderStyle: "solid",
                            borderRadius: buzz_style.shape === "circle" ? "50%" : buzz_style.shape === "rounded" ? "12px" : "0",
                          }}
                        >
                          BUZZ
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleUpdate} disabled={isUpdating} className="w-full">
                      {isUpdating ? "Updating..." : "Update Sticker Identity"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  {isProfileLoading ? (
                    <Skeleton className="h-8 w-48" />
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg">
                        <span className="font-semibold">Username:</span> {profile?.username}
                      </p>
                      <Link href={`/${profile?.username}`} className="text-blue-600 hover:underline">
                        View your profile page
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sticker Activity</CardTitle>
                  <CardDescription>
                    {isActivityLoading ? (
                      <Skeleton className="h-4 w-32" />
                    ) : (
                      `You've placed ${activity?.totalCount || 0} stickers`
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isActivityLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Beeps ({activity?.beeps.length || 0})</h4>
                        {activity?.beeps.length === 0 ? (
                          <p className="text-sm text-gray-600">No beeps yet</p>
                        ) : (
                          <div className="space-y-2">
                            {activity?.beeps.slice(0, 5).map((sticker) => (
                              <div key={sticker.id} className="text-sm p-2 bg-gray-50 rounded">
                                On{" "}
                                <Link
                                  href={`/${sticker.page.profile.username}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {sticker.page.profile.username}'s page
                                </Link>
                                {" - "}
                                {sticker.page.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Buzzes ({activity?.buzzes.length || 0})</h4>
                        {activity?.buzzes.length === 0 ? (
                          <p className="text-sm text-gray-600">No buzzes yet</p>
                        ) : (
                          <div className="space-y-2">
                            {activity?.buzzes.slice(0, 5).map((sticker) => (
                              <div key={sticker.id} className="text-sm p-2 bg-gray-50 rounded">
                                On{" "}
                                <Link
                                  href={`/${sticker.page.profile.username}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {sticker.page.profile.username}'s page
                                </Link>
                                {" - "}
                                {sticker.page.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
