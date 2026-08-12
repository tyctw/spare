import { createClient } from 'npm:@supabase/supabase-js@2';

type EcpayPayload = Record<string, string | number>;

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const MAX_FORM_BODY_BYTES = 32 * 1024;
const textHeaders = { 'Content-Type': 'text/plain; charset=utf-8' };

const ecpayUrlEncode = (value: string) => encodeURIComponent(value)
  .replace(/%20/g, '+')
  .replace(/%2D/g, '-')
  .replace(/%5F/g, '_')
  .replace(/%2E/g, '.')
  .replace(/%21/g, '!')
  .replace(/%2A/g, '*')
  .replace(/%28/g, '(')
  .replace(/%29/g, ')')
  .toLowerCase();

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
};

const ecpayCheckMacValue = async (params: EcpayPayload, hashKey: string, hashIv: string) => {
  const body = Object.entries(params)
    .filter(([key]) => key !== 'CheckMacValue')
    .sort(([left], [right]) => left.toLowerCase().localeCompare(right.toLowerCase()))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return sha256(ecpayUrlEncode(`HashKey=${hashKey}&${body}&HashIV=${hashIv}`));
};

function secureEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

async function readRequestText(request: Request, maxBytes: number) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) throw new Error('Request body is too large.');
  if (!request.body) return '';

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new Error('Request body is too large.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

Deno.serve(async (request) => {
  if (request.method !== 'POST' || !request.headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
    return new Response('0|Error', { status: 405, headers: textHeaders });
  }

  try {
    const merchantId = Deno.env.get('ECPAY_MERCHANT_ID')?.trim();
    const hashKey = Deno.env.get('ECPAY_HASH_KEY')?.trim();
    const hashIv = Deno.env.get('ECPAY_HASH_IV')?.trim();
    const mode = Deno.env.get('ECPAY_MODE')?.trim().toLowerCase() || 'production';
    if (!merchantId || !hashKey || !hashIv) throw new Error('ECPay payment is not configured.');

    const fields = Object.fromEntries(new URLSearchParams(await readRequestText(request, MAX_FORM_BODY_BYTES)).entries());
    const receivedCheckMacValue = fields.CheckMacValue || '';
    const expectedCheckMacValue = await ecpayCheckMacValue(fields, hashKey, hashIv);
    if (!secureEqual(receivedCheckMacValue.toUpperCase(), expectedCheckMacValue)) {
      console.error('Invalid ECPay CheckMacValue', { merchantTradeNo: fields.MerchantTradeNo });
      return new Response('0|Error', { status: 400, headers: textHeaders });
    }

    const merchantTradeNo = fields.MerchantTradeNo || '';
    const tradeNo = fields.TradeNo || '';
    const tradeAmount = Number(fields.TradeAmt);
    if (fields.MerchantID !== merchantId || !/^[A-Za-z0-9]{8,32}$/.test(merchantTradeNo)
      || !tradeNo || !Number.isSafeInteger(tradeAmount) || tradeAmount <= 0) {
      return new Response('0|Error', { status: 400, headers: textHeaders });
    }

    const { data: membershipPayment, error: membershipError } = await supabase
      .from('membership_payments')
      .select('amount, plan, status, ecpay_trade_no')
      .eq('merchant_trade_no', merchantTradeNo)
      .maybeSingle();
    if (membershipError) throw membershipError;
    if (membershipPayment) {
      if (membershipPayment.amount !== tradeAmount) return new Response('0|Error', { status: 400, headers: textHeaders });
      const succeeded = fields.RtnCode === '1';
      const targetStatus = succeeded ? 'paid' : 'failed';
      if (fields.SimulatePaid === '1' && mode !== 'stage') return new Response('1|OK', { headers: textHeaders });
      if (membershipPayment.status !== 'pending' && membershipPayment.ecpay_trade_no === tradeNo) return new Response('1|OK', { headers: textHeaders });
      if (membershipPayment.status !== 'pending') return new Response('0|Error', { status: 409, headers: textHeaders });

      const paidAt = new Date();
      const durationDays = membershipPayment.plan === 'yearly' ? 365 : 30;
      const { data: updated, error: updateError } = await supabase
        .from('membership_payments')
        .update({
          status: targetStatus,
          ecpay_trade_no: tradeNo,
          payment_type: fields.PaymentType || null,
          paid_at: succeeded ? paidAt.toISOString() : null,
          expires_at: succeeded ? new Date(paidAt.getTime() + durationDays * 86400000).toISOString() : null,
          callback_payload: fields,
          updated_at: paidAt.toISOString(),
        })
        .eq('merchant_trade_no', merchantTradeNo)
        .eq('status', 'pending')
        .select('status, ecpay_trade_no')
        .maybeSingle();
      if (updateError) throw updateError;
      if (!updated) return new Response('0|Error', { status: 409, headers: textHeaders });
      return new Response('1|OK', { headers: textHeaders });
    }

    const { data: payment, error: paymentError } = await supabase
      .from('support_payments')
      .select('amount, status, ecpay_trade_no')
      .eq('merchant_trade_no', merchantTradeNo)
      .maybeSingle();
    if (paymentError || !payment || payment.amount !== tradeAmount) {
      return new Response('0|Error', { status: 400, headers: textHeaders });
    }

    const succeeded = fields.RtnCode === '1';
    const targetStatus = succeeded ? 'paid' : 'failed';
    if (fields.SimulatePaid === '1' && mode !== 'stage') return new Response('1|OK', { headers: textHeaders });
    if (payment.status !== 'pending' && payment.ecpay_trade_no === tradeNo) return new Response('1|OK', { headers: textHeaders });
    if (payment.status !== 'pending') return new Response('0|Error', { status: 409, headers: textHeaders });

    const { data: updatedPayment, error } = await supabase
      .from('support_payments')
      .update({
        status: targetStatus,
        ecpay_trade_no: tradeNo,
        payment_type: fields.PaymentType || null,
        paid_at: succeeded ? new Date().toISOString() : null,
        callback_payload: fields,
        updated_at: new Date().toISOString(),
      })
      .eq('merchant_trade_no', merchantTradeNo)
      .eq('status', 'pending')
      .select('status, ecpay_trade_no')
      .maybeSingle();
    if (error) throw error;

    if (!updatedPayment) {
      const { data: currentPayment, error: currentPaymentError } = await supabase
        .from('support_payments')
        .select('status, ecpay_trade_no')
        .eq('merchant_trade_no', merchantTradeNo)
        .maybeSingle();
      if (currentPaymentError || currentPayment?.status !== targetStatus || currentPayment.ecpay_trade_no !== tradeNo) {
        return new Response('0|Error', { status: 409, headers: textHeaders });
      }
    }

    return new Response('1|OK', { headers: textHeaders });
  } catch (error) {
    console.error('ECPay callback failed', error);
    return new Response('0|Error', { status: 500, headers: textHeaders });
  }
});
