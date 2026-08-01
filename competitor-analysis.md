# All Hours Roadside vs. Texas Roadside Assistance — Competitive Audit

They're not a small local competitor — they're a 7-metro, 496-page programmatic SEO operation with real reviews baked into search results. We're a well-built single-metro site that just closed its security gap. The good news: several of their advantages are things our own architecture already supports, we just haven't built them yet — and we beat them outright on a few fronts already.

Audited allhoursroadside.com directly (homepage, robots.txt, sitemap, llms.txt, JSON-LD) on Aug 1, 2026. Their prices/claims are self-published and unverified beyond that.

## Scoreboard

| | Us | Them |
|---|---|---|
| Indexed pages | ~20 | 496 |
| Metro markets | 1 (Dallas–Fort Worth) | 7 (DFW, Austin, Houston, San Antonio, Waco, Chicago, Denver) |
| On-site reviews | 0 | 4.9★ / 247 reviews |
| AI-bot allow rules in robots.txt | 4 | 13+ |

## Where we already win

Real, defensible advantages today — not things to build, things to keep and say louder.

- **We tow. They don't.** Their own FAQ and every city page state towing isn't offered. Anyone whose car genuinely needs a shop — not just a jump or a tire — has to go elsewhere. We already cover that end of the job.

- **Cheaper on the services that overlap.** Comparing their published starting rates to our (not-yet-live) pricing: jump start $55 vs their $60–75, battery replacement $229 vs their $249–289, tire repair $65 vs their $75 labor. We also don't add their $19 flat dispatch fee on top of every call. Worth deciding on purpose: keep the no-dispatch-fee simplicity as a marketing line ("no hidden fees"), or add one — but that's a pricing call, not an SEO one.

- **HTTPS + HSTS: now at parity.** They already had this; we just fixed it this week (port 80 now redirects, HSTS is set). No longer a gap — worth confirming since it was a real, live bug until recently.

- **Structured data we can actually stand behind.** Our JSON-LD has never claimed a review count, a founding year, or an address we can't back up. That's a real asset walking into the gaps below — every trust signal we add from here should stay real, which is exactly how this codebase already treats it.

## Where they're ahead — site & search

Ranked by how much it likely moves rankings/citations, with what to actually do about each.

### Real reviews, wired into structured data — *highest impact*
Their `AggregateRating` (4.9★, 247 reviews) is what lets Google show a star rating directly in the search result — one of the single biggest click-through levers in local search — and it's a strong trust signal for AI answer engines too.
**Do:** stand up a Google Business Profile and start collecting real reviews. Add `AggregateRating` to our schema only once real numbers exist — don't front-run this one.

### A full city × service page matrix — *highest effort*
Most of their 496 pages are individual "[service] in [suburb]" pages — separate pages for Arlington Jump Start, Arlington Battery Replacement, Arlington Lockout, and so on for every DFW suburb, plus neighborhood-level pages in Austin and airport-specific pages (DFW, Love Field). We have one page per service and a plain city list — zero dedicated location pages.
**Do:** this is their real structural advantage, not a quick fix. First step: dedicated landing pages for our top 8–10 served cities (Plano, Frisco, Arlington, Irving...), reusing the `CITIES`/`SERVICES` data already in `lib/services.ts` the same way `/services/[slug]/` already works. Full city×service matrix is a later, bigger phase.

### Pricing in the title tag and meta description — *cheap, high leverage*
Their title is literally *"24/7 Roadside Dallas-Fort Worth · Tire $65 · Jump $60"* — it puts price-conscious search intent right in the Google snippet before anyone even clicks.
**Do:** once our real pricing is live, rewrite `app/layout.tsx`'s title/description to lead with it — especially since we're often cheaper.

### Richer JSON-LD
They layer in `GeoCoordinates`/`GeoCircle` (precise service-radius targeting), `PriceSpecification`/`Offer` with real prices, and `SpeakableSpecification` (voice-assistant readback) — none of which we have.
**Do:** add real price data to our `Offer` schema now that it exists. Skip anything we'd have to fake, like a precision geo-radius we haven't actually measured.

### Narrower AI-crawler allowlist than theirs — *trivial fix*
Our `robots.ts` explicitly allows 4 AI bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended). They allow 13+, including OAI-SearchBot, ChatGPT-User, Claude-Web, anthropic-ai, Perplexity-User, Applebot-Extended, and Meta-ExternalAgent.
**Do:** this is a five-minute edit directly against the stated goal of ranking in AI chatbots — expand the allow-list to match or exceed theirs.

### Local content / blog
Per-metro "roadside newsroom" posts (Texas heat, hurricane prep, SXSW/ACL traffic) — fresh, genuinely local content that gives both Google and AI answer engines more specific, citable material than a static FAQ.
**Do:** lower priority than the items above, but a handful of real, DFW-specific posts (not filler) would help both rankings and AEO citation odds.

### E-E-A-T signals: story, photos, video
A "Verified Jobs" photo gallery, a YouTube channel with real job walkthroughs, an Instagram feed, and an About/history page. We have no About page and no photo/video evidence of real jobs anywhere on the site.
**Do:** add an About page once there's real material for it (team, history, actual job photos) — same rule as reviews: don't invent a founding story to fill the space.

## Where they're ahead — the request & dispatch flow

Based on an actual dispatcher SMS from their live system — this is about our product, not our marketing site, and it's cheap to close.

