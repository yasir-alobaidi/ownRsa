import { SERVICES } from "@/lib/services";
import { SERVICE_ICONS } from "./icons";

export function Services() {
  return (
    <section id="services">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">What We Do</p>
          <h2>Roadside Help for Every Situation</h2>
          <p>
            From a dead battery to a full tow, our local drivers handle it all
            — quickly, safely, and without the runaround.
          </p>
        </div>
        <div className="services-grid">
          {SERVICES.map((service) => {
            const Icon = SERVICE_ICONS[service.id];
            return (
              <div className="service-card" key={service.id}>
                <div className="service-icon">
                  <Icon />
                </div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
