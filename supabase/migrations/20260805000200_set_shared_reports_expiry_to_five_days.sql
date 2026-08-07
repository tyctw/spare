alter table public.shared_reports
  alter column expires_at set default (now() + interval '5 days');
