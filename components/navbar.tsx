"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser, useUserProfile, useSignOutUser } from "@/app/layout.hooks";
import { User, Settings, LogOut, Shield, Palette } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { data: user, isPending: isUserLoading } = useCurrentUser();
  const { data: profile, isPending: isProfileLoading } = useUserProfile();
  const signOut = useSignOutUser();

  const handleSignOut = () => {
    signOut.mutate(undefined, {
      onSuccess: () => {
        router.push("/");
        router.refresh();
      },
    });
  };

  const isAdmin = profile?.role === "admin" || profile?.role === "super-admin";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Beep.Buzz</span>
        </Link>

        <div className="flex items-center gap-4">
          {isUserLoading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {isProfileLoading ? (
                        <Skeleton className="h-full w-full" />
                      ) : (
                        profile?.username?.charAt(0).toUpperCase() || "U"
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {isProfileLoading ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      <p className="font-medium">@{profile?.username}</p>
                    )}
                    <p className="text-sm text-muted-foreground truncate w-40">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {profile?.username && (
                  <DropdownMenuItem asChild>
                    <Link href={`/${profile.username}`}>
                      <User className="mr-2 h-4 w-4" />
                      My Page
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/studio">
                    <Palette className="mr-2 h-4 w-4" />
                    Studio
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={signOut.isPending}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {signOut.isPending ? "Signing out..." : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
