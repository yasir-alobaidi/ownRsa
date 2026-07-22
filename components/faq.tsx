import { FAQS } from "@/lib/faq";
import { faqSchema } from "@/lib/schema";

export function Faq() {
  return (
    <section id="faq">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Questions</p>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
      {/* Same Q&A the user sees, restated as structured data for search/AI answer engines. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(FAQS)) }}
      />
    </section>
  );
}
