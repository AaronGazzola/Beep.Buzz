"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/app/layout.stores";
import { useDeleteAccount } from "./page.hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TriangleAlert } from "lucide-react";

export default function DeleteAccountPage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, isLoading } = useAuthStore();
  const [confirmation, setConfirmation] = useState("");
  const deleteAccount = useDeleteAccount();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  const username = profile?.username || user?.email || "";
  const isConfirmed = confirmation === username;

  const handleDelete = () => {
    if (!isConfirmed) return;
    deleteAccount.mutate();
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md border-destructive">
        <CardHeader>
          <div className="flex items-center gap-3">
            <TriangleAlert className="h-6 w-6 text-destructive" />
            <CardTitle className="text-destructive">Delete Account</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {deleteAccount.isError && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              Something went wrong. Please try again or{" "}
              <Link href="/contact" className="underline">
                contact us
              </Link>
              .
            </div>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              This will <strong className="text-foreground">permanently delete</strong> your
              account and all associated data, including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your profile and progress</li>
              <li>All training, practice, and game history</li>
              <li>All chat messages and match records</li>
              <li>Achievements and leaderboard rankings</li>
            </ul>
            <p className="text-destructive font-medium">This action cannot be undone.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-username">
              Type <strong>{username}</strong> to confirm
            </Label>
            <Input
              id="confirm-username"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder={username}
              autoComplete="off"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={deleteAccount.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
              disabled={!isConfirmed || deleteAccount.isPending}
            >
              {deleteAccount.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete My Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
