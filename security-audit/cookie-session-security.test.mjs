// Offline regression checks. No real cookies, LINE accounts or database writes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
const read = p => fs.readFileSync(p, 'utf8');
const backend = read('supabase/functions/backend/index.ts');
const cookieName = '__Secure-line_membership_session_v2';
const token = '11111111-1111-4111-8111-111111111111';
const cookieHelpers = stripTypeScriptTypes(backend.slice(backend.indexOf('const lineSessionCookieName'), backend.indexOf('async function activeMembershipForRequest')));

test('cookie is HttpOnly, secure, partitioned, host-only and logout uses matching attributes', () => {
  const context = vm.createContext({ Request });
  vm.runInContext(cookieHelpers, context);
  const issued = vm.runInContext(`lineSessionCookie('${token}')`, context);
  const cleared = vm.runInContext("lineSessionCookie('', 0)", context);
  for (const attribute of ['HttpOnly','Secure','SameSite=None','Partitioned','Path=/functions/v1/backend']) {
    assert.ok(issued.includes(attribute)); assert.ok(cleared.includes(attribute));
  }
  assert.ok(!issued.includes('Domain='));
  assert.ok(issued.includes('Max-Age=86400'));
  assert.ok(cleared.includes('Max-Age=0'));
});

test('headers and legacy cookie cannot authenticate; valid cookie wins over injected header', () => {
  const context = vm.createContext({ Request });
  vm.runInContext(cookieHelpers, context);
  for (const headers of [{'X-Line-Session':token},{Authorization:`Bearer ${token}`},{Cookie:`line_membership_session=${token}`}]) {
    context.request = new Request('https://api.invalid', {headers});
    assert.equal(vm.runInContext('lineSessionTokenFromCookie(request)', context), '');
  }
  context.request = new Request('https://api.invalid', {headers: {Cookie:`${cookieName}=${token}`, 'X-Line-Session':'untrusted'}});
  assert.equal(vm.runInContext('lineSessionTokenFromCookie(request)', context), token);
});

test('database authentication rejects legacy, expired and revoked sessions even with a forged Cookie header', async () => {
  const code = stripTypeScriptTypes(backend.slice(backend.indexOf('async function getLineLoginSession('), backend.indexOf('const lineSessionCookieName')));
  for (const mode of ['legacy','expired','revoked','valid']) {
    const row = {token,cookie_only:mode !== 'legacy',expires_at:mode === 'expired' ? '2000-01-01' : '2099-01-01'};
    const predicates=[];
    const q={ select:()=>q, eq:(k,v)=>{predicates.push(r=>r[k]===v);return q;}, gt:(k,v)=>{predicates.push(r=>r[k]>v);return q;},
      maybeSingle:async()=>({data:mode !== 'revoked' && predicates.every(p=>p(row)) ? row : null,error:null}) };
    const context=vm.createContext({pruneExpiredLineLoginData:async()=>{},supabase:{from:()=>q},Date});
    vm.runInContext(code,context);
    const result=await vm.runInContext(`getLineLoginSession('${token}')`,context);
    assert.equal(Boolean(result),mode==='valid');
  }
});

test('API uses credentials include and never sends a stored LINE token', async () => {
  let request;
  const source=read('src/lib/api.ts').replaceAll('import.meta.env.VITE_SUPABASE_URL',"'https://api.invalid'")
    .replaceAll('import.meta.env.VITE_SUPABASE_ANON_KEY',"'public-anon'").replace(/\bexport /g,'');
  const context=vm.createContext({AbortController,Map,setTimeout,clearTimeout,
    localStorage:{getItem:k=>k==='line_membership_session_token'?token:null},
    fetch:async(url,options)=>{request=options;return Response.json({loggedIn:true});},
  });
  vm.runInContext(stripTypeScriptTypes(source),context);
  await vm.runInContext("callBackend({action:'getLineLoginSession'})",context);
  assert.equal(request.credentials,'include');
  assert.equal(request.headers['X-Line-Session'],undefined);
  assert.ok(!JSON.stringify(request).includes(token));
});

