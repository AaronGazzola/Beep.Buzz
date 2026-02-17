export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
        <h1>Terms of Service</h1>

        <p>Last updated: February 17, 2026</p>

        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of Beep.Buzz. By accessing or
          using the service you agree to be bound by these Terms. If you do not agree,
          do not use the service.
        </p>

        <h2>1. Acceptance of Terms and Age Requirement</h2>
        <p>
          You must be at least 16 years of age to use Beep.Buzz. By creating an account
          you confirm that you are 16 or older. If you are under 16, do not create an
          account or use the service.
        </p>

        <h2>2. Account Responsibilities</h2>
        <p>
          You are responsible for:
        </p>
        <ul>
          <li>Providing accurate information when creating your account</li>
          <li>Maintaining the confidentiality of your login credentials</li>
          <li>All activity that occurs under your account</li>
          <li>
            Notifying us immediately via the <a href="/contact">contact form</a> if you
            become aware of any unauthorised use of your account
          </li>
        </ul>

        <h2>3. User-Generated Content</h2>
        <p>
          You retain ownership of the morse code messages you send. By using the chat
          features you grant us a limited, non-exclusive licence to store and display your
          messages solely for the purpose of delivering the service.
        </p>
        <p>
          You are solely responsible for all content you send. The following content is
          prohibited:
        </p>
        <ul>
          <li>Illegal content of any kind</li>
          <li>Harassment, threats, or abuse directed at other users</li>
          <li>Spam or unsolicited repetitive messages</li>
          <li>Content that impersonates another person</li>
          <li>Any content that violates the rights of others</li>
        </ul>
        <p>
          You may report users who violate these Terms using the report button in the
          chat interface. We review all reports and may take action including account
          suspension or termination.
        </p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use automated tools or bots to interact with the service</li>
          <li>Attempt to circumvent any security or access controls</li>
          <li>Interfere with the operation of the service or other users&apos; access to it</li>
          <li>Attempt to reverse-engineer or copy proprietary aspects of the service</li>
          <li>Use the service for any commercial purpose without our written consent</li>
        </ul>

        <h2>5. Intellectual Property</h2>
        <p>
          The Beep.Buzz name, logo, and original content (including the Beep and Buzz
          characters and all original UI elements) are owned by the operator and protected
          by applicable intellectual property laws. Morse code itself is in the public domain.
          The source code for Beep.Buzz is open source — see the{" "}
          <a href="https://github.com/AaronGazzola/Beep.Buzz" target="_blank" rel="noopener noreferrer">
            GitHub repository
          </a>{" "}
          for licence details.
        </p>

        <h2>6. Disclaimer of Warranties</h2>
        <p>
          The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
          either express or implied, including but not limited to implied warranties of
          merchantability, fitness for a particular purpose, or non-infringement. We do
          not warrant that the service will be uninterrupted, error-free, or free of
          harmful components.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, the operator shall not be liable
          for any indirect, incidental, special, consequential, or punitive damages arising
          from your use of or inability to use the service, even if we have been advised of
          the possibility of such damages. Our total liability to you for any claim arising
          from these Terms or the service shall not exceed the amount you paid us in the
          12 months preceding the claim (or AUD $10 if you have paid nothing).
        </p>

        <h2>8. Account Termination</h2>
        <p>
          We may suspend or permanently terminate your account at any time if we reasonably
          believe you have violated these Terms, without notice and without liability to you.
        </p>
        <p>
          You may permanently delete your account at any time via the{" "}
          <a href="/account/delete">account deletion page</a>. Deletion is irreversible.
        </p>

        <h2>9. Beta Service</h2>
        <p>
          Beep.Buzz is currently in beta. The service may change significantly, data may
          be wiped periodically, and features may be added or removed without notice. We
          make no commitment to maintaining the service in its current form.
        </p>

        <h2>10. Modifications to These Terms</h2>
        <p>
          We may update these Terms at any time. We will notify you of material changes by
          posting a prominent notice on the site at least 30 days before the changes take
          effect. Continued use of the service after the effective date constitutes
          acceptance of the updated Terms.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms are governed by the laws of Victoria, Australia. Any disputes arising
          from or relating to these Terms or the service shall be subject to the exclusive
          jurisdiction of the courts of Victoria, Australia.
        </p>

        <h2>12. Contact</h2>
        <p>
          If you have any questions about these Terms, please contact us via our{" "}
          <a href="/contact">contact form</a>.
        </p>
      </div>
    </div>
  );
}
