"use client";

import { useModerationQueue } from "./layout.hooks";
import { useModerationQueueStore } from "./layout.stores";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isPending } = useModerationQueue();
  const { count } = useModerationQueueStore();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Admin Panel</h1>
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/admin" className="text-blue-600 hover:underline">
                  Moderation Queue
                </Link>
                {isPending ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                    {count} pending
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {children}
      </div>
    </div>
  );
}
