import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: February 17, 2026</p>

        <p className="text-muted-foreground mb-6">
          This Privacy Policy explains how Beep.Buzz (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects,
          uses, and protects your personal information when you use our service.
          By using Beep.Buzz you agree to the practices described in this policy.
        </p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">We collect the following information:</p>
              <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                <li>
                  <strong className="font-semibold text-foreground">Account data:</strong>{" "}
                  email address and username when you create an account
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Learning data:</strong>{" "}
                  training progress, practice sessions, game scores, achievements, and learned letters
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Chat messages:</strong>{" "}
                  morse code signals and translated text sent during user-to-user and AI chat sessions
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Contact messages:</strong>{" "}
                  subject and message content submitted via the contact form
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Usage data:</strong>{" "}
                  match history, leaderboard rankings, and skill ratings
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Functional cookie:</strong>{" "}
                  a single cookie named{" "}
                  <code className="bg-muted px-1 rounded text-sm font-mono">sidebar_state</code>{" "}
                  that stores your sidebar open/closed preference (see Section 7)
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">We use the information we collect to:</p>
              <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                <li>Provide, maintain, and improve the Beep.Buzz service</li>
                <li>Track your learning progress and achievements</li>
                <li>Enable matchmaking for user-to-user morse code chat</li>
                <li>Display leaderboards and skill ratings</li>
                <li>Send technical notices and support messages</li>
                <li>Review reports of policy violations and maintain platform safety</li>
                <li>Respond to contact form enquiries and data rights requests</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Legal Basis for Processing (GDPR)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                For users in the European Economic Area, we process your personal data on
                the following legal bases under GDPR Article 6:
              </p>
              <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                <li>
                  <strong className="font-semibold text-foreground">Contract performance (Art. 6(1)(b)):</strong>{" "}
                  processing your account data, learning data, and chat messages is necessary
                  to deliver the service you signed up for
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Legitimate interests (Art. 6(1)(f)):</strong>{" "}
                  displaying leaderboards, computing skill ratings, and maintaining platform safety
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Third-Party Data Processors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                We use the following third-party processors to operate the service. Each processor
                is bound by data processing agreements and applies appropriate security measures.
              </p>
              <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                <li>
                  <strong className="font-semibold text-foreground">Supabase</strong>{" "}
                  (database and authentication) — United States.{" "}
                  <a
                    href="https://supabase.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    Privacy policy
                  </a>
                </li>
                <li>
                  <strong className="font-semibold text-foreground">OpenRouter</strong>{" "}
                  (AI inference gateway for the AI Chat feature) — United States.{" "}
                  <a
                    href="https://openrouter.ai/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    Privacy policy
                  </a>
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Google</strong>{" "}
                  (Gemini 2.0 Flash AI model, accessed via OpenRouter) — United States.{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    Privacy policy
                  </a>
                </li>
              </ul>
              <p className="text-muted-foreground">
                We do not sell your personal information to any third party.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your data is processed and stored in the United States by our third-party processors.
                These transfers are covered by standard contractual clauses and the processors&apos;
                own data protection commitments. By using Beep.Buzz you consent to this transfer.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                <li>
                  <strong className="font-semibold text-foreground">Account and learning data:</strong>{" "}
                  retained until you delete your account
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Match messages:</strong>{" "}
                  retained for 90 days after the match ends, then deleted
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Contact messages:</strong>{" "}
                  retained for 12 months, then deleted
                </li>
                <li>
                  <strong className="font-semibold text-foreground">User reports:</strong>{" "}
                  retained for as long as necessary to investigate and resolve the report
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">Beep.Buzz uses a single functional cookie:</p>
              <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                <li>
                  <code className="bg-muted px-1 rounded text-sm font-mono">sidebar_state</code>{" "}
                  — stores whether the sidebar is open or closed. Expires after 7 days. This cookie
                  is strictly necessary for the interface to remember your preference and is not used
                  for tracking or advertising.
                </li>
              </ul>
              <p className="text-muted-foreground">
                We do not use any advertising, analytics, or tracking cookies. For full details see
                our{" "}
                <Link href="/cookies" className="text-primary underline hover:no-underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                If you are located in the European Economic Area or another jurisdiction with
                applicable privacy laws, you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-outside ml-4 space-y-2 text-muted-foreground">
                <li>
                  <strong className="font-semibold text-foreground">Access:</strong>{" "}
                  request a copy of the data we hold about you
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Rectification:</strong>{" "}
                  request correction of inaccurate data
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Erasure:</strong>{" "}
                  request deletion of your personal data
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Portability:</strong>{" "}
                  request your data in a structured, machine-readable format
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Restriction:</strong>{" "}
                  request that we limit how we process your data
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Objection:</strong>{" "}
                  object to processing based on legitimate interests
                </li>
                <li>
                  <strong className="font-semibold text-foreground">Lodge a complaint:</strong>{" "}
                  you have the right to lodge a complaint with your local data protection supervisory authority
                </li>
              </ul>
              <p className="text-muted-foreground">
                To exercise any of these rights, please submit a request via our{" "}
                <Link href="/contact" className="text-primary underline hover:no-underline">
                  contact form
                </Link>
                . We will respond within 30 days.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Account Deletion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You can permanently delete your account and all associated data at any time from
                the{" "}
                <Link href="/account/delete" className="text-primary underline hover:no-underline">
                  account deletion page
                </Link>
                . Deletion is irreversible. Your data will be removed within 30 days of your
                request. Match messages may be anonymised rather than deleted where required for
                service integrity.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Children&apos;s Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Beep.Buzz is intended for users aged 16 and over. We do not knowingly collect
                personal information from anyone under 16. If you believe a person under 16 has
                provided us with their data, please contact us and we will delete it promptly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We use industry-standard security measures including encrypted connections (HTTPS),
                row-level security on our database, and authenticated API access. No method of
                transmission over the internet is 100% secure; we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>12. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will notify you of material
                changes by posting a prominent notice on the site or by email before changes take
                effect. Continued use of the service after the effective date constitutes acceptance
                of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>13. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                For questions about this privacy policy or to submit a data rights request, please
                use our{" "}
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
