create extension if not exists pgcrypto;

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  region text not null check (region in ('taoyuan', 'kaohsiung', 'central', 'changhua', 'taipei', 'tainan', 'hsinchu')),
  name text not null,
  points numeric not null,
  credits numeric,
  type text,
  ownership text,
  vocational_group text,
  min_chinese numeric,
  min_english numeric,
  min_math numeric,
  min_science numeric,
  min_social numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists schools_region_points_idx
  on public.schools (region, points desc, credits desc nulls last);

create table if not exists public.volunteer_schools (
  id text primary key,
  region text,
  county text,
  code text,
  name text not null,
  level_info text,
  shift text,
  group_code text,
  group_name text,
  dept_code text,
  dept_name text,
  created_at timestamptz not null default now()
);

create index if not exists volunteer_schools_region_idx
  on public.volunteer_schools (region);

create table if not exists public.invitation_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code = upper(code)),
  active boolean not null default true,
  expires_at timestamptz,
  max_uses integer check (max_uses is null or max_uses > 0),
  use_count integer not null default 0 check (use_count >= 0),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.invitation_logs (
  id bigint generated always as identity primary key,
  action text not null,
  invitation_code text,
  success boolean not null,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.app_logs (
  id bigint generated always as identity primary key,
  region text,
  action text not null,
  invitation_code text,
  details jsonb not null default '{}'::jsonb,
  client_info jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  rating integer not null check (rating between 1 and 5),
  feedback text,
  client_info jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.error_reports (
  id bigint generated always as identity primary key,
  type text not null,
  description text not null,
  email text,
  client_info jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

insert into public.invitation_codes (code, active, note)
values ('TYCTW', true, '網站公開期間邀請碼')
on conflict (code) do nothing;

create or replace function public.consume_invitation_code(requested_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  consumed_id uuid;
begin
  update public.invitation_codes
  set use_count = use_count + 1
  where code = upper(trim(requested_code))
    and active = true
    and (expires_at is null or expires_at > now())
    and (max_uses is null or use_count < max_uses)
  returning id into consumed_id;

  return consumed_id is not null;
end;
$$;

revoke all on function public.consume_invitation_code(text) from public, anon, authenticated;
grant execute on function public.consume_invitation_code(text) to service_role;

alter table public.schools enable row level security;
alter table public.volunteer_schools enable row level security;
alter table public.invitation_codes enable row level security;
alter table public.invitation_logs enable row level security;
alter table public.app_logs enable row level security;
alter table public.feedback enable row level security;
alter table public.error_reports enable row level security;

revoke all on table public.schools from anon, authenticated;
revoke all on table public.volunteer_schools from anon, authenticated;
revoke all on table public.invitation_codes from anon, authenticated;
revoke all on table public.invitation_logs from anon, authenticated;
revoke all on table public.app_logs from anon, authenticated;
revoke all on table public.feedback from anon, authenticated;
revoke all on table public.error_reports from anon, authenticated;
