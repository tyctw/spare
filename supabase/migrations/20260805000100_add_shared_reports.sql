create table if not exists public.shared_reports (
  id uuid primary key default gen_random_uuid(),
  token uuid not null unique default gen_random_uuid(),
  kind text not null check (kind in ('analysis', 'volunteer')),
  payload jsonb not null,
  expires_at timestamptz not null default (now() + interval '5 days'),
  created_at timestamptz not null default now()
);

create index if not exists shared_reports_token_expires_idx
  on public.shared_reports (token, expires_at);

alter table public.shared_reports enable row level security;
revoke all on table public.shared_reports from anon, authenticated;
