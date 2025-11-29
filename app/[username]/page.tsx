import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CreatorPage({
  params,
}: {
  params: { username: string };
}) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/30">
      <div className="container max-w-4xl py-8">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder-avatar.jpg" alt={params.username} />
            <AvatarFallback className="text-2xl">
              {params.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{params.username}</h1>
            <p className="text-muted-foreground">Content Creator & Streamer</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">45.2K Subscribers</Badge>
            <Badge variant="outline">Live Now</Badge>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="aspect-video w-full bg-black">
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg">YouTube Player</p>
                  <p className="text-sm">Embedded stream/video appears here</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="interact" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="interact">Interact</TabsTrigger>
            <TabsTrigger value="donate">Donate</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
          </TabsList>

          <TabsContent value="interact" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Poll</CardTitle>
                  <Badge>Live</Badge>
                </div>
                <CardDescription>
                  What game should I play next?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Minecraft</span>
                    <span className="text-muted-foreground">45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Fortnite</span>
                    <span className="text-muted-foreground">30%</span>
                  </div>
                  <Progress value={30} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Valorant</span>
                    <span className="text-muted-foreground">25%</span>
                  </div>
                  <Progress value={25} />
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  247 votes - Ends in 15 minutes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Poll</CardTitle>
                <CardDescription>Should I do a 24-hour stream?</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button className="flex-1" variant="outline">
                  Yes!
                </Button>
                <Button className="flex-1" variant="outline">
                  No way
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation Goal</CardTitle>
                <CardDescription>New streaming setup fund</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">$750 raised</span>
                  <span className="text-muted-foreground">$1,000 goal</span>
                </div>
                <Progress value={75} className="h-3" />
                <p className="text-center text-sm text-muted-foreground">
                  75% complete - 12 contributors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support {params.username}</CardTitle>
                <CardDescription>
                  Send a donation to show your support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  <Button variant="outline">$5</Button>
                  <Button variant="outline">$10</Button>
                  <Button variant="outline">$25</Button>
                  <Button variant="outline">$50</Button>
                </div>
                <Separator />
                <Button className="w-full" size="lg">
                  Donate Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
                <CardDescription>Thank you for your support!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Anonymous</p>
                    <p className="text-xs text-muted-foreground">2 min ago</p>
                  </div>
                  <Badge variant="secondary">$25</Badge>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>SF</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">StreamFan123</p>
                    <p className="text-xs text-muted-foreground">
                      &quot;Love your content!&quot;
                    </p>
                  </div>
                  <Badge variant="secondary">$10</Badge>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>GG</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">GamerGuy99</p>
                    <p className="text-xs text-muted-foreground">15 min ago</p>
                  </div>
                  <Badge variant="secondary">$5</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mini-Game Arena</CardTitle>
                    <CardDescription>
                      Challenge the host or compete with other viewers
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">8 Players</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-dashed border-border bg-muted/50 p-8 text-center">
                  <p className="text-lg font-medium">Trivia Challenge</p>
                  <p className="text-sm text-muted-foreground">
                    Test your knowledge against the streamer!
                  </p>
                  <div className="mt-4 flex justify-center gap-4">
                    <Button>Join Game (Free)</Button>
                    <Button variant="outline">Join Game ($1)</Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="mb-2 text-sm font-medium">Leaderboard</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-lg bg-muted p-2">
                      <span className="text-lg font-bold text-yellow-500">1</span>
                      <span className="flex-1 text-sm font-medium">
                        QuizMaster42
                      </span>
                      <span className="text-sm text-muted-foreground">
                        1,250 pts
                      </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-2">
                      <span className="text-lg font-bold text-gray-400">2</span>
                      <span className="flex-1 text-sm">BrainiacFan</span>
                      <span className="text-sm text-muted-foreground">
                        980 pts
                      </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-2">
                      <span className="text-lg font-bold text-amber-600">3</span>
                      <span className="flex-1 text-sm">StreamViewer99</span>
                      <span className="text-sm text-muted-foreground">
                        875 pts
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Games</CardTitle>
                <CardDescription>Join the next challenge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Word Scramble</p>
                    <p className="text-xs text-muted-foreground">
                      Starts in 10 minutes
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Notify Me
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Reaction Race</p>
                    <p className="text-xs text-muted-foreground">
                      Starts in 30 minutes
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Notify Me
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <a href="/" className="font-medium hover:underline">
              Beep.Buzz
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
