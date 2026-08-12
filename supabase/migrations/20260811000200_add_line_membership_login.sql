alter table public.membership_payments
  add column if not exists line_user_id text;

create index if not exists membership_payments_line_user_status_idx
  on public.membership_payments (line_user_id, status, expires_at desc)
  where line_user_id is not null;

create table if not exists public.line_login_sessions (
  token uuid primary key default gen_random_uuid(),
  line_user_id text not null,
  display_name text,
  picture_url text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists line_login_sessions_user_idx
  on public.line_login_sessions (line_user_id, expires_at desc);

alter table public.line_login_sessions enable row level security;
revoke all on table public.line_login_sessions from public, anon, authenticated;
