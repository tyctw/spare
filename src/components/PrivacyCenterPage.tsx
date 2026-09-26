import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Clock3, Database, Download,
  FileText, Link2, LockKeyhole, RefreshCw, ShieldCheck, Trash2,
} from 'lucide-react';
import { callBackend } from '../lib/api';
import { withBasePath } from '../lib/routes';
import { managedLocalEntries } from '../lib/privacyStorage';
import './privacy-center.css';

type Share = {
  token: string;
  kind: string;
  created_at: string;
  expires_at: string | null;
  revoked_at: string | null;
  collaborationEnabled: boolean;
  collaboration_version: number;
};

const formatDate = (value: string | null) => value ? new Date(value).toLocaleString('zh-TW') : '無期限';

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
  const clearDialogRef = useRef<HTMLDialogElement>(null);
  const revokeDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = clearDialogRef.current;
    if (clearPending && dialog && !dialog.open) dialog.showModal();
    return () => { if (dialog?.open) dialog.close(); };
  }, [clearPending]);

  useEffect(() => {
    const dialog = revokeDialogRef.current;
    if (pending && dialog && !dialog.open) dialog.showModal();
    return () => { if (dialog?.open) dialog.close(); };
  }, [pending]);

  const refreshLocal = () => {
    try {
      setLocalCount(managedLocalEntries(localStorage, sessionStorage).length);
      setLocalError('');
    } catch {
      setLocalError('此瀏覽器不允許讀取儲存資料。');
    }
  };

  const load = async (nextPage = 0) => {
    setBusy(true);
    setError('');
    setPending(null);
    try {
      const result = await callBackend<{ loggedIn: boolean; shares: Share[]; hasMore: boolean }>({ action: 'listOwnedShares', offset: nextPage * 50 });
      setLoggedIn(result.loggedIn);
      setShares(result.shares);
      setMore(result.hasMore);
      setPage(nextPage);
    } catch {
      setError('無法讀取分享紀錄，請稍後重新整理；這不代表你沒有分享。');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void load();
    refreshLocal();
    window.addEventListener('storage', refreshLocal);
    return () => window.removeEventListener('storage', refreshLocal);
  }, []);

  const revoke = async () => {
    if (!pending) return;
    const token = pending.token;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await callBackend({ action: 'revokeOwnedShare', token });
      setShares(items => items.map(item => item.token === token ? { ...item, revoked_at: new Date().toISOString() } : item));
      setPending(null);
      setNotice('連結已撤銷，後續讀取與協作請求將被拒絕。');
    } catch {
      setError('撤銷失敗，請確認登入帳號後再試。');
    } finally {
      setBusy(false);
    }
  };

  const exportLocal = () => {
    try {
      const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), entries: managedLocalEntries(localStorage, sessionStorage) }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = '我的升學本機資料.json';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice('已產生本機資料匯出檔，請妥善保管。');
    } catch {
      setLocalError('無法匯出本機資料，請檢查瀏覽器下載與儲存權限。');
    }
  };

  const clearLocal = () => {
    try {
      for (const entry of managedLocalEntries(localStorage, sessionStorage)) {
        (entry.storage === 'local' ? localStorage : sessionStorage).removeItem(entry.key);
      }
      window.dispatchEvent(new Event('admission-comparison-updated'));
      refreshLocal();
      setClearPending(false);
      setNotice('已清除下列本機資料。其他已開啟頁面可能仍保有畫面中的草稿，請關閉或重新整理。');
    } catch {
      refreshLocal();
      setLocalError('清除未完成，部分資料可能仍保留，請重試。');
    }
  };

  const goBack = () => {
    let fromThisSite = false;
    try { fromThisSite = !!document.referrer && new URL(document.referrer).origin === window.location.origin; }
    catch { /* A direct visit returns to the home page. */ }
    if (fromThisSite && window.history.length > 1) window.history.back();
    else window.location.assign(withBasePath('/'));
  };

  return (
    <main id="main-content" className="privacy-center-page">
      <div className="privacy-shell">
        <nav className="privacy-top-nav" aria-label="頁面導覽">
          <button type="button" onClick={goBack}><ArrowLeft aria-hidden="true" size={17} />返回上一頁</button>
          <span><ShieldCheck aria-hidden="true" size={16} />資料管理中心</span>
        </nav>

        <header className="privacy-hero">
          <div className="privacy-hero-copy">
            <p className="privacy-eyebrow">你的資料，由你管理</p>
            <h1>個資與分享<br /><span>管理中心</span></h1>
            <p className="privacy-hero-description">集中查看分享連結、備份此裝置資料，並找到成績紀錄與帳號管理入口。</p>
          </div>
          <div className="privacy-hero-mark" aria-hidden="true"><ShieldCheck size={78} strokeWidth={1.3} /><span><Link2 size={24} /></span></div>
          <div className="privacy-overview" aria-label="資料概況">
            <div><span>分享連結</span><strong>{error ? '暫時無法查詢' : loggedIn === null ? '讀取中' : loggedIn ? `本頁 ${shares.length} 筆` : '登入後查看'}</strong></div>
            <div><span>此裝置資料</span><strong>{localError ? '無法讀取' : `${localCount} 筆項目`}</strong></div>
            <div><span>管理方式</span><strong>可匯出與撤銷</strong></div>
          </div>
        </header>

        <nav className="privacy-quick-nav" aria-label="快速前往">
          <a href="#shares-title"><Link2 aria-hidden="true" /><span><strong>分享連結</strong><small>期限與撤銷</small></span><ArrowRight aria-hidden="true" /></a>
          <a href="#local-title"><Database aria-hidden="true" /><span><strong>此裝置資料</strong><small>備份與清除</small></span><ArrowRight aria-hidden="true" /></a>
          <a href="#other-data-title"><FileText aria-hidden="true" /><span><strong>其他資料</strong><small>成績與帳號</small></span><ArrowRight aria-hidden="true" /></a>
        </nav>

        {notice && <p role="status" className="privacy-notice">{notice}</p>}

        <section className="privacy-panel" aria-labelledby="shares-title">
          <div className="privacy-panel-heading">
            <div className="privacy-heading-copy"><span className="privacy-heading-icon"><Link2 aria-hidden="true" /></span><div><p className="privacy-section-label">分享管理</p><h2 id="shares-title">我的分享連結</h2><p>查看每個連結的狀態、期限與存取權限。</p></div></div>
            <button type="button" className="privacy-outline-button" disabled={busy} onClick={() => void load()}><RefreshCw aria-hidden="true" size={16} />重新整理</button>
          </div>
          <div className="privacy-panel-body">
            <p className="privacy-explainer">這裡顯示目前 LINE 帳號建立的分析報告與志願清單。早期未記錄建立者、或未登入時建立的連結不會列出。撤銷或到期會停止後續存取，但無法收回他人已下載或截圖的內容。</p>
            {error && <p role="alert" className="privacy-error">{error}</p>}
            {busy && <p role="status" className="privacy-loading">正在處理分享紀錄…</p>}
            {loggedIn === false && <div className="privacy-empty-state"><span className="privacy-empty-icon"><LockKeyhole aria-hidden="true" /></span><div><h3>登入後查看你的分享</h3><p>請使用建立分享時的 LINE 帳號登入，再回到本頁查看或撤銷連結。</p></div><a href={withBasePath('/membership/account')} className="privacy-primary-link">前往 LINE 登入<ArrowUpRight aria-hidden="true" size={16} /></a></div>}
            {loggedIn && !shares.length && !busy && !error && <div className="privacy-empty-state"><span className="privacy-empty-icon"><Link2 aria-hidden="true" /></span><div><h3>目前沒有可管理的分享</h3><p>建立分析報告或志願清單分享後，連結會顯示在這裡。</p></div></div>}
            {shares.length > 0 && <ul className="privacy-share-list">{shares.map((share, index) => {
              const expired = !!share.expires_at && new Date(share.expires_at).getTime() <= Date.now();
              const inactive = !!share.revoked_at || expired;
              return <li key={share.token} className="privacy-share-card">
                <div className="privacy-share-top"><div><p>分享 #{page * 50 + index + 1}</p><h3>{share.kind === 'volunteer' ? '志願清單' : '分析報告'}</h3></div><span className={inactive ? 'privacy-status privacy-status-off' : 'privacy-status privacy-status-on'}>{share.revoked_at ? '已撤銷' : expired ? '已到期' : '有效中'}</span></div>
                <dl className="privacy-share-details"><div><dt>建立時間</dt><dd>{formatDate(share.created_at)}</dd></div><div><dt>有效期限</dt><dd>{formatDate(share.expires_at)}</dd></div><div><dt>分享權限</dt><dd>{share.collaborationEnabled ? `家長協作 · 第 ${share.collaboration_version} 版` : '唯讀分享'}</dd></div>{share.revoked_at && <div><dt>撤銷時間</dt><dd>{formatDate(share.revoked_at)}</dd></div>}</dl>
                <div className="privacy-share-actions">{!inactive && <a href={withBasePath(`/shared/${share.token}`)} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="privacy-outline-button">查看唯讀內容<ArrowUpRight aria-hidden="true" size={15} /></a>}{!share.revoked_at && <button type="button" disabled={busy} className="privacy-danger-link" onClick={() => setPending(share)}>撤銷此連結</button>}</div>
                {pending?.token === share.token && <dialog ref={revokeDialogRef} aria-labelledby="revoke-share-title" aria-describedby="revoke-share-description" onCancel={event => { event.preventDefault(); setPending(null); }} className="privacy-dialog">
                  <span className="privacy-dialog-icon"><Trash2 aria-hidden="true" /></span><h2 id="revoke-share-title">確認撤銷這份{share.kind === 'volunteer' ? '志願清單' : '分析報告'}？</h2><p id="revoke-share-description">唯讀與協作連結都會失效，無法重新啟用；之後需要重新建立分享。</p><div className="privacy-dialog-actions"><button type="button" disabled={busy} className="privacy-outline-button" onClick={() => setPending(null)}>取消撤銷</button><button type="button" disabled={busy} className="privacy-danger-button" onClick={() => void revoke()}>確認撤銷</button></div>
                </dialog>}
              </li>;
            })}</ul>}
            {loggedIn && <div className="privacy-pagination"><button type="button" className="privacy-outline-button" disabled={busy || page === 0} onClick={() => void load(page - 1)}>上一頁</button><span>第 {page + 1} 頁</span><button type="button" className="privacy-outline-button" disabled={busy || !more} onClick={() => void load(page + 1)}>下一頁</button></div>}
          </div>
        </section>

        <section className="privacy-panel privacy-local-panel" aria-labelledby="local-title">
          <div className="privacy-panel-heading"><div className="privacy-heading-copy"><span className="privacy-heading-icon"><Database aria-hidden="true" /></span><div><p className="privacy-section-label">此裝置</p><h2 id="local-title">此裝置的升學資料</h2><p>備份或清除此瀏覽器儲存的內容。</p></div></div><span className="privacy-count">{localError ? '無法讀取' : `${localCount} 筆項目`}</span></div>
          <div className="privacy-panel-body">
            <div className="privacy-local-grid"><div><h3>包含哪些資料？</h3><p>本機志願版本、待匯入志願、協作稱呼，以及本分頁的分析結果、校系比較清單與欄位設定。項目數不等於志願數量。</p></div><div><h3>清除後影響什麼？</h3><p>只會清除此瀏覽器的上述資料；雲端分享、成績紀錄和會員資格不受影響。請先匯出需要保留的內容。</p></div></div>
            {localError && <p role="alert" className="privacy-error">{localError}</p>}
            <div className="privacy-local-actions"><button type="button" className="privacy-primary-link" onClick={exportLocal}><Download aria-hidden="true" size={17} />匯出本機資料</button><button type="button" className="privacy-danger-link" onClick={() => setClearPending(true)}><Trash2 aria-hidden="true" size={17} />清除上述本機資料</button></div>
            {clearPending && <dialog ref={clearDialogRef} aria-labelledby="clear-local-title" aria-describedby="clear-local-description" onCancel={event => { event.preventDefault(); setClearPending(false); }} className="privacy-dialog">
              <span className="privacy-dialog-icon"><Trash2 aria-hidden="true" /></span><h2 id="clear-local-title">確認清除本機資料？</h2><p id="clear-local-description">將清除上述本機升學資料，包含本機志願版本。清除後無法在網站直接還原，請先匯出需要保留的資料。雲端分享、成績紀錄與會員資格不受影響。</p>{localError && <p role="alert" className="privacy-error">{localError}</p>}<div className="privacy-dialog-actions"><button type="button" autoFocus className="privacy-outline-button" onClick={() => setClearPending(false)}>取消清除</button><button type="button" className="privacy-danger-button" onClick={clearLocal}>確認清除本機資料</button></div>
            </dialog>}
          </div>
        </section>

        <section className="privacy-other" aria-labelledby="other-data-title"><div className="privacy-other-heading"><p className="privacy-section-label">更多管理入口</p><h2 id="other-data-title">其他資料與帳號設定</h2></div><div className="privacy-other-grid">{[
          ['/score-records', '雲端成績紀錄', '查看、管理與刪除已保存的成績紀錄。'],
          ['/membership/account', '帳號與聯絡資料', '修改聯絡信箱、登出、查看交易紀錄與申請刪除帳號。'],
          ['/mock-volunteer', '志願版本管理', '比較不同時間的本機志願清單並還原版本。'],
          ['/privacy', '隱私權政策', '了解資料使用方式與個人資料權利。'],
        ].map(([path, title, description]) => <a key={path} href={withBasePath(path)}><span><strong>{title}</strong><small>{description}</small></span><ArrowUpRight aria-hidden="true" size={18} /></a>)}</div></section>

        <aside className="privacy-help"><Clock3 aria-hidden="true" size={20} /><p>需要協助查詢或刪除雲端資料？請寄信至 <a href="mailto:tyctw.analyze@gmail.com">tyctw.analyze@gmail.com</a>。請勿提供密碼或協作編輯憑證。</p></aside>
      </div>
    </main>
  );
}
