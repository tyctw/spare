import React from 'react';
import { ArrowLeft, BadgeInfo, CreditCard, FileText, HeartHandshake, Mail, ShieldCheck } from 'lucide-react';
import { withBasePath } from '../lib/routes';

type PolicyKind = 'after-sales' | 'refund-cancellation';
type PolicySection = { title: string; content: React.ReactNode };

const supportEmail = 'tyctw.analyze@gmail.com';
const updatedAt = '2026 年 8 月 4 日';

const ContactLink = ({ subject, children }: { subject: string; children?: React.ReactNode }) => (
  <a className="font-black text-indigo-700 underline underline-offset-4" href={`mailto:${supportEmail}?subject=${encodeURIComponent(subject)}`}>
    {children ?? supportEmail}
  </a>
);

const afterSalesSections: PolicySection[] = [
  { title: '一、適用範圍與服務性質', content: '本說明適用於本網站「小額支持」的付款後協助。小額支持是付款人自願支持網站維護、資料整理與功能改善，並非訂閱、預購、課程、個別諮詢、代辦服務或購買保證錄取、會員資格、專屬功能、實體商品或其他特定對價；付款不會自動續扣。網站提供的落點分析、學校與科系資料及工具僅供使用者自行參考，不構成招生、錄取、升學或其他結果的保證。' },
  { title: '二、我們可協助的事項', content: '我們提供付款狀態查核、重複或錯誤扣款確認、退款與取消申請受理、付款頁操作問題說明，以及網站已公開功能的異常回報與基本排查。若發現公開資料有明顯錯誤，歡迎附上來源資料告知；我們會查核並在合理期間內更正、補充或說明，但不保證所有建議均會採用或在特定時間完成更新。' },
  { title: '三、不屬售後服務的事項', content: '我們不提供個別選校、志願排序、成績解讀、申請策略、代填資料、代為聯絡學校或保證錄取等服務；也無法代替學校、主管機關、銀行、發卡機構、綠界或其他第三方作成決定。招生名額、簡章、校系規定、成績採計與時程，請一律以主管機關及各校最新公告為準。使用者應自行評估並為其填報、申請與升學決定負責。' },
  { title: '四、付款、系統異常與第三方服務', content: '付款由綠界科技 ECPay 及付款人選用的支付機構依其流程處理。付款完成與實際入帳以付款機構及綠界交易紀錄為準；本網站收到付款成功通知後，才視為交易完成。若遇付款失敗、重複扣款、金額不符、銀行端圈存、頁面錯誤、網站暫時無法使用或第三方服務中斷，請保留交易或錯誤畫面後聯繫我們。我們會協助查核；惟第三方的審核、入帳、退刷及系統修復時間仍由其作業規則決定。' },
  { title: '五、聯絡方式與應備資料', content: <>請寄信至 <ContactLink subject="小額支持售後服務" />。付款問題請提供付款人姓名、付款日期時間、金額、付款方式、綠界交易編號或訂單編號及問題說明；功能問題請提供發生時間、操作步驟、裝置／瀏覽器資訊及必要截圖。請勿傳送完整卡號、信用卡安全碼、網銀密碼、一次性驗證碼或其他敏感憑證。</> },
  { title: '六、受理與處理時程', content: '我們原則上於收到完整資料後 3 個工作日內回覆是否已受理。可由本站直接處理的問題，將於合理期間內處理或說明結果；需要向綠界、付款機構或其他第三方查證時，會告知進度。遇天災、資安事件、大量來信、系統異常或其他非本網站可控制的情況，時程可能延長；這不影響付款人依法得主張的權利。' },
  { title: '七、退款、取消與爭議處理', content: <>退款與取消請依「退款與取消政策」提出；該政策明定 7 日內無理由退款、錯誤或重複收款的處理方式及退款時程。若您不同意處理結果，請回覆原信件並提供補充資料，我們將再次檢視；您也可向付款機構、消費者保護機關或其他依法得行使的救濟管道提出申訴或主張權利。</> },
  { title: '八、資料與權益保護', content: '我們僅在確認交易、處理售後、回覆爭議、改善服務及依法保存紀錄的必要範圍內使用資料。信用卡卡號、安全碼及付款帳密由付款頁與支付機構處理，本網站不會要求提供。個人資料的蒐集、利用與權利行使，請參閱隱私權政策。本說明不限制付款人依消費者保護法、民法或其他強制規定享有的權利；如有不一致，以對付款人較有利的強制規定為準。' },
];

