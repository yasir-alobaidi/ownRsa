import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { Services } from "@/components/services";
import { HowItWorks } from "@/components/how-it-works";
import { ServiceArea } from "@/components/service-area";
import { WhyUs } from "@/components/why-us";
import { Faq } from "@/components/faq";
import { ContactSection } from "@/components/contact-section";

export const metadata: Metadata = {
  title: "Texas Roadside Assist | 24/7 Roadside Assistance in Dallas, TX",
  description:
    "Texas Roadside Assist provides fast, reliable 24/7 roadside assistance across the Dallas Metroplex — towing, battery service, tire changes, flat tire repair, fuel delivery, wheel lock removal, lockouts, and recovery.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <Services />
      <HowItWorks />
      <ServiceArea />
      <WhyUs />
      <Faq />
      <ContactSection />
    </>
  );
}
