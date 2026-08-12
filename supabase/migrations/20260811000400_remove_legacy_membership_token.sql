-- Membership entitlement is bound exclusively to the verified LINE user ID.
-- Remove the retired bearer-like token and its lookup index so future code
-- cannot accidentally restore token-only membership checks.
drop index if exists public.membership_payments_token_status_idx;

alter table public.membership_payments
  drop column if exists membership_token;
