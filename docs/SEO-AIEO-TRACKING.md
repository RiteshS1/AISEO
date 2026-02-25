# SEO & AIEO Verification + Tracking Benchmarks

Use this doc to verify production pre-flight changes and to track SEO and AIEO ranking/benchmarks over time.

---

## 1. Production pre-flight verification checklist

### Phase 1: Footer & legal
- [ ] **Footer (App.tsx)** – Links to `/privacy` and `/terms` with `target="_blank"` and `rel="noopener noreferrer"`.
- [ ] **`/privacy`** – Placeholder page exists (`app/privacy/page.tsx`), glassmorphic “Coming Soon”, Back to Home.
- [ ] **`/terms`** – Placeholder page exists (`app/terms/page.tsx`), same pattern.

### Phase 2: Metadata & social
- [ ] **Root layout** – `metadataBase` set to production URL (e.g. `https://aiseo-n9lz.vercel.app`).
- [ ] **Title** – “GetNifty AIEO | Dominate AI Search Visibility”.
- [ ] **Description** – AIEO value prop + free audit.
- [ ] **Keywords** – AIEO, AI Engine Optimization, ChatGPT visibility, Gemini ranking, LLM optimization, etc.
- [ ] **openGraph** – title, description, url, siteName, type.
- [ ] **twitter** – card, title, description.

### Phase 3: Crawlability
- [ ] **`/robots.txt`** (via `app/robots.ts`) – Allow `/`, Disallow `/dashboard/`, `/admin/`, `/api/`; sitemap URL present.
- [ ] **`/sitemap.xml`** (via `app/sitemap.ts`) – Public routes: `/`, `/register`, `/login`, `/privacy`, `/terms` with `lastModified` and priorities.

### Phase 4: Structured data (AIEO/SEO)
- [ ] **JSON-LD in layout** – First script: `Organization` + `SoftwareApplication` (GetNifty, BusinessApplication, AIEO description).
- [ ] **JSON-LD** – Second script: `FAQPage` with 5 Q&As unchanged.

**Quick URL checks after deploy:**
- `https://<your-domain>/robots.txt`
- `https://<your-domain>/sitemap.xml`
- `https://<your-domain>/privacy`
- `https://<your-domain>/terms`

---

## 2. SEO benchmarks to track

Use these to measure and improve traditional search performance.

| Metric | Tool / method | Frequency |
|--------|----------------|-----------|
| **Indexation** | Google Search Console → Coverage / Pages | Weekly |
| **Target keyword rankings** | GSC (Performance) or Ahrefs/SEMrush for “AIEO”, “AI Engine Optimization”, “GetNifty AIEO”, “AI visibility audit” | Weekly / monthly |
| **Core Web Vitals** | Search Console → Experience, or PageSpeed Insights | Monthly |
| **Clicks & impressions** | GSC → Performance | Weekly |
| **Backlinks** | Ahrefs / Moz / GSC (Links) | Monthly |
| **Sitemap status** | GSC → Sitemaps | After deploy, then monthly |

**Suggested target keywords (examples):**
- AIEO, AI Engine Optimization
- GetNifty AIEO, AI visibility audit
- ChatGPT visibility, Gemini ranking, LLM optimization
- AI SEO tools, answer engine optimization

---

## 3. AIEO benchmarks to track

Use these to measure how well the brand is understood and cited by AI engines (ChatGPT, Gemini, Perplexity).

| Benchmark | How to measure | Frequency |
|-----------|-----------------|-----------|
| **Brand mention in answers** | Ask ChatGPT / Perplexity / Gemini: “What is GetNifty?” or “Best AIEO tools?” and note if GetNifty is mentioned. | Monthly |
| **Citation / link in answers** | When the brand is mentioned, check if the answer links to the site or cites it. | Monthly |
| **Structured data visibility** | Use Google Rich Results Test or schema validators; ensure Organization + SoftwareApplication + FAQPage validate. | After changes, then quarterly |
| **Entity / knowledge** | Search “GetNifty AIEO” in each engine; note whether the product and value prop are described correctly. | Monthly |
| **Share / Discord preview** | Share homepage link in Discord/Slack/Twitter; confirm OG title, description, and image (if set) look correct. | After deploy |

**Optional tools (if you adopt them):**
- Dedicated AIEO/visibility platforms that track LLM citations (e.g. vendor-specific dashboards).
- Manual logs: simple spreadsheet with date, engine, query, “mentioned Y/N”, “cited Y/N”.

---

## 4. Optional: Google Search Console verification

To use GSC for indexation and performance data:

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add property for `https://aiseo-n9lz.vercel.app` (or your production domain).
3. Use the **HTML tag** method: copy the `content` value from the meta tag they give (e.g. `content="abc123..."`).
4. Add to the project via env: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<content-value>`.
5. In `app/layout.tsx` (or a dedicated component), render:
   `<meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />`
   only when the env var is set.

After verification, submit the sitemap URL in GSC (Sitemaps section).

---

## 5. Summary

- **Verification:** All four production pre-flight phases (footer/legal, metadata/OG, robots/sitemap, JSON-LD) are implemented as above; use the checklist to confirm after each deploy.
- **SEO tracking:** Use Google Search Console (and optionally Ahrefs/SEMrush) for indexation, rankings, Core Web Vitals, and sitemap health.
- **AIEO tracking:** Use manual monthly checks in ChatGPT, Gemini, and Perplexity for brand mention and citation, plus structured data validation and share preview checks.

Update this doc when you change the production URL, add new pages to the sitemap, or add new tracking tools.
