create table if not exists public.line_login_exchange_codes (
  code uuid primary key default gen_random_uuid(),
  line_session_token uuid not null references public.line_login_sessions(token) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists line_login_exchange_codes_expiry_idx
  on public.line_login_exchange_codes (expires_at) where used_at is null;

alter table public.line_login_exchange_codes enable row level security;
revoke all on table public.line_login_exchange_codes from public, anon, authenticated;
