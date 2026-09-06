create table if not exists public.member_score_records (
  id uuid primary key default gen_random_uuid(),
  line_user_id text not null,
  record_type text not null check (record_type in ('mock', 'official')),
  title text not null,
  exam_date date,
  region text,
  scores jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists member_score_records_user_created_idx
  on public.member_score_records (line_user_id, created_at desc);

alter table public.member_score_records enable row level security;
revoke all on table public.member_score_records from anon, authenticated;

-- Score records are personal planning data, so account deletion removes them
-- even though payment records remain anonymised for accounting purposes.
create or replace function public.delete_membership_account(p_line_user_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_line_user_id is null or length(trim(p_line_user_id)) = 0 then return false; end if;
  if exists (select 1 from public.membership_payments where line_user_id = p_line_user_id and status = 'paid' and expires_at > now()) then return false; end if;
  delete from public.member_score_records where line_user_id = p_line_user_id;
  update public.membership_payments set line_user_id = null, updated_at = now() where line_user_id = p_line_user_id;
  delete from public.line_login_sessions where line_user_id = p_line_user_id;
  return true;
end;
$$;
