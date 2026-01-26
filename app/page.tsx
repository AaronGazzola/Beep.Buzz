"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFeaturedSections } from "./page.hooks";
import { useCurrentUser } from "./layout.hooks";

export default function Home() {
  const { data: user } = useCurrentUser();
  const { data: featured, isPending } = useFeaturedSections();

  return (
    <div className="container py-8 space-y-12">
      <section className="text-center space-y-4 py-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Welcome to Beep.Buzz
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Create your personal page, customize your sticker identity, and connect with others.
        </p>
        {!user && (
          <div className="flex justify-center gap-4 pt-4">
            <Button asChild size="lg">
              <Link href="/sign-in">Get Started</Link>
            </Button>
          </div>
        )}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Recent Pages</h2>
        {isPending ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : featured?.recentPages && featured.recentPages.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.recentPages.map((page) => (
              <Card key={page.id} className="hover:bg-accent/50 transition-colors">
                <Link href={`/${page.profile.username}`}>
                  <CardHeader>
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      by @{page.profile.username}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No pages yet. Be the first to create one!</p>
        )}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Popular Profiles</h2>
        {isPending ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-5 w-28" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : featured?.popularProfiles && featured.popularProfiles.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.popularProfiles.map((profile) => (
              <Card key={profile.id} className="hover:bg-accent/50 transition-colors">
                <Link href={`/${profile.username}`}>
                  <CardContent className="pt-6">
                    <p className="font-medium">@{profile.username}</p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No profiles yet.</p>
        )}
      </section>
    </div>
  );
}
