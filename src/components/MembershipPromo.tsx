import { useEffect, useState } from 'react';
import { Crown, KeyRound, Sparkles } from 'lucide-react';
import { MEMBERSHIP_STATUS_EVENT, type MembershipStatus } from '../lib/membership';
import { withBasePath } from '../lib/routes';

export default function MembershipPromo() {
  const [hasActiveMembership, setHasActiveMembership] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const applyStatus = (status: MembershipStatus) => {
      if (isMounted) setHasActiveMembership(status.active);
    };
    const handleMembershipStatus = (event: Event) => {
      applyStatus((event as CustomEvent<MembershipStatus>).detail);
    };

    window.addEventListener(MEMBERSHIP_STATUS_EVENT, handleMembershipStatus);
    return () => {
      isMounted = false;
      window.removeEventListener(MEMBERSHIP_STATUS_EVENT, handleMembershipStatus);
    };
  }, []);

  if (hasActiveMembership) return null;

  return <section aria-labelledby="membership-promo-title" className="relative overflow-hidden rounded-3xl border-4 border-slate-900 bg-violet-100 p-4 shadow-[5px_5px_0_#0f172a] sm:p-5">
    <div aria-hidden="true" className="absolute -right-8 -top-10 h-32 w-32 rounded-full border-8 border-violet-300/60" />
    <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-3 border-slate-900 bg-white text-violet-600 shadow-[3px_3px_0_#0f172a]"><Crown className="h-6 w-6 fill-violet-300" /></div>
      <div className="min-w-0 flex-1"><p className="text-[11px] font-black tracking-[.14em] text-violet-800">會員免廣告</p><h2 id="membership-promo-title" className="mt-0.5 text-xl font-black text-slate-900 sm:text-2xl">把注意力，留給真正重要的選擇。</h2><p className="mt-1 text-sm font-bold leading-5 text-slate-700">NT$49 起，不到一杯飲料；免廣告、免輸入系統授權碼。登入 LINE 後，換裝置也能立刻接續分析。</p><div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-black text-slate-700"><span className="inline-flex items-center gap-1 rounded-full border-2 border-slate-900 bg-white px-2.5 py-0.5"><Sparkles className="h-3 w-3 text-violet-600" />查校不中斷</span><span className="inline-flex items-center gap-1 rounded-full border-2 border-slate-900 bg-white px-2.5 py-0.5"><KeyRound className="h-3 w-3 text-sky-600" />免輸入授權碼</span></div></div>
      <a href={withBasePath('/membership')} className="inline-flex shrink-0 items-center justify-center rounded-xl border-3 border-slate-900 bg-indigo-600 px-4 py-2.5 text-sm font-black text-white shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-[5px_5px_0_#0f172a]">開始免廣告</a>
    </div>
  </section>;
}
