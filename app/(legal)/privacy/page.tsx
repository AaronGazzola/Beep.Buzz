export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
        <h1>Privacy Policy</h1>

        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, including your email
          address when you create an account, and usage data such as training
          progress, practice sessions, and match results.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Track your learning progress and achievements</li>
          <li>Enable matchmaking in competitive mode</li>
          <li>Send you technical notices and support messages</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          We do not share your personal information with third parties except as
          described in this policy or with your consent.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We use industry-standard security measures to protect your information.
          However, no method of transmission over the Internet is 100% secure.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal
          information at any time through your account settings.
        </p>

        <h2>6. Children's Privacy</h2>
        <p>
          Our service is not directed to children under 13. We do not knowingly
          collect personal information from children under 13.
        </p>

        <h2>7. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify you
          of any changes by posting the new policy on this page.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have questions about this privacy policy, please contact us
          through our contact page.
        </p>
      </div>
    </div>
  );
}
