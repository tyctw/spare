-- Defence in depth for personal score records. Browser clients have no direct
-- table or RPC access: every read/write goes through the backend, which checks
-- the HttpOnly LINE session and scopes records to that account.
revoke all on table public.member_score_records from public, anon, authenticated;

-- This security-definer function is only used by the backend service role.
-- Revoking its default PUBLIC execute privilege prevents direct RPC calls from
-- supplying another account's LINE user id.
revoke all on function public.delete_membership_account(text) from public, anon, authenticated;
