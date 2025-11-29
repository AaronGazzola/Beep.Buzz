import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="container flex flex-col items-center justify-center gap-6 py-24 text-center md:py-32">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Engage Your Audience Like Never Before
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
          Create interactive pages for your live streams. Polls, donations,
          goals, and mini-games — all in real-time at username.beep.buzz
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/signup">Get Started Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/demo">See Demo</Link>
          </Button>
        </div>
      </section>

      <section className="container py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Engage
          </h2>
          <p className="mt-4 text-muted-foreground">
            Powerful features designed for content creators
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Live Polls</CardTitle>
              <CardDescription>
                Create real-time polls and see results instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Let your audience vote on decisions, topics, or just for fun.
                Results update live as votes come in.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Donation Goals</CardTitle>
              <CardDescription>
                Set goals and track progress with your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create donation goals with progress bars. Celebrate milestones
                together with your audience.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mini-Games</CardTitle>
              <CardDescription>
                Host interactive games during your streams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Challenge your audience with host-vs-viewers games. Optional
                pay-to-play for extra engagement.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Donation Feed</CardTitle>
              <CardDescription>
                Show appreciation with a live donation history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Display recent donations and supporter messages. Build community
                recognition.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Track engagement and grow your audience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor visitor counts, poll participation, donation trends, and
                more with detailed analytics.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Custom Branding</CardTitle>
              <CardDescription>
                Make your page match your style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Customize colors, layouts, and styling to create a page that
                reflects your brand.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-y border-border bg-muted/50 py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get Started in Minutes
            </h2>
            <p className="mt-4 text-muted-foreground">
              Three simple steps to launch your interactive page
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Create Account</h3>
              <p className="text-muted-foreground">
                Sign up and choose your unique username for your Beep.Buzz page
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Connect & Customize</h3>
              <p className="text-muted-foreground">
                Link your YouTube channel, connect Stripe, and design your page
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Go Live</h3>
              <p className="text-muted-foreground">
                Share your URL with your audience and start engaging in
                real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 text-center md:py-24">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to Level Up Your Streams?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Join creators who are transforming their live streaming experience
          with interactive audience engagement.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="/signup">Create Your Page</Link>
        </Button>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 Beep.Buzz. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/support" className="hover:underline">
              Support
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
