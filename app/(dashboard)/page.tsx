import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here is an overview of your Beep.Buzz page
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Donations</CardDescription>
            <CardTitle className="text-3xl">$1,234</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Polls</CardDescription>
            <CardTitle className="text-3xl">3</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">247 total votes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Page Visitors</CardDescription>
            <CardTitle className="text-3xl">892</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Subscribers</CardDescription>
            <CardTitle className="text-3xl">45.2K</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">YouTube channel</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Setup Checklist</CardTitle>
            <CardDescription>
              Complete these steps to get the most out of Beep.Buzz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  +
                </div>
                <div>
                  <p className="text-sm font-medium">Account created</p>
                  <p className="text-xs text-muted-foreground">
                    Your Beep.Buzz account is ready
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Complete</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  +
                </div>
                <div>
                  <p className="text-sm font-medium">YouTube connected</p>
                  <p className="text-xs text-muted-foreground">
                    Channel linked successfully
                  </p>
                </div>
              </div>
              <Badge variant="secondary">Complete</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground text-muted-foreground">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium">Connect Stripe</p>
                  <p className="text-xs text-muted-foreground">
                    Set up payments to receive donations
                  </p>
                </div>
              </div>
              <Button size="sm">Connect</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground text-muted-foreground">
                  4
                </div>
                <div>
                  <p className="text-sm font-medium">Customize your page</p>
                  <p className="text-xs text-muted-foreground">
                    Add components and style your page
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href="/builder">Edit</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest interactions on your page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                $
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Anonymous</span> donated $25
                </p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                P
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">15 new votes</span> on
                  &quot;Next game?&quot; poll
                </p>
                <p className="text-xs text-muted-foreground">5 minutes ago</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                $
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">StreamFan123</span> donated $10
                </p>
                <p className="text-xs text-muted-foreground">12 minutes ago</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                G
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">8 players</span> joined the
                  mini-game
                </p>
                <p className="text-xs text-muted-foreground">18 minutes ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Donation Goal</CardTitle>
          <CardDescription>New streaming setup fund</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>$750 raised</span>
            <span className="text-muted-foreground">$1,000 goal</span>
          </div>
          <Progress value={75} />
          <p className="text-sm text-muted-foreground">
            75% complete - 12 contributors
          </p>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button size="lg" asChild>
          <Link href="/builder">Edit Your Page</Link>
        </Button>
      </div>
    </div>
  );
}
