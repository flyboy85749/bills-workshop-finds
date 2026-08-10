# Vercel Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the static Vite MPA to Vercel at `finds.billsworkshopcompany.com` with auto-deploy from GitHub, security headers, and extensionless URLs.

**Architecture:** Nothing about the build changes. `npm run build` still produces `dist/`. We add a `.gitignore` and a `vercel.json`, strip `.html` from internal links so they match Vercel's `cleanUrls` behavior, push the source to GitHub, then create a Vercel project linked to that repo and attach the subdomain.

**Tech Stack:** Vite 7 (static MPA, `appType: "mpa"`), Node 22, Vercel CLI 51.6.1, GitHub CLI (`gh`, authed as `flyboy85749`).

**Spec:** `docs/superpowers/specs/2026-08-10-vercel-deployment-design.md`

## Global Constraints

- Working directory: `D:\Development\Projects\finds.billsworkshopcompany`. All paths below are relative to it.
- **This project has no test framework.** There is no `npm test`. "Verification" throughout this plan means running the real build or making a real HTTP request and reading the actual output. Never claim a step passed without pasting the command output.
- Vercel team scope: `billchristianwebs-projects`. Vercel project name: `bills-workshop-finds`.
- GitHub remote: `https://github.com/flyboy85749/bills-workshop-finds.git`, branch `main`.
- Domain: `finds.billsworkshopcompany.com`. Apex `billsworkshopcompany.com` is already on Vercel nameservers in the same team — **do not touch apex DNS, and do not touch the existing `billsworkshop` project.**
- The four security header values are copied verbatim from `netlify.toml` and must not be altered:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: SAMEORIGIN`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Do not modify `main.js`. The empty `amazonTag` is a known, deliberately out-of-scope issue.
- Shell is PowerShell on Windows, but a Bash tool is also available. Commands below are written for Bash; they work as-is in the Bash tool.

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `.gitignore` | Create | Keep build output, deps, and Vercel local state out of the repo |
| `vercel.json` | Create | Single source of truth for host config: clean URLs + headers |
| `netlify.toml` | Delete | Superseded by `vercel.json`; leaving it invites drift |
| `index.html` | Modify | Strip `.html` from internal links |
| `about.html` | Modify | Strip `.html` from canonical + internal links |
| `privacy.html` | Modify | Strip `.html` from canonical + internal links |
| `affiliate-disclosure.html` | Modify | Strip `.html` from canonical + internal links |
| `flight-attendant-travel-essentials.html` | Modify | Strip `.html` from canonical + internal links |
| `public/sitemap.xml` | Modify | Advertise the extensionless URLs |
| `.vercel/` | Created by CLI | Local project link. Gitignored. |

Task 1 must run first (the `.gitignore` gates every later commit). Tasks 2 and 3 are independent of each other but both must land before Task 4 deploys. Task 5 verifies the result.

---

### Task 1: Repository hygiene and initial push

**Files:**
- Create: `.gitignore`
- Test: none — verified by `git status` output

**Interfaces:**
- Consumes: nothing.
- Produces: a clean working tree where `git add .` is safe, and a GitHub `main` branch containing the site source. Task 4 depends on that branch existing.

- [ ] **Step 1: Confirm the problem is real**

```bash
git status --short | head -20
```

Expected: `node_modules/` and `dist/` appear as untracked (`??`). This is what we are about to prevent.

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
dist/
.vercel/
.env
.env.*
.DS_Store
Thumbs.db
```

- [ ] **Step 3: Verify the ignore rules take effect**

```bash
git status --short
```

Expected: `node_modules/` and `dist/` are **gone** from the output. `.gitignore`, the five HTML files, `main.js`, `styles.css`, `package.json`, `package-lock.json`, `vite.config.js`, `netlify.toml`, `public/`, `partials-note.txt`, and `.htmlvalidate.json` remain.

If `dist/` or `node_modules/` still show, they were already staged or tracked — run `git rm -r --cached dist node_modules` and re-check.

- [ ] **Step 4: Stage and commit the source**

