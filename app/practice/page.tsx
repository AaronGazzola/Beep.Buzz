"use client";

import { useState, useEffect } from "react";
import { usePracticeHistory, useSavePracticeSession } from "./page.hooks";
import { usePracticeStore } from "./page.stores";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Volume2, Play } from "lucide-react";
import { generateRandomWord, textToMorse, playMorseAudio } from "@/lib/morse.utils";
import type { DifficultyLevel } from "./page.types";

const WORDS_PER_SESSION = 10;

export default function PracticePage() {
  const { data: history } = usePracticeHistory();
  const savePracticeSession = useSavePracticeSession();

  const {
    difficulty,
    currentWordIndex,
    wordsAttempted,
    wordsCorrect,
    startTime,
    isSessionActive,
    setDifficulty,
    nextWord,
    recordAnswer,
    startSession,
    endSession,
  } = usePracticeStore();

  const [currentWord, setCurrentWord] = useState("");
  const [currentMorse, setCurrentMorse] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isSessionActive) {
      const word = generateRandomWord(difficulty);
      setCurrentWord(word);
      setCurrentMorse(textToMorse(word));
    }
  }, [isSessionActive, currentWordIndex, difficulty]);

  const handleStartSession = () => {
    startSession();
  };

  const handlePlayAudio = async () => {
    if (!currentMorse || isPlaying) return;

    setIsPlaying(true);
    try {
      await playMorseAudio(currentMorse, {
        volume: 0.5,
        wpm: difficulty === "beginner" ? 15 : difficulty === "intermediate" ? 20 : 25,
        frequency: 600,
      });
    } finally {
      setIsPlaying(false);
    }
  };

  const handleSubmitAnswer = () => {
    const correct = userAnswer.toUpperCase() === currentWord;
    recordAnswer(correct);
    setUserAnswer("");

    if (wordsAttempted + 1 >= WORDS_PER_SESSION) {
      const accuracy = Math.round(
        ((wordsCorrect + (correct ? 1 : 0)) / WORDS_PER_SESSION) * 100
      );
      const completionTime = startTime ? Date.now() - startTime : 0;

      savePracticeSession.mutate({
        difficulty,
        exerciseType: "translation",
        wordsAttempted: WORDS_PER_SESSION,
        wordsCorrect: wordsCorrect + (correct ? 1 : 0),
        accuracy,
        completionTime: Math.round(completionTime / 1000),
      });

      endSession();
    } else {
      nextWord();
    }
  };

  if (!isSessionActive) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Practice Mode</h1>
            <p className="text-muted-foreground">
              Test your skills with self-paced challenges
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Start New Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Difficulty
                </label>
                <Select
                  value={difficulty}
                  onValueChange={(value: DifficultyLevel) =>
                    setDifficulty(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (15 WPM)</SelectItem>
                    <SelectItem value="intermediate">
                      Intermediate (20 WPM)
                    </SelectItem>
                    <SelectItem value="advanced">Advanced (25 WPM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  You'll translate {WORDS_PER_SESSION} random words from Morse
                  code to text. No hints provided!
                </p>
              </div>

              <Button size="lg" onClick={handleStartSession} className="w-full">
                <Play className="mr-2 h-5 w-5" />
                Start Practice Session
              </Button>
            </CardContent>
          </Card>

          {history && history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {history.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <Badge variant="outline" className="mb-1">
                          {session.difficulty}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {new Date(session.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          {session.accuracy}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {session.words_correct}/{session.words_attempted}{" "}
                          correct
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Practice Session</h1>
              <p className="text-muted-foreground">
                Question {wordsAttempted + 1} of {WORDS_PER_SESSION}
              </p>
            </div>
            <Badge>{difficulty}</Badge>
          </div>
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

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{wordsAttempted}</div>
                <div className="text-sm text-muted-foreground">Attempted</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {wordsCorrect}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {wordsAttempted > 0
                    ? Math.round((wordsCorrect / wordsAttempted) * 100)
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
