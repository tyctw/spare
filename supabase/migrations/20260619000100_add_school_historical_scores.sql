alter table public.schools
add column if not exists historical_scores jsonb;
