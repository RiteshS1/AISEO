create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  audit_count integer not null default 0,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  report_id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  inputs jsonb not null,
  result jsonb,
  email text,
  contact_name text,
  report_status text not null default 'draft'
    check (report_status in ('draft', 'pending_approval', 'generating', 'in_review', 'published', 'rejected')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reports_user_id_idx on public.reports(user_id);
create index if not exists reports_status_idx on public.reports(report_status);

alter table public.profiles enable row level security;
alter table public.reports enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can read own reports" on public.reports;
create policy "Users can read own reports"
  on public.reports for select
  using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
