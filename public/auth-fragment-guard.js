(function () {
  // Remove the legacy JavaScript-readable session before other scripts load.
  try { localStorage.removeItem('line_membership_session_token'); } catch (_) {}
  // Discard lookup credentials left by older checkout versions on every page.
  try { localStorage.removeItem('support_payment_status_token'); } catch (_) {}
  var configElement = document.getElementById('runtime-config');
  var config = {};
  try { config = JSON.parse(configElement ? configElement.textContent || '{}' : '{}'); } catch (_) { config = {}; }
  var code = new URLSearchParams(window.location.hash.slice(1)).get('line_login_code');
  // Scrub even invalid/legacy callbacks before third-party scripts can run.
  if (code || new URLSearchParams(window.location.hash.slice(1)).has('line_login_binding')) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  var expectedBinding = null;
  try {
    var raw = localStorage.getItem('line_login_browser_verifier_v2');
    if (raw) {
      var parsed = JSON.parse(raw);
      if (typeof parsed.value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(parsed.value) && typeof parsed.expiresAt === 'number' && Date.now() < parsed.expiresAt) {
        expectedBinding = parsed.value;
      }
    }
  } catch (_) {}

  if (!code || !expectedBinding || !config.supabaseUrl || !config.supabaseAnonKey) {
    window.__lineLoginExchangePromise = Promise.resolve(false);
    return;
  }

  // Redeem using only the verifier saved by this browser, never a URL value.
  window.__lineLoginExchangePromise = fetch(config.supabaseUrl.replace(/\/$/, '') + '/functions/v1/backend?_v=2', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      apikey: config.supabaseAnonKey,
      Authorization: 'Bearer ' + config.supabaseAnonKey,
    },
    body: JSON.stringify({ action: 'redeemLineLoginCode', code: code, browserVerifier: expectedBinding }),
  }).then(function (response) {
    if (!response.ok) return false;
    return response.json().then(function (data) {
      if (data && data.authenticated === true) {
        localStorage.removeItem('line_login_browser_verifier_v2');
        // A successful exchange does not prove the browser accepted its cookie.
        return fetch(config.supabaseUrl.replace(/\/$/, '') + '/functions/v1/backend?_v=2', {
          method: 'POST', credentials: 'include',
          headers: { 'Content-Type': 'application/json', apikey: config.supabaseAnonKey, Authorization: 'Bearer ' + config.supabaseAnonKey },
          body: JSON.stringify({ action: 'getLineLoginSession' }),
        }).then(function (check) {
          if (!check.ok) throw new Error('Login check failed');
          return check.json();
        }).then(function (session) {
          if (session.loggedIn !== true) {
            window.__lineLoginError = '瀏覽器未能保存登入狀態，請允許此網站的 Cookie，或使用一般瀏覽器重新登入。';
            return false;
          }
          return true;
        }).catch(function () {
          window.__lineLoginError = '無法確認登入狀態，請稍後重新登入。';
          return false;
        });
      }
      return false;
    }).catch(function () { return false; });
  }).catch(function () { return false; });
}());
