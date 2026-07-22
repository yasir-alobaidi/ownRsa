# Texas Roadside Assist

A Next.js (App Router + TypeScript) rebuild of the Texas Roadside Assist landing page: light/dark theme, a 24/7 service marketing site, and a multi-step "Request Service" form. Statically exported so it can run on GitHub Pages (or any static host) with no server required.

## Getting started locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Edit any file in `app/` or `components/` and the page reloads automatically.

To produce the static site exactly as it will be deployed:

```bash
npm run build
```

This writes fully static HTML/CSS/JS to the `out/` folder. You can open `out/index.html` directly or serve the folder with any static file server (`npx serve out`).

## Before you launch: things to update

Domain (`texasroadsideassist.com`), phone (`(945) 412-1215`), and email (`help@texasroadsideassist.com`) are all real -- confirmed and set in `lib/services.ts` (`BUSINESS`), and already threaded through `app/layout.tsx` (`metadataBase`), `lib/schema.ts` (`SITE_URL`), the sitemap/robots/OG image, and `public/llms.txt`. The phone number doubles as `DISPATCHER_PHONE` -- the same line receives the SMS for online requests.

What's still open:

| What | Where | Status |
|---|---|---|
| Form backend | `.env` + `docker compose` (Twilio SMS API) | Not yet configured -- runs in demo mode until it is. See **SMS dispatch setup** below |
| Google Business Profile | business.google.com (outside this repo) | Planned, not started -- needed for local "map pack" / Maps results |

## SMS dispatch setup (Twilio)

