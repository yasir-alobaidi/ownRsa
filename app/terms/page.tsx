import type { Metadata } from "next";
import { BUSINESS } from "@/lib/services";
import { breadcrumbSchema } from "@/lib/schema";

// Starting-point legal content, not a substitute for review by a Texas-
// licensed attorney -- towing/roadside operators have real regulatory
// exposure (e.g. TDLR licensing) that's worth confirming before relying on
// this. Update LAST_UPDATED whenever the actual content below changes.
const LAST_UPDATED = "July 22, 2026";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Texas Roadside Assist.",
  alternates: { canonical: "/terms/" },
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Terms of Service", path: "/terms/" },
]);

export default function TermsPage() {
  return (
    <div className="legal-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="container legal-content">
        <p className="eyebrow">Legal</p>
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: {LAST_UPDATED}</p>

        <p>
          Welcome to {BUSINESS.name} (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;). These Terms of
          Service (&quot;Terms&quot;) govern your use of our website and the roadside assistance
          services we arrange or provide across the Dallas-Fort Worth Metroplex. By using our
          website, calling us, or requesting service, you agree to these Terms.
        </p>
        <p>
          <strong>
            If you are experiencing a life-threatening emergency, call 911 first.
          </strong>{" "}
          {BUSINESS.name} provides roadside assistance -- towing, battery service, tire changes,
          fuel delivery, lockouts, and recovery -- not emergency medical or fire response.
        </p>

        <h2>Our Services</h2>
        <p>
          {BUSINESS.name} arranges roadside assistance including towing, battery change or
          jump-start, tire change, flat tire repair, fuel delivery, wheel lock removal, lockout
          service, and winching &amp; recovery, across Dallas, Fort Worth, and the surrounding
          Metroplex cities listed on our Service Area section. We aim to be available 24 hours a
          day, 7 days a week.
        </p>

        <h2>Requesting Service</h2>
        <p>
          You can request service by phone or through our online Request Service form. Please
          provide accurate information about your location, vehicle, and situation --
          inaccurate information can delay a technician reaching you. After an online request, a
          dispatcher will call you back at the phone number you provide to confirm details before
          a technician is sent.
        </p>

        <h2>Response Times &amp; Availability</h2>
        <p>
          Response times we advertise (such as average arrival time) are estimates based on
          typical conditions, not guarantees. Actual arrival time can be affected by weather,
          traffic, road conditions, technician availability, and demand. We reserve the right to
          decline a request, including if a location is outside our service area or if we
          reasonably believe a situation is unsafe for our technicians.
        </p>

        <h2>Pricing &amp; Payment</h2>
        <p>
          We provide pricing information before beginning work whenever possible. Final payment
          is arranged directly between you and the technician who responds to your request, at
          the time of service.
        </p>

        <h2>Your Responsibilities</h2>
        <p>When requesting service, you agree to:</p>
        <ul>
          <li>Provide accurate contact information, location, and vehicle details</li>
          <li>Confirm that you own the vehicle or are authorized to request service for it</li>
          <li>Wait in a safe location, away from moving traffic where possible, until help arrives</li>
        </ul>

        <h2>Licensing &amp; Insurance</h2>
        <p>
          {BUSINESS.name} is licensed and insured for towing and roadside operations in the State
          of Texas.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by Texas law, {BUSINESS.name} is not liable for
          indirect, incidental, or consequential damages arising from the use of our website or
          services. Nothing in these Terms limits any liability that cannot be limited under
          applicable law.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. The &quot;Last updated&quot; date above
          reflects the most recent revision. Continued use of our website or services after
          changes take effect means you accept the updated Terms.
        </p>

        <h2>Governing Law</h2>
        <p>These Terms are governed by the laws of the State of Texas.</p>

        <h2>Contact Us</h2>
        <p>
          Questions about these Terms? Call{" "}
          <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phoneDisplay}</a> or email{" "}
          <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>.
        </p>
      </div>
    </div>
  );
}
