alter table public.line_login_exchange_codes
  add column if not exists binding_hash text;

create index if not exists line_login_exchange_codes_binding_idx
  on public.line_login_exchange_codes (code, binding_hash)
  where used_at is null;
