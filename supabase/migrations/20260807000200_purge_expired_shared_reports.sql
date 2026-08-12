-- Shared-report links expire after five days, but expiry alone does not remove
-- the underlying JSON payload. Keep the table bounded even when the site has
-- no traffic by deleting expired reports on a database schedule.
create index if not exists shared_reports_expires_at_idx
  on public.shared_reports (expires_at);

create extension if not exists pg_cron;

do $$
declare
  existing_job_id bigint;
begin
  -- Replacing the named job makes this migration safe to re-run during a
  -- repair or a restored deployment.
  for existing_job_id in
    select jobid from cron.job where jobname = 'purge_expired_shared_reports'
  loop
    perform cron.unschedule(existing_job_id);
  end loop;

  perform cron.schedule(
    'purge_expired_shared_reports',
    '17 * * * *',
    $cleanup$delete from public.shared_reports where expires_at <= now()$cleanup$
  );
end;
$$;
