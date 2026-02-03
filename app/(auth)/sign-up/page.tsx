"use client";

import { useState } from "react";
import Link from "next/link";
import { useEmailSignUp, useMagicLinkSignUp } from "./page.hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Check } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUp = useEmailSignUp();
  const sendMagicLink = useMagicLinkSignUp();

  const passwordsMatch = password === confirmPassword;
  const passwordStrong = password.length >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch) {
      return;
    }

    if (!passwordStrong) {
      return;
    }

    signUp.mutate({ email, password });
  };

  const handleMagicLink = () => {
    if (!email) return;
    sendMagicLink.mutate({ email });
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Start learning Morse code today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {signUp.isError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {signUp.error instanceof Error
                  ? signUp.error.message
                  : "Failed to create account"}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password && (
                <div className="flex items-center gap-2 text-sm">
                  {passwordStrong ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <span className="h-4 w-4" />
                  )}
                  <span
                    className={
                      passwordStrong ? "text-green-500" : "text-muted-foreground"
                    }
                  >
                    At least 8 characters
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {confirmPassword && (
                <div className="flex items-center gap-2 text-sm">
                  {passwordsMatch ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <span className="h-4 w-4" />
                  )}
                  <span
                    className={
                      passwordsMatch ? "text-green-500" : "text-muted-foreground"
                    }
                  >
                    Passwords match
                  </span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={signUp.isPending || !passwordsMatch || !passwordStrong}
            >
              {signUp.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Account
            </Button>
          </form>

          <div className="mt-6">
            <Separator className="my-4" />
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleMagicLink}
              disabled={!email || sendMagicLink.isPending}
            >
              {sendMagicLink.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Mail className="mr-2 h-4 w-4" />
              Sign Up with Magic Link
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-foreground hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
