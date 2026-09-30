import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CircleUserRound,
  HeartHandshake,
  Crown,
  LogOut,
  Mail,
  Ban,
  Infinity,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Trash2,
  RotateCcw,
  History,
} from 'lucide-react';
import { callBackend } from '../lib/api';
import { startLineLogin } from '../lib/lineLogin';
import {
  clearLineSessionToken,
  consumeLineLoginCodeFromFragment,
  getMembershipStatus,
  type MembershipStatus,
} from '../lib/membership';
import { withBasePath } from '../lib/routes';
import PageBreadcrumb from './PageBreadcrumb';
import './membership.css';
import './membership-account-page.css';

type AccountState = 'loading' | 'ready' | 'error';
type MembershipPurchase = {
  reference: string;
  plan: 'monthly' | 'yearly';
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paidAt?: string;
  expiresAt?: string;
  createdAt: string;
};

const formatDate = (value?: string) => value
  ? new Intl.DateTimeFormat('zh-TW', { dateStyle: 'long', timeZone: 'Asia/Taipei' }).format(new Date(value))
  : '—';

export default function MembershipAccountPage() {
  const [state, setState] = useState<AccountState>('loading');
  const [membership, setMembership] = useState<MembershipStatus>({ active: false });
  const [lineName, setLineName] = useState('');
  const [purchases, setPurchases] = useState<MembershipPurchase[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [accountNotice, setAccountNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailEditMode, setEmailEditMode] = useState(false);
  const deleteDialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!deleteDialogOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && deleteDialogRef.current?.querySelector('button:not(:disabled)')) {
        setDeleteDialogOpen(false);
      }
      if (event.key !== 'Tab') return;
      const buttons = deleteDialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)');
      if (!buttons?.length) {
        event.preventDefault();
        return;
      }
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [deleteDialogOpen]);

  const refresh = async () => {
    setErrorMessage('');
    // Run all three requests in parallel; each has its own fallback so a
    // single slow or failed call cannot prevent the whole page from rendering.
    const [line, status, history] = await Promise.all([
      callBackend<{ loggedIn: boolean; name?: string }>({ action: 'getLineLoginSession' })
        .catch(() => ({ loggedIn: false as const })),
      getMembershipStatus()
        .catch(() => ({ active: false as const })),
      callBackend<{ purchases: MembershipPurchase[] }>({ action: 'getMembershipPurchaseHistory' })
        .catch(() => ({ purchases: [] as MembershipPurchase[] })),
    ]);
    setLineName(line.loggedIn ? line.name || 'LINE 會員' : '');
    setMembership(status);
    setPurchases(history.purchases || []);
    setState('ready');
  };

  useEffect(() => {
    void (async () => {
      try {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const hasLoginCode = hash.has('line_login_code');
        const consumed = await consumeLineLoginCodeFromFragment();
        if (hasLoginCode && !consumed) {
          setErrorMessage('LINE 登入連結已失效或逾時，請重新點擊「LINE 登入」。');
          setState('error');
          return;
        }
        await refresh();
      } catch (err) {
        const msg = err instanceof Error ? err.message : '';
        setErrorMessage(msg || '');
        setState('error');
      }
    })();
  }, []);

  const saveEmail = async () => {
    const trimmed = emailInput.trim();
    if (!trimmed) {
      setEmailError('請填寫聯絡信箱。');
      return;
    }
    if (!trimmed.includes('@')) {
      setEmailError('請輸入正確的信箱格式。');
      return;
    }
    setEmailSaving(true);
    setEmailError('');
    try {
      const result = await callBackend<{ updated: boolean; contactEmail?: string | null }>({
        action: 'updateMembershipEmail',
        email: trimmed || null,
      });
      if (result.updated) {
        setMembership((prev) => ({ ...prev, contactEmail: result.contactEmail ?? null }));
        setEmailEditMode(false);
        setEmailInput('');
      }
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : '儲存失敗，請稍後再試。');
    } finally {
      setEmailSaving(false);
    }
  };

  const loginWithLine = () => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      setErrorMessage('目前登入服務尚未設定，請稍後再試或聯絡 tyctw.analyze@gmail.com。');
      setState('error');
      return;
    }
    startLineLogin('/membership/account');
  };

  const logout = async () => {
    try {
      await callBackend({ action: 'revokeLineLoginSession' });
      clearLineSessionToken();
      setMembership({ active: false });
      setLineName('');
      setPurchases([]);
    } catch {
      setAccountNotice('登出未完成，請確認網路連線後再試一次。');
    }
  };

  const deleteAccount = async () => {
    setDeletingAccount(true);
    setAccountNotice('');
    try {
      const result = await callBackend<{ deleted: boolean; reason?: 'ACTIVE_MEMBERSHIP' | 'NOT_LOGGED_IN' }>({
        action: 'deleteMembershipAccount',
      });
      if (!result.deleted) {
        setAccountNotice(result.reason === 'ACTIVE_MEMBERSHIP'
          ? '免廣告資格仍有效，請於到期後再刪除帳號。'
          : '登入狀態已失效，請重新登入後再試。');
        setDeleteDialogOpen(false);
        return;
      }
      clearLineSessionToken();
      setMembership({ active: false });
      setLineName('');
      setPurchases([]);
      setDeleteDialogOpen(false);
      setAccountNotice('帳號已刪除，LINE 身分連結與此裝置的登入狀態已移除。');
    } catch {
      setAccountNotice('暫時無法刪除帳號，請稍後再試或聯絡客服。');
    } finally {
      setDeletingAccount(false);
    }
  };

  const planName = membership.plan === 'yearly' ? '年費會員' : '月費會員';
  const remainingDays = membership.expiresAt ? Math.max(0, Math.ceil((new Date(membership.expiresAt).getTime() - Date.now()) / 86_400_000)) : 0;
  const signedIn = Boolean(lineName) || membership.active;

  return <main aria-labelledby="member-account-title" className="account-center"><div className="account-center-shell">
    <PageBreadcrumb title="我的會員帳號" parent={{ label: '會員方案', href: '/membership' }} />
    <header className="account-center-hero"><div><p className="account-center-eyebrow"><CircleUserRound size={17} aria-hidden="true" />會員中心</p><h1 id="member-account-title">我的會員帳號</h1><p className="account-center-lead">{signedIn ? `${lineName || 'LINE 會員'}，在這裡查看會員資格、付款紀錄與帳號資料。` : '登入後，集中查看你的會員資格、付款紀錄與帳號資料。'}</p></div><div className="account-center-hero-status" data-active={membership.active}><span className="account-center-status-dot" /><div><small>目前狀態</small><strong>{state === 'loading' ? '正在確認帳號' : state === 'error' ? '需要重新確認' : membership.active ? '會員資格有效' : signedIn ? '已登入 · 尚未啟用會員' : '尚未登入'}</strong>{membership.active && <span>有效至 {formatDate(membership.expiresAt)}</span>}</div></div></header>
    {state === 'loading' ? <section className="account-center-feedback" role="status" aria-live="polite" aria-busy="true"><RotateCcw size={24} aria-hidden="true" /><h2>正在確認會員資格</h2><p>正在讀取帳號與付款紀錄，請稍候。</p></section>
    : state === 'error' ? <section className="account-center-feedback account-center-error" role="alert"><ShieldCheck size={26} aria-hidden="true" /><h2>暫時無法確認帳號狀態</h2><p>{errorMessage || '請重新整理；若仍無法確認，可重新使用 LINE 登入。'}</p><div className="account-center-form-actions"><button type="button" className="account-center-primary" onClick={() => { setState('loading'); void refresh().catch((err) => { setErrorMessage(err instanceof Error ? err.message : ''); setState('error'); }); }}>重新整理</button><button type="button" className="account-center-secondary" onClick={loginWithLine}>重新登入 LINE</button></div></section>
    : <>
      {!signedIn ? <section className="account-center-guest"><div className="account-center-guest-copy"><span className="account-center-guest-icon"><CircleUserRound size={31} aria-hidden="true" /></span><h2>先登入，找回你的會員資料。</h2><p>使用購買方案時的 LINE 帳號，確認既有資格並查看訂單。尚未加入會員，也可以先了解方案。</p><button type="button" onClick={loginWithLine} className="account-center-line"><img src={withBasePath('/brand/line/line-login.png')} width={44} height={44} alt="" aria-hidden="true" /><span>使用 LINE 登入</span><ArrowRight size={18} aria-hidden="true" /></button><a className="account-center-text-link" href={withBasePath('/membership')}>了解會員方案<ArrowRight size={16} aria-hidden="true" /></a></div><div className="account-center-guest-note"><ShieldCheck size={22} aria-hidden="true" /><h3>登入後可以做什麼？</h3><ul><li>確認方案與免廣告有效期限</li><li>查看最近的購買與付款紀錄</li><li>管理帳號、聯絡資料與分享連結</li></ul><p>LINE 登入狀態有效 24 小時；到期後可重新登入確認資格。</p></div></section>
      : <div className="account-center-main-grid">
        <section className="account-center-panel account-center-membership"><div className="account-center-panel-title"><span><Crown size={21} aria-hidden="true" /></span><div><p>MEMBERSHIP</p><h2>會員資格</h2></div><span className="account-center-badge" data-active={membership.active}>{membership.active ? '使用中' : '未啟用'}</span></div>{membership.active ? <><div className="account-center-plan"><div><span>目前方案</span><strong>{planName}</strong></div><div><span>有效期限</span><strong>{formatDate(membership.expiresAt)}</strong><small>剩餘 {remainingDays} 天</small></div></div><p className="account-center-panel-description">有效期間不顯示 Google 廣告與 Offerwall，也不需重複輸入分析授權碼。</p><div className="account-center-benefits"><span><Ban size={17} aria-hidden="true" />免廣告體驗</span><span><Infinity size={18} aria-hidden="true" />無限次落點分析</span></div><a className="account-center-text-link" href={withBasePath('/membership')}>查看完整權益<ArrowRight size={16} aria-hidden="true" /></a></> : <><div className="account-center-inactive"><h3>目前尚未啟用會員方案</h3><p>你已完成 LINE 登入。可查看會員方案，選擇適合的免廣告使用期間。</p></div><div className="account-center-benefits"><span><Ban size={17} aria-hidden="true" />免廣告與 Offerwall</span><span><Infinity size={18} aria-hidden="true" />無限次落點分析</span></div><a className="account-center-primary" href={withBasePath('/membership')}>查看方案與價格<ArrowRight size={17} aria-hidden="true" /></a></>}</section>
        <section className="account-center-panel"><div className="account-center-panel-title"><span><ShieldCheck size={21} aria-hidden="true" /></span><div><p>ACCOUNT</p><h2>帳號與聯絡資料</h2></div></div><div className="account-center-identity"><span><CircleUserRound size={25} aria-hidden="true" /></span><div><small>登入的 LINE 帳號</small><strong>{lineName || 'LINE 會員'}</strong></div><span className="account-center-connected">已登入</span></div>
          {membership.active && <div className="account-center-email"><div className="account-center-subheading"><Mail size={18} aria-hidden="true" /><h3>聯絡信箱</h3></div><p>用於會員服務聯繫與付款協助。</p>{emailEditMode ? <form onSubmit={(event) => { event.preventDefault(); void saveEmail(); }}><label htmlFor="account-email">電子信箱</label><input id="account-email" type="email" inputMode="email" autoComplete="email" required placeholder="your@email.com" value={emailInput} onChange={(event) => { setEmailInput(event.target.value); setEmailError(''); }} aria-invalid={Boolean(emailError)} aria-describedby={emailError ? 'account-email-error' : undefined} disabled={emailSaving} />{emailError && <p id="account-email-error" role="alert" className="account-center-field-error">{emailError}</p>}<div className="account-center-form-actions"><button type="submit" className="account-center-primary" disabled={emailSaving}>{emailSaving ? '儲存中…' : '儲存信箱'}</button><button type="button" className="account-center-secondary" disabled={emailSaving} onClick={() => { setEmailEditMode(false); setEmailInput(''); setEmailError(''); }}>取消</button></div></form> : <div className="account-center-email-value"><strong>{membership.contactEmail || '尚未設定聯絡信箱'}</strong><button type="button" className="account-center-secondary" onClick={() => { setEmailEditMode(true); setEmailInput(membership.contactEmail ?? ''); }}>{membership.contactEmail ? '編輯' : '新增信箱'}</button></div>}</div>}
          <p className="account-center-session-note">登入狀態有效 24 小時。登出後，此裝置會恢復一般使用者顯示。</p><button type="button" className="account-center-secondary account-center-logout" onClick={() => void logout()}><LogOut size={16} aria-hidden="true" />登出 LINE</button>
        </section>
      </div>}
      <section className="account-center-tools" aria-labelledby="account-tools-title"><div className="account-center-section-heading"><p>CONTINUE EXPLORING</p><h2 id="account-tools-title">接著使用你的升學工具</h2></div><nav aria-label="會員常用功能"><a href={withBasePath('/')}><Sparkles size={21} aria-hidden="true" /><div><strong>開始落點分析</strong><span>用成績探索候選校科</span></div><ArrowRight size={17} aria-hidden="true" /></a><a href={withBasePath('/score-records')}><History size={21} aria-hidden="true" /><div><strong>我的成績紀錄</strong><span>保存與比較考試成績</span></div><ArrowRight size={17} aria-hidden="true" /></a><a href={withBasePath('/privacy-center')}><ShieldCheck size={21} aria-hidden="true" /><div><strong>個資與分享管理</strong><span>查看或撤銷分享連結</span></div><ArrowRight size={17} aria-hidden="true" /></a></nav></section>
      {signedIn && <section className="account-center-panel account-center-history"><div className="account-center-panel-title"><span><ReceiptText size={21} aria-hidden="true" /></span><div><p>ORDERS</p><h2>購買紀錄</h2></div><small>最近 20 筆</small></div>{purchases.length ? <><div className="account-center-orders">{(isHistoryExpanded ? purchases : purchases.slice(0, 1)).map((purchase) => { const label = purchase.status === 'paid' ? '已付款' : purchase.status === 'pending' ? '處理中' : purchase.status === 'refunded' ? '已退款' : '未完成'; return <article className="account-center-order" key={`${purchase.reference}-${purchase.createdAt}`}><div className="account-center-order-top"><div><h3>{purchase.plan === 'yearly' ? '年費會員方案' : '月費會員方案'}</h3><p>NT$ {purchase.amount.toLocaleString('zh-TW')}</p></div><span className="account-center-order-status" data-status={purchase.status}>{label}</span></div><dl><div><dt>訂單編號</dt><dd>{purchase.reference}</dd></div><div><dt>{purchase.status === 'paid' ? '付款日期' : '建立日期'}</dt><dd>{formatDate(purchase.status === 'paid' ? purchase.paidAt : purchase.createdAt)}</dd></div>{purchase.status === 'paid' && <div><dt>方案有效至</dt><dd>{formatDate(purchase.expiresAt)}</dd></div>}</dl></article>; })}</div>{purchases.length > 1 && <button type="button" className="account-center-history-toggle" aria-expanded={isHistoryExpanded} onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}>{isHistoryExpanded ? '收起歷史紀錄' : `查看其餘 ${purchases.length - 1} 筆紀錄`}</button>}</> : <div className="account-center-empty"><ReceiptText size={27} aria-hidden="true" /><h3>目前沒有購買紀錄</h3><p>完成購買後，可以在這裡確認訂單與付款狀態。</p></div>}</section>}
      <section className="account-center-support" aria-label="會員協助"><div><Mail size={24} aria-hidden="true" /><h2>會員或付款需要協助？</h2><p>請提供訂單編號與問題描述，方便我們確認。</p><a className="account-center-text-link" href="mailto:tyctw.analyze@gmail.com?subject=%E6%9C%83%E5%93%A1%E5%8D%94%E5%8A%A9">tyctw.analyze@gmail.com<ArrowRight size={16} aria-hidden="true" /></a></div><nav aria-label="交易與服務說明"><a href={withBasePath('/after-sales-service')}><HeartHandshake size={19} aria-hidden="true" /><span>售後服務</span><ArrowRight size={16} aria-hidden="true" /></a><a href={withBasePath('/refund-cancellation-policy')}><ReceiptText size={19} aria-hidden="true" /><span>退款與取消說明</span><ArrowRight size={16} aria-hidden="true" /></a></nav></section>
      {signedIn && <details className="account-center-danger"><summary><Trash2 size={17} aria-hidden="true" />帳號刪除</summary><div><p>刪除後會移除成績紀錄、名下分享報告與協作紀錄，相關分享連結將失效。交易紀錄會依法保留，但不再與 LINE 帳號連結。</p>{membership.active ? <p className="account-center-danger-note">會員資格仍有效，請於到期後再刪除帳號。</p> : <button type="button" className="account-center-delete" onClick={() => setDeleteDialogOpen(true)}>刪除我的帳號</button>}</div></details>}
      {accountNotice && <p role="status" aria-live="polite" className="account-center-notice">{accountNotice}</p>}
    </>}
  </div>{deleteDialogOpen && <div className="account-center-dialog-backdrop"><section ref={deleteDialogRef} role="dialog" aria-modal="true" aria-labelledby="delete-account-title" aria-describedby="delete-account-description" className="account-center-dialog"><Trash2 size={28} aria-hidden="true" /><h2 id="delete-account-title">確認刪除帳號？</h2><p id="delete-account-description">這會移除你的成績紀錄、名下分享報告與協作紀錄，所有相關分享連結將失效，並登出目前帳號。交易紀錄會保留作為必要的付款與帳務資料，但不再與你的 LINE 帳號連結。</p><p className="account-center-danger-note">此操作無法復原；日後如需使用會員服務，需重新登入並重新購買方案。</p><div className="account-center-dialog-actions"><button type="button" className="account-center-secondary" autoFocus onClick={() => setDeleteDialogOpen(false)} disabled={deletingAccount}>保留帳號</button><button type="button" className="account-center-delete" onClick={() => void deleteAccount()} disabled={deletingAccount}>{deletingAccount ? '刪除中…' : '確定刪除'}</button></div></section></div>}</main>;
}
