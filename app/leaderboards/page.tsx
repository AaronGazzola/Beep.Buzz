"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCategoryRankings, useLeaderboardFilter } from "./page.hooks";

export default function LeaderboardsPage() {
  const { category, period, setCategory, setPeriod } = useLeaderboardFilter();
  const { data: rankings, isLoading } = useCategoryRankings(category, period);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Leaderboards</h1>
        <p className="text-muted-foreground">
          Top performers and competitive rankings
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Rankings</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select
                value={category}
                onValueChange={(value: any) => setCategory(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall">Overall</SelectItem>
                  <SelectItem value="encoding_speed">Encoding Speed</SelectItem>
                  <SelectItem value="decoding_speed">Decoding Speed</SelectItem>
                  <SelectItem value="weekly_challenge">Weekly Challenge</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={period}
                onValueChange={(value: any) => setPeriod(value)}
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : rankings && rankings.length > 0 ? (
            <div className="space-y-2">
              {rankings.map((player, index) => {
                let badgeVariant: "default" | "secondary" | "outline" = "outline";
                if (index === 0) badgeVariant = "default";
                else if (index === 1 || index === 2) badgeVariant = "secondary";

                return (
                  <Link
                    key={player.userId}
                    href={`/profile/${player.userId}`}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Badge variant={badgeVariant} className="w-12 justify-center">
                        #{player.rank}
                      </Badge>
                      <Avatar>
                        <AvatarFallback>
                          {player.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{player.username}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold text-lg">
                        {player.score.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No rankings available for this category and period
            </p>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="stats">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="achievements">Top Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average WPM
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">24.5</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1,234</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Players
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">567</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">
                Top achievements will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
