import type { Metadata } from "next";
import Link from "next/link";
import { RequestForm } from "@/components/request-form";
import { ChevronLeftIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Request Service",
  description:
    "Tell us what you need and where you are. A Texas Roadside Assist dispatcher will call you back to confirm the details.",
};

export default function RequestPage() {
  return (
    <div className="request-page">
      <div className="request-shell">
        <Link href="/" className="request-back">
          <ChevronLeftIcon />
          Back to home
        </Link>
        <div className="request-head">
          <h1>Request Roadside Service</h1>
          <p>Takes about a minute. We'll call you to confirm the details.</p>
        </div>
        <RequestForm />
      </div>
    </div>
  );
}
