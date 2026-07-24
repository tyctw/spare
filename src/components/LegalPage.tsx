import React from 'react';
import { ArrowLeft, Database, Mail, Shield } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageNavigation, { pageNavigationAsideClassName } from './PageNavigation';

type LegalPageKind = 'privacy' | 'terms';

interface LegalPageProps {
  kind: LegalPageKind;
}

type LegalSection = { title: string; body: string[] };
type LegalPageContent = {
  title: string;
  eyebrow: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  sections: LegalSection[];
};

const updatedAt = '2026 年 7 月 24 日';
const contactEmail = 'tyctw.analyze@gmail.com';

const pages: Record<LegalPageKind, LegalPageContent> = {
  privacy: {
    title: '隱私權政策',
    eyebrow: 'Privacy Policy',
    description: '本政策說明「全國會考落點分析」如何處理您使用網站時提供或產生的資料。請在使用服務前閱讀；若不同意本政策，請停止使用本服務。',
    icon: Database,
    sections: [
      {
        title: '一、適用範圍與資料管理者',
        body: [
          '本政策適用於本網站的落點分析、學校／科系查詢、模擬志願、結果匯出、評分、問題回報及相關功能。資料管理者為本網站營運者；如對資料處理有疑問，請寄信至 tyctw.analyze@gmail.com。',
          '本網站可能提供教育主管機關、學校或其他第三方網站的連結。您離開本網站後，該第三方將依其自己的隱私權政策處理資料，本網站不控制其做法。',
        ],
      },
      {
        title: '二、我們處理的資料',
        body: [
          '為提供分析功能，我們會處理您輸入的會考各科等級、作文級分、就學區、身分／分析類別、學校類型、群科偏好與邀請碼，以及您選用的篩選條件。這些資料用於計算與呈現結果；請勿輸入姓名、身分證字號、准考證號、住址、電話或其他與分析無關的個人資料。',
          '當您評分、回報問題或主動聯絡我們時，我們會處理您提供的評分、回報類型、文字內容及電子郵件。電子郵件僅用於處理或回覆您的問題。',
          '為維護服務、安全與除錯，系統會處理請求時間、操作類型、邀請碼驗證結果、IP 位址、瀏覽器 User-Agent，以及您送出的裝置／瀏覽器資訊（例如語言、螢幕與視窗尺寸、頁面網址）。這些資料不會用來建立跨網站的廣告受眾。',
        ],
      },
      {
        title: '三、處理目的與法律依據',
        body: [
          '我們處理資料，是為了提供您要求的分析、查詢、匯出、回饋與問題回報功能，驗證服務存取資格，防止濫用與攻擊，維護系統安全，以及遵守適用法令或處理爭議。',
          '依中華民國個人資料保護法，處理所需資料的依據包括您使用服務所必要的範圍、您主動提供或同意提供的資料、營運與資安的正當需要，以及法令要求或允許的情形。若您不提供必要資料，部分功能可能無法使用。',
        ],
      },
      {
        title: '四、瀏覽器儲存、Cookie 與網址資料',
        body: [
          '本網站目前使用瀏覽器的 Local Storage 與 Session Storage 保存免責聲明閱讀狀態、邀請碼短期驗證狀態、評分狀態及本次分析結果，讓您在同一瀏覽器中完成流程。分析結果會存於 Session Storage，通常於分頁／瀏覽器工作階段結束後清除；其他項目可由您在瀏覽器清除網站資料。',
          '本網站不主動設置用於跨網站追蹤或個人化廣告的 Cookie。惟瀏覽器、主機服務或您前往的第三方連結，可能依其政策使用 Cookie 或類似技術。請勿將邀請碼放入可公開分享的網址或文件，因網址可能被瀏覽器紀錄、書籤或轉送。',
        ],
      },
      {
        title: '五、資料分享、委託與跨境處理',
        body: [
          '我們不販售您的個人資料，也不會為第三方的行銷目的提供資料。為提供資料庫與後端功能，本網站使用 Supabase 等雲端服務；其僅在提供、維護及保護本服務所需範圍內受託處理資料，並可能在資料中心所在地進行處理或儲存。',
          '我們僅會在下列情形揭露必要資料：取得您的同意、為回覆您或完成您要求的功能、依法令或政府機關合法要求、為保護使用者或服務安全，或為主張、行使或防禦法律權利。',
        ],
      },
      {
        title: '六、保存期間與安全措施',
        body: [
          '我們在達成蒐集目的所必要的期間內保存資料，並依資料性質、系統安全、帳務／爭議處理及法令要求決定保存時間；不再需要時，會刪除、去識別化或採取其他適當處置。安全或濫用紀錄可能在合理必要期間內保存。',
          '我們採取合理的技術與管理措施，例如限制資料庫存取、使用權限控管與記錄必要的安全事件。但網路傳輸與電子儲存無法保證絕對安全；請妥善保護您的裝置與邀請碼。',
        ],
      },
      {
        title: '七、您的個資權利',
        body: [
          '在法令規定的範圍內，您可就您的個人資料請求查詢或閱覽、製給複製本、補充或更正、停止蒐集／處理／利用，及刪除。請以電子郵件提出申請，並說明您要處理的資料、使用的電子郵件或其他足以辨識申請事項的資訊；我們可能在合理範圍內驗證身分。',
          '您可隨時清除瀏覽器中的本站網站資料以移除本機儲存內容。撤回同意或要求刪除，不影響撤回前已合法處理的資料，亦可能使部分功能無法繼續提供。',
        ],
      },
      {
        title: '八、未成年人與政策更新',
        body: [
          '本服務面向學生與一般使用者，不要求提供與升學分析無關的敏感個資。未滿十八歲者，建議在家長、法定代理人或師長知情與協助下使用服務；如發現未成年人提供不必要的個人資料，請聯絡我們。',
          '我們可能因服務、資安或法令變動更新本政策。新版將公布於本頁並更新日期；重大變更將以合理方式提醒。更新後繼續使用服務，表示您同意更新後的政策。',
        ],
      },
    ],
  },
  terms: {
    title: '服務條款',
    eyebrow: 'Terms of Service',
    description: '本條款規範您使用「全國會考落點分析」的權利與責任。使用本服務前請詳閱；您開始或繼續使用服務，即表示同意本條款及隱私權政策。',
    icon: Shield,
    sections: [
      {
        title: '一、服務性質與適用範圍',
        body: [
          '本網站提供會考成績換算、學校與群科資料查詢、落點推估、模擬志願、歷年資料參考、匯出與相關輔助工具（以下合稱「本服務」）。本服務為資訊整理與決策輔助工具，不是招生主管機關、學校或法律／升學顧問的正式決定。',
          '實際招生資格、計分、名額、免試入學規則、志願選填、錄取與報到，均應以當年度招生簡章、主管機關及各校公告為準。使用者應自行確認最新官方資訊。',
        ],
      },
      {
        title: '二、使用資格與邀請碼',
        body: [
          '您應以合法方式使用本服務，並對您輸入的資料及操作負責。若您未成年，建議在家長、法定代理人或師長協助下使用。',
          '部分功能需使用邀請碼。邀請碼僅供授權使用，不得出售、公開散布、轉讓、出租、破解或以自動化方式大量測試。您應妥善保管邀請碼；因您自行分享、外洩或置於公開網址造成的風險，由您自行承擔。',
        ],
      },
      {
        title: '三、使用者義務與禁止行為',
        body: [
          '您不得以任何方式干擾服務、規避存取限制、探測弱點、未經授權存取資料或系統、散布惡意程式、發送大量請求、擷取／爬取資料，或從事其他可能危害服務、使用者或第三人權益的行為。',
          '您不得上傳、輸入或傳送違法、侵權、誹謗、威脅、騷擾、猥褻或不當內容；亦不得冒用他人身分、提供不實資料，或利用本服務進行商業轉售、代客大量查詢或未經授權的衍生服務。',
        ],
      },
      {
        title: '四、資料、結果與匯出內容',
        body: [
          '本服務的資料與推估結果可能因來源更新、簡章規則、資料缺漏、輸入錯誤、系統調整或個別情況而有所差異，並不保證完整、即時、無誤或必然符合實際錄取結果。您應將結果作為參考，並自行判斷與核對。',
          '您可為個人學習、家庭討論或非商業目的使用本服務產生的結果與匯出內容。對於網站程式、介面、資料編排、商標及其他受保護內容，未經權利人書面同意，不得重製、公開傳輸、改作、販售或作商業利用；法令允許者不在此限。',
        ],
      },
      {
        title: '五、第三方服務與外部連結',
        body: [
          '本服務可能連結至官方成績查詢、志願選填或其他第三方網站。這些網站由各自營運者負責，其內容、可用性、資料處理、商品或服務不受本網站控制。您使用第三方服務前應閱讀其條款與隱私權政策。',
        ],
      },
      {
        title: '六、服務調整、暫停與終止',
        body: [
          '我們得因維護、資安、技術、資料更新、法令或營運需求，隨時修改、暫停或終止全部或部分服務，並在合理可行時提供通知。對因網路、設備、第三方服務或不可抗力造成的中斷，我們會合理處理，但不保證服務永不中斷或永遠可用。',
          '如有合理理由認定您違反本條款、危害系統安全、濫用資源或侵害他人權益，我們得不經事前通知限制或停止您使用服務、使邀請碼失效、保存必要紀錄，並採取其他適當措施。',
        ],
      },
      {
        title: '七、責任限制',
        body: [
          '在適用法令允許的最大範圍內，本服務以「現況」及「可提供」基礎提供。除法律不得排除的責任外，我們不對您因依賴分析結果、未核對官方資料、資料或功能中斷、第三方網站、裝置或網路問題所生的間接、附帶、特別、懲罰性或衍生損害負責。',
          '本條款不排除或限制依中華民國強制法規不得排除或限制的責任，包括因故意或重大過失依法應負的責任。',
        ],
      },
      {
        title: '八、條款更新、準據法與聯絡方式',
        body: [
          '我們可能因服務、資安或法令變動修訂本條款；修訂版公布於本頁並更新日期後生效。若您不同意更新內容，請停止使用本服務。',
          '本條款以中華民國法律為準據法。在法律允許的範圍內，因本條款所生爭議以臺灣桃園地方法院為第一審管轄法院。若有問題，請來信 tyctw.analyze@gmail.com。',
        ],
      },
    ],
  },
};

