import { callBackend } from './api';

let lineLoginExchangePromise: Promise<boolean> | null = null;
let membershipStatusRequest: Promise<MembershipStatus> | null = null;

export type MembershipStatus = {
  active: boolean;
  plan?: 'monthly' | 'yearly';
  expiresAt?: string;
  activatedAt?: string | null;
  contactEmail?: string | null;
};

export const MEMBERSHIP_STATUS_EVENT = 'membership-status-change';

function publishMembershipStatus(status: MembershipStatus) {
  window.dispatchEvent(new CustomEvent<MembershipStatus>(MEMBERSHIP_STATUS_EVENT, { detail: status }));
}

export function clearLineSessionToken() {
  lineLoginExchangePromise = null;
  window.__lineLoginExchangePromise = undefined;
  window.__lineLoginError = undefined;
  try { localStorage.removeItem('line_membership_session_token'); } catch { /* Storage may be blocked. */ }
  publishMembershipStatus({ active: false });
  window.enableAdmissionAds?.();
}

export function consumeLineLoginCodeFromFragment(): Promise<boolean> {
  try { localStorage.removeItem('line_membership_session_token'); } catch { /* Cookie authentication does not depend on storage. */ }
  if (lineLoginExchangePromise) return lineLoginExchangePromise;
  if (window.__lineLoginExchangePromise) {
    lineLoginExchangePromise = window.__lineLoginExchangePromise.then((authenticated) => {
      if (window.__lineLoginError) throw new Error(window.__lineLoginError);
      return authenticated;
    });
    return lineLoginExchangePromise;
  }
  const hash = new URLSearchParams(window.location.hash.slice(1));
  const code = hash.get('line_login_code');
  if (code || hash.has('line_login_binding')) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }
  if (!code) return Promise.resolve(false);

  // Read binding from localStorage (supports cross-tab / WebView navigation)
  let storedBinding: string | null = null;
  try {
    const raw = localStorage.getItem('line_login_browser_verifier_v2');
    if (raw) {
      const parsed = JSON.parse(raw) as { value?: string; expiresAt?: number };
      if (typeof parsed.value === 'string' && /^[A-Za-z0-9_-]{43}$/.test(parsed.value) && typeof parsed.expiresAt === 'number' && Date.now() < parsed.expiresAt) {
        storedBinding = parsed.value;
      } else {
        // Expired — remove stale entry
        localStorage.removeItem('line_login_browser_verifier_v2');
      }
    }
  } catch {
    localStorage.removeItem('line_login_browser_verifier_v2');
  }

  if (!storedBinding) return Promise.resolve(false);

  // The independent verifier comes only from the initiating browser's storage.
  lineLoginExchangePromise = callBackend<{ authenticated: boolean }>({ action: 'redeemLineLoginCode', code, browserVerifier: storedBinding })
    .then(async (redeemed) => {
      if (!redeemed.authenticated) throw new Error('LINE session could not be established.');
      localStorage.removeItem('line_login_browser_verifier_v2');
      const session = await callBackend<{ loggedIn: boolean }>({ action: 'getLineLoginSession' });
      if (!session.loggedIn) throw new Error('瀏覽器未能保存登入狀態，請允許此網站的 Cookie，或使用一般瀏覽器重新登入。');
      return true;
    })
    .catch((error) => {
      lineLoginExchangePromise = null;
      localStorage.removeItem('line_login_browser_verifier_v2');
      throw error;
    });
  return lineLoginExchangePromise;
}

export async function getMembershipStatus(): Promise<MembershipStatus> {
  if (!membershipStatusRequest) {
    membershipStatusRequest = callBackend<MembershipStatus>(
      { action: 'getMembershipStatus' },
      { timeoutMs: 6_000 },
    );
  }

  const request = membershipStatusRequest;
  try {
    const status = await request;
    if (status.active) window.disableAdmissionAds?.();
    publishMembershipStatus(status);
    return status;
  } finally {
    if (membershipStatusRequest === request) membershipStatusRequest = null;
  }
}

export async function initializeAdvertising() {
  try {
    // Keep LIFF lazy so the ordinary browser login path does not load its SDK.
    const { initializeLiffLogin } = await import('./liff');
    await initializeLiffLogin();
    await consumeLineLoginCodeFromFragment();
    const membership = await getMembershipStatus();
    if (membership.active) return membership;
  } catch {
    // A temporary status-check failure must not accidentally grant an
    // ad-free session. The next page load will retry.
  }
  window.loadAdmissionAds?.();
  return { active: false } as MembershipStatus;
}

declare global {
  interface Window {
    loadAdmissionAds?: () => void;
    disableAdmissionAds?: () => void;
    enableAdmissionAds?: () => void;
    __lineLoginExchangePromise?: Promise<boolean>;
    __lineLoginError?: string;
  }
}
