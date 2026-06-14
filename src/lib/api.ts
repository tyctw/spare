const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const SAFE_RETRY_ACTIONS = new Set(['wakeup', 'validateInvitationCode', 'getVolunteerSchools']);
const inFlightRequests = new Map<string, Promise<unknown>>();

export type BackendErrorCode =
  | 'CONFIG_ERROR'
  | 'INVALID_REQUEST'
  | 'INVALID_INVITATION_CODE'
  | 'INVALID_SCORES'
  | 'INVALID_REGION'
  | 'NOT_FOUND'
  | 'REQUEST_TIMEOUT'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

type BackendErrorPayload = {
  error?: string;
  message?: string;
  code?: BackendErrorCode;
  requestId?: string;
};

export class BackendError extends Error {
  code: BackendErrorCode;
  status: number;
  requestId?: string;

  constructor(
    message: string,
    options: { code?: BackendErrorCode; status?: number; requestId?: string } = {},
  ) {
    super(message);
    this.name = 'BackendError';
    this.code = options.code || 'UNKNOWN_ERROR';
    this.status = options.status || 0;
    this.requestId = options.requestId;
  }
}

export function normalizeInvitationCode(code: unknown) {
  return String(code || '').trim().toUpperCase();
}

export function isBackendError(error: unknown): error is BackendError {
  return error instanceof BackendError;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, child]) => `${JSON.stringify(key)}:${stableStringify(child)}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function isRetriableError(error: unknown) {
  if (!isBackendError(error)) return false;
  return error.code === 'REQUEST_TIMEOUT' || error.code === 'NETWORK_ERROR' || error.status >= 500;
}

async function fetchBackend<T>(
  payload: Record<string, unknown>,
  signal: AbortSignal,
): Promise<T> {
  const response = await fetch(`${supabaseUrl}/functions/v1/backend`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(supabaseAnonKey
        ? {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
          }
        : {}),
    },
    body: JSON.stringify(payload),
    signal,
  });

  const data = (await response.json().catch(() => ({}))) as BackendErrorPayload;
  if (!response.ok || data.error) {
    throw new BackendError(
      data.message || data.error || `後端請求失敗 (${response.status})`,
      {
        code: data.code || (response.status >= 500 ? 'SERVER_ERROR' : 'UNKNOWN_ERROR'),
        status: response.status,
        requestId: data.requestId,
      },
    );
  }

  return data as unknown as T;
}

export async function callBackend<T>(
  payload: Record<string, unknown>,
  options: { timeoutMs?: number; signal?: AbortSignal } = {},
): Promise<T> {
  if (!supabaseUrl) {
    throw new BackendError('尚未設定 Supabase URL，請確認環境變數 VITE_SUPABASE_URL。', {
      code: 'CONFIG_ERROR',
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort('timeout'), options.timeoutMs ?? 20_000);
  const abortFromCaller = () => controller.abort(options.signal?.reason);
  options.signal?.addEventListener('abort', abortFromCaller, { once: true });

  const action = String(payload.action || '');
  const canRetry = SAFE_RETRY_ACTIONS.has(action);
  const requestKey = canRetry && !options.signal ? stableStringify(payload) : '';

  try {
    if (requestKey && inFlightRequests.has(requestKey)) {
      return await inFlightRequests.get(requestKey) as T;
    }

    const request = (async () => {
      const maxAttempts = canRetry ? 3 : 1;
      let lastError: unknown;

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        try {
          return await fetchBackend<T>(payload, controller.signal);
        } catch (error) {
          lastError = error;
          if (!canRetry || attempt === maxAttempts || controller.signal.aborted || !isRetriableError(error)) {
            throw error;
          }
          await sleep(250 * attempt);
        }
      }

      throw lastError;
    })();

    if (requestKey) inFlightRequests.set(requestKey, request);
    return await request;
  } catch (error) {
    if (isBackendError(error)) throw error;
    if (controller.signal.aborted) {
      throw new BackendError(
        options.signal?.aborted ? '請求已取消。' : '請求逾時，請稍後再試。',
        { code: 'REQUEST_TIMEOUT' },
      );
    }
    throw new BackendError('網路連線異常，請確認連線後再試。', {
      code: 'NETWORK_ERROR',
    });
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abortFromCaller);
    if (requestKey) inFlightRequests.delete(requestKey);
  }
}
