-- Privileged API access is tied to individual Supabase Auth identities, not a
-- shared application password sent by the client.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from public, anon, authenticated;

-- After deployment, add each administrator from a privileged SQL session:
-- insert into public.admin_users (user_id) values ('<Supabase Auth user UUID>');

-- Bootstrap the initial administrator once this email has an Auth account.
-- If the account is created after this migration runs, execute this statement
-- again from the Supabase SQL editor.
insert into public.admin_users (user_id)
select id
from auth.users
where lower(email) = 'ymhs0208@gmail.com'
on conflict (user_id) do nothing;
