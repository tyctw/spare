function randomBinding() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function startLineLogin(returnTo: string) {
  const binding = randomBinding();
  sessionStorage.setItem('line_login_browser_binding', binding);
  const url = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
  window.location.assign(`${url}/functions/v1/line-login?returnTo=${encodeURIComponent(returnTo)}&browserBinding=${encodeURIComponent(binding)}`);
}
