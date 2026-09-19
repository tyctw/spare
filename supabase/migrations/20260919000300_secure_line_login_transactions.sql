-- Version 1 exchange URLs carried their own verifier. Never redeem them via v2.
alter table public.line_login_exchange_codes
  add column if not exists binding_version integer not null default 1;

create table public.line_login_transactions (
  state uuid primary key default gen_random_uuid(),
  nonce text not null,
  pkce_verifier text not null,
  browser_challenge text not null check (browser_challenge ~ '^[A-Za-z0-9_-]{43}$'),
  return_path text not null,
  expires_at timestamptz not null default now() + interval '10 minutes'
);
create index line_login_transactions_expiry_idx on public.line_login_transactions(expires_at);
alter table public.line_login_transactions enable row level security;
revoke all on table public.line_login_transactions from public, anon, authenticated;
grant select, insert, delete on table public.line_login_transactions to service_role;

-- pg_cron is enabled by the existing shared-report cleanup migration.
select cron.schedule(
  'purge_expired_line_login_transactions', '*/10 * * * *',
  $$delete from public.line_login_transactions where expires_at <= now()$$
);
