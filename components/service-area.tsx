import { CITIES } from "@/lib/services";

export function ServiceArea() {
  return (
    <section id="service-area">
      <div className="container area-grid">
        <div className="area-text">
          <p className="eyebrow">Service Area</p>
          <h2>Proudly Serving the Dallas Metroplex</h2>
          <p>
            Texas Roadside Assist is based right here in Dallas. Wherever you
            are in the Metroplex, help isn't far away — and as we grow,
            we're bringing the same fast, local service to more of Texas.
          </p>
          <ul className="city-list">
            {CITIES.map((city) => (
              <li className="city-chip" key={city}>
                {city}
              </li>
            ))}
          </ul>
          <p className="area-note">
            Don't see your city listed? Call us — there's a good
            chance we cover it too.
          </p>
        </div>
        <div className="area-visual">
          <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="150" cy="150" r="140" stroke="var(--border-subtle)" strokeWidth="1.5" strokeDasharray="4 7" />
            <circle cx="150" cy="150" r="100" stroke="var(--border-subtle)" strokeWidth="1.5" strokeDasharray="4 7" />
            <circle cx="150" cy="150" r="60" stroke="var(--border-subtle)" strokeWidth="1.5" strokeDasharray="4 7" />
            <circle className="ping" cx="150" cy="150" r="9" fill="#FF6A2C" />
            <circle cx="150" cy="150" r="9" fill="#C7440F" />
            <text
              x="150"
              y="186"
              textAnchor="middle"
              fontFamily="var(--font-head)"
              fontSize="15"
              fontWeight="700"
              fill="var(--text-primary)"
              letterSpacing="1"
            >
              DALLAS
            </text>
            <text x="150" y="20" textAnchor="middle" fontFamily="var(--font-body)" fontSize="12" fill="var(--text-muted)">
              DALLAS METROPLEX
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
