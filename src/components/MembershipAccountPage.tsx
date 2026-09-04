import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CircleUserRound,
  FileText,
  HeartHandshake,
  Home,
  Crown,
  LifeBuoy,
  LogIn,
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
} from 'lucide-react';
import { callBackend } from '../lib/api';
import {
  clearLineSessionToken,
  consumeLineLoginCodeFromFragment,
  getMembershipStatus,
  type MembershipStatus,
} from '../lib/membership';
import { withBasePath } from '../lib/routes';

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
        await consumeLineLoginCodeFromFragment();
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
    const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
    if (!supabaseUrl) {
      setState('error');
      return;
    }
    window.location.assign(`${supabaseUrl}/functions/v1/line-login?returnTo=/membership/account`);
  };

  const logout = async () => {
    clearLineSessionToken();
    setMembership({ active: false });
    setLineName('');
    setPurchases([]);
    await callBackend({ action: 'revokeLineLoginSession' }).catch(() => undefined);
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
    <main id="main-content" aria-labelledby="member-account-title" className="min-h-screen overflow-hidden bg-[#f5f6ff] px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
      <div aria-hidden="true" className="fixed -left-28 top-20 h-72 w-72 rounded-full bg-violet-200/60 blur-3xl" />
      <div aria-hidden="true" className="fixed -right-24 bottom-0 h-80 w-80 rounded-full bg-sky-200/60 blur-3xl" />
      <section className="relative mx-auto max-w-5xl">
        <a href={withBasePath('/membership')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0_#161b35]">
          <ArrowLeft className="h-4 w-4" />會員免廣告
        </a>

        <header className="mt-5 overflow-hidden rounded-[1.75rem] border-2 border-slate-900 bg-violet-100 p-5 text-slate-900 shadow-[5px_5px_0_#161b35] sm:mt-6 sm:p-7">
          <div className="flex items-start justify-between gap-4 sm:items-center">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-[11px] font-black tracking-[.16em] text-violet-700"><Crown className="h-4 w-4 fill-amber-300 text-violet-700" />MEMBER ACCOUNT</p>
              <h1 id="member-account-title" className="mt-1.5 text-2xl font-black tracking-tight sm:text-4xl">我的會員帳號</h1>
              <p className="mt-2 max-w-xl text-sm font-bold leading-6 text-slate-600">資格、效期與常用操作都集中在這裡，確認後就能繼續專心查落點。</p>
            </div>
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-slate-900 bg-white text-violet-700 shadow-[2px_2px_0_#161b35] sm:h-14 sm:w-14 sm:rounded-2xl"><CircleUserRound className="h-5 w-5 sm:h-7 sm:w-7" /></div>
          </div>
        </header>

        {state === 'loading' ? (
          <div role="status" aria-live="polite" aria-busy="true" className="mt-5 rounded-2xl border-2 border-slate-900 bg-white p-8 text-center font-black shadow-[5px_5px_0_#161b35]">正在確認會員資格…</div>
        ) : state === 'error' ? (
          <div role="alert" className="mt-5 rounded-2xl border-2 border-rose-700 bg-rose-50 p-6 text-center shadow-[5px_5px_0_#161b35]">
            <p className="font-black text-rose-800">暫時無法確認帳號狀態</p>
            {errorMessage && <p className="mt-1 text-xs font-bold text-rose-600">{errorMessage}</p>}
            <button
              type="button"
              onClick={() => { setState('loading'); void refresh().catch((err) => { setErrorMessage(err instanceof Error ? err.message : ''); setState('error'); }); }}
              className="mt-4 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black"
            >
              重新整理
            </button>
          </div>
        ) : (
          <>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr] lg:items-start">
            <div className="flex flex-col gap-5">
            <article className="shrink-0 overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-white shadow-[6px_6px_0_#161b35]">
              <div className={`border-b-2 border-slate-900 p-6 sm:p-7 ${membership.active ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 ${membership.active ? 'bg-emerald-400 text-emerald-950' : 'bg-slate-200 text-slate-500'}`}>
                      {membership.active ? <BadgeCheck className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className={`text-[10px] font-black tracking-[.16em] ${membership.active ? 'text-emerald-700' : 'text-slate-500'}`}>MEMBERSHIP STATUS</p>
                      <h2 className="mt-0.5 text-lg font-black text-slate-900">{membership.active ? '免廣告已生效' : '尚未啟用免廣告'}</h2>
                    </div>
                  </div>
                  {membership.active && <span className="rounded-full border border-emerald-300 bg-white px-3 py-1 text-xs font-black text-emerald-700">已登入</span>}
                </div>
              </div>

              <div className="p-6 sm:p-7">
                {membership.active ? <>
                  <p className="text-sm font-bold leading-relaxed text-slate-700">你正在使用 {planName}，查詢、比對與規劃頁面都不會載入 Google 廣告或 Offerwall。</p>
                  <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="min-w-0 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 p-3 transition hover:border-emerald-200 sm:px-4 sm:py-3">
                      <p className="text-[10px] font-black text-emerald-800 sm:text-xs">目前方案</p>
                      <p className="mt-1 break-words text-base font-black text-emerald-950 sm:text-lg">{planName}</p>
                    </div>
                    <div className="min-w-0 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 p-3 transition hover:border-emerald-200 sm:px-4 sm:py-3">
                      <p className="text-[10px] font-black text-emerald-800 sm:text-xs">距離到期</p>
                      <p className="mt-1 break-words text-base font-black text-emerald-950 sm:text-lg">剩下 {remainingDays} 天</p>
                      <p className="mt-0.5 break-words text-[10px] font-bold text-emerald-700 sm:text-xs">至 {formatDate(membership.expiresAt)}</p>
                    </div>
                  </div>
                  {/* Email display / edit section */}
                  {emailEditMode ? (
                    <div className="mt-3 rounded-2xl border-2 border-sky-200 bg-sky-50 p-4">
                      <p className="text-xs font-black text-sky-700">聯絡信箱</p>
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
                          className={`min-w-0 w-full flex-1 rounded-xl border-2 bg-white px-3 py-2 text-sm font-bold text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-sky-400 ${emailError ? 'border-red-400' : 'border-sky-200'}`}
                        />
                        <div className="flex gap-2 sm:shrink-0">
                          <button
                            type="button"
                            onClick={() => void saveEmail()}
                            disabled={emailSaving}
                            className="flex-1 sm:flex-none rounded-xl border-2 border-slate-900 bg-sky-400 px-4 py-2 text-sm font-black text-slate-900 shadow-[2px_2px_0_#161b35] transition hover:-translate-y-0.5 disabled:opacity-50"
                          >
                            {emailSaving ? '儲存中…' : '儲存'}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setEmailEditMode(false); setEmailInput(''); setEmailError(''); }}
                            disabled={emailSaving}
                            className="flex-1 sm:flex-none rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-500 transition hover:border-slate-400"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                      {emailError && <p role="alert" className="mt-1.5 text-xs font-bold text-red-600">{emailError}</p>}
                    </div>
                  ) : membership.contactEmail ? (
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border-2 border-sky-100 bg-sky-50/50 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-sky-800">聯絡信箱</p>
                        <p className="mt-0.5 break-all text-sm font-black text-sky-950">{membership.contactEmail}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setEmailEditMode(true); setEmailInput(membership.contactEmail ?? ''); }}
                        className="shrink-0 rounded-lg border border-sky-200 bg-white px-2.5 py-1 text-xs font-black text-sky-700 transition hover:border-sky-400"
                      >
                        編輯
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setEmailEditMode(true); setEmailInput(''); }}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sky-200 bg-sky-50/30 px-4 py-3 text-sm font-black text-sky-700 transition hover:border-sky-400 hover:bg-sky-50"
                    >
                      <Mail className="h-4 w-4" />
                      新增聯絡信箱
                    </button>
                  )}
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <a href={withBasePath('/')} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-4 py-3 font-black text-white shadow-[3px_3px_0_#161b35] transition hover:-translate-y-0.5 hover:bg-indigo-700"><Home className="h-4 w-4" />回到落點分析</a>
                    <a href={withBasePath('/membership')} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-3 font-black transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#161b35]"><Sparkles className="h-4 w-4 text-indigo-600" />續購與查詢方案</a>
                  </div>
                </> : <>
                  <div className="rounded-2xl bg-indigo-50/50 p-4 sm:p-5 mb-5 border-2 border-indigo-100/50">
                    <p className="text-sm font-bold leading-relaxed text-indigo-900">
                      登入 LINE 後可確認既有資格；尚未購買時，可直接從方案頁啟用免廣告。
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="group relative flex items-center overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md sm:p-5">
                      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-slate-50 transition-colors group-hover:bg-indigo-50" />
                      <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600 sm:h-11 sm:w-11">
                          <Ban className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase sm:text-xs">專屬特權 1</p>
                          <p className="mt-0.5 text-base font-black text-slate-800 transition-colors group-hover:text-indigo-950 sm:text-lg">完全移除廣告</p>
                        </div>
                      </div>
                    </div>
                    <div className="group relative flex items-center overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md sm:p-5">
                      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-slate-50 transition-colors group-hover:bg-indigo-50" />
                      <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600 sm:h-11 sm:w-11">
                          <Infinity className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase sm:text-xs">專屬特權 2</p>
                          <p className="mt-0.5 text-base font-black text-slate-800 transition-colors group-hover:text-indigo-950 sm:text-lg">無限次落點分析</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <a href={withBasePath('/membership')} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-4 py-4 text-sm font-black text-white shadow-[4px_4px_0_#161b35] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_#161b35] active:translate-y-0 active:shadow-none"><Sparkles className="h-5 w-5" />前往啟用免廣告</a>
                </>}
              </div>
            </article>

            <section className="overflow-hidden rounded-[1.75rem] border-2 border-slate-900 bg-white shadow-[5px_5px_0_#161b35]">
              <div className="flex items-center justify-between gap-4 border-b-2 border-slate-900 bg-violet-50 px-5 py-4">
                <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl border-2 border-slate-900 bg-white text-violet-700 shadow-[2px_2px_0_#161b35]"><ReceiptText className="h-4 w-4" /></div><div><p className="text-[10px] font-black tracking-[.16em] text-violet-700">PURCHASE HISTORY</p><h2 className="mt-0.5 text-lg font-black">購買紀錄</h2></div></div>
                <span className="rounded-full border border-violet-200 bg-white px-2.5 py-1 text-[11px] font-black text-violet-700">最多 20 筆</span>
              </div>
              {purchases.length ? <div className="space-y-4 bg-slate-50/50 p-4 sm:p-5">
                {(isHistoryExpanded ? purchases : purchases.slice(0, 1)).map((purchase) => {
                  const paid = purchase.status === 'paid';
                  const statusLabel = purchase.status === 'paid' ? '已付款' : purchase.status === 'pending' ? '處理中' : purchase.status === 'refunded' ? '已退款' : '未完成';
                  return (
                    <div key={`${purchase.reference}-${purchase.createdAt}`} className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border-2 ${paid ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : purchase.status === 'refunded' ? 'border-amber-200 bg-amber-50 text-amber-600' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>
                            {paid ? <BadgeCheck className="h-5 w-5 sm:h-6 sm:w-6" /> : purchase.status === 'refunded' ? <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6" /> : <Clock className="h-5 w-5 sm:h-6 sm:w-6" />}
                          </div>
                          <div>
                            <p className="text-sm sm:text-base font-black text-slate-900">{purchase.plan === 'yearly' ? '年費會員方案' : '月費會員方案'}</p>
                            <p className="mt-0.5 text-xs sm:text-sm font-black text-indigo-700">NT$ {purchase.amount}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex items-center justify-center rounded-full border-2 px-2.5 py-1 text-[11px] sm:text-xs font-black ${paid ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : purchase.status === 'refunded' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>{statusLabel}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-xs font-bold text-slate-600 sm:grid-cols-2">
                        <div>
                          <p className="mb-1 text-[10px] uppercase tracking-wider text-slate-400">訂單編號</p>
                          <p className="select-all font-black text-slate-700">{purchase.reference}</p>
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
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-3.5 text-xs font-black text-slate-600 transition hover:border-slate-400 hover:bg-slate-100"
                  >
                    {isHistoryExpanded ? '收起歷史紀錄' : `展開其餘 ${purchases.length - 1} 筆紀錄`}
                  </button>
                )}
              </div> : <div className="px-5 py-8 text-center text-sm font-bold text-slate-500">登入 LINE 後，這裡會顯示你的會員購買紀錄。</div>}
            </section>
            </div>
            
            <div className="flex flex-col gap-5">
              <aside className="overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-white shadow-[6px_6px_0_#161b35]">
            <div className="border-b-2 border-slate-900 bg-[#00c300]/10 p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-[#00c300] text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[.16em] text-[#00a000]">IDENTITY VERIFICATION</p>
                  <h2 className="mt-0.5 text-lg font-black text-slate-900">LINE 身分確認</h2>
                </div>
              </div>
            </div>
            
            <div className="p-6 sm:p-7">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 transition-colors hover:border-slate-300">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-400">
                    <CircleUserRound className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-slate-400">登入帳號</p>
                    <p className="mt-0.5 truncate text-lg font-black text-slate-900">{lineName || '尚未登入 LINE'}</p>
                  </div>
                </div>

                <p className="rounded-xl bg-indigo-50/50 px-4 py-3 text-xs font-bold leading-relaxed text-indigo-800">
                  LINE 僅用於確認與恢復會員資格。登入狀態有效 24 小時；登出後，此裝置會立刻恢復一般使用者顯示。
                </p>

                {lineName ? (
                  <button type="button" onClick={() => void logout()} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-sm font-black text-slate-700 transition hover:border-slate-900 hover:shadow-[3px_3px_0_#0f172a]">
                    <LogOut className="h-4 w-4 text-slate-400" />
                    登出 LINE
                  </button>
                ) : (
                  <button type="button" onClick={loginWithLine} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-[#00c300] px-4 py-3.5 text-sm font-black text-white shadow-[3px_3px_0_#161b35] transition hover:-translate-y-0.5 hover:bg-[#00a000] active:translate-y-0 active:shadow-none">
                    <LogIn className="h-4 w-4" />
                    使用 LINE 登入
                  </button>
                )}
              </div>

              {lineName && (
                <div className="mt-8 border-t-2 border-dashed border-rose-100 pt-6">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-rose-500" />
                    <h3 className="text-sm font-black text-rose-700">帳號刪除</h3>
                  </div>
                  <p className="mt-2 text-xs font-bold leading-relaxed text-slate-500">
                    刪除後會移除 LINE 身分連結與此裝置登入狀態；付款交易紀錄會依法保留，但不再與你的 LINE 帳號連結。
                  </p>
                  
                  {membership.active ? (
                     <div className="mt-4 flex items-start gap-2 rounded-xl border-2 border-amber-200 bg-amber-50 px-3 py-2.5">
                       <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                       <p className="text-xs font-black leading-relaxed text-amber-800">免廣告資格仍有效，請於到期後再刪除帳號。</p>
                     </div>
                  ) : (
                    <button type="button" onClick={() => setDeleteDialogOpen(true)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 transition hover:border-rose-900 hover:bg-rose-100 hover:text-rose-900">
                      刪除帳號
                    </button>
                  )}
                </div>
              )}
              
              {accountNotice && <p role="status" aria-live="polite" className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-bold leading-5 text-indigo-800">{accountNotice}</p>}
            </div>
          </aside>

            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-[#f4f7ff] shadow-[6px_6px_0_#161b35] md:grid-cols-2">
            <div className="p-5 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.14em] text-indigo-600 sm:text-xs">
                    MEMBERSHIP SUPPORT
                  </p>
                  <h2 className="mt-1 text-xl font-black sm:text-2xl">
                    會員協助與交易保障
                  </h2>
                  <p className="mt-2 max-w-xl text-sm font-bold leading-6 text-slate-600">
                    需要協助時，我們在這裡。付款、資格確認或使用上的問題，都可以直接來信聯絡。
                  </p>
                </div>
              </div>
              <a
                href="mailto:tyctw.analyze@gmail.com?subject=%E6%9C%83%E5%93%A1%E5%85%8D%E5%BB%A3%E5%91%8A%E5%8D%94%E5%8A%A9"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-indigo-50 px-4 py-3.5 text-sm font-black text-indigo-700 transition hover:border-slate-900 hover:bg-indigo-100 sm:w-auto"
              >
                <Mail className="h-4 w-4" />
                tyctw.analyze@gmail.com
              </a>
            </div>
            <div className="border-t-2 border-slate-900 bg-[#f7f9ff] p-5 sm:p-8 md:border-l-2 md:border-t-0">
              <p className="text-[10px] font-black tracking-[0.14em] text-slate-500 sm:text-xs">
                MEMBERSHIP INFORMATION
              </p>
              <h3 className="mt-1 text-lg font-black text-slate-800 sm:text-xl">
                售後與退款說明
              </h3>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
                查看付款異常、取消申請、退款方式與交易爭議的處理原則。
              </p>
              <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
                <a
                  href={withBasePath("/after-sales-service")}
                  className="group flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white p-2.5 text-center transition hover:border-slate-900 hover:shadow-[3px_3px_0_#0f172a] sm:flex-row sm:justify-between sm:gap-3 sm:px-4 sm:py-3.5"
                >
                  <span className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
                    <HeartHandshake className="h-5 w-5 shrink-0 text-indigo-600 sm:h-4 sm:w-4" />
                    <span className="text-xs font-black text-slate-800 sm:text-sm">售後服務</span>
                  </span>
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900 sm:block" />
                </a>
                <a
                  href={withBasePath("/refund-cancellation-policy")}
                  className="group flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-slate-200 bg-white p-2.5 text-center transition hover:border-slate-900 hover:shadow-[3px_3px_0_#0f172a] sm:flex-row sm:justify-between sm:gap-3 sm:px-4 sm:py-3.5"
                >
                  <span className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-2">
                    <ReceiptText className="h-5 w-5 shrink-0 text-indigo-600 sm:h-4 sm:w-4" />
                    <span className="leading-tight text-xs font-black text-slate-800 sm:text-sm">退款與取消</span>
                  </span>
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-900 sm:block" />
                </a>
              </div>
            </div>
          </div>
          </>
        )}
      </section>
      {deleteDialogOpen && <div role="presentation" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4">
        <section role="dialog" aria-modal="true" aria-labelledby="delete-account-title" aria-describedby="delete-account-description" className="w-full max-w-md rounded-[1.75rem] border-2 border-slate-900 bg-white p-6 shadow-[7px_7px_0_#161b35] sm:p-7">
          <div className="grid h-11 w-11 place-items-center rounded-xl border-2 border-rose-800 bg-rose-100 text-rose-800"><Trash2 className="h-5 w-5" /></div>
          <h2 id="delete-account-title" className="mt-4 text-2xl font-black">確認刪除帳號？</h2>
          <p id="delete-account-description" className="mt-2 text-sm font-medium leading-6 text-slate-600">這會移除你的 LINE 身分連結和目前登入狀態。交易紀錄會保留作為必要的付款與帳務資料，但不再與你的 LINE 帳號連結。</p>
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-black leading-5 text-amber-800">此操作無法復原；日後如需使用會員服務，需重新登入並重新購買方案。</p>
          <div className="mt-6 grid gap-2 sm:gap-3 grid-cols-2">
            <button type="button" onClick={() => void deleteAccount()} disabled={deletingAccount} className="rounded-xl border-2 border-rose-800 bg-rose-700 p-2.5 sm:px-4 sm:py-3 text-sm sm:text-base font-black text-white shadow-[3px_3px_0_#7f1d1d] transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50">{deletingAccount ? '刪除中...' : '確定刪除'}</button>
            <button type="button" onClick={() => setDeleteDialogOpen(false)} disabled={deletingAccount} className="rounded-xl border-2 border-slate-900 bg-white p-2.5 sm:px-4 sm:py-3 text-sm sm:text-base font-black transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">保留帳號</button>
          </div>
        </section>
      </div>}
    </main>
  );
}
