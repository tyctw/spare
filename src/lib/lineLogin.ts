function randomBinding() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export async function startLineLogin(returnTo: string) {
  const binding = randomBinding();
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(binding));
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  // Only the challenge leaves this origin. Never put the verifier in a URL.
  localStorage.setItem('line_login_browser_verifier_v2', JSON.stringify({ value: binding, expiresAt: Date.now() + 15 * 60 * 1000 }));
  const url = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
  window.location.assign(`${url}/functions/v1/line-login?returnTo=${encodeURIComponent(returnTo)}&browserChallenge=${encodeURIComponent(challenge)}`);
}
