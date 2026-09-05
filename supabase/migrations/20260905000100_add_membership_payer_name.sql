-- Store the payer's name with the membership order. The contact_email column
-- already stores the payer email and is used for payment notifications.
alter table public.membership_payments
  add column if not exists payer_name text;

alter table public.membership_payments
  add constraint membership_payments_payer_name_length
  check (payer_name is null or char_length(payer_name) between 1 and 80) not valid;
