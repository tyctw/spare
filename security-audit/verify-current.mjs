// Offline security evidence for the current working tree; no production requests.
// PASS means the stated observation is reproduced, NOT that the application is secure.
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { stripTypeScriptTypes } from 'node:module';
import { execFileSync } from 'node:child_process';

const read = p => fs.readFileSync(p, 'utf8');
const backend = read('supabase/functions/backend/index.ts');

const results = [];
function pass(message) { results.push(message); console.log('PASS observation:', message); }

const code = '11111111-1111-4111-8111-111111111111';
execFileSync(process.execPath, ['--test', 'security-audit/line-login-security.test.mjs', 'security-audit/cookie-session-security.test.mjs'], { stdio: 'inherit' });
pass('LINE login v2 and cookie-only session security regression suites passed.');

let consumed = 0;
const invitationContext = vm.createContext({ Intl, Date, Object, String,
  supabase: { from: () => ({ insert: async () => ({}) }), rpc: () => { consumed++; throw new Error('Unexpected RPC'); } },
  background() {}, withTimeout: x => x, clientAddress: () => 'offline',
});
vm.runInContext(stripTypeScriptTypes(backend.slice(backend.indexOf('function taipeiParts('), backend.indexOf('async function requireAdmin('))), invitationContext);
assert.equal(await vm.runInContext("validateInvitationCode(rollingCode('TYCTW', new Date()), {headers:{get:()=>null}}, true)", invitationContext), true);
assert.equal(consumed, 0);
pass('Predictable invitation bypasses database consumption.');

let timer;
const scripts = [];
const sharedWindow = { location: { pathname: `/spare/shared/${code}`, hash: '', search: '?collab=dummy-editor-key' }, frames: { googlefcPresent: {} }, addEventListener() {}, setTimeout(fn) { timer = fn; } };
const sharedContext = vm.createContext({ window: sharedWindow, URLSearchParams, Promise, Date,
  document: { createElement: () => ({}), head: { appendChild(s) { scripts.push(s.src); } } },
});
assert.ok(!read('index.html').includes('collab-fragment-guard.js'));
assert.ok(read('src/components/ShareReportDialog.tsx').includes('?collab='));
vm.runInContext(read('public/bootstrap.js'), sharedContext);
timer();
await new Promise(resolve => setImmediate(resolve));
assert.equal(sharedWindow.location.search, '?collab=dummy-editor-key');
assert.ok(scripts.some(s => s.includes('googletagmanager')));
assert.ok(sharedWindow.location.pathname.includes(code));
pass('Shared page starts analytics with read token in pathname and editor key in query; fragment guard is not loaded.');

const migrations = fs.readdirSync('supabase/migrations').filter(f => f.endsWith('.sql')).sort();
const duplicates = [...new Set(migrations.map(f => f.split('_')[0]).filter((v,i,a) => a.indexOf(v) !== i))];
assert.deepEqual(duplicates, ['20260807000100', '20260807000200']);
pass(`Duplicate migration versions: ${duplicates.join(', ')}.`);
assert.ok(migrations.some(f => /create\s+(?:or\s+replace\s+)?function\s+public\.consume_api_rate_limit/i.test(read(`supabase/migrations/${f}`))));
pass('Rate-limit RPC now exists; old missing-RPC finding is obsolete.');
fs.writeFileSync('security-audit/current-check-results.json', JSON.stringify({ observations: results, networkRequests: 0 }, null, 2) + '\n');
