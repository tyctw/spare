import { callBackend } from './api';

let lineLoginExchangePromise: Promise<boolean> | null = null;
let membershipStatusRequest: Promise<MembershipStatus> | null = null;

export type MembershipStatus = {
  active: boolean;
  plan?: 'monthly' | 'yearly';
  expiresAt?: string;
  contactEmail?: string | null;
};

export const MEMBERSHIP_STATUS_EVENT = 'membership-status-change';

function publishMembershipStatus(status: MembershipStatus) {
  window.dispatchEvent(new CustomEvent<MembershipStatus>(MEMBERSHIP_STATUS_EVENT, { detail: status }));
}

export function clearLineSessionToken() {
  lineLoginExchangePromise = null;
  publishMembershipStatus({ active: false });
  window.enableAdmissionAds?.();
}

export function consumeLineLoginCodeFromFragment(): Promise<boolean> {
  if (lineLoginExchangePromise) return lineLoginExchangePromise;
  if (window.__lineLoginExchangePromise) {
    lineLoginExchangePromise = window.__lineLoginExchangePromise;
    return lineLoginExchangePromise;
  }
  const code = new URLSearchParams(window.location.hash.slice(1)).get('line_login_code');
  if (!code) return Promise.resolve(false);
  // Fragments are not sent in HTTP requests. Remove it before any third-party
  // resource can observe the visible URL, then exchange its one-time code.
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  lineLoginExchangePromise = callBackend<{ authenticated: boolean }>({ action: 'redeemLineLoginCode', code })
    .then((redeemed) => {
      if (!redeemed.authenticated) throw new Error('LINE session could not be established.');
      return true;
    })
    .catch((error) => {
      lineLoginExchangePromise = null;
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
  }
}
