"use client";

import { useState } from "react";
import { useMagicLink } from "./page.hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const { mutate: sendMagicLink, isPending, isSuccess, error } = useMagicLink();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      sendMagicLink({ email });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl sm:text-4xl font-bold">
            beep.buzz
          </Link>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your email to receive a magic link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <Alert>
                <AlertDescription>
                  Check your email for a magic link to sign in!
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isPending}
                    className="w-full"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Failed to send magic link. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  disabled={isPending || !email}
                  className="w-full"
                >
                  {isPending ? "Sending..." : "Send Magic Link"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-4">
          New to beep.buzz?{" "}
          <Link href="/" className="text-blue-600 hover:underline">
            Learn more
          </Link>
        </p>
      </div>
    </div>
  );
}
