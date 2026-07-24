export interface FaqItem {
  question: string;
  answer: string;
}

// Every answer here is a direct restatement of a claim already made
// elsewhere on the site (stats-bar, why-us, service-area, services) -- kept
// that way deliberately so structured data never asserts something the page
// itself doesn't already back up.
export const FAQS: FaqItem[] = [
  {
    question: "What areas does Texas Roadside Assist cover?",
    answer:
      "We're based in Dallas and serve the greater Dallas Metroplex, including Arlington, Plano, Irving, Garland, Mesquite, Grand Prairie, Richardson, and Carrollton. Just outside these cities? Call us -- there's a good chance we cover it too.",
  },
  {
    question: "How fast can you get to me?",
    answer:
      "Our average response time is under 30 minutes across the Metroplex, and we're available 24 hours a day, 7 days a week, including holidays.",
  },
  {
    question: "What roadside services do you offer?",
    answer:
      "Towing, battery change or jump-start, tire change (spare or used tire), flat tire repair, fuel delivery, wheel lock removal, lockout service, and winching & recovery.",
  },
  {
    question: "Do you offer upfront pricing?",
    answer: "Yes -- you'll know the cost before we ever hook up your vehicle. No surprise fees.",
  },
  {
    question: "What if I don't have a spare tire?",
    answer:
      "No problem. We carry tires and can swap in a used one on the spot, or patch a fixable flat without a full swap.",
  },
  {
    question: "Can you help if I'm locked out or lost my wheel lock key?",
    answer:
      "Yes to both. We handle standard lockouts (keys locked inside, no damage to your vehicle) and wheel lock / lug nut lock removal when the key is lost.",
  },
  {
    question: "Is Texas Roadside Assist licensed and insured?",
    answer: "Yes -- we're fully licensed and insured for towing and roadside operations in the state of Texas.",
  },
  {
    question: "How do I request help?",
    answer:
      "Call us anytime, or use the Request Service form online. Tell us what's wrong and where you are, and a dispatcher will call you back to confirm the details -- usually within minutes.",
  },
];
