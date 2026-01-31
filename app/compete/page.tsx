"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  useJoinQueue,
  useSubmitSolution,
  useMatchChat,
  useOpponentProgress,
} from "./page.hooks";
import { useQueueStore, useSolutionStore, useMatchChatStore } from "./page.stores";

export default function CompetePage() {
  const joinQueue = useJoinQueue();
  const submitSolution = useSubmitSolution();
  const sendMessage = useMatchChat();

  const { inQueue } = useQueueStore();
  const { progress } = useSolutionStore();
  const { messages } = useMatchChatStore();

  const [matchId] = useState<string | undefined>(undefined);
  const [userInput, setUserInput] = useState("");
  const [chatInput, setChatInput] = useState("");

  const { data: opponentProgress } = useOpponentProgress(matchId);

  const challengeText = "HELLO WORLD";
  const challengeMorse = ".... . .-.. .-.. --- / .-- --- .-. .-.. -..";

  const handleJoinQueue = () => {
    joinQueue.mutate();
  };

  const handleSubmit = () => {
    submitSolution.mutate({
      matchId: matchId || "",
      solution: userInput,
      wpm: 20,
      accuracy: 95,
    });
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    sendMessage.mutate({
      matchId: matchId || "",
      message: chatInput,
    });

    setChatInput("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Competitive Match
        </h1>
        <p className="text-muted-foreground">
          Challenge other learners in real-time morse code battles
        </p>
      </div>

      {!matchId && !inQueue ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Find a Match</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Ready to test your skills against other learners? Join the queue to
              be matched with an opponent of similar skill level.
            </p>
            <Button
              onClick={handleJoinQueue}
              disabled={joinQueue.isPending}
              className="w-full"
              size="lg"
            >
              {joinQueue.isPending ? "Joining..." : "Join Match Queue"}
            </Button>
          </CardContent>
        </Card>
      ) : inQueue && !matchId ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Searching for Opponent...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center py-8">
              <div className="animate-pulse space-y-2 text-center">
                <div className="w-16 h-16 bg-primary rounded-full mx-auto" />
                <p className="text-muted-foreground">Finding your match...</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => useQueueStore.getState().setInQueue(false)}
              className="w-full"
            >
              Leave Queue
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Challenge</span>
                  <Badge variant="secondary">In Progress</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-lg bg-muted">
                  <p className="font-mono text-xl text-center">
                    {challengeMorse}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Opponent Progress
                    </span>
                    <span className="text-sm">
                      {opponentProgress?.progress || 0}%
                    </span>
                  </div>
                  <Progress value={opponentProgress?.progress || 0} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Solution:</label>
                  <Input
                    placeholder="Type your translation..."
                    value={userInput}
                    onChange={(e) =>
                      setUserInput(e.target.value.toUpperCase())
                    }
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={!userInput || submitSolution.isPending}
                  className="w-full"
                >
                  {submitSolution.isPending ? "Submitting..." : "Submit Solution"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Match Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64 overflow-y-auto space-y-2 p-2 rounded-lg border">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-2 rounded-lg bg-muted text-sm"
                    >
                      <p className="font-medium text-xs text-muted-foreground mb-1">
                        You
                      </p>
                      <p>{msg.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No messages yet
                  </p>
                )}
              </div>

              <Separator />

              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
