-- Persist contact name from gate form for MailerLite {$name} in follow-up emails
alter table public.reports
  add column if not exists contact_name text;
