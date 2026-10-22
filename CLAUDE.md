# Miamora perfume

Website for Miamora, a small South African perfume brand: https://miamora.co.za
(repo: github.com/AnevRensburg/miamora). Private business context (goals, accounts, DNS, marketing
status) is in `CLAUDE.local.md`, which is git-ignored because this repo is public.

**Keep this section current.** Any session that changes anything about Miamora (website, marketing,
Google Business Profile, accounts, prices, offers) adds what a future session needs to know here, or
in `CLAUDE.local.md` if it is private. Update or remove lines that become wrong; don't just append.

## The product (what the site says)

- One product: **Miamora Eau de Parfum, 50ml**, handcrafted in South Africa with quality French oils,
  **inspired by Jean Paul Gaultier Scandal**. Notes: sweet honey, white florals, caramel and woods.
  The old name "Golden Prism" was dropped; never use it.
- Price **R250**. Current special **2 for R450** (sticky top banner, applied to order totals).
- **Free 3ml samples**: collect in Durbanville, or dropped off if the customer lives in Durbanville.
  Can be requested on their own or added to an order.
- Payment: **EFT or cash on collection** (no SnapScan). Banking details are sent on WhatsApp when an
  order is confirmed, never on the site.
- Courier anywhere in SA: **about R70, 1–2 working days**, paid in full by EFT first. Collection in
  Durbanville: no deposit.
- Messaging: lead with "Designer scent. Not designer price." and "inspired by Jean Paul Gaultier
  Scandal". Say "inspired by", never "replica", "copy" or "same as"; don't use JPG logos or bottle
  photos.
- Address: show only **Valmary Park, Durbanville, Western Cape**. The street address is hidden on
  purpose (it is also hidden on Google Business Profile); it is shared on WhatsApp.
- Contact: WhatsApp 071 547 7921, info@miamora.co.za, Instagram/Facebook @miamoraparfum.

## Stack and layout

- Angular 22, standalone components, signals, zoneless, prerendered to static HTML
  (`outputMode: "static"`, no server). One real route (`/`) plus `/404` → `404.html`.
- `src/app/core/site.ts`: **single source of truth** for business details, price, special
  (`SPECIAL`; set to `null` to turn the special off everywhere), sample size and courier cost.
- `src/app/data/reviews.ts`: Google reviews shown on the site, newest first. Reviewer name format
  is **first name + surname initial** ("Pauline N."). Date as month + year.
- `src/app/pages/home/`: the whole page (banner, hero, order reminders, reviews, sample section,
  product + payment info, order form, contact, footer).
- `src/app/shared/order-form/`: no backend. Submitting builds a WhatsApp message and opens
  `wa.me/27715477921?text=…` (email fallback link afterwards). Modes: bottles (quantity, optional
  free sample, courier/collect) or sample only (collect/drop-off).
- `src/app/shared/picture/`: `<app-picture>` renders AVIF + WebP from `public/images` using the
  generated `src/app/data/image-manifest.ts`.
- `src/index.html`: meta tags, Open Graph, and JSON-LD (`Store` + `Product` with price and
  shipping). Keep it in sync with `site.ts` when prices or details change. Do **not** add
  `aggregateRating`/review markup built from the Google reviews (Google doesn't allow review
  markup copied from third-party sites). `openingHours` can be added once the owner shares the
  collection hours (closed Sunday).
- `marketing/`: ads (`ads/ad.html` + `ads/build-ads.mjs` → `ads/out/*.png`), `ad-copy.md`,
  `google-business.md`. Not part of the website build.

## Commands

Node is installed with nvm and is not on the default PATH:
`export PATH=~/.nvm/versions/node/v24.22.0/bin:$PATH`.

- `npm start`: dev server on http://localhost:4200
- `npm run build`: production build + `scripts/postbuild.mjs` (404.html, sitemap.xml, AVIF preload)
- `npm run serve:dist`: serve the build on http://localhost:8090 (port 8080 is used by another
  local project)
- `npm run images`: optimise originals in `images-src/` (git-ignored) into `public/images/` and
  regenerate the manifest, OG image and favicons. Expected names: `hero`, `card-gift`,
  `card-books`, `card-pricing`, `card-hands`, `bottle`. The current originals were extracted from
  a Canva PDF at low resolution; the owner may supply better ones.
- `node marketing/ads/build-ads.mjs`: render ad PNGs with headless `google-chrome`.
- Format with `npx prettier --write "src/**/*.{ts,html,scss}"`.

## Deploy

- Push to `main` → `.github/workflows/deploy.yml` builds and deploys to GitHub Pages. Check with
  `gh run list` (gh is at `~/.local/bin/gh`, logged in as AnevRensburg).
- Custom domain `miamora.co.za` is set in the repo's Pages settings (not via a CNAME file), HTTPS
  enforced, domain verified on GitHub.
- `robots.txt` is in `public/`; `sitemap.xml` is generated at build time and submitted in Google
  Search Console.

## Gotchas

- In-page links must use `routerLink="/" fragment="…" queryParamsHandling="preserve"`, not
  `href="#…"`. With `<base href="/">`, a plain `#order` link on a URL with a query string (e.g.
  Facebook's `?fbclid=…`) reloads the page and loses form state.
- Photos inside grid cards use `contain: size` so a tall photo can't stretch its card.
- The build inlines Google Fonts; in a sandboxed shell the font download can fail with a TLS
  error. Re-run the build outside the sandbox. CI is unaffected.
- The old street address is still in early git history; it was public on the site at the time.
- Before 17 Oct 2026 the domain pointed at an unused Shopify setup (it answered 409/403 and had
  Shopify's robots.txt). Search Console warnings like "other 4xx", "blocked by robots.txt" and
  "403" for URLs such as `/cart`, `/collections/…` or `/products/…` come from that era and can be
  ignored; those URLs now return a real 404 with `noindex` (`pages/not-found`).
