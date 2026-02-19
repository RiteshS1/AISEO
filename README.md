# AIEO by GetNifty

AI Visibility Audit: run brand audits via Gemini, store reports in Supabase, sync leads to MailerLite. Next.js 15, App Router.

## Setup

- **Node 18+**, **Yarn**
- Copy env (see table below) into `.env.local`
- Supabase: run `supabase/migrations/001_reports.sql` so the `reports` table exists with `report_id`, `inputs`, `result`

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Gemini API key (server-side audit). |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL. |
| `NEXT_PRIVATE_SERVICE_ROLE_API_KEY` | Yes | Supabase service role key. (`SUPABASE_SERVICE_ROLE_KEY` supported as fallback.) |
| `MAILERLITE_API_KEY` | For CRM | Report URL is sent to the `assessment` field. |
| `GEMINI_MODEL` | No | Primary model (default: `gemini-2.5-flash`). |
| `GEMINI_FALLBACK_MODEL` | No | Fallback on 429/503 (default: `gemini-1.5-flash`). |

## Commands

- `yarn dev` — Dev server
- `yarn build` / `yarn start` — Production
- `yarn lint` — ESLint
- `yarn validate-gemini` — Validate API key(s) in `.env.local`

## Flow

Audit form → `POST /api/audit` (Gemini + Zod) → report saved to Supabase → `reportId` returned. Share link `/report/[reportId]` loads cached report. Email gate → `POST /api/mailerlite` with `reportId` → server sets full report URL in MailerLite `assessment`.

## Deploy (Vercel)

Import repo, set the env vars above for Production, deploy. Ensure Supabase `reports` table uses `report_id` (see migration). Do not commit `.next` (build output); it is in `.gitignore`. If `.next` was ever committed, run from the app root: `git rm -r --cached .next` then commit.
