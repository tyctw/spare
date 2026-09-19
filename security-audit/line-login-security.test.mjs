// Real application code with in-memory database/LINE doubles; no network.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
import { webcrypto } from 'node:crypto';

const read = p => fs.readFileSync(p, 'utf8');
const hash = async v => Buffer.from(await webcrypto.subtle.digest('SHA-256', new TextEncoder().encode(v))).toString('base64url');
const verifier = 'A'.repeat(43);
function database() {
  const tables = { line_login_transactions: [], line_login_sessions: [], line_login_exchange_codes: [] };
  return { tables, from(name) {
    let operation, values;
    const predicates = [];
    const q = {
      insert(v) { operation = 'insert'; values = v; return q; },
      delete() { operation = 'delete'; return q; },
      update(v) { operation = 'update'; values = v; return q; },
      eq(k,v) { predicates.push(row => row[k] === v); return q; },
      is(k,v) { predicates.push(row => (row[k] ?? null) === v); return q; },
      gt(k,v) { predicates.push(row => row[k] > v); return q; },
      select() { return q; },
      execute() {
        const rows = tables[name];
        let matches;
        if (operation === 'insert') {
          const row = { token: webcrypto.randomUUID(), code: webcrypto.randomUUID(), used_at: null, ...values };
          rows.push(row); matches = [row];
        } else {
          matches = rows.filter(row => predicates.every(p => p(row)));
          if (operation === 'delete') tables[name] = rows.filter(row => !matches.includes(row));
          if (operation === 'update') matches.forEach(row => Object.assign(row, values));
        }
        return { data: matches[0] || null, error: null };
      },
      maybeSingle() { return Promise.resolve(q.execute()); },
      single() { return Promise.resolve(q.execute()); },
      then(resolve, reject) { return Promise.resolve(q.execute()).then(resolve, reject); },
    };
    return q;
  } };
}
function server() {
  const db = database();
  let handler;
  let lineCalls = 0;
  const code = read('supabase/functions/line-login/index.ts').replace(/^import .*;\r?\n/, '');
  vm.runInNewContext(stripTypeScriptTypes(code), {
    createClient: () => db, crypto: webcrypto, TextEncoder, URL, URLSearchParams, Response, Date, btoa,
    console: { error() {} },
    Deno: { env: { get: k => ({ SITE_URL: 'https://site.invalid/spare', SUPABASE_URL: 'https://api.invalid', LINE_CHANNEL_ID: 'dummy', LINE_CHANNEL_SECRET: 'dummy' })[k] }, serve(fn) { handler = fn; } },
    fetch: async (url, options) => {
      lineCalls++;
      if (url.endsWith('/token')) {
        assert.ok(options.body.get('code_verifier'));
        return Response.json({ id_token: 'mock-line-id-token' });
      }
      assert.ok(options.body.get('nonce'));
      return Response.json({ sub: 'mock-user', name: 'Test' });
    },
  });
  return { db, call: url => handler(new Request(url)), calls: () => lineCalls };
}
const start = async s => {
  const response = await s.call(`https://api.invalid/functions/v1/line-login?browserChallenge=${await hash(verifier)}&returnTo=/membership`);
  assert.equal(response.status, 302);
  return new URL(response.headers.get('location'));
};
async function redeem(db, payload, responseHeaders = {}) {
  const backend = read('supabase/functions/backend/index.ts');
  const block = backend.slice(backend.indexOf("case 'redeemLineLoginCode': {") + "case 'redeemLineLoginCode': {".length, backend.indexOf("case 'revokeLineLoginSession':"));
  return vm.runInNewContext(`(async()=>{${block.slice(0, block.lastIndexOf('}'))}})()`, {
    payload, supabase: db, Date, String, Error, pruneExpiredLineLoginData: async () => {}, sha256Base64Url: hash,
    responseHeaders, lineSessionCookie: token => `test-cookie=${token}; HttpOnly`,
    getLineLoginSession: async token => db.tables.line_login_sessions.find(s => s.token === token && s.cookie_only),
  });
}

test('only challenge leaves initiating browser; verifier survives locally', async () => {
  const stored = new Map(); let destination;
  const source = read('src/lib/lineLogin.ts').replace('export async function', 'async function').replace('import.meta.env.VITE_SUPABASE_URL', "'https://api.invalid'");
  const context = vm.createContext({ crypto: webcrypto, TextEncoder, btoa, Date, Uint8Array,
    localStorage: { setItem: (k,v) => stored.set(k,v) }, window: { location: { assign: v => { destination = v; } } },
  });
  vm.runInContext(stripTypeScriptTypes(source), context);
  await vm.runInContext("startLineLogin('/membership')", context);
  const secret = JSON.parse(stored.get('line_login_browser_verifier_v2')).value;
  assert.ok(!destination.includes(secret));
  assert.equal(new URL(destination).searchParams.get('browserChallenge'), await hash(secret));
});

