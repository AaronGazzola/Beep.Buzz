"use client";

import { use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useUserAchievements,
  useMatchHistory,
  useUserPracticeStats,
} from "./page.hooks";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase/browser-client";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;

  // const supabase = createClient(); // Already imported

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error(error);
        throw new Error("Failed to fetch profile");
      }

      return data;
    },
  });

  const { data: achievements, isLoading: isLoadingAchievements } =
    useUserAchievements(userId);
  const { data: matches, isLoading: isLoadingMatches } = useMatchHistory(userId);
  const { data: stats, isLoading: isLoadingStats } =
    useUserPracticeStats(userId);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-3xl">
                {profile?.username?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-4">
              {isLoadingProfile ? (
                <>
                  <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                  <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
                </>
              ) : profile ? (
                <>
                  <div>
                    <h1 className="text-3xl font-bold">{profile.username}</h1>
                    <p className="text-muted-foreground">
                      Rank {profile.rank} • {profile.xp} XP
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge>Streak: {profile.streak_days} days</Badge>
                    <Badge variant="secondary">{profile.role}</Badge>
                  </div>
                </>
              ) : null}
            </div>

            <Button asChild variant="outline">
              <Link href="/messages">Send Message</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="matches">Match History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          {isLoadingStats ? (
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : stats ? (
            <>
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.totalSessions}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Best WPM
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{stats.bestWpm}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Avg Accuracy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {stats.avgAccuracy.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Practice Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">
                      {Math.floor(stats.totalTime / 3600)}h
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Practice Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentSessions.length > 0 ? (
                    <div className="space-y-2">
                      {stats.recentSessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div>
                            <p className="text-sm font-medium">
                              {new Date(session.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Difficulty: {session.difficulty}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {session.wpm} WPM
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {session.accuracy}% accuracy
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No recent sessions
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : null}
        </TabsContent>

        <TabsContent value="matches">
          <Card>
            <CardHeader>
              <CardTitle>Match History</CardTitle>
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
                      key={match.match.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          vs {match.opponent.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(
                            match.match.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm">{match.wpm} WPM</p>
                          <p className="text-xs text-muted-foreground">
                            {match.accuracy}%
                          </p>
                        </div>
                        <Badge
                          variant={
                            match.result === "won"
                              ? "default"
                              : match.result === "lost"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {match.result}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No match history available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAchievements ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : achievements && achievements.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement: any) => (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg border space-y-2"
                    >
                      <h3 className="font-medium">
                        {achievement.achievements?.title || "Achievement"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.achievements?.description || ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Unlocked:{" "}
                        {new Date(achievement.unlocked_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No achievements yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
