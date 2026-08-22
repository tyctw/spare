import { createClient } from 'npm:@supabase/supabase-js@2';

type Scores = {
  chinese: string;
  english: string;
  math: string;
  science: string;
  social: string;
  composition: number;
};

type Filters = {
  schoolOwnership?: string;
  schoolType?: string;
  vocationalGroups?: string[];
};

type SchoolRow = {
  id?: string;
  region: string;
  name: string;
  district: string | null;
  points: number | string;
  credits: number | string | null;
  historical_scores?: unknown;
  type: string | null;
  ownership: string | null;
  vocational_group: string | null;
  min_chinese: number | null;
  min_english: number | null;
  min_math: number | null;
  min_science: number | null;
  min_social: number | null;
  min_composition: number | null;
  admission_quota: number | null;
  admission_quota_source_url: string | null;
  created_at?: string;
  updated_at?: string;
};

type ScoreBreakdownItem = {
  subject: keyof Scores;
  label: string;
  grade: string | number;
  points: number;
  credits: number | null;
};

type ScoreResult = {
  totalPoints: number;
  totalCredits: number | null;
  breakdown: ScoreBreakdownItem[];
  scoringMethod: string;
};

type HistoricalScore = {
  year: string;
  points: number;
  credits: number | null;
  note?: string;
};

type AnalyzedSchool = {
  name: string;
  points: number;
  credits: number | null;
  historicalScores: HistoricalScore[];
  type: string | null;
  ownership: string | null;
  group: string | null;
  minRequirements: Record<string, number | null>;
  zone: string;
  scoreDiff: number;
  pointsDiff: number;
  creditDiff: number | null;
  distanceScore: number;
  dynamicMargin: number;
  meetsMinRequirements: boolean;
  unmetRequirements: string[];
  analysisNote: string;
};

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const defaultAllowedOrigins = ['https://tyctw.github.io'];
const allowedOrigins = new Set(
  (Deno.env.get('ALLOWED_ORIGINS') || defaultAllowedOrigins.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return origin !== null && allowedOrigins.has(origin);
}

function corsHeaders(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || !allowedOrigins.has(origin)) return { Vary: 'Origin' };
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '600',
    Vary: 'Origin',
  };
}

const MAX_JSON_BODY_BYTES = 64 * 1024;
const MAX_FORM_BODY_BYTES = 32 * 1024;
const DEFAULT_RATE_LIMIT = { windowSeconds: 60, maxRequests: 20 };
const actionRateLimits: Record<string, { windowSeconds: number; maxRequests: number }> = {
  wakeup: { windowSeconds: 60, maxRequests: 10 },
  analyzeScores: { windowSeconds: 60, maxRequests: 8 },
  validateInvitationCode: { windowSeconds: 60, maxRequests: 10 },
  getVolunteerSchools: { windowSeconds: 60, maxRequests: 20 },
  createSharedReport: { windowSeconds: 60, maxRequests: 10 },
  getSharedReport: { windowSeconds: 60, maxRequests: 30 },
  createEcpaySupportPayment: { windowSeconds: 60, maxRequests: 5 },
  getEcpaySupportPaymentStatus: { windowSeconds: 60, maxRequests: 20 },
  createMembershipPayment: { windowSeconds: 60, maxRequests: 5 },
  getMembershipStatus: { windowSeconds: 60, maxRequests: 30 },
  getMembershipPurchaseHistory: { windowSeconds: 60, maxRequests: 20 },
  getLineLoginSession: { windowSeconds: 60, maxRequests: 30 },
  redeemLineLoginCode: { windowSeconds: 60, maxRequests: 10 },
  revokeLineLoginSession: { windowSeconds: 60, maxRequests: 10 },
  deleteMembershipAccount: { windowSeconds: 3600, maxRequests: 3 },
  submitFeedback: { windowSeconds: 3600, maxRequests: 5 },
  reportError: { windowSeconds: 3600, maxRequests: 5 },
  adminListSchools: { windowSeconds: 60, maxRequests: 10 },
  adminUpsertSchool: { windowSeconds: 60, maxRequests: 10 },
  adminDeleteSchool: { windowSeconds: 60, maxRequests: 10 },
  adminClearHistoricalScores: { windowSeconds: 60, maxRequests: 5 },
};

const json = (request: Request, body: unknown, status = 200, extraHeaders: HeadersInit = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders },
  });

const inappropriateContentPatterns = [
  /幹/,
  /靠北/,
  /靠腰/,
  /三小/,
  /白癡/,
  /智障/,
  /低能/,
  /去死/,
  /王八/,
  /垃圾/,
  /賤/,
  /婊/,
  /操/,
  /肏/,
  /屌/,
  /雞巴/,
  /機掰/,
  /懶叫/,
  /洨/,
  /精液/,
  /陰莖/,
  /陰道/,
  /fuck/,
  /shit/,
  /bitch/,
  /asshole/,
];

const normalizeContentForModeration = (value: string) =>
  value.toLowerCase().replace(/[\s\u200b\u200c\u200d\p{P}\p{S}_]+/gu, '');

const hasInappropriateContent = (value: string) => {
  const normalized = normalizeContentForModeration(value);
  return inappropriateContentPatterns.some((pattern) => pattern.test(normalized));
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

type EcpayPayload = Record<string, string | number>;

const ecpayUrlEncode = (value: string) => encodeURIComponent(value)
  .replace(/%20/g, '+')
  .replace(/%2D/g, '-')
  .replace(/%5F/g, '_')
  .replace(/%2E/g, '.')
  .replace(/%21/g, '!')
  .replace(/%2A/g, '*')
  .replace(/%28/g, '(')
  .replace(/%29/g, ')')
  .toLowerCase();

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
};

const ecpayCheckMacValue = async (params: EcpayPayload, hashKey: string, hashIv: string) => {
  const body = Object.entries(params)
    .filter(([key]) => key !== 'CheckMacValue')
    .sort(([left], [right]) => left.toLowerCase().localeCompare(right.toLowerCase()))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return sha256(ecpayUrlEncode(`HashKey=${hashKey}&${body}&HashIV=${hashIv}`));
};

const ecpayConfig = () => {
  const merchantId = Deno.env.get('ECPAY_MERCHANT_ID')?.trim();
  const hashKey = Deno.env.get('ECPAY_HASH_KEY')?.trim();
  const hashIv = Deno.env.get('ECPAY_HASH_IV')?.trim();
  const mode = Deno.env.get('ECPAY_MODE')?.trim().toLowerCase() || 'production';
  const returnUrl = Deno.env.get('ECPAY_RETURN_URL')?.trim() || `${supabaseUrl}/functions/v1/ecpay-callback`;
  const clientBackUrl = Deno.env.get('ECPAY_CLIENT_BACK_URL')?.trim() || 'https://tyctw.github.io/spare/support/success';

  if (!merchantId || !hashKey || !hashIv) throw new Error('ECPay payment is not configured. Set ECPAY_MERCHANT_ID, ECPAY_HASH_KEY, and ECPAY_HASH_IV.');
  return {
    merchantId,
    hashKey,
    hashIv,
    mode,
    returnUrl,
    clientBackUrl,
    actionUrl: mode === 'stage' ? 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5' : 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5',
  };
};

