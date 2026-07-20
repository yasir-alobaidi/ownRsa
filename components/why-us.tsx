import { LightningIcon, TagIcon, ShieldCheckIcon, HeartIcon } from "./icons";

const REASONS = [
  {
    icon: LightningIcon,
    title: "Fast Local Response",
    body: "Our drivers are stationed across the Metroplex \u2014 not routed through an out-of-state call center.",
  },
  {
    icon: TagIcon,
    title: "Upfront Pricing",
    body: "You'll know the cost before we ever hook up your vehicle. No surprise fees.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Licensed & Insured",
    body: "Fully licensed and insured for towing and roadside operations in the state of Texas.",
  },
  {
    icon: HeartIcon,
    title: "Friendly, No-Judgment Help",
    body: "Car trouble is stressful enough. Our team is here to help \u2014 not to make you feel bad about it.",
  },
];

export function WhyUs() {
  return (
    <section className="alt">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Why Texas Roadside Assist</p>
          <h2>Help You Can Actually Count On</h2>
        </div>
        <div className="why-grid">
          {REASONS.map((r) => (
            <div className="why-item" key={r.title}>
              <div className="why-icon">
                <r.icon />
              </div>
              <div>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
