"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateProfile } from "./page.hooks";

export default function WelcomePage() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const createProfile = useCreateProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      return;
    }

    await createProfile.mutateAsync({
      username,
      settings: {
        difficulty: 5,
        soundEnabled: true,
        visualFeedback: true,
      },
    });

    router.push("/learn");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to Beep.Buzz!</CardTitle>
          <CardDescription>
            Let's set up your profile to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Choose a Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                maxLength={20}
                disabled={createProfile.isPending}
              />
              <p className="text-sm text-muted-foreground">
                3-20 characters, will be visible to other users
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={createProfile.isPending || !username || username.length < 3}
            >
              {createProfile.isPending ? "Creating Profile..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
