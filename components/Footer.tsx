"use client";

import { useLeaderboardSnapshot } from "@/app/layout.hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export function Footer() {
  const { data: snapshot, isLoading } = useLeaderboardSnapshot("overall");

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Top Players This Week</span>
              <Link
                href="/leaderboards"
                className="text-sm font-normal text-primary hover:underline"
              >
                View All
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : snapshot && snapshot.topPlayers.length > 0 ? (
              <div className="space-y-2">
                {snapshot.topPlayers.slice(0, 5).map((player) => (
                  <Link
                    key={player.userId}
                    href={`/profile/${player.userId}`}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-muted-foreground w-6">
                        #{player.rank}
                      </span>
                      <span className="text-sm font-medium">
                        {player.username}
                      </span>
                    </div>
                    <span className="text-sm font-mono">{player.score}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No leaderboard data available
              </p>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>© 2026 Beep.Buzz. Learn Morse Code Through Competition.</p>
        </div>
      </div>
    </footer>
  );
}