export default function LegalPage({ kind }: LegalPageProps) {
  const page = pages[kind];
  const Icon = page.icon;
  const isPrivacy = kind === 'privacy';
  const colors = isPrivacy
    ? { hero: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' }
    : { hero: 'bg-indigo-50', iconBg: 'bg-indigo-100', iconText: 'text-indigo-600' };
  const alternateHref = isPrivacy ? withBasePath('/terms') : withBasePath('/privacy');
  const alternateText = isPrivacy ? '查看服務條款' : '查看隱私權政策';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className={`border-b-4 border-slate-900 ${colors.hero}`}>
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none">
            <ArrowLeft className="h-4 w-4" />返回首頁
          </a>
          <div className="py-10">
            <div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 ${colors.iconBg}`}><Icon className={`h-6 w-6 ${colors.iconText}`} /></div>
              <div><p className="text-xs font-black uppercase tracking-widest text-slate-500">{page.eyebrow}</p><p className="text-sm font-black text-slate-700">最後更新：{updatedAt}</p></div>
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{page.title}</h1>
            <p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">{page.description}</p>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className={pageNavigationAsideClassName}>
          <PageNavigation navClassName="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]" itemLayoutClassName="space-y-2" items={page.sections.map((section, index) => ({ id: `section-${index + 1}`, label: section.title.replace(/^[一二三四五六七八]、/, ''), className: 'block rounded-xl' }))} />
        </aside>
        <div className="space-y-5">
          {page.sections.map((section, index) => <article key={section.title} id={`section-${index + 1}`} className="scroll-mt-8 rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-8"><h2 className="text-2xl font-black tracking-tight">{section.title}</h2><div className="mt-4 space-y-4">{section.body.map((paragraph) => <p key={paragraph} className="text-base font-bold leading-8 text-slate-700">{paragraph}</p>)}</div></article>)}
          <div className="flex flex-col gap-3 rounded-2xl border-4 border-slate-900 bg-amber-300 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-black">有任何疑問嗎？</h2><p className="mt-1 text-sm font-bold text-slate-800">歡迎來信詢問條款或資料處理事宜。</p></div><div className="flex flex-col gap-3 sm:flex-row"><a href={alternateHref} className="inline-flex items-center justify-center rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none">{alternateText}</a><a href={`mailto:${contactEmail}`} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"><Mail className="h-4 w-4" />{contactEmail}</a></div></div>
        </div>
      </section>
    </main>
  );
}
