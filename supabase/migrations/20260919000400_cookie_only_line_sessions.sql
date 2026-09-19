-- Existing sessions may have been exposed via JSON/localStorage. New backend
-- authentication accepts only sessions explicitly issued by the new login flow.
-- Keep historical rows for normal expiry cleanup; do not mark them as trusted.
alter table public.line_login_sessions
  add column if not exists cookie_only boolean not null default false;