const createMerchantTradeNo = () => `SP${Date.now()}${crypto.getRandomValues(new Uint16Array(1))[0].toString(36).toUpperCase()}`.slice(0, 20);
const createMembershipTradeNo = () => `MB${Date.now()}${crypto.getRandomValues(new Uint16Array(1))[0].toString(36).toUpperCase()}`.slice(0, 20);
const membershipPlans = {
  monthly: { amount: 49, days: 30, itemName: '免廣告月費會員' },
  yearly: { amount: 399, days: 365, itemName: '免廣告年費會員' },
} as const;

async function pruneExpiredLineLoginData() {
  const now = new Date().toISOString();
  await Promise.all([
    supabase.from('line_login_exchange_codes').delete().lt('expires_at', now),
    supabase.from('line_login_sessions').delete().lt('expires_at', now),
  ]).catch((error) => console.warn('Could not prune expired LINE login data', error));
}

async function getLineLoginSession(token: unknown) {
  await pruneExpiredLineLoginData();
  const sessionToken = String(token || '').trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionToken)) return null;
  const { data, error } = await supabase
    .from('line_login_sessions')
    .select('line_user_id, display_name, picture_url, expires_at')
    .eq('token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();
  if (error) throw error;
  return data;
}

const lineSessionCookieName = 'line_membership_session';
const lineSessionCookie = (token: string, maxAge = 15 * 60) =>
  `${lineSessionCookieName}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=None; Partitioned; Path=/functions/v1/backend; Max-Age=${maxAge}`;

function cookieValue(request: Request, name: string) {
  const prefix = `${name}=`;
  const value = (request.headers.get('cookie') || '').split(';').map((item) => item.trim()).find((item) => item.startsWith(prefix))?.slice(prefix.length);
  try {
    return value ? decodeURIComponent(value) : '';
  } catch {
    return '';
  }
}

function lineSessionTokenFromCookie(request: Request) {
  return cookieValue(request, lineSessionCookieName).trim();
}

