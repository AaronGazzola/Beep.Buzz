"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePracticeContent,
  useSubmitTranslation,
  useUpdateDifficulty,
} from "./page.hooks";
import { useDifficultyStore } from "./page.stores";

export default function PracticePage() {
  const { data: content, isLoading, refetch } = usePracticeContent();
  const submitTranslation = useSubmitTranslation();
  const updateDifficulty = useUpdateDifficulty();
  const { difficulty, speed } = useDifficultyStore();

  const [userInput, setUserInput] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSubmit = () => {
    if (!content) return;

    const accuracy =
      (userInput
        .toUpperCase()
        .split("")
        .filter((char, i) => char === content.text[i]).length /
        content.text.length) *
      100;

    submitTranslation.mutate({
      text: content.text,
      morseCode: content.morseCode,
      accuracy,
      wpm: speed,
    });

    setUserInput("");
    setShowAnswer(false);
    refetch();
  };

  const handlePlayMorse = () => {
    if (!content) return;

    setIsPlaying(true);

    const audioContext = new AudioContext();
    const ditDuration = (1200 / speed) * 60;
    const dahDuration = ditDuration * 3;
    const gapDuration = ditDuration;
    let currentTime = audioContext.currentTime;

    for (const char of content.morseCode) {
      if (char === ".") {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.3;

        oscillator.start(currentTime);
        oscillator.stop(currentTime + ditDuration / 1000);

        currentTime += (ditDuration + gapDuration) / 1000;
      } else if (char === "-") {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.3;

        oscillator.start(currentTime);
        oscillator.stop(currentTime + dahDuration / 1000);

        currentTime += (dahDuration + gapDuration) / 1000;
      } else if (char === " ") {
        currentTime += (ditDuration * 3) / 1000;
      }
    }

    setTimeout(() => {
      setIsPlaying(false);
    }, (currentTime - audioContext.currentTime) * 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Practice Arena</h1>
        <p className="text-muted-foreground">
          Practice decoding morse code at your own pace
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Practice Exercise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : content ? (
              <>
                <div className="space-y-4">
                  <div className="p-6 rounded-lg bg-muted flex items-center justify-center">
                    <p className="font-mono text-2xl">{content.morseCode}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handlePlayMorse}
                      disabled={isPlaying}
                      className="flex-1"
                    >
                      {isPlaying ? "Playing..." : "Play Morse"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAnswer(!showAnswer)}
                    >
                      {showAnswer ? "Hide" : "Show"} Answer
                    </Button>
                  </div>

                  {showAnswer && (
                    <div className="p-4 rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-1">
                        Answer:
                      </p>
                      <p className="font-mono text-lg">{content.text}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Your Translation:
                    </label>
                    <Input
                      placeholder="Type what you hear..."
                      value={userInput}
                      onChange={(e) =>
                        setUserInput(e.target.value.toUpperCase())
                      }
                      maxLength={content.text.length}
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!userInput || submitTranslation.isPending}
                    className="w-full"
                  >
                    {submitTranslation.isPending ? "Submitting..." : "Submit & Next"}
                  </Button>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Difficulty</label>
                <Badge variant="secondary">{difficulty}</Badge>
              </div>
              <Slider
                value={[difficulty]}
                onValueChange={([value]) =>
                  updateDifficulty.mutate({
                    difficulty: value,
                    speed,
                    characterSet: [],
                  })
                }
                min={1}
                max={10}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Speed (WPM)</label>
                <Badge variant="secondary">{speed}</Badge>
              </div>
              <Slider
                value={[speed]}
                onValueChange={([value]) =>
                  updateDifficulty.mutate({
                    difficulty,
                    speed: value,
                    characterSet: [],
                  })
                }
                min={5}
                max={40}
                step={1}
              />
            </div>

            <Button variant="outline" className="w-full" onClick={() => refetch()}>
              New Exercise
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
