import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';

// Offline checks only. No production requests or real credentials.
const backend = fs.readFileSync('supabase/functions/backend/index.ts', 'utf8');
const source = backend.slice(backend.indexOf('function taipeiParts('), backend.indexOf('async function requireAdmin('));
const context = vm.createContext({ Intl, Date, Object, String, supabase: { from: () => ({ insert: () => Promise.resolve({}) }) }, background() {}, withTimeout: x => x, clientAddress: () => 'offline' });
vm.runInContext(stripTypeScriptTypes(source), context);
const accepted = await vm.runInContext("validateInvitationCode(rollingCode('TYCTW', new Date()), { headers: { get: () => null } }, true)", context);
assert.equal(accepted, true);
console.log('CONFIRMED: predictable invitation accepted without database consumption.');

let sent;
const window = { location: { hash: '#line_login_code=11111111-1111-4111-8111-111111111111', pathname: '/membership', search: '' }, history: { replaceState() {} } };
vm.runInNewContext(fs.readFileSync('public/auth-fragment-guard.js', 'utf8'), {
  window, URLSearchParams, Promise,
  document: { getElementById: () => ({ textContent: JSON.stringify({ supabaseUrl: 'https://example.invalid', supabaseAnonKey: 'dummy' }) }) },
  fetch: async (_url, options) => { sent = JSON.parse(options.body); return { ok: true, json: async () => ({ authenticated: true }) }; },
});
await window.__lineLoginExchangePromise;
assert.equal(sent.action, 'redeemLineLoginCode');
console.log('CONFIRMED: fragment guard submits supplied exchange code without locally initiated login. Backend browser-binding absence separately reviewed.');

const migrations = fs.readdirSync('supabase/migrations');
assert.equal(migrations.some(file => /create\s+(?:or\s+replace\s+)?function\s+(?:public\.)?consume_api_rate_limit/i.test(fs.readFileSync(`supabase/migrations/${file}`, 'utf8'))), false);
console.log('CONFIRMED: rate-limit RPC has no definition in checked-in migrations.');
const duplicates = [...new Set(migrations.map(f => f.split('_')[0]).filter((v, i, all) => all.indexOf(v) !== i))];
assert.equal(duplicates.length, 2);
console.log('CONFIRMED: duplicate migration versions:', duplicates.join(', '));
