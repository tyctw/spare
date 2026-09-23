import { callBackend } from './api';

type LiffClient = {
  init(options: { liffId: string }): Promise<void>;
  isInClient(): boolean;
  isLoggedIn(): boolean;
  login(options?: { redirectUri?: string }): void;
  getIDToken(): string | null;
};

let sdkPromise: Promise<LiffClient | null> | null = null;
let loginPromise: Promise<boolean> | null = null;

function loadSdk(): Promise<LiffClient | null> {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve) => {
    if (window.liff) {
      resolve(window.liff);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>('script[data-line-liff-sdk]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.liff || null), { once: true });
      existing.addEventListener('error', () => resolve(null), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://static.line-scdn.net/liff/edge/2/sdk.js';
    script.async = true;
    script.dataset.lineLiffSdk = 'true';
    script.onload = () => resolve(window.liff || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  return sdkPromise;
}

/** Automatically establishes the existing HttpOnly LINE session inside LIFF.
 * It is a no-op on ordinary browsers and when VITE_LIFF_ID is unset. */
export function initializeLiffLogin(): Promise<boolean> {
  if (loginPromise) return loginPromise;
  const liffId = String(import.meta.env.VITE_LIFF_ID || '').trim();
  if (!liffId) return Promise.resolve(false);

  loginPromise = (async () => {
    const liff = await loadSdk();
    if (!liff) return false;
    await liff.init({ liffId });
    if (!liff.isInClient()) return false;
    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: window.location.href });
      return false;
    }
    const existing = await callBackend<{ loggedIn: boolean }>({ action: 'getLineLoginSession' }, { timeoutMs: 5_000 }).catch(() => ({ loggedIn: false }));
    if (existing.loggedIn) return true;
    const idToken = liff.getIDToken();
    if (!idToken || idToken.length > 4096) return false;
    const result = await callBackend<{ authenticated: boolean }>({ action: 'redeemLiffIdToken', idToken }, { timeoutMs: 8_000 });
    return result.authenticated === true;
  })().catch(() => false);
  return loginPromise;
}

declare global {
  interface Window {
    liff?: LiffClient;
  }
}
