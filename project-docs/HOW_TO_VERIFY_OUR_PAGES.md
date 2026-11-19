# What was given, what was built, and how to check it

Simple English guide. This file explains the work that was done and the exact steps to check that everything still works.

---

## 1. What was given to us

You gave us two website designs to copy the style and sections from:

1. **InTheWork** — a Framer template for a complete B2B SaaS website. It includes Home, Pricing, Integrations, Careers, Resources/Blog, Legal pages, 404, Contact Sales, About Us, Login and Sign Up.
2. **Nonlinear Calendar** — a dark Framer landing page with a calendar product mockup, statistics, feature tabs, testimonials, blog cards, FAQ and a final call-to-action.

The rules you gave were:

- Do **not** change or break the existing Dropflow pages.
- Put every new page on a **new route** whose name ends in `new` (example: `/homenew`).
- Make each page look like the design that was given, but use the Dropflow design system and colours where possible.
- Commit and push each page separately.
- Later, replicate the Nonlinear page exactly as a new dark page.

---

## 2. What was built and on which route

All of these are **new** files and new routes. The old pages (`/`, `/pricing`, `/login`, `/signup`, `/dashboard/*`, `/docs`, `/features`, etc.) were not changed.

### Pages from the InTheWork template

| Route | What is on it |
|---|---|
| `/homenew` | Hero, pain-point statistics, comparison table, AI feature bento grid, role tabs, testimonials, value metrics, pricing teaser, FAQ, final CTA |
| `/pricingnew` | Three plans (Free / Pro / Business), monthly–annual toggle, full feature comparison table, pricing FAQ, enterprise callout |
| `/integrationsnew` | Search and filter directory of integrations (CMS, Ecommerce, Productivity, Automation) |
| `/integrationsnew/[slug]` | Detail template for one integration, with setup steps and related integrations |
| `/careersnew` | Job list with filters for department, location and work arrangement |
| `/careersnew/[slug]` | Job detail page with responsibilities, requirements and an Apply button |
| `/resourcesnew` | Reports, news, announcements and guides, with filters and a newsletter preview form |
| `/resourcesnew/[slug]` | Full article page with table of contents and related posts |
| `/changelognew` | Timeline of product releases |
| `/privacypolicynew` | Privacy Policy (clearly marked as a draft template) |
| `/termsnew` | Terms of Service (clearly marked as a draft template) |
| `/cookiesnew` | Cookie Policy (clearly marked as a draft template) |
| `/404new` | Custom "page not found" page with links to the main new routes |
| `/aboutnew` | About us: story, values, timeline, team and statistics |
| `/contact-salesnew` | Contact sales form (preview only — it does not save anything) |
| `/loginnew` | Login page using the real Dropflow login form |
| `/signupnew` | Sign-up page using the real Dropflow sign-up form |

### Nonlinear replica

| Route | What is on it |
|---|---|
| `/nonlinearnew` | A dark standalone page that copies the Nonlinear Calendar design: hero with a calendar mockup, logo strip, feature cards, numbered Plan/Schedule/Focus/Sync tabs, statistics, "calmer week" cards, four calendar views, testimonials, blog cards, FAQ and final CTA |

This page uses its own dark layout, so it does not show the normal Dropflow header or footer.

### Helpful links

Every new page has a small **"Template pages"** strip near the bottom with links to all the other new pages. You can use it to move between them quickly.

---

## 3. How to check and verify everything

### Step 1 — Start the project

The project needs three things running: the database, the API, and the web app.

```powershell
# 1. Database (PostgreSQL on port 5434)
& 'C:\Program Files\PostgreSQL\18\bin\pg_isready.exe' -h 127.0.0.1 -p 5434

# 2. API (port 3011) — run from dropflow-api
$env:PORT='3011'; pnpm start

# 3. Web app (port 3000) — run from dropflow-web
pnpm dev
```

If the database is not responding, start it with:

```powershell
powershell -File scripts/start-local-db.ps1
```

Quick check that all three are alive:

```powershell
(Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3011/health).StatusCode   # expect 200
(Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/homenew).StatusCode   # expect 200
```

> Note: port 3001 is sometimes used by another project on this computer. That is why the API uses port 3011.

### Step 2 — Look at the pages in a browser

Open these addresses and check that each page loads, looks right, and that the interactive parts work:

```
http://127.0.0.1:3000/homenew
http://127.0.0.1:3000/pricingnew           (click the monthly/annual toggle)
http://127.0.0.1:3000/integrationsnew      (search and filter)
http://127.0.0.1:3000/integrationsnew/contentful
http://127.0.0.1:3000/careersnew           (filter the jobs)
http://127.0.0.1:3000/careersnew/senior-backend-engineer
http://127.0.0.1:3000/resourcesnew         (filter articles, try the newsletter preview)
http://127.0.0.1:3000/resourcesnew/state-of-upload-infrastructure-2026
http://127.0.0.1:3000/changelognew
http://127.0.0.1:3000/aboutnew
http://127.0.0.1:3000/contact-salesnew
http://127.0.0.1:3000/loginnew
http://127.0.0.1:3000/signupnew
http://127.0.0.1:3000/privacypolicynew
http://127.0.0.1:3000/termsnew
http://127.0.0.1:3000/cookiesnew
http://127.0.0.1:3000/404new
http://127.0.0.1:3000/nonlinearnew         (tabs and FAQ should open and close)
```

Also open the **old** pages to make sure they were not broken: `/`, `/pricing`, `/login`, `/signup`, `/dashboard`, `/docs`, `/features`.

### Step 3 — Run the automatic checks

Run these from the `dropflow` folder:

```powershell
# Full gate — this is the most important check (15 steps)
$env:API_URL='http://127.0.0.1:3011'
powershell -File scripts/verify-all.ps1
```

Expected result at the end:

```
ALL VERIFICATION STEPS PASSED
```

The 15 steps cover: API build, API unit tests, migrations, integration smoke test, authorization checks, security regressions, rate limiting, web typecheck, web unit tests, web build, SDK build/tests/consumer check, and React typecheck/build.

If you only want to check the web pages:

```powershell
cd dropflow-web
pnpm typecheck     # expect no errors
pnpm build         # expect "Compiled successfully"
```

### Step 4 — Check Git

```powershell
cd C:\Users\ASUS\Downloads\Projects\dropflow
git status --short                       # should be empty after a push
git log --oneline -10                    # shows Page Create 1 … 8 and "dropflow"
git ls-remote origin refs/heads/main     # shows the same commit SHA as your local HEAD
```

### Step 5 — What "good" looks like

- Every URL above opens with no error page.
- The monthly/annual toggle, tab selectors, filters and FAQ accordions actually change the page.
- `pnpm typecheck` and `pnpm build` finish without errors.
- `verify-all.ps1` prints **ALL VERIFICATION STEPS PASSED**.
- `git status --short` prints nothing after pushing.

### Known harmless warnings

In development mode, Next.js may show a small "8 Issues" badge. These are accessibility notices from the project's existing shared `Button` component when it renders as a link (`nativeButton` is not set to `false`). They do not stop the build or break the pages, and the production build passes. They can be cleaned up separately if you want the development badge gone.

---

## 4. Where the changes are stored

Everything was committed to GitHub:

```
https://github.com/Nirikshb/drop-flow
```

Branch: `main`

The page commits are named `Page Create 1` through `Page Create 8`, followed by a final commit named `dropflow` that adds this guide.
