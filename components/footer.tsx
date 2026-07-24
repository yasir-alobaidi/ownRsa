import Link from "next/link";
import { BUSINESS } from "@/lib/services";
import { WrenchIcon } from "./icons";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <span className="logo-mark">
                <WrenchIcon />
              </span>
              <span className="logo-text">
                <span className="logo-line1">TEXAS</span>
                <span className="logo-line2">Roadside Assist</span>
              </span>
            </Link>
            <p>
              Fast, friendly roadside help, based in Dallas and serving the
              Metroplex — any time of day.
            </p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link href="/#services">Services</Link>
              </li>
              <li>
                <Link href="/#how-it-works">How It Works</Link>
              </li>
              <li>
                <Link href="/#service-area">Service Area</Link>
              </li>
              <li>
                <Link href="/request">Request Service</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li>
                <a href={`tel:${BUSINESS.phoneTel}`}>{BUSINESS.phoneDisplay}</a>
              </li>
              <li>
                <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
              </li>
              <li>Available 24/7</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 {BUSINESS.name}. All rights reserved.</p>
          <div className="footer-legal-links">
            <Link href="/terms/">Terms of Service</Link>
            <Link href="/privacy/">Privacy Policy</Link>
          </div>
          <p>{BUSINESS.domain}</p>
        </div>
      </div>
    </footer>
  );
}
