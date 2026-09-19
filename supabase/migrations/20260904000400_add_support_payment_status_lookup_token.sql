-- Keep the schema in sync with the payment-status endpoint. Existing live
-- databases may have received this column manually before it was versioned.
alter table public.support_payments
  add column if not exists status_lookup_token uuid;

update public.support_payments
set status_lookup_token = gen_random_uuid()
where status_lookup_token is null;

alter table public.support_payments
  alter column status_lookup_token set default gen_random_uuid(),
  alter column status_lookup_token set not null;

create unique index if not exists support_payments_status_lookup_token_unique_idx
  on public.support_payments (status_lookup_token);
