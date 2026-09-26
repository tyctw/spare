import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
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
  Clock,
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
import './membership.css';

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
  ? new Intl.DateTimeFormat('zh-TW', { dateStyle: 'long' }).format(new Date(value))
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
  const remainingDays = membership.expiresAt
    ? Math.max(0, Math.ceil((new Date(membership.expiresAt).getTime() - Date.now()) / 86_400_000))
    : 0;

  return (
    <main id="main-content" aria-labelledby="member-account-title" className="membership-page member-account-page min-h-screen overflow-hidden px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
      <section className="relative mx-auto max-w-6xl">
        <a href={withBasePath('/membership')} className="account-back-link">
          <ArrowLeft className="h-4 w-4" />返回會員方案
        </a>

        <header className="member-account-hero account-hero relative mt-6 overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 rounded-full border border-[#a18bb34d]" />
          <div className="relative flex items-center justify-between gap-6">
            <div className="min-w-0">
              <span className="account-hero-kicker"><Crown aria-hidden="true" className="h-4 w-4" />會員中心</span>
              <h1 id="member-account-title" className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">我的會員帳號</h1>
              <p className="member-account-description mt-4 max-w-xl text-sm leading-7 sm:text-base">{lineName ? `${lineName}，` : ''}資格、購買紀錄與 LINE 帳號資料，都可以在這裡查看與管理。</p>
            </div>
            <div aria-hidden="true" className="account-hero-mark hidden sm:grid"><CircleUserRound className="h-14 w-14" strokeWidth={1.5} /></div>
          </div>
          {state === 'ready' && <div className="account-hero-status"><BadgeCheck aria-hidden="true" className="h-4 w-4" />{membership.active ? `${planName}有效 · 至 ${formatDate(membership.expiresAt)}` : lineName ? 'LINE 已登入 · 尚未啟用會員' : '尚未登入 LINE'}</div>}
        </header>

        <section className="account-shortcuts" aria-labelledby="account-shortcuts-title">
          <h2 id="account-shortcuts-title">快速前往</h2>
          <nav className="member-account-nav" aria-label="會員常用功能">
            <a href={withBasePath('/')}><Sparkles className="h-5 w-5 shrink-0" /><span>開始落點分析</span><ArrowRight className="ml-auto hidden h-4 w-4 sm:block" /></a>
            <a href={withBasePath('/score-records')}><History className="h-5 w-5 shrink-0" /><span>我的成績紀錄</span><ArrowRight className="ml-auto hidden h-4 w-4 sm:block" /></a>
            <a href={withBasePath('/privacy-center')}><ShieldCheck className="h-5 w-5 shrink-0" /><span>個資與分享管理</span><ArrowRight className="ml-auto hidden h-4 w-4 sm:block" /></a>
          </nav>
        </section>

        {state === 'loading' ? (
          <div role="status" aria-live="polite" aria-busy="true" className="mt-5 rounded-2xl border-2 border-slate-900 bg-white p-8 text-center font-bold shadow-[3px_3px_0_#161b35]">正在確認會員資格…</div>
        ) : state === 'error' ? (
          <div role="alert" className="mt-5 rounded-2xl border border-rose-700 bg-rose-50 p-6 text-center shadow-[3px_3px_0_#161b35]">
            <p className="font-bold text-rose-800">暫時無法確認帳號狀態</p>
            {errorMessage && <p className="mt-1 text-xs font-bold text-rose-600">{errorMessage}</p>}
            <button
              type="button"
              onClick={() => { setState('loading'); void refresh().catch((err) => { setErrorMessage(err instanceof Error ? err.message : ''); setState('error'); }); }}
              className="mt-4 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-bold"
            >
              重新整理
            </button>
          </div>
        ) : (
          <>
          <div className="account-main-grid mt-7 grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
            <div className="flex flex-col gap-6">
            <article className="member-surface account-panel account-membership-panel shrink-0 overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-white shadow-[3px_3px_0_#161b35]">
              <div className="account-panel-heading p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="account-panel-icon">
                      {membership.active ? <BadgeCheck className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="account-panel-eyebrow">會員資格</p>
                      <h2 className="mt-0.5 text-lg font-bold text-slate-900">{membership.active ? '會員權益使用中' : '尚未啟用會員'}</h2>
                    </div>
                  </div>
                  {membership.active && <span className="account-valid-badge">資格有效</span>}
                </div>
              </div>

              <div className="p-6 sm:p-7">
                {membership.active ? <>
                  <p className="account-section-intro">你的會員已啟用。使用期間不顯示網站的 Google 廣告與 Offerwall，也不需重複輸入分析授權碼。</p>
                  <div className="account-plan-stats mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="min-w-0 p-4 sm:p-5">
                      <p>目前方案</p>
                      <strong>{planName}</strong>
                    </div>
                    <div className="min-w-0 p-4 sm:p-5">
                      <p>免廣告有效期限</p>
                      <strong>{formatDate(membership.expiresAt)}</strong>
                      <small>剩餘 {remainingDays} 天</small>
                    </div>
                  </div>
                  {/* Email display / edit section */}
                  {emailEditMode ? (
                    <div className="account-email mt-5 rounded-2xl p-4">
                      <p className="account-email-label">聯絡信箱</p>
                      <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <label htmlFor="account-email" className="sr-only">電子信箱</label>
                        <input
                          id="account-email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="your@email.com"
                          value={emailInput}
                          onChange={(e) => { setEmailInput(e.target.value); setEmailError(''); }}
                          className={`min-w-0 w-full flex-1 rounded-xl border bg-white px-3 py-2 text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 ${emailError ? 'border-red-400' : 'border-sky-200'}`}
                        />
                        <div className="flex gap-2 sm:shrink-0">
                          <button
                            type="button"
                            onClick={() => void saveEmail()}
                            disabled={emailSaving}
                            className="account-email-save flex-1 sm:flex-none rounded-xl px-4 py-2 text-sm font-bold transition disabled:opacity-50"
                          >
                            {emailSaving ? '儲存中…' : '儲存'}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setEmailEditMode(false); setEmailInput(''); setEmailError(''); }}
                            disabled={emailSaving}
                            className="flex-1 sm:flex-none rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-bold text-slate-500 transition hover:border-slate-400"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                      {emailError && <p role="alert" className="mt-1.5 text-xs font-bold text-red-600">{emailError}</p>}
                    </div>
                  ) : membership.contactEmail ? (
                    <div className="account-email mt-5 flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
                      <div className="min-w-0">
                        <p className="account-email-label">聯絡信箱</p>
                        <p className="mt-0.5 break-all text-sm font-bold text-[#332d50]">{membership.contactEmail}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setEmailEditMode(true); setEmailInput(membership.contactEmail ?? ''); }}
                        className="shrink-0 rounded-lg border border-[#d8c9e8] bg-white px-2.5 py-1 text-xs font-bold text-[#5b4784] transition hover:border-[#9e8ac3]"
                      >
                        編輯
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setEmailEditMode(true); setEmailInput(''); }}
                      className="account-email-add mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition"
                    >
                      <Mail className="h-4 w-4" />
                      新增聯絡信箱
                    </button>
                  )}
                  <a href={withBasePath('/membership')} className="account-text-link">查看完整會員權益<ArrowRight className="h-4 w-4" /></a>
                </> : <>
                  <p className="account-section-intro">{lineName ? '這個 LINE 帳號尚未啟用會員。選擇方案後，就能直接開始落點分析。' : '先登入 LINE 查詢既有資格；如果還沒有會員，也可以選擇方案啟用。'}</p>
                  <div className="account-upgrade-benefits">
                    <div><Ban className="h-5 w-5" /><span>免廣告與 Offerwall</span></div>
                    <div><Infinity className="h-5 w-5" /><span>無限次落點分析</span></div>
                  </div>
                  <a href={withBasePath('/membership')} className="account-upgrade-button"><Sparkles className="h-5 w-5" />查看方案與價格<ArrowRight className="h-4 w-4" /></a>
                </>}
              </div>
            </article>

            <section className="account-panel account-history-panel overflow-hidden rounded-[1.75rem] bg-white">
              <div className="account-panel-heading flex items-center justify-between gap-4 px-5 py-4">
                <div className="flex items-center gap-3"><div className="account-panel-icon"><ReceiptText className="h-4 w-4" /></div><div><p className="account-panel-eyebrow">付款與訂單</p><h2 className="mt-0.5 text-lg font-bold">購買紀錄</h2></div></div>
                <span className="account-history-count">最近 20 筆</span>
              </div>
              {purchases.length ? <div className="space-y-4 p-4 sm:p-5">
                {(isHistoryExpanded ? purchases : purchases.slice(0, 1)).map((purchase) => {
                  const paid = purchase.status === 'paid';
                  const statusLabel = purchase.status === 'paid' ? '已付款' : purchase.status === 'pending' ? '處理中' : purchase.status === 'refunded' ? '已退款' : '未完成';
                  return (
                    <div key={`${purchase.reference}-${purchase.createdAt}`} className="account-purchase group relative overflow-hidden rounded-2xl bg-white p-4 transition-all sm:p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border ${paid ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : purchase.status === 'refunded' ? 'border-amber-200 bg-amber-50 text-amber-600' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>
                            {paid ? <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6" /> : purchase.status === 'refunded' ? <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" /> : <Clock className="h-5 w-5 sm:h-6 sm:w-6" />}
                          </div>
                          <div>
                            <p className="text-sm sm:text-base font-bold text-slate-900">{purchase.plan === 'yearly' ? '年費會員方案' : '月費會員方案'}</p>
                            <p className="mt-0.5 text-xs sm:text-sm font-bold text-emerald-700">NT$ {purchase.amount}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center justify-center rounded-full border px-2.5 py-1 text-[11px] sm:text-xs font-bold ${paid ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : purchase.status === 'refunded' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>{statusLabel}</span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs font-bold text-slate-600 sm:grid-cols-2">
                        <div>
                          <p className="mb-1 text-[10px] uppercase tracking-wider text-slate-400">訂單編號</p>
                          <p className="select-all break-all font-bold text-slate-700">{purchase.reference}</p>
                        </div>
                        {paid ? (
                          <div>
                            <p className="mb-1 text-[10px] uppercase tracking-wider text-slate-400">付款與效期</p>
                            <p className="text-slate-700">{formatDate(purchase.paidAt)} <span className="mx-1 text-slate-300">~</span> {formatDate(purchase.expiresAt)}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="mb-1 text-[10px] uppercase tracking-wider text-slate-400">建立日期</p>
                            <p className="text-slate-700">{formatDate(purchase.createdAt)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {purchases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-3.5 text-xs font-bold text-slate-600 transition hover:border-slate-400 hover:bg-slate-100"
                  >
                    {isHistoryExpanded ? '收起歷史紀錄' : `展開其餘 ${purchases.length - 1} 筆紀錄`}
                  </button>
                )}
              </div> : <div className="px-5 py-8 text-center text-sm font-bold text-slate-500">{lineName ? '目前還沒有購買紀錄，選擇方案後即可在這裡追蹤訂單。' : '登入 LINE 後，這裡會顯示你的會員購買紀錄。'}</div>}
            </section>
            </div>

            <div className="flex flex-col gap-6">
              <aside className="account-panel account-security-panel overflow-hidden rounded-[2rem] bg-white">
            <div className="account-panel-heading p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="account-panel-icon">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="account-panel-eyebrow">帳號與安全</p>
                  <h2 className="mt-0.5 text-lg font-bold text-slate-900">LINE 身分確認</h2>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <div className="flex flex-col gap-4">
                <div className="account-line-identity flex items-center gap-4 rounded-2xl p-4">
                  <div className="account-line-avatar flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                    <CircleUserRound className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-400">登入帳號</p>
                    <p className="mt-1 break-words text-xl font-bold text-slate-900">{lineName || '尚未登入 LINE'}</p>
                  </div>
                </div>

                <p className="account-security-note rounded-xl px-4 py-3 text-xs font-medium leading-relaxed">
                  LINE 僅用於確認與恢復會員資格。登入狀態有效 24 小時；登出後，此裝置會立刻恢復一般使用者顯示。
                </p>



                {lineName ? (
                  <button type="button" onClick={() => void logout()} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:border-stone-200 hover:shadow-[5px_5px_0_#161b35]">
                    <LogOut className="h-4 w-4 text-slate-400" />
                    登出 LINE
                  </button>
                ) : (
                  <button type="button" onClick={loginWithLine} className="member-line-button"><img src={withBasePath('/brand/line/line-login.png')} width={44} height={44} alt="" aria-hidden="true" /><span>使用 LINE 登入</span></button>
                )}
              </div>

              {lineName && (
                <div className="mt-8 border-t border-dashed border-rose-100 pt-6">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-rose-500" />
                    <h3 className="text-sm font-bold text-rose-700">帳號刪除</h3>
                  </div>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">
                    刪除後會移除 LINE 身分連結與此裝置登入狀態；付款交易紀錄會依法保留，但不再與你的 LINE 帳號連結。
                  </p>

                  {membership.active ? (
                     <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                       <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                       <p className="text-xs font-medium leading-relaxed text-amber-800">免廣告資格仍有效，請於到期後再刪除帳號。</p>
                     </div>
                  ) : (
                    <button type="button" onClick={() => setDeleteDialogOpen(true)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 transition hover:border-rose-900 hover:bg-rose-100 hover:text-rose-900">
                      刪除帳號
                    </button>
                  )}
                </div>
              )}

              {accountNotice && <p role="status" aria-live="polite" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium leading-5 text-emerald-800">{accountNotice}</p>}
            </div>
          </aside>

            </div>
          </div>

          <section className="account-support-grid mx-auto mt-8 grid gap-5 md:grid-cols-2" aria-label="會員協助與交易保障">
            <div className="account-support-card p-5 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="account-support-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="account-panel-eyebrow">
                    需要協助嗎
                  </p>
                  <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                    會員協助與交易保障
                  </h2>
                  <p className="mt-2 max-w-xl text-sm font-normal leading-6 text-slate-600">
                    需要協助時，我們在這裡。付款、資格確認或使用上的問題，都可以直接來信聯絡。
                  </p>
                </div>
              </div>
              <a
                href="mailto:tyctw.analyze@gmail.com?subject=%E6%9C%83%E5%93%A1%E5%85%8D%E5%BB%A3%E5%91%8A%E5%8D%94%E5%8A%A9"
                className="account-support-link mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition sm:w-auto"
              >
                <Mail className="h-4 w-4" />
                tyctw.analyze@gmail.com
              </a>
            </div>
            <div className="account-support-card p-5 sm:p-8">
              <p className="account-panel-eyebrow">
                交易保障
              </p>
              <h3 className="mt-1 text-lg font-bold text-slate-800 sm:text-xl">
                售後與退款說明
              </h3>
              <p className="mt-2 text-sm font-normal leading-6 text-slate-600">
                查看付款異常、取消申請、退款方式與交易爭議的處理原則。
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
                <a
                  href={withBasePath("/after-sales-service")}
                  className="account-policy-link group flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white p-2.5 text-center transition sm:flex-row sm:justify-between sm:gap-3 sm:px-4 sm:py-3.5"
                >
                  <span className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
                    <HeartHandshake className="h-5 w-5 shrink-0 text-[#6e55a1] sm:h-4 sm:w-4" />
                    <span className="text-xs font-bold text-slate-800 sm:text-sm">售後服務</span>
                  </span>
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900 sm:block" />
                </a>
                <a
                  href={withBasePath("/refund-cancellation-policy")}
                  className="account-policy-link group flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white p-2.5 text-center transition sm:flex-row sm:justify-between sm:gap-3 sm:px-4 sm:py-3.5"
                >
                  <span className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
                    <ReceiptText className="h-5 w-5 shrink-0 text-[#6e55a1] sm:h-4 sm:w-4" />
                    <span className="leading-tight text-xs font-bold text-slate-800 sm:text-sm">退款與取消</span>
                  </span>
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900 sm:block" />
                </a>
              </div>
            </div>
          </section>
          </>
        )}
      </section>
      {deleteDialogOpen && <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
        <section role="dialog" aria-modal="true" aria-labelledby="delete-account-title" aria-describedby="delete-account-description" className="w-full max-w-md rounded-[1.75rem] border-2 border-slate-900 bg-white p-6 shadow-[3px_3px_0_#161b35] sm:p-7">
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-rose-800 bg-rose-100 text-rose-800"><Trash2 className="h-5 w-5" /></div>
          <h2 id="delete-account-title" className="mt-4 text-2xl font-bold">確認刪除帳號？</h2>
          <p id="delete-account-description" className="mt-2 text-sm font-medium leading-6 text-slate-600">這會移除你的成績紀錄、名下分享報告與協作紀錄，所有相關分享連結將失效，並登出目前帳號。交易紀錄會保留作為必要的付款與帳務資料，但不再與你的 LINE 帳號連結。</p>
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-800">此操作無法復原；日後如需使用會員服務，需重新登入並重新購買方案。</p>
          <div className="mt-6 grid gap-2 sm:gap-3 grid-cols-2">
            <button type="button" onClick={() => void deleteAccount()} disabled={deletingAccount} className="rounded-xl border border-rose-800 bg-rose-700 p-2.5 sm:px-4 sm:py-3 text-sm sm:text-base font-bold text-white shadow-[3px_3px_0_#161b35] transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50">{deletingAccount ? '刪除中...' : '確定刪除'}</button>
            <button type="button" onClick={() => setDeleteDialogOpen(false)} disabled={deletingAccount} className="rounded-xl border-2 border-slate-900 bg-white p-2.5 sm:px-4 sm:py-3 text-sm sm:text-base font-bold transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">保留帳號</button>
          </div>
        </section>
      </div>}
    </main>
  );
}
