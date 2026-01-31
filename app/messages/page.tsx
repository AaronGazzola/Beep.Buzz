"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useSendMorseMessage,
  useMessageHistory,
  useDecodeMessage,
} from "./page.hooks";

export default function MessagesPage() {
  const sendMessage = useSendMorseMessage();
  const { data: history, isLoading } = useMessageHistory();
  const decodeMessage = useDecodeMessage();

  const [recipientId, setRecipientId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [decodingMessageId, setDecodingMessageId] = useState<string | null>(null);
  const [decodedText, setDecodedText] = useState("");

  const encodeMorse = (text: string): string => {
    const morseCode: Record<string, string> = {
      A: ".-",
      B: "-...",
      C: "-.-.",
      D: "-..",
      E: ".",
      F: "..-.",
      G: "--.",
      H: "....",
      I: "..",
      J: ".---",
      K: "-.-",
      L: ".-..",
      M: "--",
      N: "-.",
      O: "---",
      P: ".--.",
      Q: "--.-",
      R: ".-.",
      S: "...",
      T: "-",
      U: "..-",
      V: "...-",
      W: ".--",
      X: "-..-",
      Y: "-.--",
      Z: "--..",
      " ": "/",
    };

    return text
      .toUpperCase()
      .split("")
      .map((char) => morseCode[char] || "")
      .join(" ");
  };

  const handleSendMessage = async () => {
    if (!recipientId || !messageText) return;

    const morse = encodeMorse(messageText);

    await sendMessage.mutateAsync({
      recipientId,
      message: morse,
    });

    setRecipientId("");
    setMessageText("");
  };

  const handleSaveDecoded = async (messageId: string) => {
    if (!decodedText) return;

    await decodeMessage.mutateAsync({
      messageId,
      decodedText,
    });

    setDecodingMessageId(null);
    setDecodedText("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Message Center</h1>
        <p className="text-muted-foreground">
          Send and receive morse code messages with other learners
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Send Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient User ID</label>
              <Input
                placeholder="Enter user ID..."
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Message</label>
              <Textarea
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
              />
            </div>

            {messageText && (
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground mb-1">
                  Morse Preview:
                </p>
                <p className="font-mono text-sm">{encodeMorse(messageText)}</p>
              </div>
            )}

            <Button
              onClick={handleSendMessage}
              disabled={
                !recipientId || !messageText || sendMessage.isPending
              }
              className="w-full"
            >
              {sendMessage.isPending ? "Sending..." : "Send Morse Message"}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Message History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="received">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="received">Received</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
              </TabsList>

              <TabsContent value="received" className="space-y-3 mt-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </>
                ) : history && history.received.length > 0 ? (
                  history.received.map((message) => (
                    <div key={message.id} className="p-4 rounded-lg border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          From: {message.sender_id}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="p-2 rounded bg-muted">
                        <p className="font-mono text-sm">
                          {message.encoded_content}
                        </p>
                      </div>

                      {message.decoded_content ? (
                        <div className="p-2 rounded bg-green-50 dark:bg-green-950">
                          <p className="text-sm">
                            Decoded: {message.decoded_content}
                          </p>
                        </div>
                      ) : decodingMessageId === message.id ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="Type your translation..."
                            value={decodedText}
                            onChange={(e) => setDecodedText(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveDecoded(message.id)}
                              disabled={!decodedText}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setDecodingMessageId(null);
                                setDecodedText("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDecodingMessageId(message.id)}
                        >
                          Decode Message
                        </Button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No received messages
                  </p>
                )}
              </TabsContent>

              <TabsContent value="sent" className="space-y-3 mt-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </>
                ) : history && history.sent.length > 0 ? (
                  history.sent.map((message) => (
                    <div key={message.id} className="p-4 rounded-lg border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          To: {message.recipient_id}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="p-2 rounded bg-muted">
                        <p className="font-mono text-sm">
                          {message.encoded_content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No sent messages
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
