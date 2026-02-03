"use client";

import { useParams } from "next/navigation";
import { useAuthStore } from "@/app/layout.stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Zap, Target, Star } from "lucide-react";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const { user, profile } = useAuthStore();

  const isOwnProfile = user?.id === userId;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user?.email}</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge>Level {profile?.level || 1}</Badge>
                  <Badge variant="outline">
                    {profile?.skill_rating || 1000} SR
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {profile?.level || 1}
                  </div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {profile?.experience_points || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">XP</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-purple-500" />
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
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">
                    Matches Won
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
