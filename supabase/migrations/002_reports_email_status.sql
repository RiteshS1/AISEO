alter table public.reports
  add column if not exists email text,
  add column if not exists status text;