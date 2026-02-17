import { Github, Youtube } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Beep.Buzz</h1>

        <div className="space-y-6">
          <div className="rounded-lg bg-yellow-100 border border-orange-400 p-6">
            <h2 className="text-xl font-bold text-orange-800 mb-3">Beta Preview</h2>
            <p className="text-black mb-3">
              Beep.Buzz is currently in beta development. Until the initial
              version is released, the app will be changing frequently, the
              database will be occasionally wiped, and it will contain temporary
              data for testing purposes.
            </p>
            <p className="text-black mb-4">
              Beep.Buzz is open source, and the developer shares the development
              process every other day on YouTube. Follow along to see the app
              being built in real time.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                variant="outline"
                className="bg-white text-orange-800 border-orange-400 hover:bg-yellow-200"
              >
                <Link
                  href="https://github.com/AaronGazzola/Beep.Buzz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-white text-orange-800 border-orange-400 hover:bg-yellow-200"
              >
                <Link
                  href="https://www.youtube.com/@AzAnything"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="mr-2 h-4 w-4" />
                  YouTube
                </Link>
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Beep.Buzz is dedicated to making Morse code learning accessible,
                engaging, and fun. Through interactive training, self-paced
                practice, and competitive gameplay, we help users master this
                timeless communication skill.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What is Morse Code?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Morse code is a method of encoding text characters using
                sequences of dots and dashes. Invented in the 1830s, it remains
                relevant today in amateur radio, aviation, and emergency
                communications.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Modes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Training Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Guided lessons with Beep and Buzz characters that teach you
                  Morse code fundamentals step by step.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Practice Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Self-paced challenges to test and improve your translation
                  skills at various difficulty levels.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Competition Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time matches against other players to put your skills to
                  the ultimate test.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
