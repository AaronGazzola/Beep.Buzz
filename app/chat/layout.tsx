"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/app/layout.stores";
import { useChatLayoutStore } from "./layout.stores";
import { useContacts } from "./layout.hooks";
import { useIsMobile } from "@/hooks/use-mobile";
import { MORSE_ALPHABET } from "@/lib/morse.utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BookOpen, Bot, MessagesSquare, Shuffle, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMode } from "./layout.stores";

const chatModeOptions: { value: ChatMode; label: string; icon: typeof Bot }[] = [
  { value: "ai", label: "Chat with AI", icon: Bot },
  { value: "random", label: "Chat with Random User", icon: Shuffle },
  { value: "friend", label: "Chat with a friend", icon: UserRound },
];

const letters = Object.entries(MORSE_ALPHABET).filter(([c]) => /[A-Z]/.test(c));
const digits = Object.entries(MORSE_ALPHABET).filter(([c]) => /[0-9]/.test(c));
const allEntries = [...letters, ...digits];

function MorseCode({ code }: { code: string }) {
  return (
    <span className="font-mono text-4xl tracking-widest">
      {code.split("").map((c, i) =>
        c === "." ? (
          <span key={i} className="text-accent-foreground">{c}</span>
        ) : (
          <span key={i} className="text-chart-3">{c}</span>
        )
      )}
    </span>
  );
}

function CheatSheetExpandedContent() {
  return (
    <div className="overflow-y-auto py-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1">
        Letters
      </p>
      {letters.map(([char, code]) => (
        <div key={char} className="flex items-center gap-3 px-4 py-1 hover:bg-muted transition-colors">
          <span className="font-extrabold text-sm w-5 text-sidebar-foreground">{char}</span>
          <MorseCode code={code} />
        </div>
      ))}
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1 mt-2">
        Numbers
      </p>
      {digits.map(([char, code]) => (
        <div key={char} className="flex items-center gap-3 px-4 py-1 hover:bg-muted transition-colors">
          <span className="font-extrabold text-sm w-5 text-sidebar-foreground">{char}</span>
          <MorseCode code={code} />
        </div>
      ))}
    </div>
  );
}

function CheatSheetPanel() {
  const { isCheatSheetCollapsed, setIsCheatSheetCollapsed } = useChatLayoutStore();
  const isMobile = useIsMobile();
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  useEffect(() => {
    if (isMobile && !isCheatSheetCollapsed) {
      setIsCheatSheetCollapsed(true);
    }
  }, [isMobile, isCheatSheetCollapsed, setIsCheatSheetCollapsed]);

  const handleToggle = () => {
    if (isMobile) {
      setMobileSheetOpen(true);
    } else {
      setIsCheatSheetCollapsed(!isCheatSheetCollapsed);
    }
  };

  return (
    <>
      <div
        className="shrink-0 border-l flex flex-col min-h-0 bg-sidebar text-sidebar-foreground transition-[max-width] duration-200 ease-linear overflow-hidden"
        style={{
          width: "max-content",
          maxWidth: isCheatSheetCollapsed ? "var(--sidebar-width-icon)" : "50rem",
        }}
      >
        <div className="border-b p-2 shrink-0">
          <div className={cn("flex items-center py-1", isCheatSheetCollapsed ? "justify-center" : "justify-between px-2")}>
            {!isCheatSheetCollapsed && (
              <span className="font-semibold text-sm whitespace-nowrap">Morse Code</span>
            )}
            <button
              onClick={handleToggle}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="h-4 w-4" />
            </button>
          </div>
        </div>

        {isCheatSheetCollapsed ? (
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col items-center py-1">
              {allEntries.map(([char, code]) => (
                <Popover key={char}>
                  <PopoverTrigger asChild>
                    <button
                      className="w-full flex items-center justify-center py-1.5 text-sm font-extrabold hover:bg-muted transition-colors text-sidebar-foreground"
                    >
                      {char}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent side="left" align="center" className="w-fit p-3">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-lg w-5 text-sidebar-foreground">{char}</span>
                      <MorseCode code={code} />
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          </div>
        ) : (
          <CheatSheetExpandedContent />
        )}
      </div>
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent side="right" className="p-0 bg-sidebar text-sidebar-foreground flex flex-col w-[max-content] max-w-[50rem]">
          <SheetHeader className="border-b p-4 shrink-0">
            <SheetTitle className="text-sm font-semibold">Morse Code</SheetTitle>
          </SheetHeader>
          <CheatSheetExpandedContent />
        </SheetContent>
      </Sheet>
    </>
  );
}

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

function ChatModeNav() {
  const { chatMode, setChatMode } = useChatLayoutStore();
  const pathname = usePathname();
  const router = useRouter();
  const isDirectChat = pathname !== "/chat";
  const activeMode: ChatMode = isDirectChat ? "friend" : chatMode;

  const handleSelect = (mode: ChatMode) => {
    setChatMode(mode);
    if (pathname !== "/chat") {
      router.push("/chat");
    }
  };

  return (
    <div className="flex flex-col gap-1.5 p-2">
      {chatModeOptions.map((option) => {
        const Icon = option.icon;
        const isActive = activeMode === option.value;
        return (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-extrabold transition-colors text-left rounded-md border",
              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:w-fit group-data-[collapsible=icon]:self-center group-data-[collapsible=icon]:rounded-full",
              !isActive && "hover:bg-black/5",
            )}
            style={{
              backgroundColor: isActive ? "var(--color-chart-4)" : "transparent",
              color: isActive ? "white" : "var(--color-chart-4)",
              borderColor: "var(--color-chart-4)",
            }}
          >
            <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={2.5} />
            <span className="group-data-[collapsible=icon]:hidden">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ChatSidebar() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <ChatModeNav />
      {isAuthenticated && (
        <div className="border-t group-data-[collapsible=icon]:hidden">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2">
            Conversations
          </p>
          <ContactList />
        </div>
      )}
    </>
  );
}

function LeftSidebarMobileSheet() {
  const { openMobile, setOpenMobile } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetContent side="left" className="p-0 bg-sidebar text-sidebar-foreground flex flex-col w-64">
        <SheetHeader className="border-b p-2 shrink-0">
          <div className="flex items-center gap-2 px-2 py-1">
            <MessagesSquare className="h-5 w-5" />
            <SheetTitle className="font-semibold text-sm">Chat</SheetTitle>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <ChatSidebar />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SidebarCollapseOnResize() {
  const { setOpen, isMobile } = useSidebar();

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile, setOpen]);

  return null;
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="max-h-[calc(100svh-4rem)] overflow-hidden">
      <SidebarCollapseOnResize />
      <LeftSidebarMobileSheet />
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b">
          <div className="flex items-center justify-between px-2 py-1 group-data-[collapsible=icon]:justify-center">
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
              <MessagesSquare className="h-5 w-5" />
              <span className="font-semibold">Chat</span>
            </div>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <ChatSidebar />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-1 min-h-0">
          <div className="flex flex-1 flex-col min-h-0">
            {children}
          </div>
          <CheatSheetPanel />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
