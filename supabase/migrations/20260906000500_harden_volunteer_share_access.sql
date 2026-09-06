-- New volunteer shares record their creator, can be revoked immediately, and
-- never default to an unlimited lifetime.
alter table public.shared_reports
  add column if not exists owner_line_user_id text,
  add column if not exists revoked_at timestamptz;

create index if not exists shared_reports_owner_created_idx
  on public.shared_reports (owner_line_user_id, created_at desc)
  where owner_line_user_id is not null;

-- Legacy permanent links predate ownership metadata, so they cannot be safely
-- revoked by a verified creator. Give them a short transition window instead
-- of leaving leaked links valid forever.
update public.shared_reports
  set expires_at = now() + interval '7 days'
  where owner_line_user_id is null and expires_at is null;
