import { createClient } from 'npm:@supabase/supabase-js@2';

type EcpayPayload = Record<string, string | number>;

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const MAX_FORM_BODY_BYTES = 32 * 1024;
const textHeaders = { 'Content-Type': 'text/plain; charset=utf-8' };
const escapeHtml = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const ecpayUrlEncode = (value: string) => encodeURIComponent(value)
  .replace(/%20/g, '+')
  .replace(/~/g, '%7e')
  .replace(/'/g, '%27')
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

function runInBackground(task: Promise<unknown>) {
  const guardedTask = task.catch((error) => console.error('Background payment task failed', error));
  const runtime = globalThis as typeof globalThis & {
    EdgeRuntime?: { waitUntil?: (promise: Promise<unknown>) => void };
  };
  if (runtime.EdgeRuntime?.waitUntil) runtime.EdgeRuntime.waitUntil(guardedTask);
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
    const mode = Deno.env.get('ECPAY_MODE')?.trim().toLowerCase() || 'production';
    if (mode !== 'production') {
      // Live callback infrastructure must never trust public ECPay sandbox
      // credentials. Test callbacks belong in a separate deployment.
      console.error('Rejected non-production ECPay callback configuration');
      return new Response('0|Error', { status: 503, headers: textHeaders });
    }
    const merchantId = Deno.env.get('ECPAY_MERCHANT_ID')?.trim();
    const hashKey = Deno.env.get('ECPAY_HASH_KEY')?.trim();
    const hashIv = Deno.env.get('ECPAY_HASH_IV')?.trim();
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
      .select('amount, plan, status, ecpay_trade_no, contact_email, payer_name')
      .eq('merchant_trade_no', merchantTradeNo)
      .maybeSingle();
    if (membershipError) throw membershipError;
    if (membershipPayment) {
      if (membershipPayment.amount !== tradeAmount) {
        console.error('Amount mismatch', { dbAmount: membershipPayment.amount, tradeAmount });
        return new Response('0|Error', { status: 400, headers: textHeaders });
      }
      
      const rtnCode = fields.RtnCode;
      const isPaid = rtnCode === '1';
      const isWaitingPayment = rtnCode === '2' || rtnCode === '10100073';
      
      if (fields.SimulatePaid === '1') return new Response('1|OK', { headers: textHeaders });
      
      if (isWaitingPayment) {
        const { error: updateError } = await supabase
          .from('membership_payments')
          .update({
            ecpay_trade_no: tradeNo,
            payment_type: fields.PaymentType || null,
            callback_payload: fields,
            updated_at: new Date().toISOString(),
          })
          .eq('merchant_trade_no', merchantTradeNo)
          .eq('status', 'pending');
        if (updateError) throw updateError;
        return new Response('1|OK', { headers: textHeaders });
      }

      const targetStatus = isPaid ? 'paid' : 'failed';
      if (membershipPayment.status !== 'pending' && membershipPayment.ecpay_trade_no === tradeNo) {
        return new Response('1|OK', { headers: textHeaders });
      }
      if (membershipPayment.status !== 'pending') {
        console.error('Status not pending', { status: membershipPayment.status, merchantTradeNo });
        return new Response('0|Error', { status: 409, headers: textHeaders });
      }

      const paidAt = new Date();
      const { data: settlement, error: updateError } = await supabase.rpc('settle_membership_payment', {
        p_merchant_trade_no: merchantTradeNo,
        p_ecpay_trade_no: tradeNo,
        p_payment_type: fields.PaymentType || null,
        p_callback_payload: fields,
        p_paid_at: paidAt.toISOString(),
        p_target_status: targetStatus,
      });
      if (updateError) throw updateError;
      const updated = Array.isArray(settlement) ? settlement[0] : settlement;
      if (!updated || updated.status !== targetStatus || updated.ecpay_trade_no !== tradeNo) {
        console.error('Update failed, row might have changed', { merchantTradeNo });
        return new Response('0|Error', { status: 409, headers: textHeaders });
      }
      const expiresAt = updated.expires_at ? new Date(updated.expires_at) : null;
      
      // 發送付款成功通知信
      if (isPaid && membershipPayment.contact_email) {
        const resendApiKey = Deno.env.get('RESEND_API_KEY');
        const resendFrom = Deno.env.get('RESEND_FROM_EMAIL') || '會考落點分析 <no-reply@send.twexam.cc>';
        if (resendApiKey) {
          const planName = membershipPayment.plan === 'yearly' ? '年費免廣告會員' : '月費免廣告會員';
          const expireDateStr = new Intl.DateTimeFormat('zh-TW', { dateStyle: 'long' }).format(expiresAt || paidAt);
          const payerName = escapeHtml(membershipPayment.payer_name?.trim() || '使用者');
          
          const emailHtml = `
            <!DOCTYPE html>
            <html lang="zh-TW">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>付款成功通知</title>
              <style>
                @media screen and (max-width: 600px) {
                  .container { padding: 20px 10px !important; }
                  .card { box-shadow: 4px 4px 0px #0f172a !important; border-radius: 16px !important; }
                  .content { padding: 24px 20px !important; }
                  .header { padding: 28px 20px !important; }
                  .title { font-size: 22px !important; letter-spacing: 1px !important; }
                  .table-text { font-size: 14px !important; }
                  .order-card { padding: 20px 16px !important; box-shadow: 2px 2px 0px #0f172a !important; }
                }
              </style>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif; background-color: #f8fafc; -webkit-font-smoothing: antialiased;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc;">
                <tr>
                  <td align="center" class="container" style="padding: 40px 20px;">
                    <!--[if mso]>
                    <table role="presentation" align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                    <tr>
                    <td>
                    <![endif]-->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" class="card" style="background-color: #ffffff; border: 3px solid #0f172a; border-radius: 24px; box-shadow: 6px 6px 0px #0f172a; max-width: 600px; margin: 0 auto; overflow: hidden; border-collapse: separate;">
                      <!-- Header -->
                      <tr>
                        <td class="header" style="background-color: #4f46e5; padding: 36px 24px; text-align: center; border-bottom: 3px solid #0f172a;">
                          <h1 class="title" style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 900; letter-spacing: 2px;">會考落點分析</h1>
                          <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px; font-weight: 700;">免廣告會員啟用成功</p>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td class="content" style="padding: 32px 32px;">
                          <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 900;">親愛的 ${payerName}，您好：</h2>
                          <p style="margin: 0 0 24px 0; color: #334155; font-size: 16px; line-height: 1.6; font-weight: 700;">感謝您購買我們的免廣告會員方案！您的會員資格已經生效，接下來您可以享受純淨、無打擾的落點分析體驗。</p>
                          
                          <!-- Order Details -->
                          <div class="order-card" style="background-color: #f1f5f9; border: 2px solid #0f172a; border-radius: 16px; padding: 24px; margin-bottom: 32px; box-shadow: 3px 3px 0px #0f172a;">
                            <h3 style="margin: 0 0 16px 0; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; font-weight: 900;">訂單資訊</h3>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                              <tr>
                                <td class="table-text" style="padding: 10px 0; color: #475569; font-size: 15px; font-weight: 700; border-bottom: 2px dashed #cbd5e1; width: 35%;">付款人姓名</td>
                                <td class="table-text" style="padding: 10px 0; color: #0f172a; font-size: 16px; font-weight: 900; border-bottom: 2px dashed #cbd5e1; word-wrap: break-word;">${payerName}</td>
                              </tr>
                              <tr>
                                <td class="table-text" style="padding: 10px 0; color: #475569; font-size: 15px; font-weight: 700; border-bottom: 2px dashed #cbd5e1; width: 35%;">購買方案</td>
                                <td class="table-text" style="padding: 10px 0; color: #0f172a; font-size: 16px; font-weight: 900; border-bottom: 2px dashed #cbd5e1; word-wrap: break-word;">${planName}</td>
                              </tr>
                              <tr>
                                <td class="table-text" style="padding: 10px 0; color: #475569; font-size: 15px; font-weight: 700; border-bottom: 2px dashed #cbd5e1;">實付金額</td>
                                <td class="table-text" style="padding: 10px 0; color: #0f172a; font-size: 16px; font-weight: 900; border-bottom: 2px dashed #cbd5e1;">NT$ ${tradeAmount}</td>
                              </tr>
                              <tr>
                                <td class="table-text" style="padding: 10px 0; color: #475569; font-size: 15px; font-weight: 700; border-bottom: 2px dashed #cbd5e1;">訂單編號</td>
                                <td class="table-text" style="padding: 10px 0; color: #0f172a; font-size: 15px; font-family: monospace; font-weight: 900; border-bottom: 2px dashed #cbd5e1; word-wrap: break-word;">${merchantTradeNo}</td>
                              </tr>
                              <tr>
                                <td class="table-text" style="padding: 10px 0; color: #475569; font-size: 15px; font-weight: 700;">有效期限</td>
                                <td class="table-text" style="padding: 10px 0; color: #059669; font-size: 16px; font-weight: 900;">至 ${expireDateStr}</td>
                              </tr>
                            </table>
                          </div>
                          
                          <p style="margin: 0 0 24px 0; color: #334155; font-size: 16px; line-height: 1.6; font-weight: 700;">您隨時可以登入網站，在「我的會員帳號」頁面查看您的資格與交易紀錄。</p>
                          
                          <!-- Action Button -->
                          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 10px;">
                            <tr>
                              <td align="center">
                                <a href="https://tyctw.github.io/spare/membership/account" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-size: 16px; font-weight: 900; text-decoration: none; padding: 14px 32px; border: 2px solid #0f172a; border-radius: 12px; box-shadow: 3px 3px 0px #0f172a;">前往我的帳號</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td class="content" style="background-color: #f8fafc; border-top: 3px solid #0f172a; padding: 24px 32px; text-align: center;">
                          <p style="margin: 0 0 8px 0; color: #475569; font-size: 14px; font-weight: 700;">如有任何問題，歡迎來信客服</p>
                          <a href="mailto:tyctw.analyze@gmail.com" style="color: #4f46e5; font-size: 14px; text-decoration: none; font-weight: 900;">tyctw.analyze@gmail.com</a>
                          <p style="margin: 24px 0 0 0; color: #94a3b8; font-size: 12px; font-weight: 700;">本信件由系統自動發送，請勿直接回覆。</p>
                        </td>
                      </tr>
                    </table>
                    <!--[if mso]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `;

          runInBackground((async () => {
            try {
              const emailRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${resendApiKey}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  from: resendFrom,
                  to: membershipPayment.contact_email,
                  subject: '【會考落點分析】付款成功與會員啟用通知',
                  html: emailHtml
                })
              });
              if (!emailRes.ok) {
                // Do not write a provider response body to logs: it can echo
                // recipient or other personally identifiable information.
                console.error('Payment confirmation email request failed', {
                  merchantTradeNo,
                  status: emailRes.status,
                });
              } else {
                console.log('Payment confirmation email sent', { merchantTradeNo });
              }
            } catch {
              console.error('Payment confirmation email request errored', { merchantTradeNo });
            }
          })());
        } else {
          console.warn('Payment confirmation email skipped: Resend is not configured', { merchantTradeNo });
        }
      }

      return new Response('1|OK', { headers: textHeaders });
    }

    const { data: payment, error: paymentError } = await supabase
      .from('support_payments')
      .select('amount, status, ecpay_trade_no')
      .eq('merchant_trade_no', merchantTradeNo)
      .maybeSingle();
    if (paymentError) throw paymentError;
    if (!payment) {
      console.error('Payment not found in both tables', { merchantTradeNo });
      return new Response('0|Error', { status: 400, headers: textHeaders });
    }
    if (payment.amount !== tradeAmount) {
      console.error('Support amount mismatch', { dbAmount: payment.amount, tradeAmount });
      return new Response('0|Error', { status: 400, headers: textHeaders });
    }

    const rtnCode = fields.RtnCode;
    const isPaid = rtnCode === '1';
    const isWaitingPayment = rtnCode === '2' || rtnCode === '10100073';
    const targetStatus = isPaid ? 'paid' : 'failed';
    if (fields.SimulatePaid === '1') return new Response('1|OK', { headers: textHeaders });
    
    if (isWaitingPayment) {
      const { error: updateError } = await supabase
        .from('support_payments')
        .update({
          ecpay_trade_no: tradeNo,
          payment_type: fields.PaymentType || null,
          callback_payload: fields,
          updated_at: new Date().toISOString(),
        })
        .eq('merchant_trade_no', merchantTradeNo)
        .eq('status', 'pending');
      if (updateError) throw updateError;
      return new Response('1|OK', { headers: textHeaders });
    }

    if (payment.status !== 'pending' && payment.ecpay_trade_no === tradeNo) return new Response('1|OK', { headers: textHeaders });
    if (payment.status !== 'pending') {
      console.error('Support status not pending', { status: payment.status, merchantTradeNo });
      return new Response('0|Error', { status: 409, headers: textHeaders });
    }

    const { data: updatedPayment, error } = await supabase
      .from('support_payments')
      .update({
        status: targetStatus,
        ecpay_trade_no: tradeNo,
        payment_type: fields.PaymentType || null,
        paid_at: isPaid ? new Date().toISOString() : null,
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
        console.error('Support update failed, row might have changed', { merchantTradeNo, currentPayment });
        return new Response('0|Error', { status: 409, headers: textHeaders });
      }
    }

    return new Response('1|OK', { headers: textHeaders });
  } catch (error) {
    console.error('ECPay callback failed', error);
    return new Response('0|Error', { status: 500, headers: textHeaders });
  }
});
