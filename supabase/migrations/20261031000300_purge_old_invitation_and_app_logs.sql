-- Bound operational logs. This only deletes old rows; it does not change
-- what the application writes into invitation_logs or app_logs.
create extension if not exists pg_cron;

do $$
declare
  existing_job_id bigint;
begin
  -- Replacing the named job makes this migration safe to re-run during a
  -- repair or a restored deployment.
  for existing_job_id in
    select jobid from cron.job where jobname = 'purge_old_invitation_and_app_logs'
  loop
    perform cron.unschedule(existing_job_id);
  end loop;

  perform cron.schedule(
    'purge_old_invitation_and_app_logs',
    '30 3 * * *',
    $cleanup$
      delete from public.invitation_logs where created_at < now() - interval '30 days';
      delete from public.app_logs where created_at < now() - interval '30 days';
    $cleanup$
  );
end;
$$;
