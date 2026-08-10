# Bill's Workshop Finds

A lightweight multi-page affiliate guide site intended for `finds.billsworkshopcompany.com`.

## Pages

- Home and category hub
- 15 Flight Attendant Travel Essentials guide
- About
- Affiliate disclosure
- Privacy policy

## Before publishing affiliate links

Open `main.js` and set `SITE.amazonTag` to the Amazon Associates tracking ID approved for this site. The product buttons currently open relevant Amazon search results without an affiliate tag. Replace the search-based recommendations with specific products after reviewing them, if desired.

Add both the subdomain and the Pinterest account to the Amazon Associates approved websites/social profiles before promotion.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production-ready static files will be in `dist/` and can be deployed on Netlify, Vercel, Cloudflare Pages or similar static hosting.

## Connect the subdomain

After deploying, add the custom domain `finds.billsworkshopcompany.com` in the hosting provider and create the DNS record it supplies. Do not guess the record; use the exact target shown by the host.
# bills-workshop-finds
