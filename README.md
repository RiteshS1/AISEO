# AISEO by Ritesh Sharma

AI Visibility Audit: submit brand audits for human approval, generate them with Gemini and Groq fallback after approval, and publish verified reports through Supabase. Next.js 15, App Router.

## Setup

- **Node 18+**, **Yarn**
- Copy env (see table below) into `.env.local`
- Supabase: run [supabase/schema.sql](supabase/schema.sql) in the new project. Set `profiles.is_admin = true` for the admin account.

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Gemini API key (server-side audit). |
| `GROQ_API_KEY` | No | Optional final fallback API key after Gemini provider failures. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon (publishable) key for Auth. |
| `NEXT_PRIVATE_SERVICE_ROLE_API_KEY` | Yes | Supabase service role key; server-only. |
| `DISCORD_WEBHOOK_URL` | Yes | Discord webhook for approval requests (brand, email, score, review link). |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL | Used for Discord review and public report links. |
| `GEMINI_MODEL` | No | Primary model (default: `gemini-2.5-flash`). |
| `GEMINI_FALLBACK_MODEL` | No | Fallback on 429/503 (default: `gemini-1.5-flash`). |
| `GROQ_MODEL` | No | Groq fallback model (default: `llama-3.3-70b-versatile`). |

## Commands

- `yarn dev` — Dev server
- `yarn build` / `yarn start` — Production
- `yarn lint` — ESLint
- `yarn validate-gemini` — Validate API key(s) in `.env.local`

## Flow

Audit form → `POST /api/audit` (Zod) → draft saved to Supabase. User enters contact details → `POST /api/request-approval` sets `pending_approval` and sends a Discord review link. An authenticated admin opens `/admin/review/[reportId]`, approves generation, reviews the Gemini or Groq output, and publishes it. Reports move through `draft`, `pending_approval`, `generating`, `in_review`, `published`, or `rejected`. Only published reports are publicly readable.

## Code structure

- **app/** — Next.js 15 App Router: `page.tsx` (home → `App`), `login`/`register`, `dashboard/*` (protected), `report/[reportId]` (auth-aware layout), `admin/review/[reportId]` (admin-protected), `api/*` (audit, approve, deny, publish, rerun, report, request-approval, me).
- **components/** — `AuditTool` (form, scanning, gate, report viewer), `Navbar` (public).
- **lib/** — `supabase/server` (auth), `supabase/client` (browser), `supabaseServer` (service-role + reports/profiles), `adminServer`, `auditServer`, `discordServer`, `schemas/*`.
- **middleware** — Supabase SSR auth; redirects unauthenticated `/dashboard/*` and `/admin/*` routes to `/login?next=...`. Admin pages and mutations also verify `profiles.is_admin` server-side.

## Database

`supabase/schema.sql` is the canonical schema for a fresh Supabase project. It defines nullable report results for draft creation, the HITL `report_status` state machine, report ownership, admin notes, and `profiles.is_admin`.

## SEO & AIEO tracking

- **Verification checklist and benchmarks:** See [docs/SEO-AIEO-TRACKING.md](docs/SEO-AIEO-TRACKING.md) to verify production pre-flight (metadata, robots, sitemap, JSON-LD) and to track SEO and AIEO ranking/benchmarks (Search Console, Core Web Vitals, AI engine visibility).
- **Google Search Console:** Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the verification code from GSC to add the site-verification meta tag.

## Deploy (Vercel)

Import repo, set the env vars above for Production, deploy, and run `supabase/schema.sql` once in the new Supabase project. Do not commit `.next` (build output); it is in `.gitignore`. If `.next` was ever committed, run from the app root: `git rm -r --cached .next` then commit.
