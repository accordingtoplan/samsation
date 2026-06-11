# Website sitemap

The site is small by design. It loads fast. It holds still.

## Top-level pages

- `/` — **Home**
- `/about/` — **About Sam**
- `/method/` — **The method**
- `/services/` — **Work with Sam**
  - `/services/private/`
  - `/services/mentorship/` (coach's-coach)
  - `/services/recovery/` (post-surgery / postnatal)
- `/retreats/` — **Retreats**
- `/library/` — **Library** (the 21 topic pages)
  - `/library/{topic-slug}/` × 21
- `/substack/` — **Writing** (external link to Substack, also mirrored excerpts)
- `/contact/` — **Contact**

## Hidden / footer-only

- `/privacy/`
- `/terms/`
- `/press/` (when there is press)

## What is **not** on the site

- No testimonials page. Testimonials surface contextually on
  Services pages, never as a wall of social proof.
- No pricing page. Pricing is disclosed in the enquiry response.
- No blog (Substack plays that role).
- No podcast page (not a format SamSation is committing to in
  year one).
- No login / member area. The library is open.

## Navigation

Primary (top):

- About · Method · Work with Sam · Retreats · Library · Writing

Secondary (footer):

- Contact · Privacy · Terms · Instagram · Substack

Rule: **six top-level nav items maximum.** If we add one, we drop
one.

## URL conventions

- Lowercase, kebab-case slugs.
- Trailing slashes on all folder-style URLs.
- No query strings in public links.
- Canonical URL always the trailing-slash version.

## Site metadata

- **Site name**: SamSation
- **Tagline (meta)**: A Practice in Real Life Movement
- **Default OG image**: Sam in profile, film grain, off-white
  background (per `brand/identity/visual-system.json`).
- **Favicon / avatar**: artichoke accent mark on off-white
  (pending final illustration — see `visual-system.json →
  open_questions`).

## Performance targets

- First contentful paint < 1.2s on 4G.
- Weight of home page < 800kb.
- No third-party tag manager. Plausible or Fathom only for
  analytics.
- No autoplay anything.

## Accessibility baseline

- WCAG 2.2 AA.
- All topic-page videos have captions.
- Contrast at AA minimum — re-check charcoal on off-white.
- Focus rings visible.
- Alt text on every image, written in the voice (not
  "photograph of woman lifting weight").
