create table if not exists public.membership_payments (
  id uuid primary key default gen_random_uuid(),
  merchant_trade_no text not null unique,
  membership_token uuid not null unique default gen_random_uuid(),
  plan text not null check (plan in ('monthly', 'yearly')),
  amount integer not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  ecpay_trade_no text,
  payment_type text,
  paid_at timestamptz,
  expires_at timestamptz,
  callback_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists membership_payments_ecpay_trade_no_unique_idx
  on public.membership_payments (ecpay_trade_no) where ecpay_trade_no is not null;

create index if not exists membership_payments_token_status_idx
  on public.membership_payments (membership_token, status, expires_at desc);

alter table public.membership_payments enable row level security;
revoke all on table public.membership_payments from public, anon, authenticated;
