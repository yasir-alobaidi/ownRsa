import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { StatsBar } from "@/components/stats-bar";
import { Services } from "@/components/services";
import { HowItWorks } from "@/components/how-it-works";
import { ServiceArea } from "@/components/service-area";
import { WhyUs } from "@/components/why-us";
import { ContactSection } from "@/components/contact-section";

export const metadata: Metadata = {
  title: "Texas Roadside Assist | 24/7 Roadside Assistance in Dallas, TX",
  description:
    "Texas Roadside Assist provides fast, reliable 24/7 roadside assistance across the Dallas-Fort Worth Metroplex -- towing, jump-starts, flat tire changes, lockouts, fuel delivery, and recovery.",
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
      <ContactSection />
    </>
  );
}
