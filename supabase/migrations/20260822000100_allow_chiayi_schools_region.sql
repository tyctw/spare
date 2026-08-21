begin;

alter table public.schools
  drop constraint if exists schools_region_check;

alter table public.schools
  add constraint schools_region_check
  check (region in ('taoyuan', 'kaohsiung', 'central', 'changhua', 'taipei', 'tainan', 'hsinchu', 'chiayi'));

commit;