| Field | Their dispatch SMS | Ours today |
|---|---|---|
| Vehicle | "Tesla Model Y" — make/model captured | Not collected |
| Urgency | "Scheduled" — supports booking ahead, not just now | Always implicitly "now" |
| Location source | "Address selected" — labeled explicitly | Implied by field shape, not labeled |
| Price on the dispatch line | "Tire Repair - from $75" | Service name only, no price |
| Timestamp | Explicit "Time:" line | Not included |

- **Vehicle info matters more for us now than it did before** *(do first)* — we just added EV-specific services (EV Jump Start, EV Tire Change). A "Vehicle (year/make/model)" field, optional, in step 3 lets a tech confirm the right equipment before rolling, and lets dispatch catch a customer who picked the wrong (gas vs EV) service.

- **Mirror the quoted price into the dispatcher SMS** *(trivial)* — we already have `service.price` in the data model from the pending pricing work — interpolating it into `buildSmsBody()`'s service line is a one-line change, and keeps dispatcher and customer looking at the same number on the callback.

- **"Now" vs "Schedule for later"** *(bigger lift)* — worth considering deliberately rather than copying outright. Our whole site's voice is built around *15–20 min ETA, dispatcher online now*. Scheduling ahead is a genuinely different product surface (needs its own confirmation/reminder flow), not a quick add.

## Pricing, side by side

Their numbers are self-published starting rates pulled from their site/FAQ — they vary a little by page and city, and every call adds a separate $19 dispatch fee on top. Treat as directional. Ours reflects the pricing work still sitting uncommitted, not what's live today.

| Service | Us | Them |
|---|---|---|
| Towing | $3 / mile | Not offered |
| Battery replacement | $229 | $249–289 |
| Jump start | $55 | $60–75 |
| EV jump start | $75 | Not published separately |
| EV tire change | $80 | Not published separately |
| Tire change | $65 | $65–75 labor |
| Tire repair | $65 | $75 labor |
| New tire installed | Not offered as a line item | $129–189 |
| Fuel delivery | $55 + fuel cost | Not published |
| Wheel lock removal | $65 | ~$129 (Austin rate) |
| Lockout | $65 flat | $65 / $75 / $89 by vehicle tier |
| Dispatch fee | None | $19 on every call |

## Site & structured-data checklist

| Signal | Us | Them |
|---|---|---|
| HTTPS + HSTS | ✓ | ✓ |
| llms.txt | ✓ concise summary | ✓ 150+ linked pages |
| robots.txt AI-bot allow-rules | 4 named bots | 13+ named bots |
| FAQ / Q&A structured data | ✓ FAQPage | ✓ QAPage |
| AggregateRating (reviews) | ✗ no real reviews yet | ✓ 4.9★ / 247 |
| GeoCoordinates / GeoCircle | ✗ | ✓ |
| Price in structured data | ✗ (pending real pricing) | ✓ |
| SpeakableSpecification | ✗ | ✓ |
| Sitemap size | ~20 URLs | 496 URLs, 12 sub-sitemaps |
| Dedicated city landing pages | ✗ city list only | ✓ per suburb + neighborhood |
| Blog / local content | ✗ | ✓ per-metro |
| Physical address shown | ✗ intentional, mobile-only | ✓ |

## Priority order

Grouped by how soon it's worth doing, not by which section it came from above.

### Tier 1 — Do now (hours, not weeks)
Cheap, mechanical, no new content needed.

- [ ] Expand the AI-crawler allowlist in `robots.ts` to match theirs.
- [ ] Add a vehicle field (optional, year/make/model) to the request form.
- [ ] Mirror the quoted price into the dispatcher SMS's service line.
- [ ] Add a "Location source" and "Time" line to the dispatcher SMS.
- [ ] Rewrite the title/meta description to lead with real pricing, once it's live.
- [ ] Add real `PriceSpecification`/`Offer` pricing to the JSON-LD, once live.

### Tier 2 — Build next (weeks)
Real content, moderate effort.

- [ ] Stand up Google Business Profile and start collecting real reviews; wire `AggregateRating` once numbers exist.
- [ ] Dedicated landing pages for top 8–10 cities we serve, reusing the existing `CITIES`/`SERVICES` data.
- [ ] An About page once there's real material — team, history, actual job photos.
- [ ] A couple of airport pages (DFW Airport, Love Field) as a contained first experiment in underserved intent.

### Tier 3 — Longer term (only if it's worth the investment)
Matches their scale.

- [ ] Full city × service page matrix for every served suburb, if the business case supports the build-out.
- [ ] A "now vs. schedule for later" request option — a real second product surface, not a form tweak.
- [ ] A local content program (blog/newsroom) with genuinely DFW-specific posts.
- [ ] Expansion pages for new metros — only ever alongside actually serving that metro.

## One rule that matters more than any single item above

Every trust signal on their site that we're missing — reviews, years in business, precise geo-radius, photos — only works because it's (presumably) true for them. This codebase has deliberately never faked a review count or an address it couldn't back up, and that discipline is worth keeping as we close these gaps.

Add `AggregateRating` when there are real reviews. Add a founding story when there's a real one to tell. Add geo-precision when it's actually been measured. A search engine or an AI system catching one fabricated signal doesn't just cost that one signal — it undermines trust in every other true thing on the page.

## Sources

- allhoursroadside.com — homepage, `/robots.txt`, `/sitemap.xml`, `/llms.txt`, page JSON-LD — fetched directly Aug 1, 2026
- Yelp and BBB listings via web search, for review corroboration
- One real dispatcher SMS sample, shared directly

All competitor figures are self-published or third-party listings, not independently verified — re-check before treating any single number as precise.
