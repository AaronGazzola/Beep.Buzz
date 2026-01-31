"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/browser-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function VerifyPage() {
  const [status, setStatus] = useState<"waiting" | "verified" | "error">("waiting");
  const router = useRouter();
  // const supabase = createClient(); // Already imported

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          router.push("/learn");
        } else {
          router.push("/welcome");
        }
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setStatus("verified");
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", session.user.id)
          .single();

        setTimeout(() => {
          if (profile) {
            router.push("/learn");
          } else {
            router.push("/welcome");
          }
        }, 1500);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">
            {status === "waiting" && "Check Your Email"}
            {status === "verified" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {status === "waiting" && "We've sent you a magic link to sign in"}
            {status === "verified" && "Redirecting you to the app..."}
            {status === "error" && "Something went wrong"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "waiting" && (
            <>
              <div className="flex justify-center py-6">
                <Spinner className="size-8" />
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Click the link in your email to continue.</p>
                <p>The link will expire in 1 hour.</p>
                <p>
                  Don't see the email? Check your spam folder or request a new
                  link.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/sign-in")}
              >
                Back to Sign In
              </Button>
            </>
          )}
          {status === "verified" && (
            <div className="flex justify-center py-6">
              <Spinner className="size-8" />
            </div>
          )}
          {status === "error" && (
            <Button className="w-full" onClick={() => router.push("/sign-in")}>
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
