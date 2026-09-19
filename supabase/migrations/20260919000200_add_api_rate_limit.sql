create table if not exists public.api_rate_limits (
  client_key text not null,
  action text not null,
  window_start bigint not null,
  request_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (client_key, action, window_start)
);

alter table public.api_rate_limits
  add column if not exists updated_at timestamptz not null default now();

alter table public.api_rate_limits enable row level security;
revoke all on table public.api_rate_limits from public, anon, authenticated;

create or replace function public.consume_api_rate_limit(
  requested_client_key text,
  requested_action text,
  requested_window_seconds integer,
  requested_max_requests integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  bucket bigint;
  current_count integer;
begin
  if requested_client_key is null or requested_client_key = ''
    or requested_action is null or requested_action = ''
    or requested_window_seconds < 1 or requested_max_requests < 1 then
    return false;
  end if;

  bucket := floor(extract(epoch from clock_timestamp()) / requested_window_seconds)::bigint;
  insert into public.api_rate_limits(client_key, action, window_start, request_count, updated_at)
  values (requested_client_key, requested_action, bucket, 1, now())
  on conflict (client_key, action, window_start) do update
    set request_count = public.api_rate_limits.request_count + 1,
        updated_at = now()
  returning request_count into current_count;

  return current_count <= requested_max_requests;
end;
$$;

revoke all on function public.consume_api_rate_limit(text, text, integer, integer)
  from public, anon, authenticated;
grant execute on function public.consume_api_rate_limit(text, text, integer, integer)
  to service_role;

delete from public.api_rate_limits
where updated_at < now() - interval '2 days';
