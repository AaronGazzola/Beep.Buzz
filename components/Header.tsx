"use client";

import { useSignOut } from "@/app/layout.hooks";
import { useAuthStore } from "@/app/layout.stores";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, Gamepad2, LogOut, MessagesSquare, Trash2, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";

export function Header() {
  const { user, profile, isAuthenticated } = useAuthStore();
  const signOut = useSignOut();
  const pathname = usePathname();
  const isChatActive = pathname.startsWith("/chat");
  const isLearnActive = pathname === "/";
  const isPlayActive = pathname.startsWith("/game");

  const handleSignOut = () => {
    signOut.mutate();
  };

  const getInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="relative flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <Logo className="h-9 w-9" />
            <span className="font-bold text-xl text-primary">
              <span className="xs:hidden flex flex-col leading-tight text-center">
                <span>Beep.</span>
                <span>Buzz</span>
              </span>
              <span className="hidden xs:inline">Beep.Buzz</span>
            </span>
          </Link>

          <div
            className="inline-flex rounded-lg p-1 border sm:absolute sm:left-1/2 sm:-translate-x-1/2"
            style={{ borderColor: "var(--color-chart-4)" }}
          >
            <Link
              href="/"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-sm font-extrabold rounded-md transition-colors",
                isLearnActive ? "" : "hover:bg-black/5",
              )}
              style={{
                backgroundColor: isLearnActive ? "var(--color-chart-4)" : "transparent",
                color: isLearnActive ? "white" : "var(--color-chart-4)",
              }}
            >
              <BookOpen className="hidden xs:block h-4 w-4" strokeWidth={2.5} />
              Learn
            </Link>
            <Link
              href="/chat"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-sm font-extrabold rounded-md transition-colors",
                isChatActive ? "" : "hover:bg-black/5",
              )}
              style={{
                backgroundColor: isChatActive ? "var(--color-chart-4)" : "transparent",
                color: isChatActive ? "white" : "var(--color-chart-4)",
              }}
            >
              <MessagesSquare className="hidden xs:block h-4 w-4" strokeWidth={2.5} />
              Chat
            </Link>
            <Link
              href="/game"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-sm font-extrabold rounded-md transition-colors",
                isPlayActive ? "" : "hover:bg-black/5",
              )}
              style={{
                backgroundColor: isPlayActive ? "var(--color-chart-4)" : "transparent",
                color: isPlayActive ? "white" : "var(--color-chart-4)",
              }}
            >
              <Gamepad2 className="hidden xs:block h-4 w-4" strokeWidth={2.5} />
              Play
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                    data-testid="user-menu-trigger"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Level {profile?.level || 1}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Link href="/account/delete">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                    data-testid="signout-button"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hidden sm:inline-flex"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                >
                  <Link href="/sign-up">
                    <User className="h-4 w-4 xs:hidden" strokeWidth={2.5} />
                    <span className="hidden xs:inline">Sign Up</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
