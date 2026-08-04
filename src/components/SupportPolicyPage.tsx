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

const sharedNotice = (
  <section className="rounded-2xl border-2 border-sky-700 bg-sky-50 p-5 text-sm font-bold leading-7 text-slate-700">
    <div className="flex gap-2">
      <BadgeInfo className="mt-1 h-5 w-5 shrink-0 text-sky-700" />
      <p>本頁適用於本網站「小額支持」的付款。小額支持是對網站維運的自願支持，不是訂閱、預購、課程、諮詢、保證錄取或其他有對價的商品／服務；付款不會取得會員資格、專屬功能、實體商品或任何升學結果的承諾。若實際交易內容與此說明不同，將依付款頁、個別約定及適用法令中對付款人較有利者辦理。</p>
    </div>
  </section>
);

const afterSalesSections: PolicySection[] = [
  {
    title: '服務範圍與支持結果',
    content: '完成付款後，您支持的是本網站的維護、內容整理與持續改善；網站既有功能仍依當時公開提供的內容使用。小額支持不構成購買個別建議、代辦、諮詢或保證服務，也不保證網站不中斷、資料絕對無誤，或產生特定選校、升學或錄取結果。'
  },
  {
    title: '聯絡方式與應備資料',
    content: <>如有付款狀態、重複扣款、金額錯誤、退款／取消或網站功能問題，請寄信至 <ContactLink subject="小額支持問題" />。請提供付款人姓名、付款日期與時間、金額、付款方式、綠界交易編號或訂單編號，以及問題說明；可附付款畫面或通知信。請勿在信件中提供完整卡號、信用卡安全碼、網銀密碼或其他敏感付款資訊。</>
  },
  {
    title: '處理流程與回覆時間',
    content: '收到申請後，我們會先核對交易紀錄與申請人身分，並以電子郵件說明受理結果、所需補件或處理進度。一般問題將於 5 個工作天內回覆；涉及付款機構查核、退刷或銀行作業者，所需時間可能較長。我們不會要求您透過非官方連結重新付款或提供卡片敏感資料。'
  },
  {
    title: '付款異常與重複扣款',
    content: '若付款頁顯示處理中、未收到結果，請先不要重複付款，並保留畫面與通知。經核對確有重複扣款、錯誤收款或系統異常致未完成支持時，我們會依交易狀況取消、退款或協助向付款機構查詢；退款方式與時間依本政策「退款方式與時間」辦理。'
  },
  {
    title: '付款服務與安全提醒',
    content: <>本網站透過綠界科技 ECPay 提供付款流程；可用付款方式、交易驗證、付款成功與否及付款紀錄，以綠界付款頁與付款機構的作業結果為準。綠界負責金流處理，本網站營運者負責受理本政策的問題與申請。請僅在綠界付款頁輸入付款資料，並確認網址、交易金額與收款內容正確。</>
  },
];

const refundSections: PolicySection[] = [
  {
    title: '付款前取消',
    content: '在尚未完成付款前，您可直接離開付款頁或依付款頁指示取消，不會成立付款交易。若已送出付款但結果尚未明確，請勿重複付款；請先確認綠界付款結果，或來信由我們協助查詢。'
  },
  {
    title: '支持付款的取消與退款原則',
    content: '本網站的小額支持不交付商品，也不提供以付款為條件的數位內容或線上服務。付款完成後，如您改變心意，仍可來信提出取消或退款申請，我們會依交易是否完成、是否有重複或錯誤收款、付款方式的可退款機制及個案情況處理。這項自願支持的退款安排，不限制付款人依消費者保護法、民法或其他強制規定所享有的權利。'
  },
  {
    title: '法定解除權',
    content: '如個案依法屬通訊交易且無合理例外，消費者得依消費者保護法第 19 條，於接受服務後 7 日內以書面通知解除契約，無須說明理由或負擔費用；本網站收到解除服務契約通知後，將依同法第 19 條之 2 辦理返還已支付對價。若交易依法不屬消費關係或通訊交易，或有法定合理例外，是否適用上述解除權應依個案及法令認定。本網站不以本政策排除或限制依法不得排除的權利。'
  },
  {
    title: '如何申請',
    content: <>請寄信至 <ContactLink subject="申請退款或取消支持">{supportEmail}</ContactLink>，主旨可寫「申請退款或取消支持」。請附付款人姓名、付款日期與時間、金額、付款方式、綠界交易編號或訂單編號及申請原因；如主張法定解除權，請在信中明確表示解除契約。為防止冒用，我們可能請您補充交易確認資料，但不會要求完整卡號或安全碼。</>
  },
  {
    title: '退款金額、方式與時間',
    content: '經確認應退款時，原則上返還已實收且應退的支持金額；依法解除契約時，不另收取退款處理費。信用卡／Apple Pay 交易原則上透過原卡退刷；綠界完成退刷後，銀行入帳時間仍受發卡行作業影響，通常可於 7 至 10 個工作天後向發卡行查詢，個案可能更久。ATM 虛擬帳號、超商代碼／條碼等未支援自動退款的方式，將與付款人確認必要的退款資料及安全可行的退款方式。依法解除的案件，將依消費者保護法規定期限返還款項；其他核准退款案件，我們會在回覆中告知預計方式與時間。'
  },
  {
    title: '爭議款與外部申訴',
    content: <>如您已向發卡銀行、綠界或其他付款機構提出爭議款／拒付，請同步通知我們，以避免重複退款並利於查核。若雙方無法協調，您可向所在地消費者服務中心、地方政府消費者保護官或其他有管轄權機關申訴；您依法可行使的其他權利不受影響。</>
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
          <a href={withBasePath('/support')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition hover:bg-slate-100"><ArrowLeft className="h-4 w-4" />返回小額支持</a>
          <div className="py-12">
            <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><Icon className={isRefund ? 'h-6 w-6 text-amber-700' : 'h-6 w-6 text-indigo-700'} /><span className="text-xs font-black tracking-widest text-slate-500">SUPPORT POLICY</span></div>
            <h1 className="mt-5 text-4xl font-black sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-3xl text-base font-bold leading-8 text-slate-700">最後更新：{updatedAt}。請在付款前完整閱讀；本政策可供儲存與查閱。</p>
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
          <h2 className="mt-3 text-xl font-black">付款與退款聯絡窗口</h2>
          <p className="mt-2 text-sm font-bold leading-7 text-slate-300">付款、取消、退款或交易爭議，請先以電子郵件聯絡本網站營運者。我們會以交易紀錄核對處理；綠界付款頁與付款機構的結果，則以其實際作業為準。</p>
          <div className="mt-4 flex flex-wrap gap-4"><a href={`mailto:${supportEmail}`} className="inline-flex items-center gap-2 font-black text-amber-300 underline underline-offset-4"><Mail className="h-4 w-4" />{supportEmail}</a><a href="https://www.ecpay.com.tw/" target="_blank" rel="noreferrer" className="font-black text-amber-300 underline underline-offset-4">綠界科技 ECPay</a><a href={withBasePath('/terms')} className="font-black text-amber-300 underline underline-offset-4">服務條款</a></div>
        </section>

        <section className="rounded-2xl border-2 border-slate-300 bg-white p-5 text-sm font-bold leading-7 text-slate-600"><FileText className="mb-2 h-5 w-5 text-slate-700" />本政策僅說明小額支持的付款、取消與退款處理方式；個人資料處理請參閱隱私權政策。若本政策與強制法令不一致，以對付款人較有利的強制規定為準。</section>
      </section>
    </main>
  );
}
