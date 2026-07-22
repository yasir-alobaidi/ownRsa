import type { Metadata } from "next";
import { BUSINESS } from "@/lib/services";
import { breadcrumbSchema } from "@/lib/schema";

// Starting-point legal content, not a substitute for review by a Texas-
// licensed attorney -- kept scoped to exactly what this site actually does
// (form fields collected, opt-in GPS, Twilio as SMS processor, no database,
// no analytics) rather than generic template boilerplate. Update
// LAST_UPDATED whenever the actual content below changes, or whenever what
// the site collects/shares changes (e.g. if analytics is ever added).
const LAST_UPDATED = "July 22, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Texas Roadside Assist.",
  alternates: { canonical: "/privacy/" },
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Privacy Policy", path: "/privacy/" },
]);

export default function PrivacyPage() {
  return (
    <div className="legal-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="container legal-content">
        <p className="eyebrow">Legal</p>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: {LAST_UPDATED}</p>

        <p>
          This Privacy Policy explains what information {BUSINESS.name} (&quot;we,&quot;
          &quot;us,&quot; &quot;our&quot;) collects through this website, how we use it, and the
          choices you have.
        </p>

        <h2>Information We Collect</h2>
        <p>
          <strong>Information you provide.</strong> When you use our Request Service form, you
          may provide: your name, phone number, email address (optional), your location (typed
          address or GPS coordinates), notes about your vehicle or situation, and the services
          you need. When you call us, we collect whatever information you choose to share over
          the phone.
        </p>
        <p>
          <strong>Location information.</strong> If you tap &quot;Use my current GPS
          location,&quot; your browser will ask permission before sharing your device&apos;s
          location with us. We use this only to help our dispatcher find you and to generate a
          Google Maps link for the responding technician. You can decline and type your location
          instead.
        </p>
        <p>
          <strong>Automatically collected information.</strong> This site stores one preference
          -- whether you&apos;re using light or dark mode -- in your browser&apos;s local
          storage. It contains no personal information and isn&apos;t used for tracking. We do
          not currently use analytics or advertising cookies on this site.
        </p>

        <h2>How We Use Information</h2>
        <p>We use the information you provide to:</p>
        <ul>
          <li>Dispatch a technician to your location</li>
          <li>Have a dispatcher call you back to confirm details and coordinate service</li>
          <li>Communicate with you about the service you requested</li>
        </ul>
        <p>We do not use your information for marketing, and we do not sell your personal information.</p>

        <h2>How Information Is Shared</h2>
        <ul>
          <li>
            <strong>With our dispatch team and technicians</strong>, so they can respond to your
            request.
          </li>
          <li>
            <strong>With Twilio</strong>, the service we use to send your request details to our
            dispatcher by text message. Twilio processes this information on our behalf and does
            not use it for its own purposes.
          </li>
          <li>We may disclose information if required by law, or to protect the safety of our customers, technicians, or the public.</li>
          <li>We do not sell personal information to third parties.</li>
        </ul>

        <h2>Data Retention</h2>
        <p>
          Request details are used to coordinate service and are not stored in a database on
          this website. Message logs may be retained by Twilio in line with their own retention
          practices.
        </p>

        <h2>Your Choices</h2>
        <ul>
          <li>You can provide a typed address instead of your GPS location.</li>
          <li>Email is optional.</li>
          <li>You can contact us to ask what information we have about you or to request it be deleted, using the contact details below.</li>
        </ul>

        <h2>Children&apos;s Privacy</h2>
        <p>
          Our services are intended for adults arranging roadside assistance and are not
          directed at children. We do not knowingly collect information from children.
        </p>

        <h2>Security</h2>
        <p>
          We take reasonable steps to protect information submitted through our website. No
          method of transmission over the internet is completely secure, and we cannot guarantee
          absolute security.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date
          above reflects the most recent revision.
        </p>

        <h2>Contact Us</h2>
        <p>
          Questions about this Privacy Policy, or want to ask about or delete your information?
          Call <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phoneDisplay}</a> or email{" "}
          <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
        </p>
      </div>
    </div>
  );
}
