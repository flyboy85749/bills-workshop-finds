# Bill's Workshop Finds

A lightweight multi-page affiliate guide site intended for `finds.billsworkshopcompany.com`.

## Pages

- Home and category hub
- 15 Flight Attendant Travel Essentials guide
- 15 Gifts for Flight Attendants Who Love Dogs guide
- 15 Classroom Essentials Elementary Teachers Actually Use All Year guide
- 15 Gifts for Dog Lovers That Aren't Junk guide
- 15 Gifts for Student Pilots, Sorted by Where They Are in Training guide
- 15 Tools for a First Apartment, Sorted by What Just Went Wrong guide
- 15 Holiday Gifts, Grouped by Who You're Buying For guide
- 15 Retro Classroom Decor Finds That Warm Up a Cold Room guide
- The Ultimate Pen Pal Starter Kit: 15 Things Worth Owning guide
- About
- Affiliate disclosure
- Privacy policy

## Affiliate links

`SITE.amazonTag` in `site.js` is set to `billsworkshop-20`, and `finds.billsworkshopcompany.com` is registered as an approved website in Amazon Associates. Product buttons open tagged Amazon search results and carry `rel="sponsored nofollow noopener"`.

Remaining optional improvement: replace the search-based recommendations with specific reviewed products.

Add the Pinterest account to the Amazon Associates approved social profiles before promoting there.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production-ready static files will be in `dist/`.

## Checks

```bash
npm run verify
```

Runs `html-validate` over every page, then checks the built guides in `dist/`. Keep each
`<title>` on one line: the `long-title` rule counts the whitespace inside the element, so a
title wrapped across lines fails the 75-character limit even when its text is well under.

## Deployment

Hosted on Vercel as project `bills-workshop-finds` (team `billchristianwebs-projects`), live at https://finds.billsworkshopcompany.com.

Pushing to `main` deploys to production automatically; pull requests get preview URLs. Preview and `*.vercel.app` URLs sit behind team SSO — the custom domain is public.

`vercel.json` is the single source of truth for host config: clean (extensionless) URLs, four security headers, and a one-year immutable cache for Vite's content-hashed assets in `/assets/`. Build command and output directory come from Vercel's Vite framework preset.

Because pages are served without the `.html` extension, internal links, canonical tags, and `public/sitemap.xml` must all use extensionless paths. The files in `dist/` keep their `.html` names — Vercel maps the clean path to them at request time.

Design and implementation notes for the deployment live in `docs/superpowers/`.

## Adding a guide

Guide content lives in `guides/<slug>.js` as an array of `{ category, name, query, reason, tip }`
objects. Register the array in `collections` in `products.js`, mark the page's container with
`data-product-grid="<slug>"`, add the page to `rollupOptions.input` in `vite.config.js`, and add
an entry to `GUIDES` in `scripts/verify-build.mjs`. The build fails if a registered collection is
never injected, so a half-wired guide cannot ship.

A guide that builds and verifies is not yet reachable. Also link it in: add a card on the home
page (featured guide or guide-card grid), add its extensionless path to `public/sitemap.xml`, and
add TOC cross-links. The footer deliberately carries no per-guide links — it collapses to a single
"All guides" link so it does not grow with the guide count. Each guide's TOC aside is capped at two
cross-links plus "All guides", so adding a guide means swapping a link on the two nearest guides
rather than appending to every guide's TOC.
