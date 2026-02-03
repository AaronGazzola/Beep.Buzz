"use client";

import { useEffect, useState } from "react";
import { useTrainingProgress, useSubmitTraining } from "./page.hooks";
import { useTrainingStore } from "./page.stores";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Volume2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { textToMorse, playMorseAudio } from "@/lib/morse.utils";
import type { Lesson } from "./page.types";

const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Lesson 1: E and T",
    description: "Learn the two most common letters",
    characters: ["E", "T"],
    words: ["E", "T", "ET", "TEE"],
  },
  {
    id: 2,
    title: "Lesson 2: I, A, N, M",
    description: "Expanding your vocabulary",
    characters: ["I", "A", "N", "M"],
    words: ["IN", "AN", "MAN", "MAIN", "NAME"],
  },
  {
    id: 3,
    title: "Lesson 3: S, U, R, W",
    description: "Building more words",
    characters: ["S", "U", "R", "W"],
    words: ["SUN", "RUN", "WAR", "WAS", "RAW"],
  },
];

export default function TrainingPage() {
  const { data: progress } = useTrainingProgress();
  const submitTraining = useSubmitTraining();

  const {
    currentLesson,
    currentExerciseIndex,
    correctAnswers,
    totalAttempts,
    startTime,
    showTranslation,
    setCurrentLesson,
    nextExercise,
    recordAnswer,
    startSession,
    toggleTranslation,
  } = useTrainingStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  useEffect(() => {
    if (currentLesson && !startTime) {
      startSession();
    }
  }, [currentLesson, startTime, startSession]);

  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const currentWord =
    currentLesson?.words[currentExerciseIndex % currentLesson.words.length];
  const currentMorse = currentWord ? textToMorse(currentWord) : "";

  const handlePlayAudio = async () => {
    if (!currentMorse || isPlaying) return;

    setIsPlaying(true);
    try {
      await playMorseAudio(currentMorse, {
        volume: 0.5,
        wpm: 15,
        frequency: 600,
      });
    } finally {
      setIsPlaying(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentWord) return;

    const correct = userAnswer.toUpperCase() === currentWord;
    recordAnswer(correct);
    setUserAnswer("");

    if (currentLesson && currentExerciseIndex >= currentLesson.words.length - 1) {
      const accuracy = Math.round(
        (correctAnswers / Math.max(totalAttempts, 1)) * 100
      );
      const completionTime = startTime ? Date.now() - startTime : 0;

      submitTraining.mutate({
        lessonId: currentLesson.id,
        accuracy,
        completionTime: Math.round(completionTime / 1000),
        completed: accuracy >= 70,
      });
    } else {
      nextExercise();
    }
  };

  if (!currentLesson) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Training Mode</h1>
            <p className="text-muted-foreground">
              Learn Morse code through guided lessons with Beep and Buzz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LESSONS.map((lesson) => {
              const lessonProgress = progress?.find(
                (p) => p.lesson_id === lesson.id
              );
              const isCompleted = lessonProgress?.completed || false;

              return (
                <Card
                  key={lesson.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => selectLesson(lesson)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={isCompleted ? "default" : "secondary"}>
                        Lesson {lesson.id}
                      </Badge>
                      {isCompleted && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {lesson.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {lesson.characters.map((char) => (
                        <Badge key={char} variant="outline">
                          {char}
                        </Badge>
                      ))}
                    </div>
                    {lessonProgress && (
                      <div className="mt-4 text-sm text-muted-foreground">
                        Best: {lessonProgress.accuracy}% accuracy
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const progressPercent =
    ((currentExerciseIndex + 1) / currentLesson.words.length) * 100;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{currentLesson.title}</h1>
              <p className="text-muted-foreground">
                Exercise {currentExerciseIndex + 1} of{" "}
                {currentLesson.words.length}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setCurrentLesson(null)}
            >
              Exit Lesson
            </Button>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div className="bg-muted rounded-lg p-8">
                <div className="font-mono text-4xl mb-4">{currentMorse}</div>
                <Button
                  size="lg"
                  onClick={handlePlayAudio}
                  disabled={isPlaying}
                >
                  <Volume2 className="mr-2 h-5 w-5" />
                  {isPlaying ? "Playing..." : "Play Sound"}
                </Button>
              </div>

              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTranslation}
                >
                  {showTranslation ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide Translation
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Show Translation
                    </>
                  )}
                </Button>
                {showTranslation && (
                  <div className="mt-4 text-2xl font-bold text-primary">
                    {currentWord}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type what you heard:
                  </label>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmitAnswer();
                    }}
                    className="w-full px-4 py-3 text-lg text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Type your answer..."
                    autoFocus
                  />
                </div>
                <Button
                  size="lg"
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer}
                  className="w-full"
                >
                  Submit Answer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">
                  {correctAnswers}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {totalAttempts > 0
                    ? Math.round((correctAnswers / totalAttempts) * 100)
                    : 0}
                  %
                </div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
