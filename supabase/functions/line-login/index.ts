import { createClient } from 'npm:@supabase/supabase-js@2';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const encoder = new TextEncoder();
const baseUrl = Deno.env.get('SITE_URL')?.replace(/\/$/, '') || 'https://tyctw.github.io/spare';
const callbackUrl = Deno.env.get('LINE_LOGIN_CALLBACK_URL')?.trim() || `${Deno.env.get('SUPABASE_URL')}/functions/v1/line-login`;
const randomToken = () => crypto.randomUUID();

function safeReturnPath(value: string | null) { return value === '/' || value === '/membership' || value === '/membership/account' || value === '/score-records' ? value : '/membership'; }
const privateHeaders = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' };
function redirect(url: string) { return new Response(null, { status: 302, headers: { ...privateHeaders, Location: url } }); }
async function sha256(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function codedError(code: string, status: number, requestId?: string) {
  return new Response(code, { status, headers: { ...privateHeaders, ...(requestId ? { 'X-Request-Id': requestId } : {}) } });
}

Deno.serve(async (request) => {
  if (request.method !== 'GET') return codedError('METHOD_NOT_ALLOWED', 405);
  try {
    const url = new URL(request.url);
    const channelId = Deno.env.get('LINE_CHANNEL_ID')?.trim();
    const channelSecret = Deno.env.get('LINE_CHANNEL_SECRET')?.trim();
    if (!channelId || !channelSecret) return codedError('LINE_LOGIN_UNAVAILABLE', 503);

    if (url.searchParams.has('error')) return codedError('LINE_LOGIN_FAILED', 401);
    if (!url.searchParams.has('code') && !url.searchParams.has('state')) {
      const state = randomToken();
      const nonce = randomToken();
      const verifier = `${randomToken()}${randomToken()}`.replace(/-/g, '');
      const browserChallenge = url.searchParams.get('browserChallenge')?.trim() || '';
      if (!/^[A-Za-z0-9_-]{43}$/.test(browserChallenge)) return codedError('LINE_LOGIN_REQUEST_INVALID', 400);
      const returnPath = safeReturnPath(url.searchParams.get('returnTo'));

      // The URL carries only an opaque transaction ID. Both the LINE PKCE
      // verifier and the browser's independent exchange verifier stay off URLs.
      const { error: transactionError } = await supabase.from('line_login_transactions').insert({
        state, nonce, pkce_verifier: verifier, browser_challenge: browserChallenge,
        return_path: returnPath, expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });
      if (transactionError) throw transactionError;

      const authUrl = new URL('https://access.line.me/oauth2/v2.1/authorize');
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('client_id', channelId);
      authUrl.searchParams.set('redirect_uri', callbackUrl);
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('scope', 'profile openid');
      authUrl.searchParams.set('nonce', nonce);
      authUrl.searchParams.set('code_challenge', await sha256(verifier));
      authUrl.searchParams.set('code_challenge_method', 'S256');
      return redirect(authUrl.toString());
    }

    const state = url.searchParams.get('state') || '';
    const code = url.searchParams.get('code');
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(state) || !code) {
      return codedError('LINE_LOGIN_REQUEST_INVALID', 400);
    }
    // DELETE ... RETURNING claims a live transaction atomically. Concurrent
    // callbacks and replays cannot obtain the same verifier a second time.
    const { data: transaction, error: transactionError } = await supabase.from('line_login_transactions')
      .delete().eq('state', state).gt('expires_at', new Date().toISOString())
      .select('nonce, pkce_verifier, browser_challenge, return_path').maybeSingle();
    if (transactionError) throw transactionError;
    if (!transaction) return codedError('LINE_LOGIN_REQUEST_INVALID', 400);
    const { nonce, pkce_verifier: verifier, browser_challenge: browserChallenge, return_path: returnPath } = transaction;

    const tokenResponse = await fetch('https://api.line.me/oauth2/v2.1/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: callbackUrl, client_id: channelId, client_secret: channelSecret, code_verifier: verifier }) });
    const tokenData = await tokenResponse.json() as { id_token?: string };
    if (!tokenResponse.ok || !tokenData.id_token) return codedError('LINE_LOGIN_FAILED', 401);

    const verifyResponse = await fetch('https://api.line.me/oauth2/v2.1/verify', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ id_token: tokenData.id_token, client_id: channelId, nonce }) });
    const profile = await verifyResponse.json() as { sub?: string; name?: string; picture?: string };
    if (!verifyResponse.ok || !profile.sub) return codedError('LINE_LOGIN_FAILED', 401);

    const { data: session, error } = await supabase.from('line_login_sessions').insert({ line_user_id: profile.sub, cookie_only: true, display_name: profile.name || null, picture_url: profile.picture || null, expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() }).select('token').single();
    if (error || !session) throw error || new Error('Could not create LINE session.');
    const { data: exchange, error: exchangeError } = await supabase.from('line_login_exchange_codes').insert({ line_session_token: session.token, binding_hash: browserChallenge, binding_version: 2, expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() }).select('code').single();
    if (exchangeError || !exchange) throw exchangeError || new Error('Could not create LINE login exchange code.');

    const destination = new URL(`${baseUrl}${safeReturnPath(returnPath)}`);
    destination.hash = `line_login_code=${exchange.code}`;
    return redirect(destination.toString());
  } catch (error) {
    const requestId = crypto.randomUUID();
    console.error('LINE login failed', { requestId, error });
    return codedError('LINE_LOGIN_UNAVAILABLE', 503, requestId);
  }
});
