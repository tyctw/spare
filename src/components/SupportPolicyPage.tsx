import React from 'react';
import { ArrowLeft, BadgeInfo, CreditCard, FileText, HeartHandshake, Mail, ShieldCheck } from 'lucide-react';
import { withBasePath } from '../lib/routes';

type PolicyKind = 'after-sales' | 'refund-cancellation';
type PolicySection = { title: string; content: React.ReactNode };

const supportEmail = 'tyctw.analyze@gmail.com';
const updatedAt = '2026 年 8 月 4 日';

const sharedNotice = (
  <section className="rounded-2xl border-2 border-sky-700 bg-sky-50 p-5 text-sm font-bold leading-7 text-slate-700">
    <div className="flex gap-2">
      <BadgeInfo className="mt-1 h-5 w-5 shrink-0 text-sky-700" />
      <p>本網站的小額支持用於維護免費的升學資訊與工具，不是保證錄取、個別升學諮詢或可兌換商品。付款前請確認支持金額與本政策；本頁不會以任何約定排除或限制法律賦予消費者的權利。</p>
    </div>
  </section>
);

const afterSalesSections: PolicySection[] = [
  {
    title: '服務內容與適用範圍',
    content: '小額支持完成後，使用者仍可使用網站當時公開提供的免費功能。支持款項主要用於資料校對、功能維護與營運，不包含保證錄取、保證分發結果、個別顧問服務或專屬數位商品。網站的升學資訊僅供參考，實際資格、分發與公告仍應以主管機關及招生簡章為準。',
  },
  {
    title: '聯絡與案件處理',
    content: <>如有付款狀態、重複扣款、退款、取消或網站功能問題，請寄信至 <a className="font-black text-indigo-700 underline underline-offset-4" href={`mailto:${supportEmail}?subject=%E5%B0%8F%E9%A1%8D%E6%94%AF%E6%8C%81%E5%95%8F%E9%A1%8C`}>{supportEmail}</a>。請提供付款日期、金額、付款方式、綠界交易編號或訂單編號，以及問題說明；請勿在電子郵件中提供完整卡號、信用卡安全碼、網銀密碼或其他敏感付款資訊。我們會先確認交易與身分，再以電子郵件回覆處理進度。</>,
  },
  {
    title: '錯誤付款與重複扣款',
    content: '若發現重複扣款、金額錯誤或未收到付款結果，請先保留付款畫面或通知信，並儘速聯絡我們。經核對確有重複或錯誤收款時，將依原付款方式可辦理的機制處理退款；若原付款方式無法直接退款，會另行與付款人確認可行的退款方式。',
  },
  {
    title: '付款服務與資料安全',
    content: <>本網站使用綠界科技 ECPay 處理付款。實際可用付款方式、付款頁面、交易驗證與付款紀錄，以綠界付款頁及付款機構的作業結果為準。綠界是付款服務提供者；支持內容、售後與退款申請仍由本網站營運者受理。請只在綠界付款頁輸入付款資料，並留意網址與付款通知是否正確。</>,
  },
];

const refundSections: PolicySection[] = [
  {
    title: '付款前取消',
    content: '尚未完成付款前，您可直接離開付款頁或取消付款，不會成立付款交易。若付款頁已送出但交易結果尚未明確，請勿重複付款；可先確認綠界付款結果或聯絡我們協助查詢。',
  },
  {
    title: '退款與解除契約權利',
    content: '通訊交易消費者依法原則上得於接受服務後 7 日內，以書面通知方式解除契約；本政策不排除法律上適用的解除權。若您主張依法解除契約，請在期間內以電子郵件通知我們，並提供可辨識交易的資料。若日後提供依法得排除 7 日解除權的數位內容或一經提供即完成的線上服務，我們會在付款前依規定清楚揭露、取得必要同意後才適用例外；未符合例外要件者，不以本政策排除消費者權利。',
  },
  {
    title: '如何申請退款或取消',
    content: <>請寄信至 <a className="font-black text-amber-800 underline underline-offset-4" href={`mailto:${supportEmail}?subject=%E7%94%B3%E8%AB%8B%E9%80%80%E6%AC%BE%E6%88%96%E5%8F%96%E6%B6%88%E6%94%AF%E6%8C%81`}>{supportEmail}</a>，信件主旨可寫「申請退款或取消支持」。請附上付款人姓名、付款日期、金額、付款方式、綠界交易編號或訂單編號及申請原因。為避免冒用，我們可能要求補充交易確認資料；這不影響您依法行使解除權。請勿寄送完整卡號或安全碼。</>,
  },
  {
    title: '退款方式與作業時間',
    content: '退款核准後，信用卡付款原則上會透過綠界辦理原卡退刷；實際入帳時間受發卡銀行作業影響，綠界說明信用卡退刷通常約需 7 至 10 個工作天，個案可能更久。ATM 虛擬帳號、超商代碼／條碼等未支援自動退款的付款方式，將由我們與付款人確認退款資料及方式後辦理。依法解除契約時，將依消費者保護法規定期限返還已支付對價；非屬法定解除而同意退款的案件，也會在核准時告知預計處理方式與時間。',
  },
  {
    title: '退款金額、爭議與付款機構',
    content: '經確認應退款的款項，原則上退還實收支持金額；依法解除契約時不另向消費者收取退款處理費。若您已向發卡銀行或付款機構提出爭議款，請同步告知我們，以避免重複退款。因銀行、發卡機構或綠界的驗證、風險控管與結算流程所致的處理時間，仍以各付款機構實際作業為準。',
  },
];

