-- One LINE LIFF ID token can create only one membership session.
-- Store the token hash, never the token or the LINE user id.
create table public.liff_id_token_replay (
  token_hash text primary key,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index liff_id_token_replay_expiry_idx
  on public.liff_id_token_replay (expires_at);

alter table public.liff_id_token_replay enable row level security;
revoke all on table public.liff_id_token_replay from public, anon, authenticated;
grant select, insert, delete on table public.liff_id_token_replay to service_role;

-- pg_cron is enabled by the existing shared-report cleanup migration.
select cron.schedule(
  'purge_expired_liff_id_token_replay', '*/10 * * * *',
  $$delete from public.liff_id_token_replay where expires_at <= now()$$
);
