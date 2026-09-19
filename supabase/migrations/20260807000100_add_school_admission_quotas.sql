-- 115 學年度免試入學名額。數值一律記錄「一般生」實際招生名額；
-- 特殊身分外加名額不併入，避免和招生委員會公告的口徑混淆。
alter table public.schools
  add column if not exists admission_quota integer,
  add column if not exists admission_quota_source_url text;

alter table public.schools
  add constraint schools_admission_quota_nonnegative
  check (admission_quota is null or admission_quota >= 0);
