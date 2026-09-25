// Exercise real HTTP/action code with an in-memory payment store; no network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
import { webcrypto } from 'node:crypto';
const read = path => fs.readFileSync(path, 'utf8');
const source = read('supabase/functions/backend/index.ts');
const token = '11111111-1111-4111-8111-111111111111';
const otherToken = '22222222-2222-4222-8222-222222222222';
const trade = 'OfflineTrade12345';
function server() {
  let handler;
  const db = { from(name) {
    assert.equal(name, 'support_payments');
    const filters = [];
    const query = {
      insert: () => query, select: () => query,
      single: async () => ({ data: { status_lookup_token: token }, error: null }),
      eq: (key, value) => { filters.push(row => row[key] === value); return query; },
      gt: (key, value) => { filters.push(row => row[key] > value); return query; },
      maybeSingle: async () => {
        const row = { status_lookup_token: token, merchant_trade_no: trade, status: 'paid', amount: 100, created_at: new Date().toISOString() };
        return { data: filters.every(fn => fn(row)) ? { status: row.status, amount: row.amount } : null, error: null };
      },
    };
    return query;
  } };
  const code = source.slice(source.indexOf('const defaultAllowedOrigins'), source.indexOf('const MAX_JSON_BODY_BYTES'))
    + source.slice(source.indexOf('const json ='), source.indexOf('const inappropriateContentPatterns'))
    + source.slice(source.indexOf('const lineSessionCookieName'), source.indexOf('async function activeMembershipForRequest'))
    + source.slice(source.indexOf('async function handleAction('));
  vm.runInNewContext(stripTypeScriptTypes(code), {
    Request, Response, Headers, URL, Date, Error, crypto: webcrypto,
    console: { log() {}, error() {} }, supabase: db,
    Deno: { env: { get: () => undefined }, serve: fn => { handler = fn; } },
    withTimeout: promise => promise, readRequestText: request => request.text(), MAX_JSON_BODY_BYTES: 65536,
    consumeRateLimit: async () => true,
    ecpayConfig: () => ({ merchantId: 'offline', hashKey: 'offline', hashIv: 'offline', returnUrl: 'https://api.invalid', actionUrl: 'https://payment.invalid' }),
    createMerchantTradeNo: () => trade, taipeiMerchantTradeDate: () => '2026/09/25 12:00:00', ecpayCheckMacValue: async () => 'offline-mac',
  });
  return (payload, headers = {}) => handler(new Request('https://api.invalid/functions/v1/backend', {
    method: 'POST', headers: { Origin: 'https://tyctw.github.io', 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(payload),
  }));
}

test('checkout exposes lookup credential only in HttpOnly Cookie, never response JSON', async () => {
  const response = await server()({ action: 'createEcpaySupportPayment', amount: 100 });
  assert.equal(response.status, 200);
  const cookie = response.headers.get('set-cookie');
  for (const part of [token, 'HttpOnly', 'Secure', 'SameSite=None', 'Path=/functions/v1/backend', 'Max-Age=86400']) assert.ok(cookie.includes(part));
  assert.match(response.headers.get('cache-control'), /no-store/);
  const text = await response.text();
  assert.ok(!text.includes(token));
  assert.ok(!text.includes('supportPaymentStatusToken'));
  assert.equal(JSON.parse(text).fields.MerchantTradeNo, trade);
});

test('header and JSON lookup credentials cannot replace Cookie', async () => {
  for (const headers of [{}, { 'X-Payment-Status-Token': token }]) {
    const response = await server()({ action: 'getEcpaySupportPaymentStatus', merchantTradeNo: trade, statusLookupToken: token, supportPaymentStatusToken: token }, headers);
    assert.notEqual(response.status, 200);
    assert.ok(!(await response.text()).includes(token));
  }
});

test('Cookie authorizes status, conflicting header is ignored, terminal status clears Cookie', async () => {
  const call = server();
  const response = await call({ action: 'getEcpaySupportPaymentStatus', merchantTradeNo: trade }, { Cookie: `support_payment_status=${token}`, 'X-Payment-Status-Token': otherToken });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'paid');
  assert.match(response.headers.get('set-cookie'), /Max-Age=0/);
  const wrong = await call({ action: 'getEcpaySupportPaymentStatus', merchantTradeNo: trade }, { Cookie: `support_payment_status=${otherToken}`, 'X-Payment-Status-Token': token });
  assert.equal((await wrong.json()).status, 'not_found');
});

test('frontend includes cookies without reading or sending localStorage credentials', async () => {
  let sent;
  const api = read('src/lib/api.ts').replaceAll('import.meta.env.VITE_SUPABASE_URL', "'https://api.invalid'")
    .replaceAll('import.meta.env.VITE_SUPABASE_ANON_KEY', "'public'").replace(/\bexport /g, '');
  const context = vm.createContext({ AbortController, setTimeout, clearTimeout,
    localStorage: { getItem() { throw new Error('Must not read stored credentials'); } },
    fetch: async (_, options) => { sent = options; return Response.json({ status: 'pending' }); },
  });
  vm.runInContext(stripTypeScriptTypes(api), context);
  await vm.runInContext("callBackend({action:'getEcpaySupportPaymentStatus',merchantTradeNo:'OfflineTrade12345'})", context);
  assert.equal(sent.credentials, 'include');
  assert.equal(sent.headers['X-Payment-Status-Token'], undefined);
  assert.doesNotMatch(read('src/components/SupportPage.tsx'), /supportPaymentStatusToken|localStorage\.setItem/);
});

test('early guard clears legacy stored payment token even without login callback', () => {
  for (const blocked of [false, true]) {
    const stored = new Map([['support_payment_status_token', token]]);
    const context = vm.createContext({ URLSearchParams, Date,
      window: { location: { hash: '' } }, document: { getElementById: () => null },
      localStorage: {
        removeItem(key) { if (blocked) throw new Error('Storage blocked'); stored.delete(key); },
        getItem: () => null,
      },
    });
    vm.runInContext(read('public/auth-fragment-guard.js'), context);
    if (!blocked) assert.equal(stored.has('support_payment_status_token'), false);
  }
});
