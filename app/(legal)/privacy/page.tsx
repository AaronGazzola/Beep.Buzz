export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
        <h1>Privacy Policy</h1>

        <p>Last updated: February 17, 2026</p>

        <p>
          This Privacy Policy explains how Beep.Buzz (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects,
          uses, and protects your personal information when you use our service.
          By using Beep.Buzz you agree to the practices described in this policy.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We collect the following information:</p>
        <ul>
          <li>
            <strong>Account data:</strong> email address and username when you create an account
          </li>
          <li>
            <strong>Learning data:</strong> training progress, practice sessions, game scores,
            achievements, and learned letters
          </li>
          <li>
            <strong>Chat messages:</strong> morse code signals and translated text sent during
            user-to-user and AI chat sessions
          </li>
          <li>
            <strong>Contact messages:</strong> subject and message content submitted via the
            contact form
          </li>
          <li>
            <strong>Usage data:</strong> match history, leaderboard rankings, and skill ratings
          </li>
          <li>
            <strong>Functional cookie:</strong> a single cookie named <code>sidebar_state</code>{" "}
            that stores your sidebar open/closed preference (see Section 7)
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve the Beep.Buzz service</li>
          <li>Track your learning progress and achievements</li>
          <li>Enable matchmaking for user-to-user morse code chat</li>
          <li>Display leaderboards and skill ratings</li>
          <li>Send technical notices and support messages</li>
          <li>Review reports of policy violations and maintain platform safety</li>
          <li>Respond to contact form enquiries and data rights requests</li>
        </ul>

        <h2>3. Legal Basis for Processing (GDPR)</h2>
        <p>
          For users in the European Economic Area, we process your personal data on
          the following legal bases under GDPR Article 6:
        </p>
        <ul>
          <li>
            <strong>Contract performance (Art. 6(1)(b)):</strong> processing your account data,
            learning data, and chat messages is necessary to deliver the service you signed up for
          </li>
          <li>
            <strong>Legitimate interests (Art. 6(1)(f)):</strong> displaying leaderboards,
            computing skill ratings, and maintaining platform safety
          </li>
        </ul>

        <h2>4. Third-Party Data Processors</h2>
        <p>
          We use the following third-party processors to operate the service. Each processor
          is bound by data processing agreements and applies appropriate security measures.
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> (database and authentication) — United States.{" "}
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
              Privacy policy
            </a>
          </li>
          <li>
            <strong>OpenRouter</strong> (AI inference gateway for the AI Chat feature) — United States.{" "}
            <a href="https://openrouter.ai/privacy" target="_blank" rel="noopener noreferrer">
              Privacy policy
            </a>
          </li>
          <li>
            <strong>Google</strong> (Gemini 2.0 Flash AI model, accessed via OpenRouter) — United States.{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Privacy policy
            </a>
          </li>
        </ul>
        <p>
          We do not sell your personal information to any third party.
        </p>

        <h2>5. International Data Transfers</h2>
        <p>
          Your data is processed and stored in the United States by our third-party processors.
          These transfers are covered by standard contractual clauses and the processors&apos;
          own data protection commitments. By using Beep.Buzz you consent to this transfer.
        </p>

        <h2>6. Data Retention</h2>
        <ul>
          <li>
            <strong>Account and learning data:</strong> retained until you delete your account
          </li>
          <li>
            <strong>Match messages:</strong> retained for 90 days after the match ends, then deleted
          </li>
          <li>
            <strong>Contact messages:</strong> retained for 12 months, then deleted
          </li>
          <li>
            <strong>User reports:</strong> retained for as long as necessary to investigate and
            resolve the report
          </li>
        </ul>

        <h2>7. Cookies</h2>
        <p>
          Beep.Buzz uses a single functional cookie:
        </p>
        <ul>
          <li>
            <strong>sidebar_state</strong> — stores whether the sidebar is open or closed.
            Expires after 7 days. This cookie is strictly necessary for the interface to
            remember your preference and is not used for tracking or advertising.
          </li>
        </ul>
        <p>
          We do not use any advertising, analytics, or tracking cookies. For full details see
          our <a href="/cookies">Cookie Policy</a>.
        </p>

        <h2>8. Your Rights</h2>
        <p>
          If you are located in the European Economic Area or another jurisdiction with applicable
          privacy laws, you have the following rights regarding your personal data:
        </p>
        <ul>
          <li><strong>Access:</strong> request a copy of the data we hold about you</li>
          <li><strong>Rectification:</strong> request correction of inaccurate data</li>
          <li><strong>Erasure:</strong> request deletion of your personal data</li>
          <li>
            <strong>Portability:</strong> request your data in a structured, machine-readable format
          </li>
          <li>
            <strong>Restriction:</strong> request that we limit how we process your data
          </li>
          <li>
            <strong>Objection:</strong> object to processing based on legitimate interests
          </li>
          <li>
            <strong>Lodge a complaint:</strong> you have the right to lodge a complaint with your
            local data protection supervisory authority
          </li>
        </ul>
        <p>
          To exercise any of these rights, please submit a request via our{" "}
          <a href="/contact">contact form</a>. We will respond within 30 days.
        </p>

        <h2>9. Account Deletion</h2>
        <p>
          You can permanently delete your account and all associated data at any time from the{" "}
          <a href="/account/delete">account deletion page</a>. Deletion is irreversible.
          Your data will be removed within 30 days of your request. Match messages may be
          anonymised rather than deleted where required for service integrity.
        </p>

        <h2>10. Children&apos;s Privacy</h2>
        <p>
          Beep.Buzz is intended for users aged 16 and over. We do not knowingly collect
          personal information from anyone under 16. If you believe a person under 16 has
          provided us with their data, please contact us and we will delete it promptly.
        </p>

        <h2>11. Data Security</h2>
        <p>
          We use industry-standard security measures including encrypted connections (HTTPS),
          row-level security on our database, and authenticated API access. No method of
          transmission over the internet is 100% secure; we cannot guarantee absolute security.
        </p>

        <h2>12. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you of material
          changes by posting a prominent notice on the site or by email before changes take
          effect. Continued use of the service after the effective date constitutes acceptance
          of the updated policy.
        </p>

        <h2>13. Contact Us</h2>
        <p>
          For questions about this privacy policy or to submit a data rights request, please
          use our <a href="/contact">contact form</a>.
        </p>
      </div>
    </div>
  );
}
