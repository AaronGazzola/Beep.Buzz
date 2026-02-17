"use client";

import { use } from "react";
import Link from "next/link";
import { useAuthStore } from "@/app/layout.stores";
import { useCurrentUserProfile } from "@/app/page.hooks";
import { useQuery } from "@tanstack/react-query";
import { getProfileByUsernameAction } from "@/app/page.actions";
import { MorseChatDirect } from "@/components/MorseChatDirect";
import { Button } from "@/components/ui/button";

export default function ChatUserPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { isAuthenticated } = useAuthStore();
  const currentUserProfile = useCurrentUserProfile();

  const partnerProfile = useQuery({
    queryKey: ["profileByUsername", username],
    queryFn: () => getProfileByUsernameAction(username),
    enabled: !!username,
  });

  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-muted-foreground">Sign in to chat</p>
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (partnerProfile.isPending) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="h-8 w-32 rounded bg-muted animate-pulse" />
      </div>
    );
  }

  if (!partnerProfile.data) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <p className="text-muted-foreground">User not found</p>
        <Button asChild variant="outline">
          <Link href="/chat">Back to Chat</Link>
        </Button>
      </div>
    );
  }

  if (currentUserProfile.data?.user_id === partnerProfile.data.user_id) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2">
        <p className="text-muted-foreground">You can&apos;t chat with yourself</p>
        <Button asChild variant="outline">
          <Link href="/chat">Back to Chat</Link>
        </Button>
      </div>
    );
  }

  return (
    <MorseChatDirect
      partnerUserId={partnerProfile.data.user_id}
      partnerUsername={partnerProfile.data.username ?? username}
      className="flex-1"
    />
  );
}
