create table if not exists public.support_payments (
  id uuid primary key default gen_random_uuid(),
  merchant_trade_no text not null unique,
  amount integer not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  payment_method text,
  status_lookup_token uuid not null unique default gen_random_uuid(),
  payment_type text,
  ecpay_trade_no text,
  paid_at timestamptz,
  callback_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.support_payments enable row level security;