Online service requests are sent as an **SMS to your dispatcher** via [Twilio](https://www.twilio.com). The message includes the customer's name, phone, selected services, location (with a **Google Maps link** when GPS is used), and any notes.

1. Create a Twilio account and buy a **US phone number** (Messaging capable).
2. Copy `.env.example` to `.env` in the project root and fill in:
   - `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` — from the Twilio console
   - `TWILIO_FROM_NUMBER` — your Twilio number (E.164 format, e.g. `+12145550100`)
   - `DISPATCHER_PHONE` — the number that should receive SMS alerts; already `+19454121215` in `.env.example` (the real main line, which doubles as the dispatcher's number)
3. Start with Docker: `docker compose up --build`
4. Submit a test request at `http://localhost:9000/request/`

Until Twilio is configured, the API still accepts submissions in **demo mode** (logs the SMS body to the container console instead of sending).

### Abuse / cost protection

Every accepted request sends one real, billed SMS, so `/api/request` layers a few checks (all in `api/index.js`, no extra dependency): a per-IP rate limit, a hidden honeypot field that silently no-ops bot submissions, de-duping identical back-to-back submissions, and a hard daily request cap as a worst-case spend ceiling. Tunable via `RATE_LIMIT_MAX_PER_IP`, `MAX_REQUESTS_PER_DAY`, and `ALLOWED_ORIGINS` in `.env` (defaults in `.env.example`).

### GPS / Google Maps

When a customer taps **Use my current GPS location**, the form fills in coordinates like `32.776720, -96.796990` — paste that directly into Google Maps search, or tap the **open directions** link. The same Google Maps URL is included in the dispatcher SMS.

### Local dev (frontend + API)

```bash
npm install && npm run dev          # site at http://localhost:3000
cd api && npm install && npm run dev # API at http://localhost:3001
```

Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3001/api/request` so the form hits the local API.

## Going live with HTTPS (Cloudflare)

There's no TLS anywhere in this repo's Docker/nginx setup on purpose -- it's meant to sit behind Cloudflare, which is both the simplest way to get free HTTPS here and gives a global CDN cache for the static assets as a side effect. Nginx is already configured to trust Cloudflare's real-IP headers (see the `set_real_ip_from` block in `nginx.conf`), so this is just account/DNS setup, no code changes needed:

1. Add the site to Cloudflare and point `texasroadsideassist.com`'s nameservers at Cloudflare (done at your domain registrar).
2. Add a DNS **A record** for the domain pointing at this server's public IP, with the proxy toggle **on** (orange cloud, not grey).
3. In Cloudflare's SSL/TLS settings, start with **Flexible** (Cloudflare terminates HTTPS for visitors; the Cloudflare-to-origin leg stays plain HTTP, which is fine since that's this server's current state and requires zero origin changes). The page is still a secure context from the browser's point of view either way, which is what the GPS feature needs.
4. Turn on **Always Use HTTPS** (redirects any `http://` visitor to `https://`).
5. Later, if you want the Cloudflare-to-origin leg encrypted too: switch SSL/TLS mode to **Full**, and install a free Cloudflare Origin CA certificate on this nginx (a bit more setup, not required to fix the GPS/HTTPS issue above).

## Making the request form actually notify you (legacy Formspree)

Formspree has been replaced by the Twilio SMS API above. If you prefer email instead, you can point `REQUEST_API_URL` in `lib/config.ts` back to a Formspree endpoint and adjust the payload in `components/request-form.tsx`.

## Deploying to GitHub Pages

A workflow is already set up at `.github/workflows/deploy.yml`. To turn it on:

1. Push this project to a GitHub repository
2. In the repo, go to **Settings → Pages**, and under **Source** choose **GitHub Actions**
3. Push to your `main` branch (or run the workflow manually from the **Actions** tab)

The workflow builds the site and deploys the `out/` folder automatically. It sets `BASE_PATH` to `/<your-repo-name>` during the build so all links and assets resolve correctly at `https://<your-username>.github.io/<your-repo-name>/`.

**Using a custom domain instead?** Add a `CNAME` file under `public/` containing your domain, configure the DNS records per [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), and remove the `BASE_PATH` line from `.github/workflows/deploy.yml` (or set it to an empty string) since a custom domain is served from the root, not a `/repo-name` subpath.

**Deploying somewhere else instead (Vercel, Netlify, your own server)?** This still works -- static export is a subset of what those platforms support. You can also delete `output: "export"` from `next.config.ts` if you'd rather run Next.js as a full server (which would let you bring back a real API route instead of Formspree, if you want).

## SEO / AEO (search + AI answer engines)

- **Structured data (JSON-LD)** -- `lib/schema.ts` builds a `LocalBusiness`/`AutomotiveBusiness` entity (name, phone, email, service-area cities, hours, and the full service catalog) injected site-wide in `app/layout.tsx`; `FAQPage` schema in `components/faq.tsx`; `BreadcrumbList` on `/request`. Deliberately excludes a street address (this is a mobile service-area business, not a storefront), reviews/ratings, and pricing, since none of that is real data -- fabricating any of it would be misleading structured data, which search engines actively penalize.
- **FAQ section** (`lib/faq.ts`, `components/faq.tsx`) -- every answer restates a claim already made elsewhere on the page (response time, service list, licensing, pricing policy), so the structured data never asserts something the page itself doesn't back up. This is also the single highest-leverage block for AI answer engines (ChatGPT, Perplexity, Google AI Overviews) to quote directly.
- **`app/sitemap.ts`** / **`app/robots.ts`** -- generated at build time (works fine under static export). Robots rules explicitly allow known AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) in addition to the default `*` allow, so this is future-proof if any of them ever ships a stricter default.
- **`public/llms.txt`** -- a plain-text summary of the business/services/contact info for AI crawlers, following the emerging (unofficial, not universally adopted) `llms.txt` convention.
- **`app/opengraph-image.tsx`** -- a branded 1200x630 social preview image generated at build time (`next/og`), so links shared on social/chat/AI platforms show something other than a blank card.
- **Fonts** via `next/font/google` (`app/layout.tsx`) -- self-hosted at build time instead of a runtime request to `fonts.googleapis.com`, which removes a render-blocking third-party round trip.
- **Canonical URLs** set per-page via `alternates.canonical`.

None of this guarantees rankings -- that also depends on backlinks, Google Business Profile signals, and reviews, all of which live outside this repo. See the wrap-up notes for what to do about those.

## Project structure

```
app/
  layout.tsx          Root layout: fonts, theme provider, JSON-LD, header/footer/mobile call bar
  page.tsx            Homepage (assembles the section components below)
  globals.css         Full design system -- raw color palette + light/dark semantic tokens
  request/page.tsx    "Request Service" page shell
  sitemap.ts          Generates sitemap.xml at build time
  robots.ts           Generates robots.txt at build time
  opengraph-image.tsx Branded social-share image, generated at build time
components/
  header.tsx, footer.tsx, hero.tsx, services.tsx, how-it-works.tsx,
  service-area.tsx, why-us.tsx, faq.tsx, contact-section.tsx, mobile-call-bar.tsx
  request-form.tsx    The 3-step request flow (services -> location -> contact)
  theme-provider.tsx, theme-toggle.tsx   Light/dark theme (next-themes)
  icons.tsx           Every icon used on the site, as small React components
lib/
  services.ts         Shared data: the 8 services, service cities, business info
  config.ts           Request API endpoint URL
  location.ts         Google Maps GPS formatting helpers
  schema.ts           JSON-LD builders (LocalBusiness, FAQPage, BreadcrumbList)
  faq.ts              FAQ question/answer content
api/
  index.js            Twilio SMS API (dispatcher notifications)
  Dockerfile          API container image
public/
  llms.txt            Plain-text site summary for AI crawlers
```

## How the theme system works

`app/globals.css` defines two layers of CSS variables:
- **Raw palette** (`--signal-500`, `--asphalt-900`, etc.) -- fixed brand colors
- **Semantic tokens** (`--bg-canvas`, `--text-primary`, `--accent-text`, etc.) -- these are what components actually use, and their values flip between `[data-theme="dark"]` and `[data-theme="light"]`

The hero section has its own night/day variant (dark navy skyline vs. a soft daytime sky) driven by the same token system, so the whole page -- not just isolated pieces -- responds to the toggle. The footer and mobile call bar are intentionally fixed dark in both themes as a brand accent.

The toggle itself is [`next-themes`](https://github.com/pacocoursey/next-themes), which also prevents the "flash of wrong theme" on page load and persists the choice in `localStorage`.

## Known limitations of this demo

- Placeholder contact info throughout (see table above)
- No automated tests
- The service-area coverage map and city list are illustrative, not driven by real geodata
