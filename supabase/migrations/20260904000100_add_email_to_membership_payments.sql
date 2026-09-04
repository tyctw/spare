alter table public.membership_payments
  add column if not exists contact_email text;
