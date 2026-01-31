"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveUsersCount, useOngoingMatches, useMorseDemo } from "./page.hooks";
import { useCurrentUser } from "./layout.hooks";
import { useDemoStore } from "./layout.stores";

export default function Home() {
  const { data: user } = useCurrentUser();
  const { data: activeUsers, isLoading: isLoadingUsers } = useActiveUsersCount();
  const { data: matches, isLoading: isLoadingMatches } = useOngoingMatches();
  const { handleEncode, handlePlay } = useMorseDemo();
  const { input, output, isPlaying } = useDemoStore();
  const [demoText, setDemoText] = useState("");

  const handleDemoEncode = () => {
    const morse = handleEncode(demoText);
    if (morse) {
      handlePlay(morse);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
          Learn Morse Code Through Competition
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Master morse code with beep and buzz. Practice, compete, and climb the
          leaderboards.
        </p>
        {!user && (
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link href="/sign-in">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/practice">Try Practice</Link>
            </Button>
          </div>
        )}
        {user && (
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg">
              <Link href="/learn">Continue Learning</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/compete">Find Match</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Try Morse Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Type a message..."
                value={demoText}
                onChange={(e) => setDemoText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleDemoEncode();
                  }
                }}
              />
              <Button
                onClick={handleDemoEncode}
                disabled={!demoText || isPlaying}
                className="w-full"
              >
                {isPlaying ? "Playing..." : "Encode & Play"}
              </Button>
            </div>
            {output && (
              <div className="p-4 rounded-md bg-muted">
                <p className="text-sm text-muted-foreground mb-2">
                  Morse Code:
                </p>
                <p className="font-mono text-lg">{output}</p>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Dit (.) = beep | Dah (-) = buzz
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingUsers ? (
              <Skeleton className="h-20 w-full" />
            ) : activeUsers ? (
              <div className="text-center p-6 bg-muted rounded-lg">
                <p className="text-4xl font-bold mb-2">{activeUsers.count}</p>
                <p className="text-sm text-muted-foreground">
                  Active Users (24h)
                </p>
                {activeUsers.change24h !== 0 && (
                  <Badge
                    variant={activeUsers.change24h > 0 ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {activeUsers.change24h > 0 ? "+" : ""}
                    {activeUsers.change24h} from yesterday
                  </Badge>
                )}
              </div>
            ) : null}
            <div className="text-center">
              <Button asChild variant="outline" className="w-full">
                <Link href="/leaderboards">View Leaderboards</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Ongoing Matches</span>
              <Link
                href="/compete"
                className="text-sm font-normal text-primary hover:underline"
              >
                Join a Match
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingMatches ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : matches && matches.length > 0 ? (
              <div className="space-y-2">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{match.status}</Badge>
                      <span className="text-sm">
                        {match.player1.username} vs {match.player2.username}
                      </span>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/compete?match=${match.id}`}>Watch</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No matches in progress
                </p>
                <Button asChild>
                  <Link href="/compete">Start a Match</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Learn</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Master morse code through structured lessons and progressive
              challenges.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/learn">Start Learning</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Practice</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Hone your skills at your own pace with customizable practice
              sessions.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/practice">Practice Now</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compete</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Challenge other learners in real-time matches and climb the
              leaderboards.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/compete">Find Match</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
