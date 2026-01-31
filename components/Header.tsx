"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useSignOut } from "@/app/layout.hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { data: user, isLoading } = useCurrentUser();
  const signOut = useSignOut();

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold hover:opacity-80">
          Beep.Buzz
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/learn"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Learn
          </Link>
          <Link
            href="/practice"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Practice
          </Link>
          <Link
            href="/compete"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Compete
          </Link>
          <Link
            href="/leaderboards"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Leaderboards
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${user.id}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/messages">Messages</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut.mutate()}
                  disabled={signOut.isPending}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
