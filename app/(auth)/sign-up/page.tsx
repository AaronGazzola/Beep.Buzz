"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEmailSignUp, useMagicLinkSignUp, useUsernameAvailability } from "./page.hooks";
import { useAuthStore } from "@/app/layout.stores";
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
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Check, Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const signUp = useEmailSignUp();
  const sendMagicLink = useMagicLinkSignUp();
  const usernameCheck = useUsernameAvailability(username);

  const passwordStrong = password.length >= 8;
  const isUsernameValid = usernameCheck.data?.available === true;
  const isCheckingUsername = usernameCheck.isFetching && username.length >= 3;

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordStrong || !isUsernameValid) {
      return;
    }

    signUp.mutate({ email, password, username });
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
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                required
                pattern="[a-zA-Z0-9_-]{3,20}"
              />
              {username.length >= 3 && (
                <div className="flex items-center gap-2 text-sm">
                  {isCheckingUsername ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-muted-foreground">Checking...</span>
                    </>
                  ) : isUsernameValid ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">Available</span>
                    </>
                  ) : (
                    <>
                      <span className="h-4 w-4" />
                      <span className="text-destructive">
                        {usernameCheck.data?.error || "Not available"}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
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

            <Button
              type="submit"
              className="w-full"
              disabled={signUp.isPending || !passwordStrong || !isUsernameValid || !username}
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
