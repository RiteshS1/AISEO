create table if not exists public.reports (
  report_id uuid primary key default gen_random_uuid(),
  inputs jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);
