export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
        <h1>Cookie Policy</h1>

        <p>Last updated: February 17, 2026</p>

        <h2>What is a cookie?</h2>
        <p>
          A cookie is a small text file stored on your device by your browser when you
          visit a website. Cookies are used for a variety of purposes including remembering
          your preferences and keeping you signed in.
        </p>

        <h2>Cookies we use</h2>
        <p>
          Beep.Buzz uses <strong>one cookie</strong>:
        </p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Purpose</th>
              <th>Expiry</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>sidebar_state</code></td>
              <td>Stores whether the sidebar is open or closed</td>
              <td>7 days</td>
              <td>Functional</td>
            </tr>
          </tbody>
        </table>
        <p>
          This cookie is <strong>strictly functional</strong>. It never leaves your browser to
          be shared with third parties and is not used for advertising, analytics, or tracking
          of any kind.
        </p>

        <h2>Cookies we do NOT use</h2>
        <p>
          Beep.Buzz does not use:
        </p>
        <ul>
          <li>Advertising or targeting cookies</li>
          <li>Analytics cookies (e.g. Google Analytics)</li>
          <li>Social media tracking cookies</li>
          <li>Any third-party cookies</li>
        </ul>

        <h2>How to manage or disable cookies</h2>
        <p>
          You can control or delete cookies through your browser settings. Instructions
          for common browsers:
        </p>
        <ul>
          <li>
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
              Google Chrome
            </a>
          </li>
          <li>
            <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a href="https://support.apple.com/en-au/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
              Safari
            </a>
          </li>
          <li>
            <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
              Microsoft Edge
            </a>
          </li>
        </ul>
        <p>
          Disabling the <code>sidebar_state</code> cookie will not prevent you from using
          Beep.Buzz — the sidebar will simply revert to its default position on each visit.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If we introduce new cookies we will update this policy and the &quot;last updated&quot;
          date above before they are set.
        </p>

        <h2>Contact</h2>
        <p>
          For questions about this cookie policy, please use our{" "}
          <a href="/contact">contact form</a>.
        </p>
      </div>
    </div>
  );
}
