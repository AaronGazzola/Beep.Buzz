"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/", label: "Overview", icon: "=Ê" },
  { href: "/builder", label: "Page Builder", icon: "<¨" },
  { href: "/analytics", label: "Analytics", icon: "=È" },
  { href: "/settings", label: "Settings", icon: "™" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentPath = "/";

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      <aside className="hidden w-64 shrink-0 border-r border-border md:block">
        <div className="flex h-full flex-col gap-4 p-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" alt="Creator" />
              <AvatarFallback>CR</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Creator Name</span>
              <span className="text-xs text-muted-foreground">
                creator.beep.buzz
              </span>
            </div>
          </div>
          <Separator />
          <nav className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                  currentPath === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <Separator className="mb-4" />
            <Button variant="outline" className="w-full" asChild>
              <Link href="/creator" target="_blank">
                View Your Page
              </Link>
            </Button>
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-border px-6">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              =
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt="Creator" />
              <AvatarFallback>CR</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
