import React from 'react';
import { ArrowLeft, BadgeInfo, FileText, HeartHandshake, Mail, ShieldCheck } from 'lucide-react';
import { withBasePath } from '../lib/routes';

type PolicyKind = 'after-sales' | 'refund-cancellation';
const email = 'tyctw.analyze@gmail.com';

const common = <section className="rounded-2xl border-2 border-slate-900 bg-sky-50 p-5 text-sm font-bold leading-7 text-slate-700"><div className="flex gap-2"><BadgeInfo className="mt-1 h-5 w-5 shrink-0 text-sky-700" /><p>本頁政策不限制消費者依中華民國法令享有的權利；法令有較有利於消費者的規定時，依該規定辦理。付款功能正式啟用前，本站不收集付款資訊，也不會產生扣款。</p></div></section>;

export default function SupportPolicyPage({ kind }: { kind: PolicyKind }) {
  const isRefund = kind === 'refund-cancellation';
  const title = isRefund ? '退款與取消政策' : '售後服務';
  const Icon = isRefund ? ShieldCheck : HeartHandshake;
  const sections = isRefund ? [
    ['適用範圍', '本政策適用於本網站日後開通之「小額支持」一次性付款。支持並非實體商品購買、數位內容交付或定期訂閱；不提供換貨、補發、續約或自動扣款。'],
    ['取消與退款申請', '付款尚未完成、付款失敗或訂單逾時者，不會成立支持交易，無須退款。付款完成後，如有重複扣款、未授權付款、金額輸入錯誤或其他合理事由，請於付款完成後 7 日內以電子郵件提出申請。'],
    ['申請資料與處理方式', `請寄至 ${email}，主旨註明「小額支持退款申請」，並提供付款日期、金額、付款方式、訂單或交易編號、聯絡電子郵件及退款原因。請勿提供完整卡號、卡片安全碼、網銀密碼或一次性驗證碼。我們將核對交易資料並回覆處理結果；核准退款後，原則上以原付款方式退回。`],
    ['入帳與爭議交易', '退款實際入帳時間會因付款方式、發卡或金融機構，以及 PAYUNi 統一金流的作業流程而異。若認為交易未經本人授權，請立即聯絡發卡／付款機構並同步通知我們；爭議款項可能依 PAYUNi 的爭議處理程序暫停或保留，並以適當證明及處理結果為準。'],
  ] : [
    ['服務範圍', '小額支持為一次性、自願性的支持款項，用於協助網站維護、資料整理與工具優化；不包含實體商品、數位內容、個人諮詢、保證錄取、訂閱或其他持續性服務。'],
    ['聯絡與案件受理', `如有付款、退款、重複扣款、未授權交易或政策疑問，請寄至 ${email}。為協助核對，請提供付款日期、金額、付款方式、訂單或交易編號與問題說明；切勿以電子郵件傳送完整卡號、卡片安全碼、網銀密碼或一次性驗證碼。`],
    ['金流角色與資料安全', '付款功能啟用後，將由 PAYUNi 統一金流提供付款處理。PAYUNi 是金流服務提供者，不是本頁支持方案的提供者；售後、退款與支持內容問題請先向本站提出。我們不會要求您以電子郵件或訊息提供敏感付款憑證。'],
    ['處理原則', '我們會依交易資料、付款狀態及適用規範處理案件。若案件涉及未授權付款或付款爭議，請同時向付款機構申報，以利依其爭議處理流程處理。'],
  ];

  return <main className="min-h-screen bg-slate-50 text-slate-900"><section className={isRefund ? 'border-b-4 border-slate-900 bg-amber-50' : 'border-b-4 border-slate-900 bg-indigo-50'}><div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8"><a href={withBasePath('/support')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"><ArrowLeft className="h-4 w-4" /> 回到小額支持</a><div className="py-12"><div className="inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><Icon className={isRefund ? 'h-6 w-6 text-amber-700' : 'h-6 w-6 text-indigo-700'} /><span className="text-xs font-black tracking-widest text-slate-500">SUPPORT POLICY</span></div><h1 className="mt-5 text-4xl font-black sm:text-5xl">{title}</h1><p className="mt-4 max-w-3xl text-base font-bold leading-8 text-slate-700">最後更新：2026 年 7 月 28 日。付款前請詳閱本頁內容。</p></div></div></section><section className="mx-auto max-w-5xl space-y-5 px-4 py-10 sm:px-6 lg:px-8">{common}{sections.map(([heading, content], index) => <article key={heading} className="rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-8"><div className="flex gap-3"><span className={isRefund ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-amber-200 font-black' : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-indigo-200 font-black'}>{index + 1}</span><div><h2 className="text-2xl font-black">{heading}</h2><p className="mt-3 text-base font-bold leading-8 text-slate-700">{content}</p></div></div></article>)}<section className="rounded-2xl border-4 border-slate-900 bg-slate-900 p-6 text-white shadow-[5px_5px_0px_0px_rgba(245,158,11,1)]"><FileText className="h-6 w-6 text-amber-300" /><h2 className="mt-3 text-xl font-black">交易資訊與外部規範</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-300">正式啟用付款前，收款主體名稱、統一編號、營業地址及發票資訊將於結帳頁面與本政策揭露。PAYUNi 的付款方式與交易處理以其當時公告為準。</p><div className="mt-4 flex flex-wrap gap-4"><a href={`mailto:${email}`} className="inline-flex items-center gap-2 font-black text-amber-300 underline underline-offset-4"><Mail className="h-4 w-4" /> 聯絡我們</a><a href="https://www.payuni.com.tw/terms" target="_blank" rel="noreferrer" className="font-black text-amber-300 underline underline-offset-4">PAYUNi 服務條款</a></div></section></section></main>;
}
