const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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

export async function callBackend<T>(
  payload: Record<string, unknown>,
  options: { timeoutMs?: number; signal?: AbortSignal } = {},
): Promise<T> {
  if (!supabaseUrl) {
    throw new BackendError('系統尚未設定後端服務，請聯絡管理員。', {
      code: 'CONFIG_ERROR',
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort('timeout'), options.timeoutMs ?? 20_000);
  const abortFromCaller = () => controller.abort(options.signal?.reason);
  options.signal?.addEventListener('abort', abortFromCaller, { once: true });

  try {
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
      signal: controller.signal,
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
  } catch (error) {
    if (isBackendError(error)) throw error;
    if (controller.signal.aborted) {
      throw new BackendError(
        options.signal?.aborted ? '請求已取消。' : '伺服器回應逾時，請稍後再試。',
        { code: 'REQUEST_TIMEOUT' },
      );
    }
    throw new BackendError('無法連線至伺服器，請檢查網路後再試。', {
      code: 'NETWORK_ERROR',
    });
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abortFromCaller);
  }
}