export default function SupportPolicyPage({ kind }: { kind: PolicyKind }) {
  const isRefund = kind === 'refund-cancellation';
  const title = isRefund ? '退款與取消政策' : '售後服務';
  const Icon = isRefund ? ShieldCheck : HeartHandshake;
  const sections = isRefund ? refundSections : afterSalesSections;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className={isRefund ? 'border-b-4 border-slate-900 bg-amber-50' : 'border-b-4 border-slate-900 bg-indigo-50'}>
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <a href={withBasePath('/support')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition hover:bg-slate-100"><ArrowLeft className="h-4 w-4" />回到小額支持</a>
          <div className="py-12">
            <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><Icon className={isRefund ? 'h-6 w-6 text-amber-700' : 'h-6 w-6 text-indigo-700'} /><span className="text-xs font-black tracking-widest text-slate-500">SUPPORT POLICY</span></div>
            <h1 className="mt-5 text-4xl font-black sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-base font-bold leading-8 text-slate-700">最後更新：{updatedAt}。付款前請詳閱本頁內容。</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-5 px-4 py-10 sm:px-6 lg:px-8">
        {sharedNotice}
        {sections.map((section, index) => (
          <article key={section.title} className="rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-8">
            <div className="flex gap-3">
              <span className={isRefund ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-amber-200 font-black' : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-indigo-200 font-black'}>{index + 1}</span>
              <div><h2 className="text-2xl font-black">{section.title}</h2><div className="mt-3 text-base font-bold leading-8 text-slate-700">{section.content}</div></div>
            </div>
          </article>
        ))}

        <section className="rounded-2xl border-4 border-slate-900 bg-slate-900 p-6 text-white shadow-[5px_5px_0px_0px_rgba(245,158,11,1)]">
          <CreditCard className="h-6 w-6 text-amber-300" />
          <h2 className="mt-3 text-xl font-black">收款與法定揭露</h2>
          <p className="mt-2 text-sm font-bold leading-7 text-slate-300">付款服務由綠界科技股份有限公司（ECPay）提供。本網站營運者應在結帳頁與本頁揭露實際收款主體名稱、統一編號（如適用）、營業／聯絡地址、聯絡方式及發票資訊；目前可用的客服信箱為 {supportEmail}。付款前顯示的收款人、金額與付款方式，應以綠界付款頁為準。</p>
          <div className="mt-4 flex flex-wrap gap-4"><a href={`mailto:${supportEmail}`} className="inline-flex items-center gap-2 font-black text-amber-300 underline underline-offset-4"><Mail className="h-4 w-4" />聯絡我們</a><a href="https://www.ecpay.com.tw/" target="_blank" rel="noreferrer" className="font-black text-amber-300 underline underline-offset-4">綠界科技 ECPay</a><a href={withBasePath('/terms')} className="font-black text-amber-300 underline underline-offset-4">網站服務條款</a></div>
        </section>

        <section className="rounded-2xl border-2 border-slate-300 bg-white p-5 text-sm font-bold leading-7 text-slate-600"><FileText className="mb-2 h-5 w-5 text-slate-700" />本頁以中華民國法令為準據。若本政策與強制或較有利於消費者的法律規定不一致，依該法律規定辦理。</section>
      </section>
    </main>
  );
}
