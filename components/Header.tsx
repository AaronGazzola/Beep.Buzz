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
import { LogOut, MessagesSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, profile, isAuthenticated } = useAuthStore();
  const signOut = useSignOut();
  const pathname = usePathname();
  const isChatActive = pathname.startsWith("/chat");

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
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <span className="font-bold text-xl text-primary">Beep.Buzz</span>
            </Link>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-semibold"
              style={{
                borderColor: "var(--color-chart-4)",
                backgroundColor: isChatActive ? "transparent" : "var(--color-chart-4)",
                color: isChatActive ? "var(--color-chart-4)" : "white",
              }}
            >
              <Link href="/chat">
                <MessagesSquare
                  className="h-4 w-4"
                  strokeWidth={2.5}
                />
                Chat
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
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
                  className="hidden xs:inline-flex"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                >
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
