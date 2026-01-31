"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useLessonProgress,
  usePracticeStats,
  useSkillProgression,
  useRecommendedLessons,
} from "./page.hooks";

export default function LearnPage() {
  const {
    data: lessonsData,
    isLoading: isLoadingLessons,
  } = useLessonProgress();
  const { data: stats, isLoading: isLoadingStats } = usePracticeStats();
  const { data: skills, isLoading: isLoadingSkills } = useSkillProgression();
  const {
    data: recommendations,
    isLoading: isLoadingRecs,
  } = useRecommendedLessons();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Learning Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your progress and continue your morse code journey
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Practice Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingStats ? (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </>
            ) : stats ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Sessions
                  </span>
                  <span className="font-medium">{stats.totalSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Avg WPM
                  </span>
                  <span className="font-medium">
                    {stats.avgWpm.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Avg Accuracy
                  </span>
                  <span className="font-medium">
                    {stats.avgAccuracy.toFixed(1)}%
                  </span>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Skill Progression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoadingSkills ? (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </>
            ) : skills ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Level {skills.level}</span>
                    <span className="text-sm text-muted-foreground">
                      {skills.xp} / {skills.nextLevelXp} XP
                    </span>
                  </div>
                  <Progress value={(skills.xp / skills.nextLevelXp) * 100} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(skills.skills).map(([skill, value]) => (
                    <div key={skill}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm capitalize">{skill}</span>
                        <span className="text-sm font-medium">{value}%</span>
                      </div>
                      <Progress value={value} />
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingLessons ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : lessonsData ? (
                <div className="space-y-2">
                  {lessonsData.lessons.map((lesson) => {
                    const progress = lessonsData.progress.find(
                      (p) => p.lesson_id === lesson.id
                    );
                    const isCompleted = progress?.completed || false;
                    const attempts = progress?.attempts || 0;

                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{lesson.title}</h3>
                            {isCompleted && (
                              <Badge variant="secondary">Completed</Badge>
                            )}
                            <Badge variant="outline">
                              Difficulty {lesson.difficulty}
                            </Badge>
                          </div>
                          {lesson.description && (
                            <p className="text-sm text-muted-foreground">
                              {lesson.description}
                            </p>
                          )}
                          {attempts > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {attempts} attempt{attempts > 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                        <Button asChild>
                          <Link href={`/practice?lesson=${lesson.id}`}>
                            {isCompleted ? "Review" : "Start"}
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No lessons available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recommended For You</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingRecs ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : recommendations && recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.lessonId}
                    className="p-3 rounded-lg border space-y-2"
                  >
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {rec.reason}
                    </p>
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/practice?lesson=${rec.lessonId}`}>
                        Start Lesson
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recommendations at this time
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
