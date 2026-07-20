const STEPS = [
  {
    title: "Call or Request Online",
    body: "Tell us your location and what's going on \u2014 it takes less than a minute.",
  },
  {
    title: "We Dispatch the Nearest Driver",
    body: "A local technician heads straight to you, wherever you are in the Metroplex.",
  },
  {
    title: "Back on the Road",
    body: "We resolve the issue on the spot or tow you exactly where you need to go.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="alt">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">How It Works</p>
          <h2>Back on the Road in Three Simple Steps</h2>
        </div>
        <div className="steps">
          {STEPS.map((step, i) => (
            <div className="step" key={step.title}>
              <div className="step-num">{i + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
