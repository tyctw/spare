function randomBinding() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function startLineLogin(returnTo: string) {
  const binding = randomBinding();
  localStorage.setItem('line_login_browser_binding', JSON.stringify({ value: binding, expiresAt: Date.now() + 15 * 60 * 1000 }));
  const url = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
  window.location.assign(`${url}/functions/v1/line-login?returnTo=${encodeURIComponent(returnTo)}&browserBinding=${encodeURIComponent(binding)}`);
}
