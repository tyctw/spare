-- Regular shared reports remain five-day snapshots. A null expiry is reserved
-- for permanent volunteer-list links created by the backend after it verifies
-- the caller has an active membership.
alter table public.shared_reports
  alter column expires_at drop not null;

comment on column public.shared_reports.expires_at is
  'Null only for permanent volunteer shares created for an active member; otherwise the report expiry timestamp.';
