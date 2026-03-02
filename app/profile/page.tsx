"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { CharacterCreator } from "@/components/CharacterCreator";
import { useAuthStore } from "@/app/layout.stores";
import { useProfile, useUpdateUsername, useUpdateCharacter } from "./page.hooks";
import { DEFAULT_CHARACTER_SETTINGS } from "./page.types";
import type { CharacterSettings } from "./page.types";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile: storeProfile, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateUsername = useUpdateUsername();
  const updateCharacter = useUpdateCharacter();

  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [characterSettings, setCharacterSettings] = useState<CharacterSettings>(DEFAULT_CHARACTER_SETTINGS);
  const debounceRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setUsernameInput(profile.username ?? "");
      if (profile.character_settings) {
        setCharacterSettings(profile.character_settings as CharacterSettings);
      }
    }
  }, [profile]);

  const handleCharacterChange = (settings: CharacterSettings) => {
    setCharacterSettings(settings);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateCharacter.mutate(settings);
    }, 500);
  };

  const handleSaveUsername = () => {
    if (!usernameInput.trim() || usernameInput === profile?.username) {
      setEditingUsername(false);
      return;
    }
    updateUsername.mutate(usernameInput.trim(), {
      onSuccess: () => setEditingUsername(false),
    });
  };

  const handleCancelUsername = () => {
    setUsernameInput(profile?.username ?? "");
    setEditingUsername(false);
  };

  if (authLoading || !isAuthenticated) return null;

  const isLoading = profileLoading;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account and customize your character.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Email</p>
            {isLoading ? (
              <Skeleton className="h-5 w-48" />
            ) : (
              <p className="font-medium">{user?.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Username</p>
            {isLoading ? (
              <Skeleton className="h-5 w-32" />
            ) : editingUsername ? (
              <div className="flex items-center gap-2">
                <Input
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveUsername();
                    if (e.key === "Escape") handleCancelUsername();
                  }}
                  className="h-8 w-48"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={handleSaveUsername}
                  disabled={updateUsername.isPending}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={handleCancelUsername}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="font-medium">{profile?.username || "—"}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => setEditingUsername(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex gap-8">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Level</p>
              {isLoading ? (
                <Skeleton className="h-5 w-10" />
              ) : (
                <p className="font-medium">{profile?.level ?? 1}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Skill Rating</p>
              {isLoading ? (
                <Skeleton className="h-5 w-12" />
              ) : (
                <p className="font-medium">{profile?.skill_rating ?? 0}</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Member Since</p>
              {isLoading ? (
                <Skeleton className="h-5 w-24" />
              ) : (
                <p className="font-medium">
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Character</CardTitle>
            {updateCharacter.isPending && (
              <span className="text-xs text-muted-foreground">Saving...</span>
            )}
            {updateCharacter.isSuccess && !updateCharacter.isPending && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Check className="h-3 w-3" /> Saved
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col lg:flex-row gap-8">
              <Skeleton className="lg:w-56 h-48 rounded-xl" />
              <div className="flex-1 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </div>
          ) : (
            <CharacterCreator value={characterSettings} onChange={handleCharacterChange} />
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Delete Account</p>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
            </div>
            <Button variant="destructive" asChild>
              <Link href="/account/delete">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
