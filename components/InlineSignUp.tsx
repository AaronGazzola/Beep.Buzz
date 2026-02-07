"use client";

import { useGameStore } from "@/app/page.stores";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { supabase } from "@/supabase/browser-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function useInlineSignUp() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const learnedLetters = useGameStore((state) => state.learnedLetters);

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      console.log("[InlineSignUp] Starting sign up for:", email);
      console.log(
        "[InlineSignUp] Redirect URL:",
        `${window.location.origin}/welcome`,
      );
      console.log("[InlineSignUp] Learned letters to save:", learnedLetters);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/welcome`,
          data: {
            pending_learned_letters:
              learnedLetters.length > 0 ? learnedLetters : undefined,
          },
        },
      });

      console.log("[InlineSignUp] Response data:", data);
      console.log("[InlineSignUp] Response error:", error);

      if (error) {
        console.error("[InlineSignUp] Error during sign up:", error);
        if (error.message.includes("already registered")) {
          throw new Error("An account with this email already exists");
        }
        throw new Error(error.message);
      }

      console.log("[InlineSignUp] User created:", data.user?.id);
      console.log("[InlineSignUp] User email:", data.user?.email);
      console.log(
        "[InlineSignUp] Email confirmed at:",
        data.user?.email_confirmed_at,
      );
      console.log(
        "[InlineSignUp] Confirmation sent at:",
        data.user?.confirmation_sent_at,
      );
      console.log("[InlineSignUp] User metadata:", data.user?.user_metadata);

      return data;
    },
    onSuccess: () => {
      toast.success("Account created! Check your email to verify.");
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/verify");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create account",
      );
    },
  });
}

interface InlineSignUpProps {
  className?: string;
}

export function InlineSignUp({ className }: InlineSignUpProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const signUp = useInlineSignUp();

  const passwordStrong = password.length >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordStrong) {
      return;
    }

    signUp.mutate({ email, password });
  };

  return (
    <div
      className={cn(
        "w-full max-w-md mx-auto p-6 rounded-lg border bg-card text-card-foreground",
        className,
      )}
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold">Save Your Progress</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create an account to track your learning journey
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
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
          <div className="relative">
            <Input
              id="inline-password"
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
          disabled={signUp.isPending || !passwordStrong}
        >
          {signUp.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Create Account
        </Button>
      </form>

      <p className="text-sm text-muted-foreground text-center mt-4">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-foreground hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
