import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: February 17, 2026</p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>What is a cookie?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A cookie is a small text file stored on your device by your browser when you
                visit a website. Cookies are used for a variety of purposes including remembering
                your preferences and keeping you signed in.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies we use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Beep.Buzz uses <strong className="font-semibold text-foreground">one cookie</strong>:
              </p>
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Name</th>
                      <th className="px-4 py-2 text-left font-semibold">Purpose</th>
                      <th className="px-4 py-2 text-left font-semibold">Expiry</th>
                      <th className="px-4 py-2 text-left font-semibold">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3">
                        <code className="bg-muted px-1 rounded font-mono">sidebar_state</code>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Stores whether the sidebar is open or closed
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">7 days</td>
                      <td className="px-4 py-3 text-muted-foreground">Functional</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground">
                This cookie is{" "}
                <strong className="font-semibold text-foreground">strictly functional</strong>.
                It never leaves your browser to be shared with third parties and is not used for
                advertising, analytics, or tracking of any kind.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies we do NOT use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">Beep.Buzz does not use:</p>
              <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                <li>Advertising or targeting cookies</li>
                <li>Analytics cookies (e.g. Google Analytics)</li>
                <li>Social media tracking cookies</li>
                <li>Any third-party cookies</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to manage or disable cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                You can control or delete cookies through your browser settings. Instructions
                for common browsers:
              </p>
              <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.apple.com/en-au/guide/safari/sfri11471/mac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    Safari
                  </a>
                </li>
                <li>
                  <a
                    href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    Microsoft Edge
                  </a>
                </li>
              </ul>
              <p className="text-muted-foreground">
                Disabling the{" "}
                <code className="bg-muted px-1 rounded text-sm font-mono">sidebar_state</code>{" "}
                cookie will not prevent you from using Beep.Buzz — the sidebar will simply revert
                to its default position on each visit.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to this policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If we introduce new cookies we will update this policy and the &quot;last updated&quot;
                date above before they are set.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                For questions about this cookie policy, please use our{" "}
                <Link href="/contact" className="text-primary underline hover:no-underline">
                  contact form
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
