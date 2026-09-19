(function () {
  var configElement = document.getElementById('runtime-config');
  var config = {};
  try { config = JSON.parse(configElement ? configElement.textContent || '{}' : '{}'); } catch (_) { config = {}; }
  var code = new URLSearchParams(window.location.hash.slice(1)).get('line_login_code');
  var binding = new URLSearchParams(window.location.hash.slice(1)).get('line_login_binding');
  var expectedBinding = sessionStorage.getItem('line_login_browser_binding');

  if (!code || !binding || !expectedBinding || binding !== expectedBinding || !config.supabaseUrl || !config.supabaseAnonKey) {
    window.__lineLoginExchangePromise = Promise.resolve(false);
    return;
  }

  // Remove the one-time code synchronously, before any analytics or ad script
  // is allowed to load. The code is exchanged directly for an HttpOnly cookie.
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
  window.__lineLoginExchangePromise = fetch(config.supabaseUrl.replace(/\/$/, '') + '/functions/v1/backend', {
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
      if (data && data.authenticated === true) sessionStorage.removeItem('line_login_browser_binding');
      return data && data.authenticated === true;
    }).catch(function () { return false; });
  }).catch(function () { return false; });
}());
