import { CITIES } from "@/lib/services";

const STATS = [
  { num: "<30 Min", label: "Average Response Time" },
  { num: "24/7/365", label: "Always Available" },
  { num: "100%", label: "Licensed & Insured" },
  { num: `${CITIES.length} Cities`, label: "Across the DFW Metroplex" },
];

export function StatsBar() {
  return (
    <section className="stats-bar">
      <div className="container stats-grid">
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
