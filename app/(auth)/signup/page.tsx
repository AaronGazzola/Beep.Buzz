"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function SignupPage() {
  const currentStep = 1;
  const totalSteps = 3;
  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Step {currentStep} of {totalSteps}: Account details
        </CardDescription>
        <Progress value={progressValue} className="mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="flex items-center gap-2">
            <Input id="username" placeholder="yourname" />
            <span className="shrink-0 text-sm text-muted-foreground">
              .beep.buzz
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            This will be your unique page URL
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Create a password" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
          />
        </div>
        <Separator />
        <div className="space-y-4">
          <p className="text-sm font-medium">Next steps after signup:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-border p-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                2
              </div>
              <div>
                <p className="text-sm font-medium">Connect YouTube</p>
                <p className="text-xs text-muted-foreground">
                  Link your channel to display subscriber count and embed videos
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                3
              </div>
              <div>
                <p className="text-sm font-medium">Connect Stripe</p>
                <p className="text-xs text-muted-foreground">
                  Set up payments to receive donations from your audience
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms" className="text-sm font-normal">
            I agree to the{" "}
            <Link href="/terms" className="underline hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full">Create Account</Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:text-primary">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
