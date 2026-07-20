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

Everything below is a clearly-labeled placeholder. Search for these and replace them with your real details:

| What | Where | Current placeholder |
|---|---|---|
| Phone number | `lib/services.ts` (`BUSINESS`) | `(214) 555-0139` -- this is a fictional number (the `555-01xx` block is reserved for fiction), not a working line |
| Email | `lib/services.ts` (`BUSINESS`) | `help@texasroadsideassist.com` |
| Domain | `lib/services.ts` and `app/layout.tsx` (`metadataBase`) | `texasroadsideassist.com` |
| Form backend | `lib/config.ts` (`FORM_ENDPOINT`) | `https://formspree.io/f/YOUR_FORM_ID` -- **required** for the request form to actually notify you, see below |

## Making the request form actually notify you

This site is statically exported, so there's no server of ours to receive form submissions -- GitHub Pages only serves files. The "Request Service" form instead posts directly from the visitor's browser to [Formspree](https://formspree.io), a free service built for exactly this.

1. Create a free account at formspree.io
2. Create a new form and copy its endpoint URL (looks like `https://formspree.io/f/abcdwxyz`)
3. Paste it into `FORM_ENDPOINT` in `lib/config.ts`
4. Every submission gets emailed to you -- no further code changes needed

Until you do this, the form still works end-to-end as a demo (it shows the same success screen) but the submission isn't sent anywhere; you'll see a console warning reminding you it's unconfigured. Prefer a different provider (Web3Forms, Getform, Basin)? Swap the URL and, if needed, adjust the `fetch` call in `components/request-form.tsx` to match their field format.

## Deploying to GitHub Pages

A workflow is already set up at `.github/workflows/deploy.yml`. To turn it on:

1. Push this project to a GitHub repository
2. In the repo, go to **Settings → Pages**, and under **Source** choose **GitHub Actions**
3. Push to your `main` branch (or run the workflow manually from the **Actions** tab)

The workflow builds the site and deploys the `out/` folder automatically. It sets `BASE_PATH` to `/<your-repo-name>` during the build so all links and assets resolve correctly at `https://<your-username>.github.io/<your-repo-name>/`.

**Using a custom domain instead?** Add a `CNAME` file under `public/` containing your domain, configure the DNS records per [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site), and remove the `BASE_PATH` line from `.github/workflows/deploy.yml` (or set it to an empty string) since a custom domain is served from the root, not a `/repo-name` subpath.

**Deploying somewhere else instead (Vercel, Netlify, your own server)?** This still works -- static export is a subset of what those platforms support. You can also delete `output: "export"` from `next.config.ts` if you'd rather run Next.js as a full server (which would let you bring back a real API route instead of Formspree, if you want).

## Project structure

```
app/
  layout.tsx        Root layout: fonts, theme provider, header/footer/mobile call bar
  page.tsx           Homepage (assembles the section components below)
  globals.css        Full design system -- raw color palette + light/dark semantic tokens
  request/page.tsx    "Request Service" page shell
components/
  header.tsx, footer.tsx, hero.tsx, services.tsx, how-it-works.tsx,
  service-area.tsx, why-us.tsx, contact-section.tsx, mobile-call-bar.tsx
  request-form.tsx    The 3-step request flow (services -> location -> contact)
  theme-provider.tsx, theme-toggle.tsx   Light/dark theme (next-themes)
  icons.tsx           Every icon used on the site, as small React components
lib/
  services.ts         Shared data: the 6 services, service cities, business info
  config.ts           The Formspree endpoint
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
