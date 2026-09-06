-- Collaboration is opt-in and only available on member-created volunteer
-- shares.  The editor key is deliberately separate from the public token so
-- a normal read-only share cannot be used to change the list.
alter table public.shared_reports
  add column if not exists collaboration_key uuid unique,
  add column if not exists collaboration_version integer not null default 1,
  add column if not exists collaboration_confirmed_at timestamptz,
  add column if not exists collaboration_confirmed_by text;

create table if not exists public.shared_report_collaboration_events (
  id uuid primary key default gen_random_uuid(),
  report_token uuid not null references public.shared_reports(token) on delete cascade,
  event_type text not null check (event_type in ('comment', 'revision', 'confirmed')),
  actor_name text not null,
  message text,
  version integer,
  created_at timestamptz not null default now()
);

create index if not exists shared_report_collaboration_events_report_created_idx
  on public.shared_report_collaboration_events (report_token, created_at desc);

alter table public.shared_report_collaboration_events enable row level security;
revoke all on table public.shared_report_collaboration_events from anon, authenticated;
