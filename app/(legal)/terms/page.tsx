export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
        <h1>Terms of Service</h1>

        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Beep.Buzz, you accept and agree to be bound by
          the terms and provision of this agreement.
        </p>

        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily access the materials on Beep.Buzz
          for personal, non-commercial transitory viewing only.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account
          and password. You agree to accept responsibility for all activities that
          occur under your account.
        </p>

        <h2>4. Prohibited Uses</h2>
        <p>
          You may not use Beep.Buzz for any illegal or unauthorized purpose. You
          must not violate any laws in your jurisdiction when using our service.
        </p>

        <h2>5. Modifications</h2>
        <p>
          Beep.Buzz reserves the right to modify or replace these Terms at any
          time. It is your responsibility to check these Terms periodically for
          changes.
        </p>

        <h2>6. Contact</h2>
        <p>
          If you have any questions about these Terms, please contact us through
          our contact page.
        </p>
      </div>
    </div>
  );
}
