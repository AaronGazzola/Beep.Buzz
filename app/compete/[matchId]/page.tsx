"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/app/layout.stores";
import {
  useMatchState,
  useMatchMessages,
  useSubmitTranslation,
  useEndMatch,
} from "./page.hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Volume2, Trophy } from "lucide-react";
import { generateRandomWord, textToMorse, playMorseAudio } from "@/lib/morse.utils";

const MATCH_DURATION = 300;
const ROUNDS_PER_MATCH = 5;

export default function MatchArenaPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.matchId as string;

  const { user } = useAuthStore();
  const { match, messages, isLoading } = useMatchState(matchId);
  const submitTranslation = useSubmitTranslation();
  const endMatch = useEndMatch();

  useMatchMessages(matchId, user?.id || "");

  const [currentWord, setCurrentWord] = useState("");
  const [currentMorse, setCurrentMorse] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  useEffect(() => {
    if (match && messages) {
      const userMessages = messages.filter((m) => m.user_id === user?.id);
      const opponentMessages = messages.filter((m) => m.user_id !== user?.id);

      setUserScore(userMessages.filter((m) => m.is_correct).length);
      setOpponentScore(opponentMessages.filter((m) => m.is_correct).length);

      if (userMessages.length + opponentMessages.length >= ROUNDS_PER_MATCH * 2) {
        if (match.status === "active") {
          endMatch.mutate(matchId);
        }
      }
    }
  }, [match, messages, user?.id, matchId, endMatch]);

  useEffect(() => {
    const word = generateRandomWord("intermediate");
    setCurrentWord(word);
    setCurrentMorse(textToMorse(word));
    setRoundStartTime(Date.now());
  }, [messages?.length]);

  const handlePlayAudio = async () => {
    if (!currentMorse || isPlaying) return;

    setIsPlaying(true);
    try {
      await playMorseAudio(currentMorse, {
        volume: 0.5,
        wpm: 20,
        frequency: 600,
      });
    } finally {
      setIsPlaying(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer || !match) return;

    const translationTime = Date.now() - roundStartTime;

    submitTranslation.mutate({
      matchId: match.id,
      message: userAnswer,
      morseCode: currentMorse,
      translationTime,
    });

    setUserAnswer("");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Match Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/compete")} className="w-full">
              Back to Competition Hub
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCompleted = match.status === "completed";
  const roundsPlayed = messages?.length || 0;
  const isUserCreator = match.user_id === user?.id;

  if (isCompleted) {
    const userWon = userScore > opponentScore;

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Trophy
                className={`h-16 w-16 mx-auto mb-4 ${
                  userWon ? "text-yellow-500" : "text-gray-400"
                }`}
              />
              <CardTitle className="text-3xl">
                {userWon ? "Victory!" : "Defeat"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">
                        {userScore}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Your Score
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{opponentScore}</div>
                      <div className="text-sm text-muted-foreground">
                        Opponent Score
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={() => router.push("/compete")}
                className="w-full"
                size="lg"
              >
                Back to Competition Hub
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Match Arena</h1>
            <p className="text-muted-foreground">
              Round {Math.floor(roundsPlayed / 2) + 1} of {ROUNDS_PER_MATCH}
            </p>
          </div>
          <Badge variant={match.status === "active" ? "default" : "secondary"}>
            {match.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {userScore}
                </div>
                <div className="text-sm text-muted-foreground">Your Score</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{opponentScore}</div>
                <div className="text-sm text-muted-foreground">
                  Opponent Score
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
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
                    Translate the Morse code:
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
                    disabled={submitTranslation.isPending}
                  />
                </div>
                <Button
                  size="lg"
                  onClick={handleSubmitAnswer}
                  disabled={!userAnswer || submitTranslation.isPending}
                  className="w-full"
                >
                  Submit Answer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
