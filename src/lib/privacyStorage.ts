// Explicit allowlist: never export session credentials, payment tracking, or unrelated storage.
export function managedLocalEntries(local: Storage, session: Storage) {
  const result: { storage: 'local' | 'session'; key: string; value: string }[] = [];
  for (const [kind, storage] of [['local', local], ['session', session]] as const) {
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (!key) continue;
      const allowed = kind === 'local'
        ? key.startsWith('volunteer-versions-v1:') || ['mock-volunteer-import', 'volunteer-collaboration-name'].includes(key)
        : ['tw-admission-analysis-results', 'tw-admission-analysis-comparison-schools', 'tw-admission-analysis-comparison-fields'].includes(key);
      if (allowed) result.push({ storage: kind, key, value: storage.getItem(key) || '' });
    }
  }
  return result;
}
