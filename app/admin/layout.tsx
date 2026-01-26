"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/app/layout.hooks";
import { useAdminAccess, useModerationQueue } from "./layout.hooks";
import { useModerationQueueStore } from "./layout.stores";
import { Shield, AlertTriangle, Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: user, isPending: isUserLoading } = useCurrentUser();
  const { data: hasAccess, isPending: isAccessLoading } = useAdminAccess();
  const { isPending: isQueueLoading } = useModerationQueue();
  const queueData = useModerationQueueStore((state) => state.queueData);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!isAccessLoading && hasAccess === false) {
      router.push("/");
    }
  }, [hasAccess, isAccessLoading, router]);

  if (isUserLoading || isAccessLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !hasAccess) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="sticky top-20 space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>

            <nav className="space-y-2">
              <Link
                href="/admin"
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Moderation
                </span>
                {isQueueLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : queueData?.pendingCount ? (
                  <Badge variant="destructive">{queueData.pendingCount}</Badge>
                ) : null}
              </Link>
            </nav>

            {queueData && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  {queueData.pendingCount} pending /{" "}
                  {queueData.totalCount} total flags
                </p>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
