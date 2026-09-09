import { useEffect, useState } from 'react';
import { ShieldCheck, Link2, Database, Download, Trash2 } from 'lucide-react';
import { callBackend } from '../lib/api';
import { withBasePath } from '../lib/routes';
import { managedLocalEntries } from '../lib/privacyStorage';

type Share = { token: string; kind: string; created_at: string; expires_at: string | null; revoked_at: string | null; collaborationEnabled: boolean; collaboration_version: number };
const date = (value: string | null) => value ? new Date(value).toLocaleString('zh-TW') : '無期限';
const card = 'rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[3px_3px_0_#0f172a]';
const button = 'rounded-xl border-2 border-slate-900 px-4 py-2 font-bold disabled:opacity-40';
export default function PrivacyCenterPage() {
  const [shares, setShares] = useState<Share[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [pending, setPending] = useState<Share | null>(null);
  const [clearPending, setClearPending] = useState(false);
  const [localCount, setLocalCount] = useState(0);
  const [localError, setLocalError] = useState('');
  const refreshLocal = () => {
    try { setLocalCount(managedLocalEntries(localStorage, sessionStorage).length); setLocalError(''); }
    catch { setLocalError('此瀏覽器不允許讀取儲存資料。'); }
  };
  const load = async (nextPage = 0) => {
    setBusy(true); setError(''); setPending(null);
    try {
      const result = await callBackend<{ loggedIn: boolean; shares: Share[]; hasMore: boolean }>({ action: 'listOwnedShares', offset: nextPage * 50 });
      setLoggedIn(result.loggedIn); setShares(result.shares); setMore(result.hasMore); setPage(nextPage);
    } catch { setError('無法讀取分享紀錄，請稍後重新整理；這不代表你沒有分享。'); }
    finally { setBusy(false); }
  };
  useEffect(() => { void load(); refreshLocal(); window.addEventListener('storage', refreshLocal); return () => window.removeEventListener('storage', refreshLocal); }, []);
  const revoke = async () => {
    if (!pending) return;
    const token = pending.token;
    setBusy(true); setError(''); setNotice('');
    try {
      await callBackend({ action: 'revokeOwnedShare', token });
      setShares(items => items.map(s => s.token === token ? { ...s, revoked_at: new Date().toISOString() } : s));
      setPending(null); setNotice('連結已撤銷，後續讀取與協作請求將被拒絕。');
    } catch { setError('撤銷失敗，請確認登入帳號後再試。'); }
    finally { setBusy(false); }
  };
  const exportLocal = () => {
    try {
      const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), entries: managedLocalEntries(localStorage, sessionStorage) }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = '我的升學本機資料.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice('已產生本機資料匯出檔，請妥善保管。');
    } catch { setLocalError('無法匯出本機資料，請檢查瀏覽器下載與儲存權限。'); }
  };
  const clearLocal = () => {
    try {
      for (const entry of managedLocalEntries(localStorage, sessionStorage)) (entry.storage === 'local' ? localStorage : sessionStorage).removeItem(entry.key);
      window.dispatchEvent(new Event('admission-comparison-updated'));
      refreshLocal(); setClearPending(false); setNotice('已清除下列本機資料。其他已開啟頁面可能仍保有畫面中的草稿，請關閉或重新整理。');
    } catch { refreshLocal(); setLocalError('清除未完成，部分資料可能仍保留，請重試。'); }
  };
  return <main id="main-content" className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
    <div className="mx-auto max-w-5xl space-y-6">
      <header className={card}><ShieldCheck className="mb-3 h-9 w-9 text-indigo-700" /><h1 className="text-3xl font-black">個資與分享管理中心</h1><p className="mt-3 leading-7 text-slate-600">查看分享期限、停止分享，並集中管理你的成績紀錄、帳號與本機資料。</p></header>
      {notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-900">{notice}</p>}
      <section className={card} aria-labelledby="shares-title">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="shares-title" className="flex items-center gap-2 text-xl font-black"><Link2 />我的分享連結</h2><button className={button} disabled={busy} onClick={() => load()}>重新整理分享</button></div>
        <p className="mt-3 text-sm leading-6 text-slate-600">列出此 LINE 帳號建立的分析報告與志願清單，不需有效付費資格即可管理。未登入時建立或早期未記錄建立者的連結不會出現在這裡。到期或撤銷會停止後續存取，無法收回他人已下載、截圖或已開啟的內容；撤銷不會刪除雲端紀錄。</p>
        {error && <p role="alert" className="mt-3 text-rose-700">{error}</p>}
        {busy && <p role="status" className="mt-3">正在處理…</p>}
        {loggedIn === false && <div className="mt-4 rounded-xl bg-indigo-50 p-4"><p>請先登入建立分享時使用的 LINE 帳號，再回到本頁重新整理。</p><a className="mt-2 inline-block font-bold underline" href={withBasePath('/membership/account')}>前往會員帳號登入</a></div>}
        {loggedIn && !shares.length && !busy && !error && <p className="mt-4">尚無可管理的分享紀錄。</p>}
        <ul className="mt-4 space-y-3">{shares.map((s, index) => {
          const expired = !!s.expires_at && new Date(s.expires_at).getTime() <= Date.now();
          const inactive = !!s.revoked_at || expired;
          return <li key={s.token} className="rounded-xl border border-slate-200 p-4">
            <div className="flex flex-wrap justify-between gap-3"><h3 className="font-black">{s.kind === 'volunteer' ? '志願清單' : '分析報告'} #{page * 50 + index + 1}</h3><span className={inactive ? 'font-bold text-slate-500' : 'font-bold text-emerald-700'}>{s.revoked_at ? '已撤銷' : expired ? '已到期' : '有效中'}</span></div>
            <p className="mt-2 text-sm">建立：{date(s.created_at)}<br />期限：{date(s.expires_at)}<br />權限：{s.collaborationEnabled ? `家長協作 · 第 ${s.collaboration_version} 版` : '唯讀分享'}</p>
            {s.revoked_at && <p className="mt-1 text-sm">撤銷：{date(s.revoked_at)}</p>}
            <div className="mt-3 flex flex-wrap gap-3">{!inactive && <a className={button} href={withBasePath(`/shared/${s.token}`)} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">查看唯讀內容</a>}{!s.revoked_at && <button disabled={busy} className={`${button} text-rose-700`} onClick={() => setPending(s)}>撤銷此連結</button>}</div>
            {pending?.token === s.token && <div className="mt-3 rounded-xl bg-amber-50 p-3"><p>確定撤銷這份{s.kind === 'volunteer' ? '志願清單' : '分析報告'}？唯讀與協作連結都會失效，無法重新啟用；之後需要重新建立分享。</p><div className="mt-3 flex gap-3"><button disabled={busy} className={`${button} bg-rose-600 text-white`} onClick={revoke}>確認撤銷</button><button disabled={busy} className={button} onClick={() => setPending(null)}>取消撤銷</button></div></div>}
          </li>;
        })}</ul>
        {loggedIn && <div className="mt-4 flex items-center gap-3"><button className={button} disabled={busy || page === 0} onClick={() => load(page - 1)}>上一頁</button><span>第 {page + 1} 頁</span><button className={button} disabled={busy || !more} onClick={() => load(page + 1)}>下一頁</button></div>}
      </section>
      <section className={card} aria-labelledby="local-title"><h2 id="local-title" className="flex items-center gap-2 text-xl font-black"><Database />此裝置的升學資料</h2><p className="mt-3 leading-7 text-slate-600">包含本機志願版本、待匯入志願、協作稱呼，以及本分頁的分析結果、校系比較清單與欄位設定。目前有 {localCount} 筆儲存項目（不是志願數量）。本機清除不影響雲端分享、成績紀錄或會員資格。</p>
        {localError && <p role="alert" className="mt-3 text-rose-700">{localError}</p>}
        <div className="mt-4 flex flex-wrap gap-3"><button className={`${button} flex items-center gap-2`} onClick={exportLocal}><Download className="h-4 w-4" />匯出本機資料</button><button className={`${button} flex items-center gap-2 text-rose-700`} onClick={() => setClearPending(true)}><Trash2 className="h-4 w-4" />清除上述本機資料</button></div>
        {clearPending && <div className="mt-4 rounded-xl bg-amber-50 p-4"><p>清除後無法在網站直接還原。請先匯出需要保留的資料，再確認清除。</p><div className="mt-3 flex flex-wrap gap-3"><button className={`${button} bg-rose-600 text-white`} onClick={clearLocal}>確認清除本機資料</button><button className={button} onClick={() => setClearPending(false)}>取消清除</button></div></div>}
      </section>
      <section className="grid gap-4 sm:grid-cols-2" aria-label="其他資料管理">{[
        ['/score-records', '雲端成績紀錄', '查看、管理與刪除已保存的成績紀錄。'],
        ['/membership/account', '帳號與聯絡資料', '修改聯絡信箱、登出、查看交易紀錄與申請刪除帳號。'],
        ['/mock-volunteer', '志願版本管理', '比較不同時間的本機志願清單並還原版本。'],
        ['/privacy', '隱私權政策', '了解資料使用方式與個人資料權利。'],
      ].map(([path, title, description]) => <a key={path} href={withBasePath(path)} className={`${card} block hover:bg-indigo-50`}><h2 className="font-black">{title} →</h2><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></a>)}</section>
      <p className="text-sm leading-6 text-slate-600">若需協助查詢或刪除雲端資料，請透過 <a className="underline" href="mailto:tyctw.analyze@gmail.com">tyctw.analyze@gmail.com</a> 聯絡我們；請勿提供密碼或協作編輯憑證。</p>
    </div>
  </main>;
}