```bash
git add .
git commit -m "Add site source and gitignore

Commits the Vite MPA source that was previously untracked, and adds a
gitignore so build output and dependencies stay out of the repo.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 5: Confirm no build output got committed**

```bash
git show --stat --name-only HEAD | grep -E "node_modules|^dist/" || echo "CLEAN - no build output committed"
```

Expected: `CLEAN - no build output committed`

- [ ] **Step 6: Reconcile with the remote, then push**

```bash
git fetch origin
git status -sb | head -2
```

If the output shows the branch is behind or diverged, stop and report — the remote has commits we do not have locally. Otherwise:

```bash
git push -u origin main
```

- [ ] **Step 7: Confirm the push landed**

```bash
gh repo view flyboy85749/bills-workshop-finds --json defaultBranchRef -q .defaultBranchRef.name
git ls-remote --heads origin main
```

Expected: branch `main` exists on the remote and its SHA matches local `git rev-parse HEAD`.

---

### Task 2: Add `vercel.json`, remove `netlify.toml`

**Files:**
- Create: `vercel.json`
- Delete: `netlify.toml`

**Interfaces:**
- Consumes: `.gitignore` from Task 1.
- Produces: `cleanUrls: true` behavior that Task 3's link edits assume, and the header rules that Task 5 checks 3 and 4 assert.

- [ ] **Step 1: Record the header values being migrated**

```bash
cat netlify.toml
```

Expected: the four `[headers.values]` entries. Confirm they match the four values in Global Constraints before deleting anything. If they differ, the constraints are stale — stop and report.

- [ ] **Step 2: Create `vercel.json`**

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

Note: `buildCommand` and `outputDirectory` are deliberately **absent**. Vercel's Vite framework preset infers `npm run build` and `dist`; leaving them out of the file keeps them editable in the dashboard.

- [ ] **Step 3: Verify the JSON parses**

```bash
node -e "const c=require('./vercel.json'); console.log('cleanUrls:', c.cleanUrls, '| header groups:', c.headers.length, '| keys in group 0:', c.headers[0].headers.map(h=>h.key).join(', '))"
```

Expected:
```
cleanUrls: true | header groups: 2 | keys in group 0: X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy
```

- [ ] **Step 4: Delete `netlify.toml`**

```bash
git rm netlify.toml
```

- [ ] **Step 5: Confirm the build is unaffected**

```bash
npm run build
```

Expected: succeeds, five HTML files emitted to `dist/`. `vercel.json` is host config and does not participate in the Vite build — this step is confirming we did not break anything, not testing the config.

- [ ] **Step 6: Commit**

```bash
git add vercel.json
git commit -m "Switch host config from Netlify to Vercel

Ports the four security headers verbatim, enables clean URLs, and adds
an immutable cache header for Vite's content-hashed assets.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Strip `.html` from internal links, canonicals, and sitemap

**Files:**
- Modify: `index.html`, `about.html`, `privacy.html`, `affiliate-disclosure.html`, `flight-attendant-travel-essentials.html`
- Modify: `public/sitemap.xml`

**Interfaces:**
- Consumes: `cleanUrls: true` from Task 2 — these edits are only correct if that setting is live.
- Produces: a site whose own links point at final URLs rather than at 308 redirects. Task 5 check 5 asserts the sitemap contents.

The four page basenames to rewrite are exactly: `about`, `privacy`, `affiliate-disclosure`, `flight-attendant-travel-essentials`. `index.html` is never referenced by name and must not be rewritten. `styles.css` and `main.js` references must not be touched.

- [ ] **Step 1: Record the current state**

```bash
grep -o '/[a-z-]*\.html' *.html public/sitemap.xml | sort | uniq -c
```

Expected: counts for the four basenames across the six files. Save this output — Step 4 compares against it.

- [ ] **Step 2: Rewrite the four basenames**

```bash
for f in index.html about.html privacy.html affiliate-disclosure.html flight-attendant-travel-essentials.html public/sitemap.xml; do
  sed -i \
    -e 's|/about\.html|/about|g' \
    -e 's|/privacy\.html|/privacy|g' \
    -e 's|/affiliate-disclosure\.html|/affiliate-disclosure|g' \
    -e 's|/flight-attendant-travel-essentials\.html|/flight-attendant-travel-essentials|g' \
    "$f"
done
```

This is safe because each pattern is anchored on a leading `/` and an escaped literal `.html`, and the four basenames appear nowhere else in these files.

- [ ] **Step 3: Verify no internal `.html` references survive**

