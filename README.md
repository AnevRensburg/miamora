# Miamora

Static website for Miamora Eau de Parfum, built with Angular 22 and prerendered to plain HTML for
GitHub Pages.

## Everyday tasks

| Task                     | How                                                                         |
| ------------------------ | --------------------------------------------------------------------------- |
| Run locally              | `npm start` → http://localhost:4200                                         |
| Change price / contacts  | Edit `src/app/core/site.ts` (used everywhere on the site)                   |
| Replace photos           | Put originals in `images-src/` (names below), then `npm run images`         |
| Production build         | `npm run build`, then `npm run serve:dist` → http://localhost:8090          |
| Deploy                   | Push to `main`; `.github/workflows/deploy.yml` publishes to GitHub Pages    |

## Photos

`npm run images` turns the originals in `images-src/` into small AVIF + WebP files in
`public/images/` (several widths each), plus the social-preview image and favicons. Expected names
(any of .jpg / .jpeg / .png / .webp):

| File          | Where it shows                             |
| ------------- | ------------------------------------------ |
| `hero`        | Full-width background at the top           |
| `card-gift`   | Order Reminders card 1 (gift)              |
| `card-books`  | Order Reminders card 2 (small batches)     |
| `card-pricing`| Order Reminders card 3 (sizes and pricing) |
| `card-hands`  | Order Reminders card 4 (order ahead)       |
| `bottle`      | Contact section, also used for the favicon |

`images-src/` is git-ignored; commit the generated `public/images/` and
`src/app/data/image-manifest.ts`.

## Order form

There is no server. Submitting the form builds the order as text and opens WhatsApp
(`wa.me/<number>?text=…`) so the customer only has to press Send. An email fallback link is shown
afterwards.

## GitHub Pages setup (once)

1. Create a GitHub repo and push this project to `main`.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. For miamora.co.za: add the domain under **Settings → Pages → Custom domain**, and point the DNS at
   GitHub Pages as GitHub describes there.
