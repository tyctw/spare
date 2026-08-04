import React from 'react';
import { ArrowLeft, Database, Mail, Shield } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageNavigation, { pageNavigationAsideClassName } from './PageNavigation';

type LegalPageKind = 'privacy' | 'terms';
type LegalSection = { title: string; body: string[] };
type LegalPageContent = {
  title: string;
  eyebrow: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  sections: LegalSection[];
};

const updatedAt = '2026 年 8 月 4 日';
const contactEmail = 'tyctw.analyze@gmail.com';
// 請在正式營運前填妥下列資訊；以電子商務方式收款時，應揭露可有效聯絡的營運者資料。
const operatorName = '本網站營運者';
const operatorAddress = '請以電子郵件聯絡取得營運者聯絡地址';

const pages: Record<LegalPageKind, LegalPageContent> = {
  privacy: {
    title: '隱私權政策',
    eyebrow: 'PRIVACY POLICY',
    description: '本政策說明「全國會考落點分析」如何蒐集、處理、利用與保護您提供或使用服務時產生的資料。若您不同意本政策，請停止使用本服務。',
    icon: Database,
    sections: [
      {
        title: '一、資料管理者、適用範圍與聯絡方式',
        body: [
          `資料管理者為${operatorName}。本政策適用於本網站的落點分析、學校與科系查詢、模擬志願、資料匯出、評分、問題回報、小額支持與相關頁面。營運者聯絡地址：${operatorAddress}；隱私或個資相關問題請寄至 ${contactEmail}。`,
          '本網站連結至教育主管機關、學校、綠界科技或其他第三方網站時，您離開本站後，該第三方將依其自身政策處理資料；本網站不控制第三方的資料處理做法。',
        ],
      },
      {
        title: '二、蒐集的資料類別',
        body: [
          '為提供分析與志願規劃功能，我們可能處理您自行輸入的就學區、會考成績、偏好、志願排序、搜尋條件及匯出設定。請勿輸入姓名、身分證字號、准考證號、住址、電話、金融帳號或其他與功能無關的敏感資料。',
          '為維持服務安全與排除故障，我們可能處理必要的技術資料，例如瀏覽器或裝置類型、IP 位址、請求時間、錯誤與操作紀錄。當您評分、回報問題或來信聯絡時，我們也會處理您主動提供的內容與聯絡資訊。',
          '進行小額支持時，本站會保存訂單識別碼、金額、付款狀態、付款方式與綠界回傳的必要交易資訊；信用卡卡號、驗證碼及其他付款憑證由綠界科技付款頁處理，本站不直接蒐集或保存。',
        ],
      },
      {
        title: '三、蒐集目的、處理方式與保存期間',
        body: [
          '資料僅在提供分析、志願規劃、客服、錯誤排除、服務安全、防止濫用、付款核對、法令遵循及改善服務所必要的範圍內使用，不會出售您的個人資料，也不會為與前述目的無關的行銷而任意利用。',
          '分析結果、部分設定與付款返回狀態可能儲存在您的瀏覽器 Local Storage 或 Session Storage；您可透過瀏覽器設定清除。清除後，部分功能偏好、暫存結果或登入／邀請驗證狀態可能無法保留。',
          '伺服器端資料將依蒐集目的所需期間、爭議處理需要及適用法令的保存義務保存；目的消失、保存期限屆滿或您依法請求時，將依法律及技術可行性辦理刪除、停止處理或去識別化。',
        ],
      },
      {
        title: '四、資料接收者與委外服務',
        body: [
          '為提供服務，我們使用 Supabase 的資料庫與雲端功能處理網站所需資料；其僅在提供基礎設施、資安與維運所必要的範圍內處理資料。若您使用小額支持，綠界科技 ECPay 會依其付款流程處理付款資訊與交易驗證。',
          '在法律要求、主管機關合法命令、權利保護、資安事件處理或防止詐欺與濫用所必要時，我們可能依法提供必要資料。除上述情形外，未經您同意不會向第三人揭露可識別您的個人資料。',
        ],
      },
      {
        title: '五、Cookie 與瀏覽器儲存',
        body: [
          '本站以必要的瀏覽器儲存功能維持免責聲明閱讀狀態、邀請驗證快取、評分狀態、分析暫存結果與付款返回識別。本站目前不以本站自建 Cookie 進行跨網站廣告追蹤。',
          '您可在瀏覽器中拒絕 Cookie、限制網站儲存或清除網站資料；但這可能影響部分互動功能。第三方付款頁或外部網站使用的 Cookie，依其各自政策辦理。',
        ],
      },
      {
        title: '六、資料安全與您的權利',
        body: [
          '我們採取合理的技術與管理措施保護資料，包括傳輸加密、存取控制及權限管理；但網際網路傳輸或儲存無法保證絕對安全。如發生可能危及個人資料的事件，將依適用法令採取必要處理。',
          `依個人資料保護法及其他適用法令，您得就自己的資料請求查詢或閱覽、製給複製本、補充或更正、停止蒐集／處理／利用及刪除。請以 ${contactEmail} 提出申請並提供足以核對身分與請求內容的必要資訊；我們會依法處理，法律另有保存義務或拒絕事由者不在此限。`,
        ],
      },
      {
        title: '七、未成年人與政策更新',
        body: [
          '未滿十八歲者，請在法定代理人或監護人理解本政策的情況下使用服務或進行支持。若法定代理人認為未成年人不當提供資料，請與我們聯絡。',
          '我們可能因功能、法令或資料處理方式調整而更新本政策，更新內容將公布於本頁並變更最後更新日。重大變更時，會以網站上合理顯著的方式通知；更新後繼續使用服務，表示您在法律允許範圍內同意更新內容。',
        ],
      },
    ],
  },
  terms: {
    title: '服務條款',
    eyebrow: 'TERMS OF SERVICE',
    description: '本條款規範您使用「全國會考落點分析」服務的權利與責任。開始或繼續使用服務前，請閱讀本條款、隱私權政策、免責聲明及小額支持相關政策。',
    icon: Shield,
    sections: [
      {
        title: '一、服務定位與條款同意',
        body: [
          '本站提供升學資訊整理、校科查詢、落點分析、志願規劃與討論輔助工具，不是政府機關、招生委員會、學校或正式報名、分發系統，也不提供保證錄取、資格審查或個別升學諮詢。',
          '使用服務即表示您同意遵守本條款及本站公布的隱私權政策、免責聲明與其他適用規則。若您不同意，請停止使用；未滿十八歲者，應由法定代理人或監護人閱讀並同意後使用。',
        ],
      },
      {
        title: '二、資訊來源、分析限制與使用者責任',
        body: [
          '本站會盡力整理公開資訊與提供工具，但招生名額、比序、資格、日程、學校與科系資料可能隨年度或公告而變更。所有分析、排序、分數區間與建議僅供參考，最終應以當學年度官方簡章、招生區公告及目標學校資訊為準。',
          '您應自行確認輸入資料是否正確，並在正式報名或選填前核對官方規則。因輸入錯誤、官方規則變更、第三方服務中斷、網路環境、不可抗力或依參考資訊自行作成決定所生結果，應由您依適用法律與實際情況處理。',
        ],
      },
      {
        title: '三、合理使用與禁止行為',
        body: [
          '您可為個人、家庭、教育輔導或非營利討論目的使用本站功能。除法律允許或取得書面同意外，不得大量擷取、爬取、重製、散布、出售、出租、反向工程、干擾服務、規避限制、冒用他人身分或將本站資料包裝為自己的付費服務。',
          '不得輸入、上傳、傳送或散布違法、侵害他人權利、含惡意程式、具騷擾或歧視性，或可能危害系統安全的內容。若發現合理懷疑的濫用或資安風險，本站得在必要範圍內暫停、限制或終止相關使用，並依法保留權利。',
        ],
      },
      {
        title: '四、帳號、邀請碼與使用者內容',
        body: [
          '若功能提供邀請碼、快取驗證或其他存取機制，您應自行保管，不得轉售、破解、共用以規避限制或用於未經授權目的。您應對透過自己裝置或憑證進行的使用負責。',
          '您透過評分、問題回報或客服提供的意見，仍由您保有原有權利；您同意本站得在改善、維運與回覆服務所必要的範圍內使用該內容。請勿提交機密、未經授權或含他人個資的資料。',
        ],
      },
      {
        title: '五、智慧財產權與第三方連結',
        body: [
          '本站的程式、版面、商標、設計、文字與資料編排受相關法律保護；官方公開資料、學校資訊及第三方商標仍各自屬其權利人。您不得移除權利標示或主張對本站內容擁有權利。',
          '本站可能連結教育主管機關、學校、綠界科技或其他第三方網站。第三方網站的內容、可用性、交易、資安與資料處理由各自營運者負責；使用前請自行閱讀其條款與政策。',
        ],
      },
      {
        title: '六、小額支持、付款與消費者權益',
        body: [
          '小額支持為自願性支持網站維運，不代表購買保證錄取、個別諮詢、實體商品或特定優先服務。付款由綠界科技 ECPay 依其流程處理；付款成功與否及可用方式以綠界付款頁與交易結果為準。',
          `售後、取消與退款申請請依「售後服務」及「退款與取消政策」辦理，或寄至 ${contactEmail}。本條款與相關政策不排除或限制消費者依消費者保護法及其他強制規定享有的權利；如有不一致，依對消費者較有利的強制規定處理。`,
        ],
      },
      {
        title: '七、服務變更、責任限制與終止',
        body: [
          '本站可能為維護、資安、法令遵循或功能改善而修改、暫停或停止全部或部分服務，並會在合理可行情況下公告。本站不保證服務永不中斷、所有資料永遠完整或分析結果必然符合實際招生結果。',
          '在法律允許的最大範圍內，本站對因使用或無法使用免費資訊工具所生的間接、附帶或衍生損害不負責任；但因故意或重大過失、依法不得排除的責任，或消費者保護相關強制規定所生責任，不受此限制。',
        ],
      },
      {
        title: '八、準據法、爭議處理與條款更新',
        body: [
          `本條款以中華民國法律為準據法。若發生爭議，請先寄至 ${contactEmail} 聯絡處理；如無法協議，雙方得依適用法令向有管轄權的法院或主管機關尋求救濟。`,
          '我們可能因法令、服務或功能調整而更新本條款，更新內容將公布於本頁並標示最後更新日。若條款部分無效，不影響其餘部分效力；任何不得依法限制的消費者權利，仍依適用法律辦理。',
        ],
      },
    ],
  },
};

