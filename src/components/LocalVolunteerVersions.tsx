import { useState } from 'react';
import VolunteerVersionHistory from './VolunteerVersionHistory';
import type { VersionChoice, VolunteerVersion } from '../lib/volunteerVersions';
export default function LocalVolunteerVersions({ region, choices, onRestore }: { region: string; choices: VersionChoice[]; onRestore: (choices: VersionChoice[]) => void }) {
  const storageKey = `volunteer-versions-v1:${region}`;
  const [error, setError] = useState('');
  const [versions, setVersions] = useState<VolunteerVersion[]>(() => {
    try { const value = JSON.parse(localStorage.getItem(storageKey) || '[]'); return Array.isArray(value) ? value.filter(v => Number.isInteger(v.version) && Array.isArray(v.choices)) : []; } catch { return []; }
  });
  const persist = (next: VolunteerVersion[]) => {
    try { localStorage.setItem(storageKey, JSON.stringify(next.slice(0,100))); setVersions(next.slice(0,100)); setError(''); return true; }
    catch { setError('無法保存版本，可能是瀏覽器儲存空間不足。請先匯出清單；這次未還原或保存。'); return false; }
  };
  const snapshot = (list: VersionChoice[], version: number, note: string): VolunteerVersion => ({ choices: JSON.parse(JSON.stringify(list)), version, note, actor_name: '本機使用者', created_at: new Date().toISOString() });
  return <><p className="mt-5 text-sm text-slate-600">本機版本依就學區分開保存，保留最近 100 版；不會跨裝置同步，清除網站資料也會清除紀錄。協作連結中的版本另存於雲端。</p><VolunteerVersionHistory versions={versions} choices={choices}
    onSave={note => { persist([snapshot(choices, (versions[0]?.version || 0)+1,note || '手動保存'), ...versions]); }}
    onRestore={v => { const n = (versions[0]?.version || 0)+1; if (persist([snapshot(v.choices,n+1,`還原第 ${v.version} 版`),snapshot(choices,n,'還原前自動備份'),...versions])) onRestore(JSON.parse(JSON.stringify(v.choices))); }} />
    {error && <p role="alert" className="text-rose-700">{error}</p>}</>;
}
