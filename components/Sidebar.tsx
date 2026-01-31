"use client";

import Link from "next/link";
import { useCurrentUser, useUserProgress } from "@/app/layout.hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export function Sidebar() {
  const { data: user } = useCurrentUser();
  const { data: progress, isLoading } = useUserProgress();

  if (!user) {
    return null;
  }

  return (
    <aside className="hidden lg:block w-64 border-r p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </>
          ) : progress ? (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Rank</span>
                  <Badge variant="secondary">{progress.rank}</Badge>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">XP</span>
                  <span className="text-sm">{progress.xp}</span>
                </div>
                <Progress value={(progress.xp % 1000) / 10} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Streak</span>
                  <span className="text-sm">{progress.streakDays} days</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Lessons</span>
                  <span className="text-sm">
                    {progress.lessonsCompleted}/{progress.totalLessons}
                  </span>
                </div>
                <Progress
                  value={
                    (progress.lessonsCompleted / progress.totalLessons) * 100
                  }
                />
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link
            href="/practice"
            className="block w-full text-center py-2 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Practice Now
          </Link>
          <Link
            href="/compete"
            className="block w-full text-center py-2 px-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            Find Match
          </Link>
        </CardContent>
      </Card>
    </aside>
  );
}