const refundSections: PolicySection[] = [
  { title: '一、付款前取消', content: '在尚未完成付款前，您可隨時離開付款頁或停止操作，無須提出申請。若已送出付款但頁面顯示失敗、取消或逾期，請勿重複付款；請先以付款機構通知及交易編號確認，或來信請我們協助查核。' },
  { title: '二、7 日內改變心意的退款', content: '本網站提供較友善的退款安排：自付款成功次日起算 7 日內，付款人可不附理由申請取消並全額退款。請以電子郵件明確提出申請；以寄信時間為準。這項安排不影響、也不排除付款人依消費者保護法、民法或其他強制規定享有的任何權利。' },
  { title: '三、7 日後的退款申請', content: '超過前述期間仍可提出申請，我們會依實際交易、款項是否已完成退款、是否已有重複或錯誤扣款及付款方式的可退款機制個案處理；並於回覆中說明結果與理由。除法律另有規定、重複扣款、錯誤收款、未授權交易或本網站可歸責的情形外，超過 7 日的自願支持不保證退款。' },
  { title: '四、必定優先處理的情形', content: '如有重複扣款、金額或訂單錯誤、未收到應有的退款，或付款人主張交易並非本人授權，請立即聯絡我們。我們會優先查核；確認屬重複或錯誤收款時，將全額退款。涉及未授權交易時，為避免擴大損失，請同時立即向發卡銀行、支付機構或綠界依其程序申報；我們會在合法且必要的範圍內配合查證。' },
  { title: '五、申請方式與核驗', content: <>請寄信至 <ContactLink subject="申請退款或取消支持" />，主旨可寫「申請退款或取消支持」。請附付款人姓名、付款日期時間、金額、付款方式、綠界交易編號或訂單編號與申請原因；若主張法定解除權，請明確表示「解除契約」。為防止冒用，我們可能要求補充可合理確認交易的資料，但不會要求完整卡號或信用卡安全碼。</> },
  { title: '六、退款方式、費用與爭議', content: '原則上退款至原付款方式，不以現金或轉帳替代；原付款方式無法退款時，將先與付款人確認合法、安全的替代方式。因本網站重複或錯誤收款所生的合理退款費用，由本網站負擔。若對處理結果有疑義，請回覆原申請信件補充資料；不影響您向付款機構、消費者保護機關或依法得行使的救濟管道提出申訴或主張權利。' },
];

export default function SupportPolicyPage({ kind }: { kind: PolicyKind }) {
  const isRefund = kind === 'refund-cancellation';
  const title = isRefund ? '退款與取消政策' : '售後服務說明';
  const Icon = isRefund ? ShieldCheck : HeartHandshake;
  const sections = isRefund ? refundSections : afterSalesSections;

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <section className={isRefund ? 'border-b-4 border-slate-900 bg-amber-50' : 'border-b-4 border-slate-900 bg-indigo-50'}><div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <a href={withBasePath('/support')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#0f172a]"><ArrowLeft className="h-4 w-4" />返回小額支持</a>
      <div className="py-12"><div className="inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0_#0f172a]"><Icon className={isRefund ? 'h-6 w-6 text-amber-700' : 'h-6 w-6 text-indigo-700'} /><span className="text-xs font-black tracking-widest text-slate-500">SUPPORT POLICY</span></div><h1 className="mt-5 text-4xl font-black sm:text-5xl">{title}</h1><p className="mt-4 max-w-3xl text-base font-bold leading-8 text-slate-700">最後更新：{updatedAt}。請於付款前閱讀；付款後的協助、取消與退款依本政策辦理。</p></div>
    </div></section>
    <section className="mx-auto max-w-5xl space-y-5 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border-2 border-sky-700 bg-sky-50 p-5 text-sm font-bold leading-7 text-slate-700"><div className="flex gap-2"><BadgeInfo className="mt-1 h-5 w-5 shrink-0 text-sky-700" /><p>本政策的目的在於清楚說明處理方式，不限制法律賦予付款人的權利。若本政策、付款頁或個別約定與適用的強制規定不一致，以對付款人較有利的強制規定為準。</p></div></section>
      {sections.map((section, index) => <article key={section.title} className="rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#0f172a] sm:p-8"><div className="flex gap-3"><span className={isRefund ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-amber-200 font-black' : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-indigo-200 font-black'}>{index + 1}</span><div><h2 className="text-2xl font-black">{section.title}</h2><div className="mt-3 text-base font-bold leading-8 text-slate-700">{section.content}</div></div></div></article>)}
      <section className="rounded-2xl border-4 border-slate-900 bg-slate-900 p-6 text-white shadow-[5px_5px_0_#f59e0b]"><CreditCard className="h-6 w-6 text-amber-300" /><h2 className="mt-3 text-xl font-black">聯絡我們</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-300">請以交易編號及必要資料來信，避免在公開留言或信件中傳送敏感付款資訊。</p><div className="mt-4 flex flex-wrap gap-4"><a href={`mailto:${supportEmail}`} className="inline-flex items-center gap-2 font-black text-amber-300 underline underline-offset-4"><Mail className="h-4 w-4" />{supportEmail}</a><a href="https://www.ecpay.com.tw/" target="_blank" rel="noreferrer" className="font-black text-amber-300 underline underline-offset-4">綠界科技 ECPay</a><a href={withBasePath('/terms')} className="font-black text-amber-300 underline underline-offset-4">服務條款</a></div></section>
      <section className="rounded-2xl border-2 border-slate-300 bg-white p-5 text-sm font-bold leading-7 text-slate-600"><FileText className="mb-2 h-5 w-5 text-slate-700" />本政策僅說明小額支持的付款、取消與退款處理方式；個人資料處理請參閱隱私權政策。</section>
    </section>
  </main>;
}
