-- Run against an isolated database after membership migrations. All data rolls back.
begin;
do $$
declare
  actual timestamptz;
  paid timestamptz := '2026-10-30 04:00:00+00';
  callbacks integer;
begin
  insert into public.membership_payments (merchant_trade_no, plan, amount, line_user_id)
  values ('test-quarter-new', 'quarterly', 129, 'test-quarter-user');
  perform public.settle_membership_payment('test-quarter-new', 'test-ecpay-quarter', 'Credit', '{}', paid, 'paid');
  select expires_at into actual from public.membership_payments where merchant_trade_no = 'test-quarter-new';
  if actual <> paid + interval '90 days' then raise exception 'New quarterly membership must last 90 days'; end if;

  select count(*) into callbacks from public.settle_membership_payment('test-quarter-new', 'test-ecpay-quarter', 'Credit', '{}', paid, 'paid');
  if callbacks <> 0 then raise exception 'Duplicate callback must be a no-op'; end if;
  select expires_at into actual from public.membership_payments where merchant_trade_no = 'test-quarter-new';
  if actual <> paid + interval '90 days' then raise exception 'Duplicate callback extended membership'; end if;

  insert into public.membership_payments (merchant_trade_no, plan, amount, line_user_id)
  values ('test-quarter-stack', 'quarterly', 129, 'test-quarter-user');
  perform public.settle_membership_payment('test-quarter-stack', 'test-ecpay-stack', 'Credit', '{}', paid, 'paid');
  select expires_at into actual from public.membership_payments where merchant_trade_no = 'test-quarter-stack';
  if actual <> paid + interval '180 days' then raise exception 'Renewal must add 90 days to existing expiry'; end if;

  insert into public.membership_payments (merchant_trade_no, plan, amount, line_user_id, status, expires_at)
  values ('test-quarter-expired', 'monthly', 49, 'test-quarter-expired-user', 'paid', paid - interval '1 day');
  insert into public.membership_payments (merchant_trade_no, plan, amount, line_user_id)
  values ('test-quarter-restart', 'quarterly', 129, 'test-quarter-expired-user');
  perform public.settle_membership_payment('test-quarter-restart', 'test-ecpay-restart', 'Credit', '{}', paid, 'paid');
  select expires_at into actual from public.membership_payments where merchant_trade_no = 'test-quarter-restart';
  if actual <> paid + interval '90 days' then raise exception 'Expired membership must restart at payment time'; end if;

  insert into public.membership_payments (merchant_trade_no, plan, amount, line_user_id)
  values ('test-quarter-failed', 'quarterly', 129, 'test-quarter-failed-user');
  perform public.settle_membership_payment('test-quarter-failed', 'test-ecpay-failed', 'Credit', '{}', paid, 'failed');
  if exists (select 1 from public.membership_payments where merchant_trade_no = 'test-quarter-failed' and (expires_at is not null or status <> 'failed')) then
    raise exception 'Failed payment must not grant membership';
  end if;
  perform public.settle_membership_payment('test-quarter-failed', 'test-ecpay-failed-paid', 'Credit', '{}', paid, 'paid');
  select expires_at into actual from public.membership_payments where merchant_trade_no = 'test-quarter-failed';
  if actual <> paid + interval '90 days' then raise exception 'Verified success must settle a non-final failure'; end if;
  select count(*) into callbacks from public.settle_membership_payment('test-quarter-failed', 'test-ecpay-failed-paid', 'Credit', '{}', paid, 'paid');
  if callbacks <> 0 then raise exception 'Recovered membership must not extend on a duplicate success'; end if;

  insert into public.membership_payments (merchant_trade_no, plan, amount, line_user_id)
  values ('test-quarter-month', 'monthly', 49, 'test-quarter-month-user'), ('test-quarter-year', 'yearly', 399, 'test-quarter-year-user');
  perform public.settle_membership_payment('test-quarter-month', 'test-ecpay-month', 'Credit', '{}', paid, 'paid');
  perform public.settle_membership_payment('test-quarter-year', 'test-ecpay-year', 'Credit', '{}', paid, 'paid');
  if not exists (select 1 from public.membership_payments where merchant_trade_no = 'test-quarter-month' and expires_at = paid + interval '30 days') then raise exception 'Monthly duration changed'; end if;
  if not exists (select 1 from public.membership_payments where merchant_trade_no = 'test-quarter-year' and expires_at = paid + interval '365 days') then raise exception 'Yearly duration changed'; end if;

  begin
    insert into public.membership_payments (merchant_trade_no, plan, amount) values ('test-quarter-invalid', 'invalid', 129);
    raise exception 'Unknown plan was accepted';
  exception when check_violation then null;
  end;
end;
$$;
rollback;
