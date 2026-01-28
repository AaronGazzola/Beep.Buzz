"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser, useCreateProfile, useCheckUsernameAvailable } from "../layout.hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { User, Check, X } from "lucide-react";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

export default function WelcomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const { data: currentUser, isLoading } = useCurrentUser();
  const createProfile = useCreateProfile();
  const checkUsername = useCheckUsernameAvailable();

  useEffect(() => {
    if (!isLoading && !currentUser?.user) {
      router.push("/sign-in");
    }
    if (!isLoading && currentUser?.profile) {
      router.push("/editor");
    }
  }, [isLoading, currentUser, router]);

  const checkUsernameAvailability = useDebouncedCallback(async (value: string) => {
    if (value.length < 3) {
      setIsAvailable(null);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    checkUsername.mutate(value, {
      onSuccess: (available) => {
        setIsAvailable(available);
        setIsChecking(false);
      },
      onError: () => {
        setIsAvailable(null);
        setIsChecking(false);
      },
    });
  }, 500);

  const handleUsernameChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(sanitized);
    setIsAvailable(null);
    checkUsernameAvailability(sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    if (!isAvailable) {
      toast.error("Please choose an available username");
      return;
    }

    createProfile.mutate(username, {
      onSuccess: () => {
        toast.success("Profile created! Redirecting to editor...");
        router.push("/editor");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="size-6 text-primary" />
          </div>
          <CardTitle>Welcome to Beep.Buzz!</CardTitle>
          <CardDescription>
            Choose a username to create your profile. This will be your unique
            URL: beep.buzz/<strong>{username || "username"}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  @
                </span>
                <Input
                  id="username"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className="pl-8 pr-10"
                  maxLength={20}
                />
                {username.length >= 3 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isChecking ? (
                      <div className="size-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                    ) : isAvailable === true ? (
                      <Check className="size-4 text-green-500" />
                    ) : isAvailable === false ? (
                      <X className="size-4 text-destructive" />
                    ) : null}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Only lowercase letters, numbers, and underscores allowed.
                {username.length > 0 && username.length < 3 && (
                  <span className="text-destructive ml-1">
                    At least 3 characters required.
                  </span>
                )}
                {isAvailable === false && (
                  <span className="text-destructive ml-1">
                    Username is already taken.
                  </span>
                )}
              </p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={
                createProfile.isPending ||
                !isAvailable ||
                username.length < 3
              }
            >
              {createProfile.isPending ? "Creating..." : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