async function activeMembershipForRequest(request: Request) {
  const lineSession = await getLineLoginSession(lineSessionTokenFromCookie(request));
  if (!lineSession) return null;

  const { data, error } = await supabase
    .from('membership_payments')
    .select('plan, expires_at')
    .eq('status', 'paid')
    .gt('expires_at', new Date().toISOString())
    .eq('line_user_id', lineSession.line_user_id)
    .order('expires_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

const SCHOOL_CACHE_TTL_MS = 20 * 60 * 1000;
const VOLUNTEER_SCHOOL_CACHE_TTL_MS = 30 * 60 * 1000;

const cache = new Map<string, CacheEntry<unknown>>();
const pendingLoads = new Map<string, Promise<unknown>>();

async function withTimeout<T>(
  promise: PromiseLike<T>,
  ms = 5000,
  label = 'operation',
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} timeout after ${ms}ms`));
    }, ms);
  });

  try {
    return await Promise.race([Promise.resolve(promise), timeout]);
  } finally {
    clearTimeout(timer!);
  }
}

function cacheKey(parts: Array<string | number | null | undefined>) {
  return parts.map((part) => String(part ?? '')).join(':');
}

async function cached<T>(key: string, ttlMs: number, loader: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const existing = cache.get(key) as CacheEntry<T> | undefined;
  if (existing && existing.expiresAt > now) return existing.value;

  const pending = pendingLoads.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const load = loader()
    .then((value) => {
      cache.set(key, { value, expiresAt: Date.now() + ttlMs });
      return value;
    })
    .finally(() => pendingLoads.delete(key));

  pendingLoads.set(key, load);
  return load;
}

function invalidateCache(prefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}

function background(task: PromiseLike<unknown>) {
  const guarded = Promise.resolve(task).catch((error) =>
    console.error('background task failed', error),
  );

  const runtime = globalThis as typeof globalThis & {
    EdgeRuntime?: { waitUntil?: (promise: Promise<unknown>) => void };
  };

  if (typeof runtime.EdgeRuntime?.waitUntil === 'function') {
    runtime.EdgeRuntime.waitUntil(guarded);
  }
}

const IPV4_ADDRESS_PATTERN = /^(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
const IPV6_ADDRESS_PATTERN = /^[0-9a-f:]+$/i;

function clientAddress(request: Request) {
  // This function is deployed behind Supabase's Cloudflare edge, which sets
  // CF-Connecting-IP. Never use X-Forwarded-For or X-Real-IP here: callers
  // can supply those headers themselves and create a fresh rate-limit bucket
  // for every request.
  const address = request.headers.get('cf-connecting-ip')?.trim() || '';
  if (IPV4_ADDRESS_PATTERN.test(address) || (address.includes(':') && IPV6_ADDRESS_PATTERN.test(address))) {
    return address;
  }

  // Fail closed. If the trusted edge header is unexpectedly unavailable, all
  // such traffic shares one bucket rather than allowing an attacker to choose
  // arbitrary client identifiers through request headers.
  return 'unavailable-client-address';
}

async function consumeRateLimit(request: Request, action: string) {
  const hasConfiguredLimit = Object.prototype.hasOwnProperty.call(actionRateLimits, action);
  const limit = hasConfiguredLimit ? actionRateLimits[action] : DEFAULT_RATE_LIMIT;
  // Only the hash is stored in the rate-limit table, not the visitor IP itself.
  const clientKey = await sha256(clientAddress(request));
  const { data, error } = await withTimeout(
    supabase.rpc('consume_api_rate_limit', {
      requested_client_key: clientKey,
      requested_action: hasConfiguredLimit ? action : 'unknown',
      requested_window_seconds: limit.windowSeconds,
      requested_max_requests: limit.maxRequests,
    }),
    3000,
    'rate limit check',
  );

  if (error) throw error;
  return data === true;
}

async function readRequestText(request: Request, maxBytes: number) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new Error('Request body is too large.');
  }

  if (!request.body) return '';

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new Error('Request body is too large.');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

function taipeiParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

function rollingCode(prefix: string, date: Date) {
  const p = taipeiParts(date);
  return `${prefix}${p.year}${p.month}${p.day}${p.hour}`;
}

async function validateInvitationCode(code: unknown, request: Request, consume = false) {
  const invitationCode = String(code || '').trim().toUpperCase();
  let valid = false;

  if (invitationCode) {
    const now = new Date();
    const prefixes = ['TYCTW', 'TW', 'CTTW', 'KHTW', 'CHCTW', 'SH'];

    const generatedCodes = prefixes.flatMap((prefix) => [
      rollingCode(prefix, now),
      rollingCode(prefix, new Date(now.getTime() - 60 * 60 * 1000)),
    ]);

    valid = generatedCodes.includes(invitationCode);

    if (!valid && consume) {
      const { data, error } = await withTimeout(
        supabase.rpc('consume_invitation_code', {
          requested_code: invitationCode,
        }),
        3000,
        'consume invitation code',
      );

      if (error) throw error;
      valid = data === true;
    } else if (!valid) {
      const { data, error } = await withTimeout(
        supabase
          .from('invitation_codes')
          .select('active, expires_at, max_uses, use_count')
          .eq('code', invitationCode)
          .maybeSingle(),
        3000,
        'validate invitation code',
      );

      if (error) throw error;

      if (data) {
        const notExpired = !data.expires_at || new Date(data.expires_at) > now;
        const hasUses = data.max_uses === null || data.use_count < data.max_uses;
        valid = data.active && notExpired && hasUses;
      }
    }
  }

  background(
    withTimeout(
      supabase.from('invitation_logs').insert({
        action: consume ? '使用' : '驗證',
        invitation_code: invitationCode || null,
        success: valid,
        ip: clientAddress(request),
        user_agent: request.headers.get('user-agent'),
      }),
      2000,
      'insert invitation log',
    ),
  );

  return valid;
}

async function requireAdmin(request: Request) {
  const authorization = request.headers.get('authorization') || '';
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new Error('Administrator authentication is required.');

  // Validate the Supabase Auth JWT server-side. A caller can no longer gain
  // privileged access by knowing an application-wide password.
  const { data: authData, error: authError } = await withTimeout(
    supabase.auth.getUser(token),
    3000,
    'verify administrator session',
  );
  const user = authData.user;
  if (authError || !user) throw new Error('Administrator authentication is invalid or expired.');

  const { data: membership, error: membershipError } = await withTimeout(
    supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle(),
    3000,
    'verify administrator role',
  );
  if (membershipError) throw membershipError;
  if (!membership) throw new Error('Administrator role is required.');

  background(
    withTimeout(
      supabase.from('invitation_logs').insert({
        action: 'admin',
        invitation_code: '[authenticated-admin]',
        success: true,
        ip: clientAddress(request),
        user_agent: request.headers.get('user-agent'),
      }),
      2000,
      'insert admin audit log',
    ),
  );

  return user;
}

// Retained temporarily only to keep the historical source diff small. No
// privileged route calls this function; all routes below use requireAdmin().
async function validateAdminCode(code: unknown, request: Request) {
  const adminCode = Deno.env.get('ADMIN_ACCESS_CODE')?.trim();
  const requestedCode = String(code || '').trim();

  // Admin access must never fall back to an invitation code. Invitation codes
  // grant end-user access only; using one here would let a public code control
  // privileged school-management actions when this secret is misconfigured.
  if (!adminCode) {
    console.error('ADMIN_ACCESS_CODE is not configured; refusing admin access.');
    throw new Error('管理功能尚未完成安全設定');
  }

  const valid = requestedCode.length > 0 && requestedCode === adminCode;

  background(
    withTimeout(
      supabase.from('invitation_logs').insert({
        action: 'admin',
        invitation_code: requestedCode ? '[admin-code]' : null,
        success: valid,
        ip: clientAddress(request),
        user_agent: request.headers.get('user-agent'),
      }),
      2000,
      'insert admin log',
    ),
  );

  return valid;
}

function assertAdmin(valid: boolean) {
  if (!valid) throw new Error('管理驗證碼無效或已過期');
}

function nullableNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error('數字欄位格式不正確');
  return number;
}

function parseHistoricalScores(value: unknown): HistoricalScore[] {
  if (!value) return [];
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    if (!Array.isArray(parsed)) return [];
    const scores: HistoricalScore[] = [];

    parsed.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const record = item as Record<string, unknown>;
      const points = nullableNumber(record.points);
      if (points === null) return;
      const year = String(record.year || '').trim();
      if (!year) return;

      scores.push({
        year,
        points,
        credits: nullableNumber(record.credits),
        note: String(record.note || '').trim() || undefined,
      });
    });

    return scores;
  } catch {
    return [];
  }
}

function normalizeHistoricalScores(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const scores = parseHistoricalScores(value).filter((item) => Number.isFinite(item.points));
  return scores.length ? scores : null;
}

function assertScores(value: unknown): asserts value is Scores {
  const scores = value as Scores;
  const grades = new Set(['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C']);
  const subjects: (keyof Scores)[] = ['chinese', 'english', 'math', 'science', 'social'];

  if (!scores || subjects.some((subject) => !grades.has(String(scores[subject])))) {
    throw new Error('成績格式不正確');
  }

  const composition = Number(scores.composition);

  if (!Number.isInteger(composition) || composition < 0 || composition > 6) {
    throw new Error('作文級分必須為 0 到 6');
  }

  scores.composition = composition;
}

function sumSubjects(scores: Scores, points: Record<string, number>) {
  return ['chinese', 'english', 'math', 'science', 'social'].reduce(
    (sum, subject) => sum + points[scores[subject as keyof Scores] as string],
    0,
  );
}

function roundScore(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildBreakdown(
  scores: Scores,
  pointMap: Record<string, number>,
  creditMap: Record<string, number> | null,
  compositionPoints = 0,
  compositionCredits: number | null = null,
) {
  const labels: Record<string, string> = {
    chinese: '國文',
    english: '英文',
    math: '數學',
    science: '自然',
    social: '社會',
    composition: '寫作測驗',
  };

  const subjects: (keyof Scores)[] = ['chinese', 'english', 'math', 'science', 'social'];

  const breakdown = subjects.map((subject) => {
    const grade = scores[subject] as string;

    return {
      subject,
      label: labels[subject],
      grade,
      points: pointMap[grade],
      credits: creditMap ? creditMap[grade] : null,
    };
  });

  if (compositionPoints > 0 || compositionCredits !== null) {
    breakdown.push({
      subject: 'composition',
      label: labels.composition,
      grade: scores.composition,
      points: compositionPoints,
      credits: compositionCredits,
    });
  }

  return breakdown;
}

function calculateScores(region: string, scores: Scores): ScoreResult {
  const standardPoints = { 'A++': 6, 'A+': 6, A: 6, 'B++': 4, 'B+': 4, B: 4, C: 2 };
  const standardCredits = { 'A++': 7, 'A+': 6, A: 5, 'B++': 4, 'B+': 3, B: 2, C: 1 };
  const detailedPoints = { 'A++': 7, 'A+': 6, A: 5, 'B++': 4, 'B+': 3, B: 2, C: 1 };
  const compositionDecimal = [0, 0.1, 0.2, 0.4, 0.6, 0.8, 1];

  if (region === 'taoyuan') {
    const compositionPoints = [0, 1, 2, 2, 3, 3, 3][scores.composition];

    return {
      totalPoints: roundScore(sumSubjects(scores, standardPoints) + compositionPoints),
      totalCredits: sumSubjects(scores, standardCredits),
      breakdown: buildBreakdown(scores, standardPoints, standardCredits, compositionPoints),
      scoringMethod: '五科以 A=6、B=4、C=2 計積分，寫作測驗另依級分加計；同積分時以積點作為精細排序依據。',
    };
  }

  if (region === 'kaohsiung' || region === 'hsinchu') {
    return {
      totalPoints: sumSubjects(scores, standardPoints),
      totalCredits: sumSubjects(scores, standardCredits),
      breakdown: buildBreakdown(scores, standardPoints, standardCredits),
      scoringMethod: '五科以 A=6、B=4、C=2 計積分，並以 A++ 至 C 的積點作為同分比較依據。',
    };
  }

  if (region === 'central') {
    const credits = { 'A++': 21, 'A+': 18, A: 15, 'B++': 12, 'B+': 9, B: 6, C: 3 };

    return {
      totalPoints: sumSubjects(scores, standardPoints),
      totalCredits: sumSubjects(scores, credits) + scores.composition,
      breakdown: buildBreakdown(scores, standardPoints, credits, 0, scores.composition),
      scoringMethod: '五科以 A=6、B=4、C=2 計積分；積點採 A++=21 至 C=3，並加計寫作級分以提升同分推估精度。',
    };
  }

  if (region === 'changhua') {
    const points = { 'A++': 9, 'A+': 8, A: 7, 'B++': 6, 'B+': 5, B: 4, C: 3 };

    return {
      totalPoints: sumSubjects(scores, points),
      totalCredits: null,
      breakdown: buildBreakdown(scores, points, null),
      scoringMethod: '五科直接採 A++=9 至 C=3 的細分積分，已將同等級內差異納入總分。',
    };
  }

  if (region === 'taipei' || region === 'tainan') {
    const compositionPoints = compositionDecimal[scores.composition];

    return {
      totalPoints: roundScore(sumSubjects(scores, detailedPoints) + compositionPoints),
      totalCredits: null,
      breakdown: buildBreakdown(scores, detailedPoints, null, compositionPoints),
      scoringMethod: '五科採 A++=7 至 C=1 的細分積分，寫作測驗以小數加權，適合做更細緻的門檻差距比較。',
    };
  }

  if (region === 'chiayi') {
    const points = { 'A++': 5, 'A+': 5, A: 5, 'B++': 3, 'B+': 3, B: 3, C: 1 };
    const credits = { 'A++': 9, 'A+': 8, A: 7, 'B++': 5, 'B+': 4, B: 3, C: 1 };
    const compositionPoints = scores.composition >= 5 ? 2 : scores.composition >= 3 ? 1.5 : scores.composition >= 1 ? 1 : 0;

    return {
      totalPoints: roundScore(sumSubjects(scores, points) + compositionPoints),
      totalCredits: sumSubjects(scores, credits),
      breakdown: buildBreakdown(scores, points, credits, compositionPoints),
      scoringMethod: '五科以精熟=5、基礎=3、待加強=1計積分；寫作6、5級分2分，4、3級分1.5分，2、1級分1分，會考項目最高27分。五科積點依 A++=9、A+=8、A=7、B++=5、B+=4、B=3、C=1 換算，供同分比較使用。',
    };
  }

  throw new Error(`無效的地區指定: ${region}`);
}

function filterSchools(
  rows: SchoolRow[],
  totalPoints: number,
  totalCredits: number | null,
  filters: Filters,
  scores: Scores,
  region: string,
) {
  let margin = 2;
  if (region === 'central' || region === 'changhua') margin = 3;
  if (region === 'taipei' || region === 'tainan' || region === 'hsinchu' || region === 'chiayi') margin = 1.5;

  const scoreValues: Record<string, number> = {
    'A++': 9,
    'A+': 8,
    A: 7,
    'B++': 6,
    'B+': 5,
    B: 4,
    C: 3,
  };

  const subjectLabels: Record<string, string> = {
    chinese: '國文',
    english: '英文',
    math: '數學',
    science: '自然',
    social: '社會',
    composition: '作文',
  };

  const requirementValues: Record<string, number> = {
    chinese: scoreValues[scores.chinese],
    english: scoreValues[scores.english],
    math: scoreValues[scores.math],
    science: scoreValues[scores.science],
    social: scoreValues[scores.social],
    composition: scores.composition,
  };

  return rows
    .map((row) => {
      const school = {
        region: row.region,
        name: row.name,
        district: row.district,
        points: Number(row.points),
        credits: row.credits === null || row.credits === '' ? null : Number(row.credits),
        historicalScores: parseHistoricalScores(row.historical_scores),
        admissionQuota: row.admission_quota,
        admissionQuotaSourceUrl: row.admission_quota_source_url,
        type: row.type,
        ownership: row.ownership,
        group: row.vocational_group,
        minRequirements: {
          chinese: row.min_chinese,
          english: row.min_english,
          math: row.min_math,
          science: row.min_science,
          social: row.min_social,
          composition: row.min_composition,
        },
      };

      const diff = roundScore(totalPoints - school.points);

      const creditDiff =
        school.credits !== null && totalCredits !== null
          ? roundScore(totalCredits - school.credits)
          : null;

      const hasCredits = school.credits !== null;
      const isVocational = school.type !== null && school.type !== '普通科';

      const dynamicMargin = roundScore(
        clamp(margin + (isVocational ? 0.35 : 0) + (totalCredits !== null ? 0.15 : 0), 0.8, 3.5),
      );

      let zone = 'safe';

      if (diff < 0) zone = 'reach';
      else if (diff === 0) {
        if (hasCredits && totalCredits !== null) {
          zone =
            creditDiff !== null && creditDiff < 0
              ? 'reach'
              : creditDiff !== null && creditDiff <= 2
                ? 'target'
                : 'safe';
        } else {
          zone = 'target';
        }
      } else if (diff <= dynamicMargin * 0.5) {
        zone = 'target';
      }

      // Subject values are only used after total points and credits are tied.
      // They are historical admission references, not eligibility rules.
      const shouldCheckMinRequirements =
        diff === 0 && hasCredits && totalCredits !== null && creditDiff === 0;

      const unmetRequirements = shouldCheckMinRequirements
        ? Object.entries(school.minRequirements)
            .filter(
              ([subject, minimum]) =>
                minimum && requirementValues[subject] < minimum,
            )
            .map(([subject]) => subjectLabels[subject] || subject)
        : [];

      const meetsMinRequirements = unmetRequirements.length === 0;

      if (!meetsMinRequirements) zone = 'reach';

      const creditPenalty = creditDiff !== null && creditDiff < 0 ? Math.abs(creditDiff) / 10 : 0;
      const minRequirementPenalty = unmetRequirements.length * 0.75;
      const positiveCreditBonus =
        creditDiff !== null && creditDiff > 0 ? Math.min(creditDiff, 6) * 0.05 : 0;

      const distanceScore = roundScore(
        diff - creditPenalty - minRequirementPenalty + positiveCreditBonus,
      );

      const pointDifferenceText = Math.abs(diff);
      const subjectReferenceText = unmetRequirements.length > 0
        ? `；${unmetRequirements.join('、')}低於歷年錄取參考，錄取風險提高`
        : '';

      // Keep the copy factual and numerical. "minRequirements" is retained
      // as a database/API field name, but is presented as a historical
      // reference rather than a qualification rule.
      const analysisNote = !meetsMinRequirements
        ? diff < 0
          ? `總積分低於參考門檻 ${pointDifferenceText} 分，屬可挑戰範圍${subjectReferenceText}，列為夢幻區。`
          : diff === 0
            ? `總積分與積點皆與參考值相同${subjectReferenceText}，列為夢幻區。`
            : `總積分高於參考門檻 ${pointDifferenceText} 分${subjectReferenceText}，列為夢幻區。`
        : creditDiff !== null && diff === 0 && creditDiff > 0
          ? `總積分相同，積點高於參考值 ${creditDiff} 點，同分比序較具優勢。`
          : creditDiff !== null && diff === 0 && creditDiff < 0
            ? `總積分相同，積點低於參考值 ${Math.abs(creditDiff)} 點，同分比序風險較高。`
            : creditDiff !== null && diff === 0 && creditDiff === 0
              ? '總積分與積點皆與參考值相同，仍須留意超額比序。'
              : diff < 0
                ? `總積分低於參考門檻 ${pointDifferenceText} 分，屬可挑戰範圍。`
                : diff === 0
                  ? '總積分與參考門檻相同，仍須留意超額比序。'
                  : zone === 'safe'
                    ? `總積分高於參考門檻 ${pointDifferenceText} 分，錄取條件相對穩健。`
                    : `總積分高於參考門檻 ${pointDifferenceText} 分，具備申請競爭力。`;

      return {
        ...school,
        zone,
        scoreDiff: diff,
        pointsDiff: diff,
        creditDiff,
        distanceScore,
        dynamicMargin,
        meetsMinRequirements,
        unmetRequirements,
        analysisNote,
      };
    })
    .filter((school) => {
      const ownershipMatch =
        !filters.schoolOwnership ||
        filters.schoolOwnership === 'all' ||
        school.ownership === filters.schoolOwnership;

      const typeMatch =
        !filters.schoolType ||
        filters.schoolType === 'all' ||
        school.type === filters.schoolType;

      const groups = filters.vocationalGroups || [];

      const groupMatch =
        groups.length === 0 || groups.includes('all') || groups.includes(school.group || '');

      const isReach = school.scoreDiff < 0 && school.scoreDiff >= -school.dynamicMargin;
      const isCreditReach =
        school.scoreDiff === 0 && school.creditDiff !== null && school.creditDiff < 0;

      const pointsMatch = totalPoints >= school.points || isReach;

      const creditsMatch =
        school.credits === null ||
        totalPoints > school.points ||
        (totalPoints === school.points &&
          totalCredits !== null &&
          totalCredits >= school.credits) ||
        isReach ||
        isCreditReach;

      return ownershipMatch && typeMatch && groupMatch && pointsMatch && creditsMatch;
    })
    .sort((a, b) => {
      const zoneOrder: Record<string, number> = { reach: 0, target: 1, safe: 2 };

      return (
        (zoneOrder[a.zone] ?? 99) - (zoneOrder[b.zone] ?? 99) ||
        (a.zone === 'reach' && b.zone === 'reach'
          ? Math.abs(b.scoreDiff) - Math.abs(a.scoreDiff) ||
            Math.abs(b.creditDiff ?? 0) - Math.abs(a.creditDiff ?? 0)
          : Math.abs(a.scoreDiff) - Math.abs(b.scoreDiff)) ||
        b.points - a.points ||
        (b.credits || 0) - (a.credits || 0)
      );
    });
}

function analysisReportV2(
  scores: Scores,
  schools: AnalyzedSchool[],
  calculated: ScoreResult,
  region: string,
) {
  const values = Object.values(scores);

  const aCount = values.filter(
    (score) => typeof score === 'string' && score.startsWith('A'),
  ).length;

  const bCount = values.filter(
    (score) => typeof score === 'string' && score.startsWith('B'),
  ).length;

  const cCount = values.filter((score) => score === 'C').length;

  const zoneCounts = schools.reduce(
    (counts, school) => {
      counts[school.zone] = (counts[school.zone] || 0) + 1;
      return counts;
    },
    { safe: 0, target: 0, reach: 0 } as Record<string, number>,
  );

  const total = schools.length || 1;
  const reachRatio = Math.round((zoneCounts.reach / total) * 100);
  const targetRatio = Math.round((zoneCounts.target / total) * 100);
  const safeRatio = Math.round((zoneCounts.safe / total) * 100);

  const samePointCreditReach = schools.filter(
    (school) => school.scoreDiff === 0 && school.creditDiff !== null && school.creditDiff < 0,
  ).length;

  const unmetRequirementCount = schools.filter((school) => !school.meetsMinRequirements).length;

  let levelComment =
    '整體落點風險偏高，建議採取穩健策略，優先把實際區與保守區補足，再少量挑戰夢幻區。';

  if (aCount === 5) {
    levelComment =
      '五科皆達 A 群，具備挑戰前段與熱門學校的條件；熱門校仍需留意同分比序、作文級分與招生名額變動。';
  } else if (aCount >= 4) {
    levelComment = 'A 群科目非常完整，前段學校競爭力強，建議以夢幻區搭配實際區建立志願序。';
  } else if (aCount >= 3) {
    levelComment = 'A 群科目比例高，前段學校競爭力明顯，但仍要留意同分比序與單科門檻。';
  } else if (aCount >= 2) {
    levelComment = '具備一定前段競爭力，建議以實際區為主、少量挑戰夢幻區，並補足保守區。';
  } else if (aCount >= 1 || bCount >= 4) {
    levelComment = '整體成績穩定，適合以實際區為主軸建立志願序，並依興趣與通勤條件排序。';
  } else if (bCount >= 3 && cCount <= 1) {
    levelComment = '基礎能力穩定，建議以實際區與保守區為核心，挑戰校不宜過多。';
  } else if (bCount >= 2 && cCount <= 2) {
    levelComment = '落點會集中在中後段與技職類科，建議擴大校系選擇並重視興趣適配。';
  } else if (cCount >= 3) {
    levelComment = '待加強科目較多，建議優先確認單科門檻、招生名額與交通可行性，並增加保守選項。';
  }

  const summaryParts = [
    `試算總積分為 ${calculated.totalPoints}${calculated.totalCredits !== null ? `，總積點為 ${calculated.totalCredits}` : ''}。`,
    levelComment,
    `符合篩選條件的學校共 ${schools.length} 所：夢幻區 ${zoneCounts.reach} 所、實際區 ${zoneCounts.target} 所、保守區 ${zoneCounts.safe} 所。`,
  ];

  if (samePointCreditReach > 0) {
    summaryParts.push(
      `其中 ${samePointCreditReach} 所是積分相同但積點未達，已視為同分比序挑戰並歸入夢幻區。`,
    );
  }

  if (unmetRequirementCount > 0) {
    summaryParts.push(`${unmetRequirementCount} 所學校有單科門檻未達，系統已提高風險判定。`);
  }

  return {
    analysisSummary: summaryParts.join(''),
    zoneCounts,
    suggestion:
      '填寫會考志願時，建議依「夢幻、落點、安全」三層配置。前段可放幾個想挑戰、分數略高的夢幻志願；中段以歷年錄取分數與自身成績相近的落點志願為主；後段則保留2至3個錄取機率較高的安全志願，降低落榜風險。安排時也要考量通勤時間、校風、學習壓力與升學風氣，選擇真正適合自己的高中。',
    scoringExplanation: calculated.scoringMethod,
    scoreBreakdown: calculated.breakdown,
    riskNotes: {
      reachRatio,
      targetRatio,
      safeRatio,
      samePointCreditReach,
      unmetRequirementCount,
    },
    region,
  };
}

async function handleAction(payload: Record<string, any>, request: Request) {
  switch (payload.action) {
    case 'wakeup':
      return { message: 'System is awake and ready!' };

    case 'createEcpaySupportPayment': {
      const amount = Number(payload.amount);
      if (!Number.isInteger(amount) || amount < 10 || amount > 50_000) {
        throw new Error('Support amount must be a whole number between NT$10 and NT$50,000.');
      }

      const config = ecpayConfig();
      const merchantTradeNo = createMerchantTradeNo();
      const now = new Date();
      const merchantTradeDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const fields: EcpayPayload = {
        MerchantID: config.merchantId,
        MerchantTradeNo: merchantTradeNo,
        MerchantTradeDate: merchantTradeDate,
        PaymentType: 'aio',
        TotalAmount: amount,
        TradeDesc: 'Support',
        ItemName: '網站小額支持',
        ReturnURL: config.returnUrl,
        ChoosePayment: 'ALL',
        ClientBackURL: config.clientBackUrl,
        NeedExtraPaidInfo: 'Y',
        EncryptType: 1,
        CustomField1: 'website-support',
      };
      const checkMacValue = await ecpayCheckMacValue(fields, config.hashKey, config.hashIv);

      const { data: payment, error } = await supabase
        .from('support_payments')
        .insert({
          merchant_trade_no: merchantTradeNo,
          amount,
          status: 'pending',
          payment_method: 'ALL',
        })
        .select('status_lookup_token')
        .single();
      if (error || !payment?.status_lookup_token) throw error || new Error('Could not create payment tracking token.');

      return {
        actionUrl: config.actionUrl,
        fields: { ...fields, CheckMacValue: checkMacValue },
        statusLookupToken: payment.status_lookup_token,
      };
    }

    case 'getEcpaySupportPaymentStatus': {
      const merchantTradeNo = String(payload.merchantTradeNo || '');
      const statusLookupToken = String(payload.statusLookupToken || '').trim();
      if (!/^[A-Za-z0-9]{8,32}$/.test(merchantTradeNo)
        || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(statusLookupToken)) {
        throw new Error('Invalid support payment reference.');
      }

      const { data, error } = await supabase
        .from('support_payments')
        .select('status, amount')
        .eq('merchant_trade_no', merchantTradeNo)
        .eq('status_lookup_token', statusLookupToken)
        .maybeSingle();
      if (error) throw error;
      return data || { status: 'not_found' };
    }

    case 'createMembershipPayment': {
      const planId = String(payload.plan || '') as keyof typeof membershipPlans;
      const plan = membershipPlans[planId];
      if (!plan) throw new Error('Invalid membership plan.');
      const lineSession = await getLineLoginSession(lineSessionTokenFromCookie(request));
      if (!lineSession) throw new Error('LINE login is required before purchasing membership.');

      const config = ecpayConfig();
      const merchantTradeNo = createMembershipTradeNo();
      const now = new Date();
      const merchantTradeDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const memberBackUrl = Deno.env.get('ECPAY_MEMBERSHIP_CLIENT_BACK_URL')?.trim()
        || config.clientBackUrl.replace(/\/support\/success(?:\?.*)?$/, '/membership/success');
      const fields: EcpayPayload = {
        MerchantID: config.merchantId,
        MerchantTradeNo: merchantTradeNo,
        MerchantTradeDate: merchantTradeDate,
        PaymentType: 'aio',
        TotalAmount: plan.amount,
        TradeDesc: 'AdFreeMember',
        ItemName: plan.itemName,
        ReturnURL: config.returnUrl,
        ChoosePayment: 'ALL',
        ClientBackURL: memberBackUrl,
        NeedExtraPaidInfo: 'Y',
        EncryptType: 1,
        CustomField1: `membership:${planId}`,
      };
      const checkMacValue = await ecpayCheckMacValue(fields, config.hashKey, config.hashIv);
      const { data, error } = await supabase
        .from('membership_payments')
        .insert({ merchant_trade_no: merchantTradeNo, plan: planId, amount: plan.amount, line_user_id: lineSession.line_user_id })
        .select('id')
        .single();
      if (error || !data?.id) throw error || new Error('Could not create membership payment.');
      return { actionUrl: config.actionUrl, fields: { ...fields, CheckMacValue: checkMacValue } };
    }

    case 'getMembershipStatus': {
      const data = await activeMembershipForRequest(request);
      return data ? { active: true, plan: data.plan, expiresAt: data.expires_at } : { active: false };
    }

    case 'getMembershipPurchaseHistory': {
      const lineSession = await getLineLoginSession(lineSessionTokenFromCookie(request));
      if (!lineSession) return { purchases: [] };
      const { data, error } = await supabase
        .from('membership_payments')
        .select('merchant_trade_no, plan, amount, status, paid_at, expires_at, created_at')
        .eq('line_user_id', lineSession.line_user_id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      return {
        purchases: (data || []).map((payment) => ({
          reference: payment.merchant_trade_no.slice(-8),
          plan: payment.plan,
          amount: payment.amount,
          status: payment.status,
          paidAt: payment.paid_at,
          expiresAt: payment.expires_at,
          createdAt: payment.created_at,
        })),
      };
    }

    case 'getLineLoginSession': {
      const session = await getLineLoginSession(lineSessionTokenFromCookie(request));
      return session ? { loggedIn: true, name: session.display_name, pictureUrl: session.picture_url } : { loggedIn: false };
    }

    case 'redeemLineLoginCode': {
      await pruneExpiredLineLoginData();
      const code = String(payload.code || '').trim();
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(code)) throw new Error('Invalid LINE login code.');
      const { data, error } = await supabase
        .from('line_login_exchange_codes')
        .update({ used_at: new Date().toISOString() })
        .eq('code', code)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .select('line_session_token')
        .maybeSingle();
      if (error) throw error;
      if (!data?.line_session_token) throw new Error('LINE login code has expired or was already used.');
      return { authenticated: true, sessionToken: data.line_session_token };
    }

    case 'revokeLineLoginSession': {
      const sessionToken = lineSessionTokenFromCookie(request);
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionToken)) return { revoked: false };
      const { error } = await supabase.from('line_login_sessions').delete().eq('token', sessionToken);
      if (error) throw error;
      return { revoked: true };
    }

    case 'deleteMembershipAccount': {
      const lineSession = await getLineLoginSession(lineSessionTokenFromCookie(request));
      if (!lineSession) return { deleted: false, reason: 'NOT_LOGGED_IN' };
      const { data, error } = await supabase.rpc('delete_membership_account', {
        p_line_user_id: lineSession.line_user_id,
      });
      if (error) throw error;
      return data === true
        ? { deleted: true }
        : { deleted: false, reason: 'ACTIVE_MEMBERSHIP' };
    }

    case 'createSharedReport': {
      const kind = String(payload.kind || '');
      const report = payload.payload;
      if (kind !== 'analysis' && kind !== 'volunteer') throw new Error('Invalid shared report type.');
      if (!report || typeof report !== 'object' || Array.isArray(report)) throw new Error('Invalid shared report content.');
      if (kind === 'analysis' && (!report.results || typeof report.results !== 'object')) {
        throw new Error('Invalid analysis report content.');
      }
      if (kind === 'volunteer' && (!Array.isArray(report.choices) || report.choices.length > 30)) {
        throw new Error('Invalid volunteer report content.');
      }

      // A snapshot is deliberately bounded: this public endpoint must not become
      // a general-purpose file store.
      const encodedPayload = JSON.stringify(report);
      if (encodedPayload.length > 150_000) throw new Error('Shared report is too large.');

      const { data, error } = await withTimeout(
        supabase
          .from('shared_reports')
          .insert({ kind, payload: report })
          .select('token')
          .single(),
        5000,
        'create shared report',
      );
      if (error) throw error;
      return { token: data.token };
    }

    case 'getSharedReport': {
      const token = String(payload.token || '').trim();
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) {
        throw new Error('Invalid shared report link.');
      }
      const { data, error } = await withTimeout(
        supabase
          .from('shared_reports')
          .select('kind, payload, expires_at')
          .eq('token', token)
          .gt('expires_at', new Date().toISOString())
          .maybeSingle(),
        5000,
        'load shared report',
      );
      if (error) throw error;
      if (!data) throw new Error('This shared report has expired or is unavailable.');
      return { kind: data.kind, payload: data.payload, expiresAt: data.expires_at };
    }

    case 'validateInvitationCode':
      return {
        valid: await validateInvitationCode(payload.invitationCode, request),
      };

    case 'submitFeedback': {
      const rating = Number(payload.payload?.rating);

      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error('評分格式不正確');
      }

      const { error } = await withTimeout(
        supabase.from('feedback').insert({
          rating,
          feedback: String(payload.payload?.feedback || '').slice(0, 2000),
          client_info: payload.clientInfo || {},
        }),
        3000,
        'submit feedback',
      );

      if (error) throw error;

      return { success: true };
    }

    case 'reportError': {
      const description = String(payload.payload?.description || '').trim();

      if (!description) throw new Error('請輸入問題描述');
      if (hasInappropriateContent(description)) throw new Error('問題描述含有不適當字詞，請調整為具體、理性的回報內容。');

      const { error } = await withTimeout(
        supabase.from('error_reports').insert({
          type: String(payload.payload?.type || 'other').slice(0, 100),
          description: description.slice(0, 5000),
          email: String(payload.payload?.email || '').slice(0, 320) || null,
          client_info: payload.clientInfo || {},
        }),
        3000,
        'report error',
      );

      if (error) throw error;

      return { success: true };
    }

    case 'getVolunteerSchools': {
      return cached(cacheKey(['volunteer_schools', 'all']), VOLUNTEER_SCHOOL_CACHE_TTL_MS, async () => {
        const pageSize = 1000;
        const schools = [];

        for (let from = 0; ; from += pageSize) {
          const { data, error } = await withTimeout(
            supabase
              .from('volunteer_schools')
              .select('id, county, code, name, level_info, shift, group_code, group_name, dept_code, dept_name')
              .order('county')
              .order('name')
              .range(from, from + pageSize - 1),
            5000,
            `load volunteer schools ${from}`,
          );

          if (error) throw error;

          schools.push(...(data || []));

          if (!data || data.length < pageSize) break;
        }

        return {
          schools: schools.map((school) => ({
            id: school.id,
            county: school.county,
            code: school.code,
            name: school.name,
            levelInfo: school.level_info,
            shift: school.shift,
            groupCode: school.group_code,
            groupName: school.group_name,
            deptCode: school.dept_code,
            deptName: school.dept_name,
          })),
        };
      });
    }

    case 'adminListSchools': {
      await requireAdmin(request);

      const pageSize = 1000;
      const rows: SchoolRow[] = [];
      const region = String(payload.region || 'all');

      for (let from = 0; ; from += pageSize) {
        let query = supabase
          .from('schools')
          .select(
            'id, region, name, district, points, credits, historical_scores, type, ownership, vocational_group, min_chinese, min_english, min_math, min_science, min_social, min_composition, admission_quota, admission_quota_source_url, created_at, updated_at',
          )
          .order('region')
          .order('points', { ascending: false });

        if (region !== 'all') query = query.eq('region', region);

        const { data, error } = await withTimeout(
          query.range(from, from + pageSize - 1),
          8000,
          `admin list schools ${from}`,
        );

        if (error) throw error;

        rows.push(...((data || []) as SchoolRow[]));

        if (!data || data.length < pageSize) break;
      }

      return { schools: rows };
    }

    case 'adminUpsertSchool': {
      await requireAdmin(request);

      const school = payload.school || {};
      const validRegions = new Set([
        'taoyuan',
        'kaohsiung',
        'central',
        'changhua',
        'taipei',
        'tainan',
        'hsinchu',
        'chiayi',
      ]);

      const region = String(school.region || '');
      const name = String(school.name || '').trim();
      const points = Number(school.points);
      const credits = nullableNumber(school.credits);

      if (!validRegions.has(region)) throw new Error('區域格式不正確');
      if (!name) throw new Error('請輸入學校名稱');
      if (!Number.isFinite(points)) throw new Error('請輸入分數門檻');
      if (credits !== null && !Number.isFinite(credits)) throw new Error('請輸入正確積分');

      const row = {
        ...(school.id ? { id: school.id } : {}),
        region,
        name,
        district: String(school.district || '').trim() || null,
        points,
        credits,
        historical_scores: normalizeHistoricalScores(school.historical_scores ?? school.historicalScores),
        type: String(school.type || '').trim() || null,
        ownership: String(school.ownership || '').trim() || null,
        vocational_group: String(school.vocational_group || '').trim() || null,
        min_chinese: nullableNumber(school.min_chinese),
        min_english: nullableNumber(school.min_english),
        min_math: nullableNumber(school.min_math),
        min_science: nullableNumber(school.min_science),
        min_social: nullableNumber(school.min_social),
        min_composition: nullableNumber(school.min_composition),
        admission_quota: nullableNumber(school.admission_quota ?? school.admissionQuota),
        admission_quota_source_url: String(school.admission_quota_source_url ?? school.admissionQuotaSourceUrl ?? '').trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await withTimeout(
        supabase
          .from('schools')
          .upsert(row)
          .select(
            'id, region, name, district, points, credits, historical_scores, type, ownership, vocational_group, min_chinese, min_english, min_math, min_science, min_social, min_composition, admission_quota, admission_quota_source_url, created_at, updated_at',
          )
          .single(),
        5000,
        'admin upsert school',
      );

      if (error) throw error;

      invalidateCache(cacheKey(['schools']));

      return { school: data };
    }

    case 'adminDeleteSchool': {
      await requireAdmin(request);

      const id = String(payload.id || '');

      if (!id) throw new Error('缺少資料 ID');

      const { error } = await withTimeout(
        supabase.from('schools').delete().eq('id', id),
        5000,
        'admin delete school',
      );

      if (error) throw error;

      invalidateCache(cacheKey(['schools']));

      return { success: true };
    }

    case 'adminClearHistoricalScores': {
      await requireAdmin(request);

      const ids = Array.isArray(payload.ids)
        ? [...new Set(payload.ids.map((id: unknown) => String(id || '').trim()).filter(Boolean))]
        : [];

      if (ids.length === 0) throw new Error('缺少要清空歷年成績的資料 ID');
      if (ids.length > 2000) throw new Error('一次清空筆數過多，請先篩選後再執行');

      const updated: SchoolRow[] = [];
      const now = new Date().toISOString();

      for (let index = 0; index < ids.length; index += 500) {
        const chunk = ids.slice(index, index + 500);
        const { data, error } = await withTimeout(
          supabase
            .from('schools')
            .update({ historical_scores: null, updated_at: now })
            .in('id', chunk)
            .select(
              'id, region, name, district, points, credits, historical_scores, type, ownership, vocational_group, min_chinese, min_english, min_math, min_science, min_social, min_composition, admission_quota, admission_quota_source_url, created_at, updated_at',
            ),
          8000,
          `admin clear historical scores ${index}`,
        );

        if (error) throw error;
        updated.push(...((data || []) as SchoolRow[]));
      }

      invalidateCache(cacheKey(['schools']));

      return { schools: updated, count: updated.length };
    }

    case 'analyzeScores': {
      assertScores(payload.scores);

      const region = String(payload.region || '');
      const activeMembership = await activeMembershipForRequest(request);
      const valid = Boolean(activeMembership) || await validateInvitationCode(payload.invitationCode, request, true);

      if (!valid) throw new Error('邀請碼無效或已過期');

      const calculated = calculateScores(region, payload.scores);

      const rows = await cached(cacheKey(['schools', region]), SCHOOL_CACHE_TTL_MS, async () => {
        const { data, error } = await withTimeout(
          supabase
            .from('schools')
            .select(
              'region, name, district, points, credits, historical_scores, type, ownership, vocational_group, min_chinese, min_english, min_math, min_science, min_social, min_composition, admission_quota, admission_quota_source_url',
            )
            .eq('region', region),
          5000,
          'load schools for analyzeScores',
        );

        if (error) throw error;

        return (data || []) as SchoolRow[];
      });

      const eligibleSchools = filterSchools(
        rows,
        calculated.totalPoints,
        calculated.totalCredits,
        payload.filters || {},
        payload.scores,
        region,
      );

      background(
        withTimeout(
          supabase.from('app_logs').insert({
            region,
            action: '分析完成',
            invitation_code: activeMembership ? 'MEMBERSHIP' : String(payload.invitationCode || ''),
            details: {
              totalPoints: calculated.totalPoints,
              totalCredits: calculated.totalCredits,
              eligibleSchoolCount: eligibleSchools.length,
            },
            client_info: payload.clientInfo || {},
          }),
          2000,
          'insert app log',
        ),
      );

      return {
        totalPoints: calculated.totalPoints,
        ...(calculated.totalCredits !== null && region !== 'hsinchu'
          ? { totalCredits: calculated.totalCredits }
          : {}),
        scoreBreakdown: calculated.breakdown,
        scoringMethod: calculated.scoringMethod,
        eligibleSchools,
        analysisReport: analysisReportV2(payload.scores, eligibleSchools, calculated, region),
      };
    }

    default:
      throw new Error('不支援的後端操作');
  }
}

async function handleEcpayCallback(request: Request) {
  const config = ecpayConfig();
  const body = await readRequestText(request, MAX_FORM_BODY_BYTES);
  const fields = Object.fromEntries(new URLSearchParams(body).entries());
  const receivedCheckMacValue = fields.CheckMacValue;
  const expectedCheckMacValue = await ecpayCheckMacValue(fields, config.hashKey, config.hashIv);

  if (!receivedCheckMacValue || receivedCheckMacValue !== expectedCheckMacValue) {
    console.error('Invalid ECPay CheckMacValue', { merchantTradeNo: fields.MerchantTradeNo });
    return new Response('0|Error', { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  const merchantTradeNo = fields.MerchantTradeNo || '';
  const tradeNo = fields.TradeNo || '';
  const tradeAmount = Number(fields.TradeAmt);

  if (fields.MerchantID !== config.merchantId || !/^[A-Za-z0-9]{8,32}$/.test(merchantTradeNo)) {
    console.error('Invalid ECPay merchant or order reference', { merchantId: fields.MerchantID, merchantTradeNo });
    return new Response('0|Error', { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  if (!Number.isSafeInteger(tradeAmount) || tradeAmount <= 0) {
    console.error('Invalid ECPay payment amount', { merchantTradeNo, tradeAmount: fields.TradeAmt });
    return new Response('0|Error', { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  if (!tradeNo) {
    console.error('Missing ECPay trade number', { merchantTradeNo });
    return new Response('0|Error', { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  const { data: payment, error: paymentError } = await supabase
    .from('support_payments')
    .select('amount, status, ecpay_trade_no')
    .eq('merchant_trade_no', merchantTradeNo)
    .maybeSingle();

  if (paymentError || !payment) {
    console.error('Unknown ECPay order', { merchantTradeNo, error: paymentError });
    return new Response('0|Error', { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  if (payment.amount !== tradeAmount) {
    console.error('ECPay payment amount mismatch', { merchantTradeNo, expectedAmount: payment.amount, tradeAmount });
    return new Response('0|Error', { status: 400, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  const succeeded = fields.RtnCode === '1';
  const simulated = fields.SimulatePaid === '1';
  const targetStatus = succeeded ? 'paid' : 'failed';

  // Simulated payments are useful only against ECPay's stage environment. They
  // must never mark a production donation as settled.
  if (simulated && config.mode !== 'stage') {
    console.warn('Ignored simulated ECPay payment outside stage mode', { merchantTradeNo });
    return new Response('1|OK', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  // A duplicate callback for the same ECPay trade is safe and acknowledged.
  if (payment.status !== 'pending' && payment.ecpay_trade_no === tradeNo) {
    return new Response('1|OK', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  if (payment.status !== 'pending') {
    console.error('Invalid ECPay payment state transition', { merchantTradeNo, status: payment.status, tradeNo });
    return new Response('0|Error', { status: 409, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  const { data: updatedPayment, error } = await supabase
    .from('support_payments')
    .update({
      status: targetStatus,
      ecpay_trade_no: tradeNo,
      payment_type: fields.PaymentType || null,
      paid_at: succeeded ? new Date().toISOString() : null,
      callback_payload: fields,
      updated_at: new Date().toISOString(),
    })
    .eq('merchant_trade_no', merchantTradeNo)
    .eq('status', 'pending')
    .select('status, ecpay_trade_no')
    .maybeSingle();

  if (error) {
    console.error('Could not record ECPay callback', error);
    return new Response('0|Error', { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  if (!updatedPayment) {
    // Another delivery may have completed the same pending order first. Only
    // acknowledge it when it resulted in the exact same ECPay transaction.
    const { data: currentPayment, error: currentPaymentError } = await supabase
      .from('support_payments')
      .select('status, ecpay_trade_no')
      .eq('merchant_trade_no', merchantTradeNo)
      .maybeSingle();

    if (currentPaymentError || currentPayment?.status !== targetStatus || currentPayment.ecpay_trade_no !== tradeNo) {
      console.error('Could not safely reconcile ECPay callback', { merchantTradeNo, tradeNo, currentPaymentError });
      return new Response('0|Error', { status: 409, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
  }

  return new Response('1|OK', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    if (!isAllowedOrigin(request)) return new Response('Origin not allowed', { status: 403, headers: { Vary: 'Origin' } });
    return new Response('ok', { headers: corsHeaders(request) });
  }
  if (request.method !== 'POST') return json(request, { error: 'Method not allowed' }, 405);
  // CORS preflight is a browser safeguard, not an authorization check. Reject
  // cross-site POSTs here as well so credentialed requests cannot rely on a
  // preflight response being enforced by the caller.
  if (request.headers.get('origin') && !isAllowedOrigin(request)) {
    return json(request, { error: 'Origin not allowed' }, 403);
  }

  const start = Date.now();
  const path = new URL(request.url).pathname;

  try {
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return json(request, { error: 'Content-Type must be application/json.' }, 415);
    }
    const rawBody = await withTimeout(readRequestText(request, MAX_JSON_BODY_BYTES), 3000, 'read request json');
    let payload: Record<string, any>;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      throw new Error('Invalid JSON request body.');
    }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('Invalid JSON request body.');
    }
    const action = String(payload.action || 'unknown');
    if (!await consumeRateLimit(request, action)) {
      return json(request, { error: 'Too many requests. Please try again later.' }, 429);
    }
    const result = await handleAction(payload, request);

    console.log({
      path,
      action: payload.action,
      ms: Date.now() - start,
    });

    const responseHeaders: HeadersInit = {};
    if (action === 'redeemLineLoginCode' && typeof result?.sessionToken === 'string') {
      responseHeaders['Set-Cookie'] = lineSessionCookie(result.sessionToken);
      delete result.sessionToken;
    }
    if (action === 'revokeLineLoginSession' || (action === 'deleteMembershipAccount' && result?.deleted === true)) {
      responseHeaders['Set-Cookie'] = lineSessionCookie('', 0);
    }
    return json(request, result, 200, responseHeaders);
  } catch (error) {
    const requestId = crypto.randomUUID();
    console.error({
      path,
      ms: Date.now() - start,
      requestId,
      error,
    });

    const isInvalidRequest = error instanceof Error && error.message === 'Invalid JSON request body.';
    return json(request, {
      error: isInvalidRequest ? 'INVALID_REQUEST' : 'SERVER_ERROR',
      code: isInvalidRequest ? 'INVALID_REQUEST' : 'SERVER_ERROR',
      message: isInvalidRequest ? '請求格式不正確，請重新操作。' : '系統暫時無法完成請求，請稍後再試。',
      requestId,
    }, isInvalidRequest ? 400 : 500);
  }
});
