import { BUSINESS } from "@/lib/services";
import { PhoneIcon } from "./icons";

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-inner">
        <p className="eyebrow">24/7 Emergency Roadside Assistance</p>
        <h1>
          Stuck on the side of the road?
          <span className="accent">We've got Dallas covered.</span>
        </h1>
        <p className="hero-sub">
          Flat tire, dead battery, lockout, or you just need a tow — one call
          gets a local driver headed your way, day or night.
        </p>
        <div className="hero-ctas">
          <a href={`tel:${BUSINESS.phoneTel}`} className="btn btn-primary btn-lg">
            <PhoneIcon />
            Call Now — {BUSINESS.phoneDisplay}
          </a>
          <button type="button" className="btn btn-outline btn-lg" disabled>
            Request Service Online
            <span className="badge-soon">Coming Soon</span>
          </button>
        </div>
        <ul className="hero-badges">
          <li>Average 30-Minute Arrival</li>
          <li>Open 24/7, 365 Days</li>
          <li>Licensed & Insured</li>
        </ul>
      </div>

      <div className="hero-skyline" aria-hidden="true">
        <svg viewBox="0 0 1440 260" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <g fill="var(--hero-skyline-fill)">
            <rect x="0" y="125" width="70" height="45" />
            <rect x="70" y="95" width="55" height="75" />
            <rect x="125" y="130" width="65" height="40" />
            <rect x="190" y="110" width="50" height="60" />
            <rect x="355" y="105" width="60" height="65" />
            <rect x="415" y="90" width="50" height="80" />
            <rect x="465" y="115" width="65" height="55" />
            <rect x="530" y="80" width="55" height="90" />
            <rect x="585" y="130" width="70" height="40" />
            <rect x="655" y="100" width="50" height="70" />
            <rect x="705" y="120" width="65" height="50" />
            <rect x="770" y="85" width="55" height="85" />
            <rect x="825" y="125" width="70" height="45" />
            <rect x="895" y="105" width="50" height="65" />
            <rect x="945" y="75" width="60" height="95" />
            <rect x="1005" y="120" width="65" height="50" />
            <rect x="1070" y="100" width="55" height="70" />
            <rect x="1125" y="130" width="70" height="40" />
            <rect x="1195" y="90" width="50" height="80" />
            <rect x="1245" y="115" width="65" height="55" />
            <rect x="1310" y="105" width="70" height="65" />
            <rect x="1380" y="125" width="60" height="45" />
          </g>
          <rect x="273" y="25" width="4" height="45" fill="var(--hero-skyline-fill)" />
          <rect x="240" y="70" width="70" height="100" fill="var(--hero-skyline-fill)" />
          <circle cx="275" cy="20" r="13" fill="var(--hero-base)" stroke="var(--signal-500)" strokeWidth="2.2" />
          <line x1="264" y1="14" x2="286" y2="26" stroke="var(--signal-500)" strokeWidth="1" />
          <line x1="264" y1="26" x2="286" y2="14" stroke="var(--signal-500)" strokeWidth="1" />
          <line x1="262" y1="20" x2="288" y2="20" stroke="var(--signal-500)" strokeWidth="1" />
          <rect x="0" y="170" width="1440" height="90" fill="var(--hero-road-fill)" />
          <line
            x1="0"
            y1="215"
            x2="1440"
            y2="215"
            stroke="var(--caution-400)"
            strokeWidth="4"
            strokeDasharray="42 30"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </section>
  );
}