```bash
grep -n '\.html' *.html public/sitemap.xml || echo "CLEAN - no .html references remain"
```

Expected: `CLEAN - no .html references remain`.

If anything matches, inspect it before proceeding — an external link to some other site's `.html` page would be a false positive and should be left alone.

- [ ] **Step 4: Verify the canonical tags specifically**

```bash
grep -A2 'rel="canonical"' *.html | grep 'href='
```

Expected: five results (grep prefixes each with its filename), whose `href` values are exactly:

| File | Canonical href |
|---|---|
| `index.html` | `https://finds.billsworkshopcompany.com/` |
| `about.html` | `https://finds.billsworkshopcompany.com/about` |
| `privacy.html` | `https://finds.billsworkshopcompany.com/privacy` |
| `affiliate-disclosure.html` | `https://finds.billsworkshopcompany.com/affiliate-disclosure` |
| `flight-attendant-travel-essentials.html` | `https://finds.billsworkshopcompany.com/flight-attendant-travel-essentials` |

(`index.html`'s canonical is on a single line and already correct at `/`; the other four span two lines, hence the `-A2`.)

- [ ] **Step 5: Verify the sitemap**

```bash
cat public/sitemap.xml
```

Expected: five `<loc>` entries — the root plus the four extensionless paths. No `.html` anywhere.

- [ ] **Step 6: Rebuild and confirm the filenames on disk are unchanged**

```bash
npm run build && ls dist/*.html
```

Expected: `dist/` still contains `index.html`, `about.html`, `privacy.html`, `affiliate-disclosure.html`, `flight-attendant-travel-essentials.html`.

This is the key sanity check: **the files on disk keep their `.html` extension** — Vercel's `cleanUrls` maps the extensionless request path to them at serve time. If Vite emitted different filenames, the routing assumption is wrong and Task 5 will 404.

- [ ] **Step 7: Commit**

```bash
git add index.html about.html privacy.html affiliate-disclosure.html flight-attendant-travel-essentials.html public/sitemap.xml
git commit -m "Use extensionless URLs in links, canonicals, and sitemap

Matches the cleanUrls setting so the site links to final URLs instead
of to 308 redirects.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Create the Vercel project, connect Git, attach the domain

**Files:**
- Created by CLI: `.vercel/project.json` (gitignored)

**Interfaces:**
- Consumes: the pushed `main` branch from Task 1; `vercel.json` from Task 2; the link edits from Task 3.
- Produces: a production deployment URL (`https://<deployment>.vercel.app`) and the live domain. Task 5 tests both.

Confirm before starting: `vercel whoami` returns a logged-in user and the scope is `billchristianwebs-projects`. If not, stop and ask the user to run `vercel login` — do not attempt an interactive login unattended.

- [ ] **Step 1: Confirm the project name is free**

```bash
vercel projects ls
```

Expected: `billsworkshop`, `layover-link`, `bark-dating`, `layover-ads`, `learn-code`. **No** `bills-workshop-finds`. If that name is taken, stop and report rather than deploying into an existing project.

- [ ] **Step 2: Push the pending commits so Vercel builds current code**

```bash
git push origin main
git log --oneline origin/main -3
```

Expected: the Task 2 and Task 3 commits are on `origin/main`.

- [ ] **Step 3: Create and link the project**

```bash
vercel link --yes --project bills-workshop-finds --team billchristianwebs-projects
```

Expected: creates the project and writes `.vercel/project.json`.

- [ ] **Step 4: Confirm the link and that `.vercel/` is ignored**

```bash
cat .vercel/project.json
git status --short
```

Expected: a `projectId` and `orgId`. `git status` must **not** list `.vercel/`.

- [ ] **Step 5: Connect the GitHub repository**

```bash
vercel git connect https://github.com/flyboy85749/bills-workshop-finds.git
```

Expected: confirmation that the project is connected to `flyboy85749/bills-workshop-finds`. This is what makes future pushes auto-deploy.

If the CLI reports a permissions or GitHub-App error, stop and report it — connecting the repo may need a one-time GitHub App authorization in the Vercel dashboard, which the user must click through.

- [ ] **Step 6: Deploy to production**

```bash
vercel --prod --yes
```

Expected: a build log ending in a production URL. **Record that URL** — Task 5 uses it. If the build fails, read the log and fix the cause before continuing; do not retry blindly.

- [ ] **Step 7: Confirm the framework and output directory were detected correctly**

```bash
vercel project inspect bills-workshop-finds
```

Expected: framework `vite`, output directory `dist` (or "default", which resolves to `dist` for Vite). If it detected something else, correct it before attaching the domain.

- [ ] **Step 8: Attach the subdomain**

```bash
vercel domains add finds.billsworkshopcompany.com bills-workshop-finds
```

Expected: the domain is added and, because `billsworkshopcompany.com` is on Vercel nameservers in this team, Vercel creates the DNS record itself and reports the domain as valid/configured. No registrar action is required.

If it instead prints a CNAME target and asks you to configure DNS manually, that means the apex is not resolving through Vercel DNS as expected — stop and report the exact target shown rather than guessing a record.

- [ ] **Step 9: Confirm the DNS record exists**

```bash
vercel dns list billsworkshopcompany.com
```

Expected: a record for the `finds` subdomain. Note that Vercel-managed apex domains may serve this via an internal record that does not appear in `dns list`; if the list is empty but Step 8 reported the domain as configured, proceed to Task 5 and let the live HTTP check be the arbiter.

---

### Task 5: Verify the deployment

**Files:** none — this task only reads.

**Interfaces:**
- Consumes: the production URL and domain from Task 4.
- Produces: the evidence that closes out the plan.

Set the base URL once. Prefer the custom domain, but if DNS has not propagated yet, run checks 1–5 against the production `.vercel.app` URL from Task 4 Step 6 and retry check 6 on the domain separately.

```bash
BASE=https://finds.billsworkshopcompany.com
curl -s -o /dev/null -w 'domain reachable: %{http_code}\n' "$BASE/"
```

If that prints `000` (DNS not resolving yet), substitute the deployment URL for the remaining checks:

```bash
BASE=https://<production-url-from-task-4-step-6>.vercel.app
```

and treat Step 6 as the one outstanding check to retry once DNS resolves. Do not mark Task 5 complete until Step 6 passes on the real domain.

- [ ] **Step 1: All five pages return 200 at their clean URLs**

```bash
for p in / /about /privacy /affiliate-disclosure /flight-attendant-travel-essentials; do
  printf "%-45s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code}' "$BASE$p")"
done
```

Expected: `200` on every line.

- [ ] **Step 2: The `.html` forms redirect**

```bash
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' "$BASE/about.html"
```

Expected: `308 -> https://finds.billsworkshopcompany.com/about`

- [ ] **Step 3: All four security headers are present**

```bash
curl -sI "$BASE/about" | grep -iE 'x-content-type-options|referrer-policy|x-frame-options|permissions-policy'
```

Expected: four lines matching the values in Global Constraints exactly.

- [ ] **Step 4: Hashed assets carry the immutable cache header**

```bash
ASSET=$(curl -s "$BASE/" | grep -o '/assets/[^"]*' | head -1)
echo "asset: $ASSET"
curl -sI "$BASE$ASSET" | grep -i 'cache-control'
```

Expected: `cache-control: public, max-age=31536000, immutable`

- [ ] **Step 5: `robots.txt` and `sitemap.xml` serve correctly**

```bash
curl -s -o /dev/null -w 'robots: %{http_code}\n' "$BASE/robots.txt"
curl -s -o /dev/null -w 'sitemap: %{http_code}\n' "$BASE/sitemap.xml"
curl -s "$BASE/sitemap.xml"
```

Expected: both `200`, and the sitemap lists five extensionless URLs with no `.html`.

- [ ] **Step 6: HTTPS on the custom domain**

```bash
curl -sI "$BASE/" | head -1
```

Expected: `HTTP/2 200`. A TLS error means the certificate is still being issued — wait and retry; Vercel issues it automatically once DNS resolves.

- [ ] **Step 7: Report results**

Report every check with its actual output. If any check failed, say so plainly with the output rather than describing the deployment as complete. Do not mark this task done on partial passes.

---

## Post-completion note for the user

The site is live but **earns nothing yet**: `main.js:2` has `amazonTag: ""`, so product buttons link to untagged Amazon search results. Before promoting the subdomain, set a valid Associates tracking ID and register `finds.billsworkshopcompany.com` as an approved website in Amazon Associates. Both were explicitly out of scope for this plan.
