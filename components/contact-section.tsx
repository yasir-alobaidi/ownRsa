import Link from "next/link";
import { BUSINESS, SERVICES } from "@/lib/services";
import { PhoneIcon, EnvelopeIcon, ClockIcon, PinIcon, ChevronRightIcon } from "./icons";

export function ContactSection() {
  return (
    <section id="contact" className="contact-cta">
      <div className="container contact-inner">
        <div className="contact-info">
          <p className="eyebrow">Get Help Now</p>
          <h2>Need Help Right Now?</h2>
          <p>Don't wait it out on the shoulder. Call now and we'll have someone headed your way.</p>
          <a href={`tel:${BUSINESS.phoneTel}`} className="btn btn-primary btn-lg">
            <PhoneIcon />
            Call {BUSINESS.phoneDisplay}
          </a>
          <ul className="contact-details">
            <li>
              <span className="ci-icon">
                <PhoneIcon />
              </span>
              <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phoneDisplay}</a>
            </li>
            <li>
              <span className="ci-icon">
                <EnvelopeIcon />
              </span>
              <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
            </li>
            <li>
              <span className="ci-icon">
                <ClockIcon />
              </span>
              Available 24 hours a day, 7 days a week
            </li>
            <li>
              <span className="ci-icon">
                <PinIcon />
              </span>
              Serving the Dallas–Fort Worth Metroplex
            </li>
          </ul>
        </div>

        <div className="request-panel">
          <h3>Prefer not to call? Request online.</h3>
          <p>
            Tell us what you need and where you are, and a dispatcher will call
            you back to confirm the details — usually within minutes.
          </p>
          <ul className="service-tags">
            {SERVICES.map((s) => (
              <li key={s.id}>{s.name}</li>
            ))}
          </ul>
          <Link href="/request" className="btn btn-primary btn-block">
            Start a Request
            <ChevronRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
