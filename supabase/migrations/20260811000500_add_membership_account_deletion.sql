-- Delete the LINE-linked membership account only after every paid entitlement
-- has expired. Financial transaction records remain for accounting purposes,
-- but their direct LINE identity link is removed.
create or replace function public.delete_membership_account(p_line_user_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_line_user_id is null or length(trim(p_line_user_id)) = 0 then
    return false;
  end if;

  if exists (
    select 1
    from public.membership_payments
    where line_user_id = p_line_user_id
      and status = 'paid'
      and expires_at > now()
  ) then
    return false;
  end if;

  update public.membership_payments
  set line_user_id = null,
      updated_at = now()
  where line_user_id = p_line_user_id;

  delete from public.line_login_sessions
  where line_user_id = p_line_user_id;

  return true;
end;
$$;

revoke all on function public.delete_membership_account(text) from public, anon, authenticated;
grant execute on function public.delete_membership_account(text) to service_role;