export default function LegalPage({ kind }: { kind: LegalPageKind }) {
  const page = pages[kind];
  const Icon = page.icon;
  const isPrivacy = kind === 'privacy';
  const colors = isPrivacy
    ? { hero: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconText: 'text-emerald-700', panel: 'bg-emerald-50' }
    : { hero: 'bg-indigo-50', iconBg: 'bg-indigo-100', iconText: 'text-indigo-700', panel: 'bg-indigo-50' };
  const alternateHref = isPrivacy ? withBasePath('/terms') : withBasePath('/privacy');
  const alternateText = isPrivacy ? '查看服務條款' : '查看隱私權政策';

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <section className={`border-b-4 border-slate-900 ${colors.hero}`}>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5"><ArrowLeft className="h-4 w-4" />返回首頁</a>
        <div className="py-10"><div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0_#0f172a]"><div className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 ${colors.iconBg}`}><Icon className={`h-6 w-6 ${colors.iconText}`} /></div><div><p className="text-xs font-black tracking-widest text-slate-500">{page.eyebrow}</p><p className="text-sm font-black text-slate-700">最後更新：{updatedAt}</p></div></div><h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{page.title}</h1><p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">{page.description}</p></div>
      </div>
    </section>
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className={pageNavigationAsideClassName}><PageNavigation navClassName="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0_#0f172a]" itemLayoutClassName="space-y-2" items={page.sections.map((section, index) => ({ id: `section-${index + 1}`, label: section.title.replace(/^[一二三四五六七八]、/, ''), className: 'block rounded-xl' }))} /></aside>
      <div className="space-y-5">
        {page.sections.map((section, index) => <article key={section.title} id={`section-${index + 1}`} className="scroll-mt-8 rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#0f172a] sm:p-8"><h2 className="text-2xl font-black tracking-tight">{section.title}</h2><div className="mt-4 space-y-4">{section.body.map((paragraph) => <p key={paragraph} className="text-base font-bold leading-8 text-slate-700">{paragraph}</p>)}</div></article>)}
        <section className={`rounded-2xl border-4 border-slate-900 p-5 shadow-[5px_5px_0_#0f172a] ${colors.panel}`}><h2 className="text-xl font-black">需要協助或想了解另一份文件？</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-700">若對本政策或條款有疑問，請先聯絡我們；您也可查看另一份法律文件。</p><div className="mt-4 flex flex-col gap-3 sm:flex-row"><a href={alternateHref} className="inline-flex items-center justify-center rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-sm font-black shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5">{alternateText}</a><a href={`mailto:${contactEmail}`} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5"><Mail className="h-4 w-4" />{contactEmail}</a></div></section>
      </div>
    </section>
  </main>;
}
