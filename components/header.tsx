"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BUSINESS } from "@/lib/services";
import { WrenchIcon, PhoneIcon } from "./icons";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#service-area", label: "Service Area" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <div className="header-inner container">
        <Link href="/" className="logo" aria-label={`${BUSINESS.name} home`}>
          <span className="logo-mark">
            <WrenchIcon />
          </span>
          <span className="logo-text">
            <span className="logo-line1">TEXAS</span>
            <span className="logo-line2">Roadside Assist</span>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <a href={`tel:${BUSINESS.phoneTel}`} className="btn btn-primary header-call">
            <PhoneIcon />
            {BUSINESS.phoneDisplay}
          </a>
          <button
            type="button"
            className={`nav-toggle${menuOpen ? " active" : ""}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="bar bar1" />
            <span className="bar bar2" />
            <span className="bar bar3" />
          </button>
        </div>
      </div>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`} id="mobileMenu">
        <div className="mobile-menu-inner">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a href={`tel:${BUSINESS.phoneTel}`} className="btn btn-primary btn-block">
            <PhoneIcon />
            Call {BUSINESS.phoneDisplay}
          </a>
        </div>
      </div>
    </header>
  );
}
