"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/app/layout.stores";
import { useProfileByUserId } from "@/app/page.hooks";
import { useChatLayoutStore } from "./layout.stores";
import { useContacts, useDirectMatchmaking } from "./layout.hooks";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

function ContactList() {
  const contacts = useContacts();

  if (contacts.isPending) {
    return (
      <div className="flex flex-col gap-2 px-4 py-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!contacts.data || contacts.data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground px-4 py-2">No conversations yet</p>
    );
  }

  return (
    <div className="flex flex-col">
      {contacts.data.map((contact) => (
        <Link
          key={contact.userId}
          href={`/chat/${contact.username}`}
          className="flex flex-col px-4 py-3 hover:bg-muted transition-colors border-b last:border-b-0"
        >
          <span className="text-sm font-medium">{contact.username}</span>
          <span className="text-xs text-muted-foreground truncate">{contact.lastMessage}</span>
        </Link>
      ))}
    </div>
  );
}

function MatchmakingSection() {
  const { isSearching, setIsSearching } = useChatLayoutStore();
  const { partnerUserId, cancel } = useDirectMatchmaking({ enabled: isSearching });
  const partnerProfile = useProfileByUserId(partnerUserId);
  const router = useRouter();

  useEffect(() => {
    if (partnerProfile.data?.username) {
      setIsSearching(false);
      router.push(`/chat/${partnerProfile.data.username}`);
    }
  }, [partnerProfile.data?.username, router, setIsSearching]);

  const handleCancel = () => {
    cancel();
    setIsSearching(false);
  };

  if (isSearching) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Searching for a match...
        </div>
        <Button variant="outline" size="sm" onClick={handleCancel} className="w-full">
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <Button
        variant="default"
        size="sm"
        className="w-full"
        onClick={() => setIsSearching(true)}
      >
        Find Random Match
      </Button>
    </div>
  );
}

function ChatSidebar() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-8">
        <p className="text-sm text-muted-foreground text-center">Sign in to access chat</p>
        <Button asChild size="sm">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <MatchmakingSection />
      <div className="border-t">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2">
          Conversations
        </p>
        <ContactList />
      </div>
    </>
  );
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader className="border-b">
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="font-semibold">Chat</span>
            </div>
            <SidebarTrigger className={cn("lg:hidden")} />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <ChatSidebar />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b px-4 py-3 lg:hidden">
            <SidebarTrigger />
            <span className="text-sm font-medium">Chat</span>
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
