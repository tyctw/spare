-- Serialize owned-share creation with account deletion. A request that already
-- passed the HTTP session check must not insert a share after deletion commits.
create or replace function public.guard_shared_report_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.owner_line_user_id is not null then
    perform pg_advisory_xact_lock(hashtext('membership-share-lifecycle'), hashtext(new.owner_line_user_id));
    if not exists (
      select 1 from public.line_login_sessions
      where line_user_id = new.owner_line_user_id
        and cookie_only = true and expires_at > clock_timestamp()
    ) then
      raise exception 'SHARE_OWNER_SESSION_EXPIRED';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.guard_shared_report_owner() from public, anon, authenticated;

create trigger shared_report_owner_session_guard
before insert or update of owner_line_user_id on public.shared_reports
for each row execute function public.guard_shared_report_owner();

create or replace function public.delete_membership_account(p_line_user_id text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if p_line_user_id is null or length(trim(p_line_user_id)) = 0 then return false; end if;
  perform pg_advisory_xact_lock(hashtext('membership-share-lifecycle'), hashtext(p_line_user_id));
  if exists (
    select 1 from public.membership_payments
    where line_user_id = p_line_user_id and status = 'paid' and expires_at > now()
  ) then return false; end if;

  -- The existing ON DELETE CASCADE foreign keys remove collaboration events
  -- and volunteer versions; both read tokens and editor keys stop resolving.
  delete from public.shared_reports where owner_line_user_id = p_line_user_id;
  delete from public.member_score_records where line_user_id = p_line_user_id;
  update public.membership_payments set line_user_id = null, updated_at = now()
    where line_user_id = p_line_user_id;
  delete from public.line_login_sessions where line_user_id = p_line_user_id;
  return true;
end;
$$;
revoke all on function public.delete_membership_account(text) from public, anon, authenticated;
grant execute on function public.delete_membership_account(text) to service_role;
