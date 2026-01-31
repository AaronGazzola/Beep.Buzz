"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSendMagicLink } from "./page.hooks";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const sendMagicLink = useSendMagicLink();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    await sendMagicLink.mutateAsync(email);
    router.push("/verify");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In to Beep.Buzz</CardTitle>
          <CardDescription>
            Enter your email to receive a magic link for passwordless sign-in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={sendMagicLink.isPending}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={sendMagicLink.isPending || !email}
            >
              {sendMagicLink.isPending ? "Sending..." : "Send Magic Link"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground text-center mt-4">
            No password required. We'll send you a secure link to sign in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
