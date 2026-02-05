"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/supabase/browser-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function useInlineSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
        },
      });

      if (error) {
        console.error(error);
        if (error.message.includes("already registered")) {
          throw new Error("An account with this email already exists");
        }
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/verify");
    },
  });
}

interface InlineSignUpProps {
  className?: string;
}

export function InlineSignUp({ className }: InlineSignUpProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUp = useInlineSignUp();

  const passwordsMatch = password === confirmPassword;
  const passwordStrong = password.length >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch || !passwordStrong) {
      return;
    }

    signUp.mutate({ email, password });
  };

  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto p-6 rounded-lg border bg-card text-card-foreground",
        className
      )}
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold">Save Your Progress</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create an account to track your learning journey
        </p>
      </div>

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
          <Label htmlFor="inline-email">Email</Label>
          <Input
            id="inline-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inline-password">Password</Label>
          <Input
            id="inline-password"
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
          <Label htmlFor="inline-confirm">Confirm Password</Label>
          <Input
            id="inline-confirm"
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

      <p className="text-sm text-muted-foreground text-center mt-4">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-foreground hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
