# AIEO by GetNifty

AI Visibility Audit: run brand audits via Gemini, store reports in Supabase, human-in-the-loop approval via Discord, then sync approved leads to MailerLite. Next.js 15, App Router.

## Setup

- **Node 18+**, **Yarn**
- Copy env (see table below) into `.env.local`
- Supabase: run migrations `001_reports.sql`, `002_reports_email_status.sql`, and `003_profiles_and_report_ownership.sql` (reports + profiles + `user_id` on reports).

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Gemini API key (server-side audit). |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon (publishable) key for Auth. |
| `NEXT_PRIVATE_SERVICE_ROLE_API_KEY` | Yes | Supabase service role key. (`SUPABASE_SERVICE_ROLE_KEY` supported as fallback.) |
| `DISCORD_WEBHOOK_URL` | Yes | Discord webhook for approval requests (brand, email, score, review link). |
| `MAILERLITE_API_KEY` | For CRM | Used only after approval; report URL is sent to the `assessment` field. |
| `MAILERLITE_GROUP_ID` | For CRM | Optional. If set, new subscribers are added to this group. **MailerLite automation:** use trigger "When a subscriber joins a group" and select the AISEO LEADS group so workflows run for new signups. |
| `GEMINI_MODEL` | No | Primary model (default: `gemini-2.5-flash`). |
| `GEMINI_FALLBACK_MODEL` | No | Fallback on 429/503 (default: `gemini-1.5-flash`). |

## Commands

- `yarn dev` — Dev server
- `yarn build` / `yarn start` — Production
- `yarn lint` — ESLint
- `yarn validate-gemini` — Validate API key(s) in `.env.local`

## Flow

Audit form → `POST /api/audit` (Gemini + Zod) → report saved to Supabase → `reportId` returned. User enters email at gate → `POST /api/request-approval` (stores email, sets status `pending`, sends Discord embed with review link). Admin opens `/admin/review/[reportId]` from Discord → reviews report → "Approve & Send to CRM" (`POST /api/approve`) or "Deny" (`POST /api/deny`). Approved reports sync to MailerLite. Share link `/report/[reportId]` loads cached report; authenticated users see it in the dashboard sidebar layout.

## Code structure

- **app/** — Next.js 15 App Router: `page.tsx` (home → `App`), `login`/`register`, `dashboard/*` (protected), `report/[reportId]` (auth-aware layout), `admin/review/[reportId]` (no auth; Discord link), `api/*` (audit, approve, deny, report, request-approval, me).
- **components/** — `AuditTool` (form, scanning, gate, report viewer), `Navbar` (public).
- **lib/** — `supabase/server` (auth), `supabase/client` (browser), `supabaseServer` (service-role + reports/profiles), `auditServer`, `discordServer`, `mailerliteServer`, `schemas/*`.
- **middleware** — Supabase SSR auth; redirects unauthenticated `/dashboard/*` to `/login?next=...`; `/admin/review/*` is intentionally unprotected.

## Migrations

**Keep all SQL migration files.** They are the source of truth for the Supabase schema. Run them in order (001 → 002 → 003) when setting up a new environment. Do not delete or edit applied migrations.

## Deploy (Vercel)

Import repo, set the env vars above for Production, deploy. Run both Supabase migrations. Do not commit `.next` (build output); it is in `.gitignore`. If `.next` was ever committed, run from the app root: `git rm -r --cached .next` then commit.
