import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { RequestForm } from "@/components/request-form";
import { ChevronLeftIcon } from "@/components/icons";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Request Service",
  description:
    "Tell us what you need and where you are. A Texas Roadside Assist dispatcher will call you back to confirm the details.",
  alternates: {
    canonical: "/request/",
  },
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", path: "/" },
  { name: "Request Service", path: "/request/" },
]);

export default function RequestPage() {
  return (
    <div className="request-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="request-shell">
        <Link href="/" className="request-back">
          <ChevronLeftIcon />
          Back to home
        </Link>
        <div className="request-head">
          <h1>Request Roadside Service</h1>
          <p>Takes about a minute. We'll call you to confirm the details.</p>
        </div>
        {/* useSearchParams (for ?service= prefill) requires a Suspense boundary in a static export */}
        <Suspense fallback={null}>
          <RequestForm />
        </Suspense>
      </div>
    </div>
  );
}
