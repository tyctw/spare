// Exercise the real checkout action without contacting LINE or ECPay.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';

const source = fs.readFileSync('supabase/functions/backend/index.ts', 'utf8');
function checkout(loggedIn = true) {
  const orders = [];
  const code = source.slice(source.indexOf('const membershipPlans ='), source.indexOf('async function pruneExpiredLineLoginData'))
    + source.slice(source.indexOf('async function handleAction('), source.indexOf('Deno.serve('))
    + '\nglobalThis.checkout = handleAction;';
  const context = {
    Request, Date, Error,
    Deno: { env: { get: () => undefined } },
    getLineLoginSession: async () => loggedIn ? { line_user_id: 'test-member' } : null,
    lineSessionTokenFromCookie: () => 'test-session',
    ecpayConfig: () => ({ merchantId: 'test', clientBackUrl: 'https://example.invalid/support/success', actionUrl: 'https://payment.invalid', returnUrl: 'https://api.invalid' }),
    createMembershipTradeNo: () => 'MembershipTest',
    taipeiMerchantTradeDate: () => '2026/10/30 12:00:00',
    ecpayCheckMacValue: async () => 'test-mac',
    supabase: { from(name) {
      assert.equal(name, 'membership_payments');
      return { insert(order) {
        orders.push(order);
        return { select: () => ({ single: async () => ({ data: { id: 'test-id' }, error: null }) }) };
      } };
    } },
  };
  vm.runInNewContext(stripTypeScriptTypes(code), context);
  return { orders, call: (payload) => context.checkout({ action: 'createMembershipPayment', payerName: 'Test Member', email: 'test@example.invalid', ...payload }, new Request('https://api.invalid'), {}) };
}

test('quarterly checkout charges NT$129 and records the authenticated owner; ignores client price/duration', async () => {
  const { call, orders } = checkout();
  const result = await call({ plan: 'quarterly', amount: 1, days: 365 });
  assert.equal(result.fields.TotalAmount, 129);
  assert.equal(result.fields.ItemName, '90 天免廣告會員');
  assert.equal(result.fields.CustomField1, 'membership:quarterly');
  assert.equal(result.fields.ClientBackURL, 'https://example.invalid/membership/success');
  assert.equal(orders[0].plan, 'quarterly');
  assert.equal(orders[0].amount, 129);
  assert.equal(orders[0].line_user_id, 'test-member');
});

test('existing plans keep their prices and unknown plans cannot create orders', async () => {
  for (const [plan, amount] of [['monthly', 49], ['yearly', 399]]) {
    assert.equal((await checkout().call({ plan })).fields.TotalAmount, amount);
  }
  for (const plan of ['invalid', '__proto__', 'constructor', '']) {
    const { call, orders } = checkout();
    await assert.rejects(call({ plan }), /Invalid membership plan/);
    assert.equal(orders.length, 0);
  }
});

test('quarterly checkout requires a LINE session', async () => {
  const { call, orders } = checkout(false);
  await assert.rejects(call({ plan: 'quarterly' }), /LINE login is required/);
  assert.equal(orders.length, 0);
});
