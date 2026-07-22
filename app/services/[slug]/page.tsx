import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BUSINESS, CITIES, SERVICES, type ServiceId } from "@/lib/services";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";
import { SERVICE_ICONS, PhoneIcon } from "@/components/icons";

// Longer, page-specific copy -- distinct from the one-line descriptions used
// on the homepage cards/checkboxes, so this page has real unique content
// rather than just repeating the summary at length.
const SERVICE_DETAILS: Record<ServiceId, string> = {
  towing:
    "When your car won't start, isn't safe to drive, or just needs to get somewhere specific -- a dealership, a trusted shop, or home -- we provide light and medium-duty towing anywhere in the Dallas-Fort Worth Metroplex. Tell us where you are and where the vehicle needs to go, and a local driver will get it there safely.",
  "battery-jump":
    "A dead battery is one of the most common roadside calls we get. In most cases a jump-start gets your engine running again in minutes. If the battery itself is the problem, we carry replacements and can swap it on the spot, right where you're parked.",
  "tire-change":
    "Got a flat and a spare (or a used tire) ready to go? We'll swap it in on the shoulder, in a parking lot, or wherever you've stopped, so you can get back on the road without waiting on a shop appointment.",
  "flat-tire-fix":
    "Not every flat needs a full tire swap. If the damage is fixable, we can patch or repair it on the spot -- faster and cheaper than a full tire change when a patch will hold.",
  "fuel-delivery":
    "Ran out of gas on the highway or in an unfamiliar part of town? We'll bring enough fuel to get you safely to the nearest station -- no need to walk or wait for a ride.",
  "wheel-lock":
    "Lost the key to your wheel locks (the anti-theft lug nuts some vehicles use)? We carry the tools to remove them safely without damaging your wheels, so a tire change or repair isn't held up by a missing key.",
  lockout:
    "Keys locked inside your car? Our technicians can get you back in fast, using techniques that don't damage your vehicle's doors or locks.",
  winching:
    "Stuck in mud, a ditch, snow, or a tight spot you can't reverse out of? We'll winch or pull your vehicle free safely, without causing further damage.",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.id === slug);
  if (!service) return {};

  const title = `${service.name} in Dallas-Fort Worth`;
  const description = `${service.description} Available 24/7 across the Dallas-Fort Worth Metroplex -- call now or request service online.`;

  return {
    title,
    description,
    alternates: { canonical: `/services/${service.id}/` },
    openGraph: { title, description },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.id === slug);
  if (!service) notFound();

  const Icon = SERVICE_ICONS[service.id];
  const otherServices = SERVICES.filter((s) => s.id !== service.id);
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: service.name, path: `/services/${service.id}/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema(service)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <section className="service-detail-hero">
        <div className="container">
          <p className="eyebrow">Roadside Service</p>
          <div className="service-detail-icon">
            <Icon />
          </div>
          <h1>
            {service.name} in <span className="accent">Dallas-Fort Worth</span>
          </h1>
          <p className="service-detail-lead">{SERVICE_DETAILS[service.id]}</p>
          <div className="hero-ctas">
            <a href={`tel:${BUSINESS.phoneTel}`} className="btn btn-primary btn-lg">
              <PhoneIcon />
              Call Now — {BUSINESS.phoneDisplay}
            </a>
            <button type="button" className="btn btn-outline btn-lg" disabled>
              Request This Service
              <span className="badge-soon">Coming Soon</span>
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Service Area</p>
            <h2>Serving the Whole Metroplex</h2>
          </div>
          <ul className="city-list">
            {CITIES.map((city) => (
              <li className="city-chip" key={city}>
                {city}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="alt">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Also Available</p>
            <h2>Other Ways We Can Help</h2>
          </div>
          <div className="services-grid">
            {otherServices.map((s) => {
              const OtherIcon = SERVICE_ICONS[s.id];
              return (
                <Link className="service-card" href={`/services/${s.id}/`} key={s.id}>
                  <div className="service-icon">
                    <OtherIcon />
                  </div>
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