test('opaque state, server PKCE, callback contains code only; stolen URLs cannot redeem', async () => {
  const s = server(); const auth = await start(s);
  const state = auth.searchParams.get('state');
  const transaction = s.db.tables.line_login_transactions[0];
  assert.match(state, /^[0-9a-f-]{36}$/);
  assert.ok(!auth.href.includes(transaction.pkce_verifier));
  assert.ok(!auth.href.includes(verifier));
  assert.equal(auth.searchParams.get('code_challenge'), await hash(transaction.pkce_verifier));
  const callback = `https://api.invalid/functions/v1/line-login?state=${state}&code=valid-line-code`;
  const response = await s.call(callback);
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const destination = new URL(response.headers.get('location'));
  const params = new URLSearchParams(destination.hash.slice(1));
  assert.deepEqual([...params.keys()], ['line_login_code']);
  const code = params.get('line_login_code');
  await assert.rejects(redeem(s.db, { code }));
  await assert.rejects(redeem(s.db, { code, browserVerifier: 'B'.repeat(43) }));
  await assert.rejects(redeem(s.db, { code, browserVerifier: await hash(verifier) }));
  assert.equal(s.db.tables.line_login_exchange_codes[0].used_at, null);
  const headers = {};
  const result = await redeem(s.db, { code, browserVerifier: verifier }, headers);
  assert.equal(result.authenticated, true);
  assert.deepEqual(Object.keys(result), ['authenticated']);
  assert.ok(headers['Set-Cookie'].includes('HttpOnly'));
  await assert.rejects(redeem(s.db, { code, browserVerifier: verifier }));
  assert.equal((await s.call(callback)).status, 400);
  assert.equal(s.calls(), 2);
});

test('tampered, expired and legacy state are rejected before LINE requests', async () => {
  const s = server(); const auth = await start(s);
  for (const state of [webcrypto.randomUUID(), Buffer.from('{"verifier":"forged"}').toString('base64url')]) {
    assert.equal((await s.call(`https://api.invalid/?state=${state}&code=dummy`)).status, 400);
  }
  s.db.tables.line_login_transactions[0].expires_at = '2000-01-01T00:00:00Z';
  assert.equal((await s.call(`https://api.invalid/?state=${auth.searchParams.get('state')}&code=dummy`)).status, 400);
  assert.equal(s.calls(), 0);
  assert.equal((await s.call(`https://api.invalid/?browserBinding=${verifier}`)).status, 400);
});

test('concurrent callback and exchange allow only one winner', async () => {
  const s = server(); const auth = await start(s);
  const url = `https://api.invalid/?state=${auth.searchParams.get('state')}&code=dummy`;
  const responses = await Promise.all([s.call(url), s.call(url)]);
  assert.deepEqual(responses.map(r => r.status).sort(), [302, 400]);
  const code = s.db.tables.line_login_exchange_codes[0].code;
  const attempts = await Promise.allSettled([redeem(s.db, {code, browserVerifier:verifier}), redeem(s.db, {code, browserVerifier:verifier})]);
  assert.equal(attempts.filter(r => r.status === 'fulfilled').length, 1);
});

test('expired and legacy exchange rows fail even with correct leaked verifier', async () => {
  for (const version of [1, 2]) {
    const db = database(); const code = webcrypto.randomUUID();
    db.tables.line_login_exchange_codes.push({ code, binding_hash: await hash(verifier), binding_version: version,
      expires_at: version === 1 ? '2099-01-01T00:00:00Z' : '2000-01-01T00:00:00Z', used_at: null });
    await assert.rejects(redeem(db, { code, browserVerifier: verifier }));
  }
});

for (const fallback of [false, true]) {
  for (const mode of ['valid', 'missing', 'expired', 'legacy']) {
    test(`${fallback ? 'React fallback' : 'early guard'}: ${mode} browser secret and URL scrubbing`, async () => {
      const values = new Map();
      if (mode === 'valid' || mode === 'expired') values.set('line_login_browser_verifier_v2', JSON.stringify({ value: verifier, expiresAt: mode === 'valid' ? Date.now()+60000 : 1 }));
      if (mode === 'legacy') values.set('line_login_browser_binding', JSON.stringify({value:verifier,expiresAt:Date.now()+60000}));
      let sent;
      const window = { location: { hash: `#line_login_code=${webcrypto.randomUUID()}&line_login_binding=untrusted`, pathname:'/membership', search:'' },
        history: { replaceState() { window.location.hash = ''; } } };
      const context = vm.createContext({ window, URLSearchParams, Promise, Date, Response,
        localStorage: { getItem: k=>values.get(k), setItem:(k,v)=>values.set(k,v), removeItem:k=>values.delete(k) },
        document: { getElementById:()=>({textContent:'{"supabaseUrl":"https://api.invalid","supabaseAnonKey":"dummy"}'}) },
        fetch: async (_url, options) => { assert.equal(window.location.hash,''); const payload = JSON.parse(options.body); if (payload.action === 'getLineLoginSession') return Response.json({loggedIn:true}); sent = payload; return Response.json({authenticated:true}); },
        callBackend: async payload => { assert.equal(window.location.hash,''); if (payload.action === 'getLineLoginSession') return {loggedIn:true}; sent=payload; return {authenticated:true}; },
      });
      let result;
      if (fallback) {
        const source = read('src/lib/membership.ts').replace(/^import .*;\r?\n/, '').replace(/\bexport /g, '');
        vm.runInContext(stripTypeScriptTypes(source), context);
        result = await vm.runInContext('consumeLineLoginCodeFromFragment()', context);
      } else {
        vm.runInContext(read('public/auth-fragment-guard.js'), context);
        result = await window.__lineLoginExchangePromise;
      }
      assert.equal(window.location.hash, '');
      assert.equal(result, mode === 'valid');
      if (mode === 'valid') { assert.equal(sent.browserVerifier, verifier); assert.equal(sent.browserBinding, undefined); }
      else assert.equal(sent, undefined);
    });
  }
}
