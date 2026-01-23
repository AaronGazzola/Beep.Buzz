"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUsernameValidation, useStickerIdentity } from "./page.hooks";
import { useUsernameValidationStore, useStickerIdentityStore } from "./page.stores";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function WelcomePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [inputUsername, setInputUsername] = useState("");

  const { username, isValid, isAvailable } = useUsernameValidationStore();
  const { beep_style, buzz_style, setBeepStyle, setBuzzStyle } = useStickerIdentityStore();

  const { data: validation, isPending: isValidating } = useUsernameValidation(inputUsername);
  const { mutate: createProfile, isPending: isCreating, error } = useStickerIdentity();

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && isAvailable) {
      setStep(2);
    }
  };

  const handleComplete = () => {
    createProfile(username, {
      onSuccess: () => {
        router.push(`/${username}`);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Welcome to beep.buzz!</h1>
          <p className="text-gray-600">Set up your profile in 2 easy steps</p>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Username</CardTitle>
              <CardDescription>
                Pick a unique username (3-20 characters, letters, numbers, - and _ only)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUsernameSubmit} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="username"
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    required
                    className="w-full"
                  />
                  {isValidating && inputUsername.length >= 3 && (
                    <Skeleton className="h-4 w-48 mt-2" />
                  )}
                  {validation && inputUsername.length >= 3 && !isValidating && (
                    <p className={`text-sm mt-2 ${validation.isValid && validation.isAvailable ? "text-green-600" : "text-red-600"}`}>
                      {!validation.isValid && "Username must be 3-20 characters and contain only letters, numbers, - and _"}
                      {validation.isValid && !validation.isAvailable && "Username is already taken"}
                      {validation.isValid && validation.isAvailable && "Username is available!"}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!isValid || !isAvailable || isValidating}
                  className="w-full"
                >
                  Continue
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Customize Your Stickers</CardTitle>
              <CardDescription>
                Choose colors and shapes for your beep and buzz stickers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to create profile. Please try again.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isCreating}
                  className="w-full sm:w-auto"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={isCreating}
                  className="flex-1"
                >
                  {isCreating ? "Creating Profile..." : "Complete Setup"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