for (const fallback of [false,true]) {
  for (const accepted of [false,true]) {
    test(`${fallback?'React fallback':'early guard'} removes legacy token, never stores response token, verifies cookie (${accepted})`,async()=>{
      const values=new Map([
        ['line_membership_session_token',token],
        ['line_login_browser_verifier_v2',JSON.stringify({value:'A'.repeat(43),expiresAt:Date.now()+60000})],
      ]);
      const actions=[];
      const window={location:{hash:`#line_login_code=${token}`,pathname:'/membership',search:''},history:{replaceState(){window.location.hash='';}}};
      const respond=payload=>{
        actions.push(payload.action);
        assert.equal(values.has('line_membership_session_token'),false);
        return payload.action==='redeemLineLoginCode'?{authenticated:true,sessionToken:'never-store-this'}:{loggedIn:accepted};
      };
      const context=vm.createContext({window,URLSearchParams,Promise,Date,
        document:{getElementById:()=>({textContent:'{"supabaseUrl":"https://api.invalid","supabaseAnonKey":"public"}'})},
        localStorage:{getItem:k=>values.get(k),removeItem:k=>values.delete(k),setItem:(k,v)=>values.set(k,v)},
        fetch:async(_url,options)=>{assert.equal(options.credentials,'include');return Response.json(respond(JSON.parse(options.body)));},
        callBackend:async payload=>respond(payload),
      });
      if(fallback){
        vm.runInContext(stripTypeScriptTypes(read('src/lib/membership.ts').replace(/^import .*;\r?\n/,'').replace(/\bexport /g,'')),context);
        const result=vm.runInContext('consumeLineLoginCodeFromFragment()',context);
        if(accepted) assert.equal(await result,true); else await assert.rejects(result,/Cookie/);
      } else {
        vm.runInContext(read('public/auth-fragment-guard.js'),context);
        assert.equal(await window.__lineLoginExchangePromise,accepted);
        if(!accepted) assert.match(window.__lineLoginError,/Cookie/);
      }
      assert.deepEqual(actions,['redeemLineLoginCode','getLineLoginSession']);
      assert.equal(values.has('line_membership_session_token'),false);
      assert.ok(![...values.values()].includes('never-store-this'));
    });
  }
}

test('credentialed API denies foreign or absent Origin and sends private no-store responses',async()=>{
  // Exercise the actual HTTP handler with a simple safe action double.
  const originHelpers=backend.slice(backend.indexOf('const defaultAllowedOrigins'),backend.indexOf('const MAX_JSON_BODY_BYTES'));
  const jsonHelper=backend.slice(backend.indexOf('const json ='),backend.indexOf('const inappropriateContentPatterns'));
  let serve;
  const context=vm.createContext({Request,Response,Date,Headers,URL,console:{log(){},error(){}},
    Deno:{env:{get:()=>undefined},serve:fn=>{serve=fn;}},
    withTimeout:p=>p, readRequestText:r=>r.text(),MAX_JSON_BODY_BYTES:65536,
    consumeRateLimit:async()=>true,handleAction:async()=>({loggedIn:false}),
  });
  vm.runInContext(stripTypeScriptTypes(originHelpers+jsonHelper+backend.slice(backend.indexOf('Deno.serve('))),context);
  for(const origin of [null,'https://evil.invalid','https://tyctw.github.io']){
    const response=await serve(new Request('https://api.invalid/functions/v1/backend',{method:'POST',headers:{'Content-Type':'application/json',...(origin?{Origin:origin}:{})},body:'{"action":"getLineLoginSession"}'}));
    assert.equal(response.status,origin==='https://tyctw.github.io'?200:403);
    if(response.status===200)assert.match(response.headers.get('cache-control'),/no-store/);
  }
});
