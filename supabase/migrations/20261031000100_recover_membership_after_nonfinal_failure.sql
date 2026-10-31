-- A non-success ECPay notice must not make a later signed success a no-op.
-- Pending orders stay pending in the callback. Orders already marked failed by
-- an earlier non-final notice can still move to paid. Paid and refunded rows
-- stay idempotent. An explicit failed settlement still only applies to pending.
begin;

create or replace function public.settle_membership_payment(
  p_merchant_trade_no text,
  p_ecpay_trade_no text,
  p_payment_type text,
  p_callback_payload jsonb,
  p_paid_at timestamptz,
  p_target_status text
)
returns table (
  status text,
  ecpay_trade_no text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.membership_payments%rowtype;
  v_existing_expires_at timestamptz;
  v_expires_at timestamptz;
  v_duration_days integer;
begin
  if p_target_status not in ('paid', 'failed') then
    raise exception 'Invalid membership payment status';
  end if;

  select *
  into v_payment
  from public.membership_payments
  where merchant_trade_no = p_merchant_trade_no
  for update;

  if not found then
    return;
  end if;

  if p_target_status = 'failed' then
    if v_payment.status <> 'pending' then
      return;
    end if;
  elsif v_payment.status not in ('pending', 'failed') then
    return;
  end if;

  if p_target_status = 'paid' then
    if p_paid_at is null or v_payment.line_user_id is null then
      raise exception 'A paid membership requires a payment time and LINE user';
    end if;

    perform pg_advisory_xact_lock(hashtext(v_payment.line_user_id));

    select max(mp.expires_at)
    into v_existing_expires_at
    from public.membership_payments as mp
    where mp.line_user_id = v_payment.line_user_id
      and mp.status = 'paid'
      and mp.expires_at > p_paid_at;

    v_duration_days := case v_payment.plan
      when 'yearly' then 365
      when 'quarterly' then 90
      else 30
    end;
    v_expires_at := greatest(p_paid_at, coalesce(v_existing_expires_at, p_paid_at))
      + make_interval(days => v_duration_days);
  end if;

  update public.membership_payments as mp
  set status = p_target_status,
      ecpay_trade_no = p_ecpay_trade_no,
      payment_type = p_payment_type,
      paid_at = case when p_target_status = 'paid' then p_paid_at else null end,
      expires_at = case when p_target_status = 'paid' then v_expires_at else null end,
      callback_payload = p_callback_payload,
      updated_at = p_paid_at
  where mp.id = v_payment.id
    and mp.status = v_payment.status
    and (
      (p_target_status = 'paid' and mp.status in ('pending', 'failed'))
      or (p_target_status = 'failed' and mp.status = 'pending')
    )
  returning mp.status, mp.ecpay_trade_no, mp.expires_at
  into status, ecpay_trade_no, expires_at;

  return next;
end;
$$;

revoke all on function public.settle_membership_payment(text, text, text, jsonb, timestamptz, text)
  from public, anon, authenticated;
grant execute on function public.settle_membership_payment(text, text, text, jsonb, timestamptz, text)
  to service_role;

commit;
