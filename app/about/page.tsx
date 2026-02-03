import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Beep.Buzz</h1>

        <div className="space-y-6">
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
