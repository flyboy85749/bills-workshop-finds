# Vercel deployment for finds.billsworkshopcompany.com

Date: 2026-08-10
Status: Approved

## Goal

Deploy the existing static Vite MPA to Vercel at `finds.billsworkshopcompany.com`, with
auto-deploy on push to GitHub, the security headers currently defined for Netlify carried
over, and extensionless page URLs.

## Current state

- Static multi-page site built by Vite 7 (`appType: "mpa"`), five HTML entry points, output
  to `dist/`.
- Host config lives in `netlify.toml` (build command, publish dir, four security headers).
- `public/robots.txt` and `public/sitemap.xml` already reference
  `https://finds.billsworkshopcompany.com`.
- Git repo has a single README commit against remote
  `https://github.com/flyboy85749/bills-workshop-finds.git`. All source files are untracked
  and there is no `.gitignore`.
- Vercel CLI 51.6.1 installed and authenticated; `gh` authenticated as `flyboy85749`.
- Vercel team `billchristianwebs-projects` already owns `billsworkshopcompany.com` on
  **Vercel nameservers**. A separate project `billsworkshop` exists for the apex.

## Non-goals

Nothing about the build pipeline, page content, or styling changes. No server-side code, no
framework migration, no analytics, no CI beyond Vercel's own Git integration.

## Design

### 1. Repository hygiene

Add `.gitignore` covering:

```
node_modules/
dist/
.vercel/
.env
.env.*
.DS_Store
Thumbs.db
```

Then commit all source files and push to `main` on `flyboy85749/bills-workshop-finds`.

Rationale: without this, the first push commits `node_modules/` and a stale `dist/` that
would conflict with Vercel's own build output.

### 2. `vercel.json`

Create at repo root, and **delete `netlify.toml`** so there is exactly one source of truth
for host configuration.

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

The four security headers are carried over verbatim from `netlify.toml`. The `/assets/*`
cache rule is new: Vite content-hashes filenames under `dist/assets/`, so they are safe to
cache indefinitely.

Build command and output directory are **not** set in `vercel.json` — Vercel's Vite framework
preset infers `npm run build` and `dist` correctly. Setting them in project config (step 4)
keeps them visible and overridable in the dashboard.

### 3. Clean-URL content updates

`cleanUrls: true` makes Vercel serve `dist/about.html` at `/about` and issue a 308 redirect
from `/about.html` to `/about`. To avoid the site linking to its own redirects, update:

- **Internal links** in all five HTML files: `href="/about.html"` → `href="/about"`, and the
  same for `/affiliate-disclosure.html`, `/privacy.html`,
  `/flight-attendant-travel-essentials.html`.
- **Canonical tags**: each page's `<link rel="canonical">` drops the `.html`. `index.html`
  already canonicalises to `/` and needs no change.
- **`public/sitemap.xml`**: the four non-root `<loc>` entries drop `.html`.

There are no `og:url` tags in these files, so nothing else references the extension.
`public/robots.txt` is unaffected.

Affected internal-link occurrences (from a grep of the working tree): `index.html` lines
36–37, 56, 123, 274, 276, 296–297; `about.html` 12, 38–39, 123, 125, 145–146; `privacy.html`
12, 38–39, 132, 134, 154–155; `affiliate-disclosure.html` 12, 38–39, 115, 117, 137–138;
`flight-attendant-travel-essentials.html` 12, 46–47, 125, 146, 148, 168–169.

### 4. Vercel project and domain

- Create project named `bills-workshop-finds` (matching the GitHub repo) in team
  `billchristianwebs-projects`.
- Link it to the GitHub repository so pushes to `main` deploy to production and pull requests
  get preview URLs.
- Framework preset: Vite. Build command `npm run build`. Output directory `dist`. Install
  command default.
- Attach the domain `finds.billsworkshopcompany.com` to the project. Because
  `billsworkshopcompany.com` is on Vercel nameservers within the same team, Vercel creates
  the required DNS record itself — no registrar action needed.

The existing `billsworkshop` project keeps the apex domain. The two projects are independent.

### 5. Verification

Deployment is not considered complete until each of these is checked against the live
production URL and reported with its actual output:

1. `/`, `/about`, `/privacy`, `/affiliate-disclosure`, and
   `/flight-attendant-travel-essentials` each return HTTP 200.
2. `/about.html` returns 308 with `Location: /about`.
3. A page response carries all four security headers.
4. A hashed file under `/assets/` carries
   `Cache-Control: public, max-age=31536000, immutable`.
5. `/robots.txt` and `/sitemap.xml` return 200, and the sitemap lists the extensionless URLs.
6. `https://finds.billsworkshopcompany.com` resolves and serves the site over HTTPS.

If DNS has not propagated when the other checks run, checks 1–5 run against the
`*.vercel.app` deployment URL and check 6 is retried separately.

## Risks

- **DNS propagation delay.** Vercel-managed nameservers make this fast, but it is not
  instantaneous. Mitigated by verifying against the deployment URL first.
- **Vercel project name collision.** Five projects exist in the team; none is named
  `bills-workshop-finds`, so this is expected to be clear.

## Known issue, out of scope

`main.js:2` sets `amazonTag: ""`. The site deploys and functions, but product buttons link to
untagged Amazon search results and earn nothing until a valid Associates tracking ID is set.
The subdomain also needs to be registered as an approved website in Amazon Associates before
promotion. Both are content/business steps and are deliberately excluded from this work.
