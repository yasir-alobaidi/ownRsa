import { BUSINESS, CITIES, SERVICES, type ServiceDef } from "./services";

export const SITE_URL = "https://texasroadsideassist.com";

// Site-wide business facts, injected once in the root layout. Deliberately
// omits `address` (this is a mobile service area business with no public
// storefront -- Google's own structured-data guidance treats that as valid
// for LocalBusiness when `areaServed` is present) and omits `aggregateRating`
// / `review` and `priceRange` (no real review data or published pricing to
// report -- fabricating either would be misleading structured data).
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "AutomotiveBusiness"],
  "@id": `${SITE_URL}/#business`,
  name: BUSINESS.name,
  url: SITE_URL,
  telephone: BUSINESS.phoneTel,
  email: BUSINESS.email,
  description:
    "24/7 roadside assistance across the Dallas-Fort Worth Metroplex: towing, battery jump-starts, tire changes, flat tire repair, fuel delivery, wheel lock removal, lockouts, and winching.",
  areaServed: CITIES.map((city) => ({ "@type": "City", name: city })),
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "00:00",
    closes: "23:59",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Roadside Assistance Services",
    itemListElement: SERVICES.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.description,
      },
    })),
  },
};

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function serviceSchema(service: ServiceDef) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.name,
    name: service.name,
    description: service.description,
    provider: { "@id": `${SITE_URL}/#business` },
    areaServed: CITIES.map((city) => ({ "@type": "City", name: city })),
    url: `${SITE_URL}/services/${service.id}/`,
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
