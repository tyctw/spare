(function () {
  var configElement = document.getElementById('runtime-config');
  var config = {};
  try { config = JSON.parse(configElement ? configElement.textContent || '{}' : '{}'); } catch (_) { config = {}; }
  var code = new URLSearchParams(window.location.hash.slice(1)).get('line_login_code');
  var binding = new URLSearchParams(window.location.hash.slice(1)).get('line_login_binding');
  var expectedBinding = null;
  try {
    var raw = localStorage.getItem('line_login_browser_binding');
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed.value && typeof parsed.expiresAt === 'number' && Date.now() < parsed.expiresAt) {
        expectedBinding = parsed.value;
      }
    }
  } catch (_) {}

  if (!code || !binding || !expectedBinding || binding !== expectedBinding || !config.supabaseUrl || !config.supabaseAnonKey) {
    window.__lineLoginExchangePromise = Promise.resolve(false);
    return;
  }

  // Remove the one-time code synchronously, before any analytics or ad script
  // is allowed to load. The code is exchanged directly for a session token.
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
  window.__lineLoginExchangePromise = fetch(config.supabaseUrl.replace(/\/$/, '') + '/functions/v1/backend?_v=2', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      apikey: config.supabaseAnonKey,
      Authorization: 'Bearer ' + config.supabaseAnonKey,
    },
    body: JSON.stringify({ action: 'redeemLineLoginCode', code: code, browserBinding: binding }),
  }).then(function (response) {
    if (!response.ok) return false;
    return response.json().then(function (data) {
      if (data && data.authenticated === true) {
        localStorage.removeItem('line_login_browser_binding');
        if (data.sessionToken) {
          localStorage.setItem('line_membership_session_token', data.sessionToken);
        }
      }
      return data && data.authenticated === true;
    }).catch(function () { return false; });
  }).catch(function () { return false; });
}());
