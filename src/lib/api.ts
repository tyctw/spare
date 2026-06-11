const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export async function callBackend<T>(payload: Record<string, unknown>): Promise<T> {
  if (!supabaseUrl) {
    throw new Error('尚未設定 VITE_SUPABASE_URL');
  }

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
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.error) {
    throw new Error(data.error || `後端請求失敗 (${response.status})`);
  }

  return data as T;
}
