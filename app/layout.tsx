import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileCallBar } from "@/components/mobile-call-bar";
import { organizationSchema, SITE_URL } from "@/lib/schema";
import "./globals.css";

// Self-hosted at build time (no runtime request to fonts.googleapis.com),
// exposed as the same --font-body / --font-head variables globals.css
// already keys off of everywhere.
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-head",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Texas Roadside Assist | 24/7 Roadside Assistance in Dallas, TX",
    template: "%s | Texas Roadside Assist",
  },
  description:
    "Fast, friendly 24/7 roadside assistance across the Dallas-Fort Worth Metroplex — towing, battery jump-starts, tire changes, flat tire repair, fuel delivery, wheel lock removal, lockouts, and recovery.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Texas Roadside Assist | 24/7 Roadside Assistance in Dallas, TX",
    description: "Fast, friendly roadside help across the Dallas-Fort Worth Metroplex, available 24/7.",
    type: "website",
    url: SITE_URL,
    siteName: "Texas Roadside Assist",
  },
  twitter: {
    card: "summary_large_image",
    title: "Texas Roadside Assist | 24/7 Roadside Assistance in Dallas, TX",
    description: "Fast, friendly roadside help across the Dallas-Fort Worth Metroplex, available 24/7.",
  },
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%2314171F'/%3E%3Ccircle cx='32' cy='32' r='16' fill='none' stroke='%23FF6A2C' stroke-width='6'/%3E%3Ccircle cx='32' cy='32' r='5' fill='%23FF6A2C'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${barlow.variable} ${barlowCondensed.variable}`}
    >
      <head>
        {/* Static, developer-controlled data only (no user input) -- safe to inject directly. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <a className="skip-link" href="#main">
            Skip to main content
          </a>
          <div className="hazard-trim" aria-hidden="true" />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <MobileCallBar />
        </ThemeProvider>
      </body>
    </html>
  );
}
