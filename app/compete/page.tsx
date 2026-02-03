"use client";

import { useAuthStore } from "@/app/layout.stores";
import {
  useAvailableMatches,
  useUserMatches,
  useCreateMatch,
  useJoinMatch,
} from "./page.hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Swords, Clock, CheckCircle2, X } from "lucide-react";
import Link from "next/link";

export default function CompetePage() {
  const { user, profile } = useAuthStore();
  const { data: availableMatches, isLoading: matchesLoading } =
    useAvailableMatches();
  const { data: userMatches, isLoading: userMatchesLoading } = useUserMatches();
  const createMatch = useCreateMatch();
  const joinMatch = useJoinMatch();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need to sign in to compete against other players
            </p>
            <Button asChild className="w-full">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Competition Hub</h1>
          <p className="text-muted-foreground">
            Challenge other players in real-time Morse code translation battles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">{profile?.level || 1}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Swords className="h-8 w-8 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {profile?.skill_rating || 1000}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Skill Rating
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Trophy className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {profile?.experience_points || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">XP</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Matches</CardTitle>
            </CardHeader>
            <CardContent>
              {matchesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : availableMatches && availableMatches.length > 0 ? (
                <div className="space-y-3">
                  {availableMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">Player Challenge</p>
                        <p className="text-sm text-muted-foreground">
                          Created{" "}
                          {new Date(match.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => joinMatch.mutate(match.id)}
                        disabled={joinMatch.isPending}
                      >
                        Join Match
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No available matches right now
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Create a new match to start competing!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Matches</CardTitle>
            </CardHeader>
            <CardContent>
              {userMatchesLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : userMatches && userMatches.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userMatches.map((match) => {
                    const isCreator = match.user_id === user.id;
                    const userScore = isCreator
                      ? match.user_score
                      : match.opponent_score;
                    const opponentScore = isCreator
                      ? match.opponent_score
                      : match.user_score;

                    return (
                      <div
                        key={match.id}
                        className="flex items-center justify-between p-4 bg-muted rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {match.status === "pending" && (
                              <Badge variant="secondary">
                                <Clock className="mr-1 h-3 w-3" />
                                Waiting
                              </Badge>
                            )}
                            {match.status === "active" && (
                              <Badge variant="default">
                                <Swords className="mr-1 h-3 w-3" />
                                Active
                              </Badge>
                            )}
                            {match.status === "completed" && (
                              <Badge
                                variant={
                                  userScore > opponentScore
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {userScore > opponentScore ? (
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                ) : (
                                  <X className="mr-1 h-3 w-3" />
                                )}
                                {userScore > opponentScore ? "Won" : "Lost"}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {userScore} - {opponentScore}
                          </p>
                        </div>
                        {match.status === "active" && (
                          <Button asChild size="sm">
                            <Link href={`/compete/${match.id}`}>
                              Continue
                            </Link>
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No matches yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <Button
            size="lg"
            onClick={() => createMatch.mutate(user.id)}
            disabled={createMatch.isPending}
          >
            <Swords className="mr-2 h-5 w-5" />
            Create New Match
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Match with a random opponent based on skill level
          </p>
        </div>
      </div>
    </div>
  );
}
