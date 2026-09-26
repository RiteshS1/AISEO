create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  audit_count integer not null default 0,
  credits_remaining integer not null default 2 check (credits_remaining >= 0),
  credits_used integer not null default 0 check (credits_used >= 0),
  plan text not null default 'free' check (plan in ('free', 'pro', 'agency')),
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists credits_remaining integer not null default 2;
alter table public.profiles add column if not exists credits_used integer not null default 0;
alter table public.profiles add column if not exists is_admin boolean not null default false;
alter table public.profiles add column if not exists plan text not null default 'free';

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  razorpay_order_id text not null unique,
  razorpay_payment_id text unique,
  amount integer not null check (amount > 0),
  currency text not null default 'INR',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  pack_type text not null check (pack_type in ('pro', 'agency')),
  credits integer not null check (credits > 0),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists payment_orders_user_id_idx on public.payment_orders(user_id);

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

alter table public.profiles drop constraint if exists profiles_credits_remaining_check;
alter table public.profiles add constraint profiles_credits_remaining_check check (credits_remaining >= 0);
alter table public.profiles drop constraint if exists profiles_credits_used_check;
alter table public.profiles add constraint profiles_credits_used_check check (credits_used >= 0);
alter table public.profiles drop constraint if exists profiles_plan_check;
alter table public.profiles add constraint profiles_plan_check check (plan in ('free', 'pro', 'agency'));

alter table public.profiles enable row level security;
alter table public.reports enable row level security;
alter table public.payment_orders enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can read own reports" on public.reports;
create policy "Users can read own reports"
  on public.reports for select
  using (auth.uid() = user_id);

drop policy if exists "Users can read own payment orders" on public.payment_orders;
create policy "Users can read own payment orders"
  on public.payment_orders for select
  using (auth.uid() = user_id);

create or replace function public.reserve_audit_slot(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set credits_remaining = credits_remaining - 1,
      credits_used = credits_used + 1,
      audit_count = audit_count + 1,
      updated_at = now()
  where id = p_user_id and credits_remaining > 0;
  return found;
end;
$$;

create or replace function public.refund_audit_slot(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set credits_remaining = credits_remaining + 1,
      credits_used = greatest(credits_used - 1, 0),
      audit_count = greatest(audit_count - 1, 0),
      updated_at = now()
  where id = p_user_id and credits_used > 0;
  return found;
end;
$$;

drop function if exists public.fulfill_payment(text, text);
create or replace function public.fulfill_payment(p_order_id text, p_payment_id text, p_pack_type text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  payment public.payment_orders;
begin
  if p_pack_type not in ('pro', 'agency') then return false; end if;
  select * into payment from public.payment_orders where razorpay_order_id = p_order_id for update;
  if not found then return false; end if;
  if payment.pack_type <> p_pack_type then return false; end if;
  if payment.status = 'paid' then return payment.razorpay_payment_id = p_payment_id; end if;
  update public.profiles
  set credits_remaining = credits_remaining + payment.credits,
      plan = p_pack_type,
      updated_at = now()
  where id = payment.user_id;
  if not found then return false; end if;
  update public.payment_orders
  set status = 'paid', razorpay_payment_id = p_payment_id, paid_at = now()
  where razorpay_order_id = p_order_id;
  return true;
end;
$$;

create or replace function public.reject_report_and_refund(p_report_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  report_user_id uuid;
begin
  select user_id into report_user_id
  from public.reports
  where report_id = p_report_id
    and report_status in ('pending_approval', 'in_review')
  for update;
  if not found then return false; end if;
  if report_user_id is null then return false; end if;
  update public.profiles
  set credits_remaining = credits_remaining + 1,
      credits_used = greatest(credits_used - 1, 0),
      audit_count = greatest(audit_count - 1, 0),
      updated_at = now()
  where id = report_user_id and credits_used > 0;
  if not found then return false; end if;
  update public.reports set report_status = 'rejected', updated_at = now() where report_id = p_report_id;
  return true;
end;
$$;

revoke execute on function public.reserve_audit_slot(uuid) from public, anon, authenticated;
revoke execute on function public.refund_audit_slot(uuid) from public, anon, authenticated;
revoke execute on function public.fulfill_payment(text, text, text) from public, anon, authenticated;
revoke execute on function public.reject_report_and_refund(uuid) from public, anon, authenticated;
grant execute on function public.reserve_audit_slot(uuid) to service_role;
grant execute on function public.refund_audit_slot(uuid) to service_role;
grant execute on function public.fulfill_payment(text, text, text) to service_role;
grant execute on function public.reject_report_and_refund(uuid) to service_role;

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
