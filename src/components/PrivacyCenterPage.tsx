import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Link2, Database, Download, Trash2, ArrowUpRight, ArrowLeft, Clock3 } from 'lucide-react';
import { callBackend } from '../lib/api';
import { withBasePath } from '../lib/routes';
import { managedLocalEntries } from '../lib/privacyStorage';

type Share = { token: string; kind: string; created_at: string; expires_at: string | null; revoked_at: string | null; collaborationEnabled: boolean; collaboration_version: number };
const date = (value: string | null) => value ? new Date(value).toLocaleString('zh-TW') : '無期限';
const card = 'rounded-[1.6rem] border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0_#0f172a] sm:p-7';
const button = 'inline-flex min-w-0 items-center justify-center whitespace-nowrap rounded-xl border-2 border-slate-900 px-4 py-2 font-bold transition hover:-translate-y-0.5 disabled:opacity-40';
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
  const clearDialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = clearDialogRef.current;
    if (clearPending && dialog && !dialog.open) dialog.showModal();
    return () => { if (dialog?.open) dialog.close(); };
  }, [clearPending]);
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
  return <main id="main-content" className="min-h-screen bg-[#f3f6f1] px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
    <div className="mx-auto max-w-6xl space-y-7">
      <header className="relative isolate overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-[#e9efea] shadow-[5px_5px_0_#0f172a]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border-[50px] border-white/40" />
        <div className="relative border-b border-slate-900/15 px-5 py-4 sm:px-8">
          <button type="button" onClick={() => {
            let fromThisSite = false;
            try { fromThisSite = !!document.referrer && new URL(document.referrer).origin === window.location.origin; } catch { /* Treat an unavailable referrer as a direct visit. */ }
            if (fromThisSite && window.history.length > 1) window.history.back();
            else window.location.assign(withBasePath('/'));
          }} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-offset-4 hover:bg-emerald-50"><ArrowLeft aria-hidden="true" className="h-4 w-4" />返回上一頁</button>
          <span className="float-right pt-1 text-[10px] font-bold tracking-[0.16em] text-slate-600 sm:text-xs">PRIVACY & SHARING</span>
        </div>
        <div className="relative grid gap-8 px-5 py-8 sm:px-8 sm:py-10 md:grid-cols-[1fr_220px] md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-900/20 bg-white/70 px-3 py-1.5 text-xs font-bold text-emerald-900"><ShieldCheck className="h-4 w-4" />你的資料，由你管理</span>
            <h1 className="mt-5 text-[2rem] font-black leading-[1.25] tracking-tight text-slate-950 sm:text-5xl">個資與分享<span className="block text-emerald-900">管理中心</span></h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">查看分享期限、停止分享，並集中管理你的成績紀錄、帳號與本機資料。</p>
          </div>
          <div aria-hidden="true" className="relative hidden h-52 items-center justify-center md:flex">
            <div className="absolute h-44 w-44 rounded-full border border-emerald-900/20" />
            <div className="absolute h-32 w-32 rounded-full bg-white/60" />
            <div className="relative -rotate-6 rounded-[1.8rem] border-2 border-slate-900 bg-emerald-900 p-7 text-lime-200 shadow-[5px_5px_0_#0f172a]"><ShieldCheck className="h-16 w-16" strokeWidth={1.4} /></div>
            <div className="absolute right-0 top-3 rotate-6 rounded-2xl border-2 border-slate-900 bg-white p-3"><Link2 className="h-6 w-6 text-emerald-900" /></div>
            <div className="absolute bottom-1 left-1 -rotate-6 rounded-2xl border-2 border-slate-900 bg-[#e5edbd] p-3"><Database className="h-6 w-6 text-emerald-900" /></div>
          </div>
        </div>
        <nav aria-label="管理中心快速導覽" className="relative grid border-t-2 border-slate-900 bg-white sm:grid-cols-3">
          {[
            { href: '#shares-title', icon: Clock3, title: '管理分享', description: '查看期限・撤銷連結' },
            { href: '#local-title', icon: Database, title: '整理本機資料', description: '匯出備份・清除資料' },
            { href: withBasePath('/membership/account'), icon: ShieldCheck, title: '帳號與個資', description: '聯絡資料・帳號管理' },
          ].map(({ href, icon: Icon, title, description }, index) => <a key={href} href={href} className={`group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-emerald-50 focus-visible:outline-offset-[-4px] sm:px-6 ${index ? 'border-t border-slate-200 sm:border-l sm:border-t-0' : ''}`}>
            <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-emerald-800" /><span className="flex-1"><span className="block text-sm font-black">{title}</span><span className="mt-1 block text-xs text-slate-500">{description}</span></span><ArrowUpRight aria-hidden="true" className="h-4 w-4 text-slate-400 transition-colors group-hover:text-emerald-800" />
          </a>)}
        </nav>
      </header>
      {notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-emerald-900">{notice}</p>}
      <section className={card} aria-labelledby="shares-title">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><p className="text-[11px] font-black tracking-[0.18em] text-emerald-700">SHARED ACCESS</p><h2 id="shares-title" className="mt-1 flex items-center gap-2 text-2xl font-black"><Link2 className="text-emerald-700" />我的分享連結</h2><p className="mt-2 text-sm font-bold text-slate-500">掌握誰能看見你的內容，以及連結何時失效。</p></div><button className={`${button} w-full bg-slate-50 sm:w-auto`} disabled={busy} onClick={() => load()}>重新整理分享</button></div>
        <p className="mt-3 text-sm leading-6 text-slate-600">列出此 LINE 帳號建立的分析報告與志願清單，不需有效付費資格即可管理。未登入時建立或早期未記錄建立者的連結不會出現在這裡。到期或撤銷會停止後續存取，無法收回他人已下載、截圖或已開啟的內容；撤銷不會刪除雲端紀錄。</p>
        {error && <p role="alert" className="mt-3 text-rose-700">{error}</p>}
        {busy && <p role="status" className="mt-3">正在處理…</p>}
        {loggedIn === false && <div className="mt-4 rounded-xl bg-indigo-50 p-4"><p>請先登入建立分享時使用的 LINE 帳號，再回到本頁重新整理。</p><a className="mt-2 inline-block font-bold underline" href={withBasePath('/membership/account')}>前往會員帳號登入</a></div>}
        {loggedIn && !shares.length && !busy && !error && <p className="mt-4">尚無可管理的分享紀錄。</p>}
        <ul className="mt-5 grid gap-3 lg:grid-cols-2">{shares.map((s, index) => {
          const expired = !!s.expires_at && new Date(s.expires_at).getTime() <= Date.now();
          const inactive = !!s.revoked_at || expired;
          return <li key={s.token} className="rounded-2xl border-2 border-slate-200 bg-slate-50/70 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/40">
            <div className="flex flex-wrap justify-between gap-3"><h3 className="font-black">{s.kind === 'volunteer' ? '志願清單' : '分析報告'} <span className="text-slate-400">#{page * 50 + index + 1}</span></h3><span className={`rounded-full px-2.5 py-1 text-xs font-black ${inactive ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800'}`}>{s.revoked_at ? '已撤銷' : expired ? '已到期' : '有效中'}</span></div>
            <p className="mt-3 text-sm leading-6 text-slate-600">建立：{date(s.created_at)}<br />期限：{date(s.expires_at)}<br />權限：{s.collaborationEnabled ? `家長協作 · 第 ${s.collaboration_version} 版` : '唯讀分享'}</p>
            {s.revoked_at && <p className="mt-1 text-sm">撤銷：{date(s.revoked_at)}</p>}
            <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">{!inactive && <a className={`${button} w-full sm:w-auto`} href={withBasePath(`/shared/${s.token}`)} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">查看唯讀內容</a>}{!s.revoked_at && <button disabled={busy} className={`${button} w-full text-rose-700 sm:w-auto`} onClick={() => setPending(s)}>撤銷此連結</button>}</div>
            {pending?.token === s.token && <div className="mt-3 rounded-xl bg-amber-50 p-3"><p>確定撤銷這份{s.kind === 'volunteer' ? '志願清單' : '分析報告'}？唯讀與協作連結都會失效，無法重新啟用；之後需要重新建立分享。</p><div className="mt-3 flex gap-3"><button disabled={busy} className={`${button} bg-rose-600 text-white`} onClick={revoke}>確認撤銷</button><button disabled={busy} className={button} onClick={() => setPending(null)}>取消撤銷</button></div></div>}
          </li>;
        })}</ul>
        {loggedIn && <div className="mt-5 grid w-full items-center gap-2 border-t border-slate-200 pt-4 sm:flex sm:flex-wrap"><button className={`${button} w-full sm:w-auto`} disabled={busy || page === 0} onClick={() => load(page - 1)}>上一頁</button><span className="text-center text-xs font-black text-slate-500 sm:w-auto">第 {page + 1} 頁</span><button className={`${button} w-full sm:w-auto`} disabled={busy || !more} onClick={() => load(page + 1)}>下一頁</button></div>}
      </section>
      <section className={`${card} bg-[#fffdf4]`} aria-labelledby="local-title"><div className="flex items-start gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-200 text-amber-900"><Database /></span><div><p className="text-[11px] font-black tracking-[0.18em] text-amber-700">ON THIS DEVICE</p><h2 id="local-title" className="mt-1 text-2xl font-black">此裝置的升學資料</h2></div></div><p className="mt-4 max-w-3xl leading-7 text-slate-600">包含本機志願版本、待匯入志願、協作稱呼，以及本分頁的分析結果、校系比較清單與欄位設定。目前有 <strong className="text-slate-900">{localCount} 筆</strong>儲存項目（不是志願數量）。本機清除不影響雲端分享、成績紀錄或會員資格。</p>
        {localError && <p role="alert" className="mt-3 text-rose-700">{localError}</p>}
        <div className="mt-5 grid w-full gap-2 border-t border-amber-200 pt-4 sm:flex sm:flex-wrap"><button className={`${button} w-full gap-2 bg-white sm:w-auto`} onClick={exportLocal}><Download className="h-4 w-4" />匯出本機資料</button><button className={`${button} w-full gap-2 bg-white text-rose-700 sm:w-auto`} onClick={() => setClearPending(true)}><Trash2 className="h-4 w-4" />清除上述本機資料</button></div>
        {clearPending && <dialog ref={clearDialogRef} aria-labelledby="clear-local-title" aria-describedby="clear-local-description" onCancel={event => { event.preventDefault(); setClearPending(false); }} className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border-2 border-slate-900 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm">
          <h2 id="clear-local-title" className="text-xl font-black">確認清除本機資料？</h2>
          <p id="clear-local-description" className="mt-3 leading-7 text-slate-600">將清除上述本機升學資料，包含本機志願版本。清除後無法在網站直接還原，請先匯出需要保留的資料。雲端分享、成績紀錄與會員資格不受影響。</p>
          {localError && <p role="alert" className="mt-3 text-rose-700">{localError}</p>}
          <div className="mt-5 flex flex-wrap justify-end gap-3"><button autoFocus className={button} onClick={() => setClearPending(false)}>取消清除</button><button className={`${button} bg-rose-600 text-white`} onClick={clearLocal}>確認清除本機資料</button></div>
        </dialog>}
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
