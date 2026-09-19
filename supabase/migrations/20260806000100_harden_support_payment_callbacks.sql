-- An ECPay transaction may belong to only one local support-payment order.
-- This prevents a replay or implementation error from linking it to another order.
create unique index if not exists support_payments_ecpay_trade_no_unique_idx
  on public.support_payments (ecpay_trade_no)
  where ecpay_trade_no is not null;
