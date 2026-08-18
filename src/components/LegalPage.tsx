import React from 'react';
import { ArrowLeft, Database, Mail, Shield } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageNavigation, { pageNavigationAsideClassName } from './PageNavigation';

type LegalPageKind = 'privacy' | 'terms';
type LegalSection = { title: string; body: string[] };
type LegalPageContent = { title: string; eyebrow: string; description: string; icon: React.ComponentType<{ className?: string }>; sections: LegalSection[] };

const contactEmail = 'tyctw.analyze@gmail.com';
const updatedAt = '2026-08-11';

const privacySections: LegalSection[] = [
  { title: '一、隱私權保護政策的適用範圍', body: [
    '本隱私權政策適用於「台灣會考落點分析」網站（以下簡稱「本網站」）所提供的各項服務，包含落點分析、校科搜尋、積分換算、模擬志願、結果匯出與分享、回饋與問題回報、LINE 會員登入及付費免廣告功能等。',
    '本政策旨在說明本網站如何蒐集、處理、利用與保護您的個人資料。當您使用第三方服務（如 LINE 登入、綠界科技 ECPay 付款、Google 服務等）或點擊外部連結時，將適用該第三方服務業者的隱私權政策，本網站不負連帶責任。',
  ] },
  { title: '二、個人資料的蒐集目的與類別', body: [
    '為了提供精準的落點分析與個人化體驗，我們可能會蒐集以下類別的資料：',
    '1. 網站使用資料：當您使用落點分析時，您輸入的就學區、會考成績（等級與標示）、志願偏好、模擬志願序等，主要於您的瀏覽器中進行運算或暫存。',
    '2. 系統與裝置資訊：包含 IP 位址、瀏覽器種類、裝置資訊、頁面停留與互動時間、錯誤日誌等，作為維護系統安全、除錯與優化服務之用。',
    '3. 會員與聯絡資料：若您使用 LINE 登入，我們會取得 LINE 提供之使用者識別碼（User ID）、顯示名稱與頭像網址。若您透過 Email 聯絡我們，我們將留存您的信箱地址與通訊內容。',
    '4. 付款紀錄：若您購買免廣告服務，我們將蒐集必要的訂單編號、交易金額與狀態（不包含完整信用卡號），以利核對帳務與開通權限。',
  ] },
  { title: '三、個人資料的利用期間、地區、對象與方式', body: [
    '1. 期間：您的資料將保留至蒐集目的消失、或您主動要求刪除為止。其中，LINE 短期驗證碼約 60 秒失效，登入工作階段約 15 分鐘失效。若您建立「分享連結」，該唯讀快照資料預設將於建立後 5 天自動過期並刪除。付款紀錄依商業會計法及稅法規定保存。',
    '2. 地區：本網站主機資源（如 GitHub Pages、Supabase）可能位於臺灣境內或境外，資料處理將於前述伺服器所在地進行。',
    '3. 對象與方式：本網站僅在提供服務之必要範圍內，由營運團隊與合作之雲端服務商處理資料。我們絕對不會將您的個人資料出售、出租或任意交換給第三方。',
  ] },
  { title: '四、Cookie 與瀏覽器暫存技術', body: [
    '本網站會使用 Cookie 或類似的瀏覽器儲存技術（如 localStorage、sessionStorage）來記憶您的免責聲明閱讀狀態、介面偏好、以及維持分析工作階段。這能省去您重複輸入資料的麻煩。',
    '我們同時載入 Google Analytics 與 Google 廣告（非會員狀態下），其可能會透過 Cookie 收集您的瀏覽行為以提供個人化內容。您可隨時透過瀏覽器設定阻擋或清除 Cookie，但這可能導致本網站部分功能無法正常運作或失去您的暫存進度。',
  ] },
  { title: '五、第三方服務商之資料處理', body: [
    '為了維持服務穩定與功能完整，本網站採用多項第三方服務：',
    '1. LINE 登入：僅做為身分驗證，登出本網站不會影響您的 LINE App 狀態。',
    '2. 綠界科技（ECPay）：處理金流與付款驗證，我們不會經手亦不保存您的完整金融卡片資訊。',
    '3. 雲端後台與分析：使用 Supabase 提供後端與資料庫服務；使用 Google 提供字型、網站分析與廣告聯播網服務。這些服務商皆具備嚴格的資安標準，並依其隱私權條款妥善保護資料。',
  ] },
  { title: '六、資料的安全保護措施', body: [
    '我們致力於保護您的資料安全。網站全面採用 HTTPS 加密傳輸，並搭配短效期憑證與嚴格的後端權限控制（RLS）來防止未經授權的存取。然而，網際網路傳輸無法保證百分之百安全，請妥善保管您的裝置，並避免在公開場合輸入敏感資訊。',
  ] },
  { title: '七、分享與匯出功能規範', body: [
    '當您使用本網站的「分享連結」或匯出功能時，系統會為您的成績與志願清單建立一份唯讀快照，並產生專屬連結。任何持有該連結的人皆可查看該內容。請在分享前自行確認內容不包含不願公開的隱私資訊。本網站無法控制他人如何轉傳或截圖您的分享連結。',
  ] },
  { title: '八、您的個人資料權利', body: [
    '依據中華民國《個人資料保護法》第三條規定，您得就我們所蒐集之您的個人資料，行使下列權利：',
    '1. 查詢、請求閱覽或請求製給複製本。',
    '2. 請求補充或更正。',
    '3. 請求停止蒐集、處理或利用。',
    '4. 請求刪除。',
    '如欲行使上述權利，請透過客服信箱 tyctw.analyze@gmail.com 與我們聯絡。為保障安全，我們可能會要求您提供足以確認身分之資訊，並依法於合理期間內處理您的請求。',
  ] },
  { title: '九、未成年人隱私保護', body: [
    '本網站服務對象包含國中學生。若您為未滿十八歲之未成年人，請在父母或法定代理人了解並同意本隱私權政策後，再行使用本網站之服務（尤其是涉及付款或提供個人資料之功能）。如我們發現未經同意蒐集了未成年人之敏感個資，我們將會採取適當措施予以刪除。',
  ] },
  { title: '十、隱私權政策之修訂', body: [
    '本網站保留隨時修改本隱私權政策的權利。當政策有重大變更時，我們將於網站顯著位置公告或更新本頁面的「最後更新日期」。繼續使用本網站即代表您同意接受修訂後之隱私權政策。',
  ] },
];

const termsSections: LegalSection[] = [
  { title: '一、認知與接受條款', body: [
    '歡迎使用「台灣會考落點分析」網站（以下簡稱「本網站」）。當您開始瀏覽、存取或使用本網站的任何功能（包含但不限於落點分析、志願模擬、LINE 登入與付費服務）時，即表示您已充分閱讀、瞭解並同意遵守本《服務條款》及《隱私權政策》。',
    '若您為未滿十八歲之未成年人，請務必在父母或法定代理人的陪同與同意下閱讀本條款並使用本網站服務。如果您不同意本條款之任何內容，請立即停止使用本網站。',
  ] },
  { title: '二、服務性質與免責聲明', body: [
    '1. 本網站為民間開發之升學資訊輔助工具，並非政府機關、各地區免試入學委員會或各級學校的官方系統。',
    '2. 網站提供的會考積分換算、落點區間分析、校科資訊及志願排序建議，皆基於歷史數據、公開簡章與演算法推估。分析結果「僅供參考」，絕不構成任何學校的錄取保證。',
    '3. 實際招生名額、超額比序規則及錄取標準，請務必以「當年度各就學區免試入學委員會之官方簡章」及「正式志願選填系統」為最終依據。',
    '4. 本網站對於使用者因依賴本網站資訊而做出的任何報名、就學或生涯決定，概不負任何法律或賠償責任。',
  ] },
  { title: '三、使用者行為與義務', body: [
    '您承諾絕不為任何非法目的或以任何非法方式使用本網站，並承諾遵守中華民國相關法規及一切使用網際網路之國際慣例。您同意並保證不得利用本網站從事下列行為：',
    '1. 冒用他人身分登入或使用本網站服務。',
    '2. 透過系統漏洞、機器人、爬蟲程式或其他自動化方式，未經授權擷取或干擾本網站之資料與運作。',
    '3. 散布電腦病毒、上傳惡意內容或對本網站進行反向工程。',
    '4. 利用本網站各項功能（如分享連結）散布虛偽不實、侵害他人隱私或違反公序良俗之內容。',
  ] },
  { title: '四、會員帳號與 LINE 登入規範', body: [
    '1. 本網站提供 LINE 帳號登入功能以便識別會員身分。登入授權僅限於本網站之驗證，本網站不會取得您的 LINE 密碼，亦不會未經同意代您發送 LINE 訊息。',
    '2. 您有責任妥善保管您的裝置與 LINE 帳號。任何經由您的 LINE 帳號登入本網站所進行的行為，均將視為您本人的行為。',
    '3. 在本網站點擊「登出」，僅會中斷您在本網站的工作階段，不會影響您在手機或電腦上 LINE App 的登入狀態。',
  ] },
  { title: '五、付費方案、會員權益與退款政策', body: [
    '1. 本網站提供「免廣告會員」付費方案（包含月費 NT$49 與年費 NT$399 兩種選擇），方案皆為一次性買斷，不會自動續約扣款。',
    '2. 付費交易由第三方金流服務「綠界科技 ECPay」處理。當綠界科技確認付款成功後，系統將自動為您綁定的 LINE 帳號開通免廣告權限。',
    '3. 免廣告權益僅在會員有效期間內生效，旨在移除本網站所控制的第三方廣告。部分因瀏覽器快取或非本站可控範圍的版位異常不在此限。',
    '4. 退款與取消規定：若發生重複扣款或服務嚴重異常，請保留訂單編號並聯絡客服處理。詳細之法定解除權與退費規範，請參照本站獨立之《退款與取消政策》。',
  ] },
  { title: '六、資料分享與智慧財產權', body: [
    '1. 當您使用「分享連結」功能匯出您的模擬志願或成績快照時，該連結為公開可讀狀態（預設 5 天後失效）。請勿在分享內容中備註任何私人敏感資訊，本網站不對分享後遭他人閱覽或轉傳之行為負責。',
    '2. 本網站上所有內容（包含但不限於文字、圖片、網頁設計、商標、軟體程式碼與資料庫），其著作權與智慧財產權均屬本網站營運者或合法權利人所有。未經書面授權，禁止擅自重製、改作、散布或用於商業營利用途。',
  ] },
  { title: '七、服務變更、暫停與終止', body: [
    '本網站保留隨時修改、暫停或終止本網站部分或全部服務之權利。在以下情況下，本網站得暫停或中斷服務，且不對因此產生的任何不便或損失負損害賠償責任：',
    '1. 網站設備進行必要之搬遷、更換、升級或維護。',
    '2. 因天災、不可抗力、網路服務提供商線路中斷或其他不可歸責於本網站之事由致服務停止。',
    '3. 使用者違反本條款之規定，本網站得隨時終止其會員資格與使用權限。',
  ] },
  { title: '八、第三方外部連結', body: [
    '本網站可能包含指向其他外部網站的連結（如各區招生委員會官網、外部序位分享平台）。這些外部網站的內容、隱私政策與安全性均由該網站負責，本網站不對其提供任何擔保或承擔責任。',
  ] },
  { title: '九、準據法與管轄法院', body: [
    '本條款之解釋與適用，以及因使用本網站所衍生之任何爭議，均應以中華民國法律為準據法。雙方同意以台灣台北地方法院為第一審管轄法院，但法律另有強制規定者從其規定。',
  ] },
  { title: '十、聯絡我們', body: [
    '若您對本服務條款、網站操作或會員權益有任何疑問，請透過客服信箱與我們聯繫：tyctw.analyze@gmail.com。',
  ] },
];

const pages: Record<LegalPageKind, LegalPageContent> = {
  privacy: { title: '隱私權政策', eyebrow: 'PRIVACY POLICY', description: '清楚說明本網站目前蒐集、使用、分享、保存資料的方式，以及您可行使的權利。', icon: Database, sections: privacySections },
  terms: { title: '服務條款', eyebrow: 'TERMS OF SERVICE', description: '使用本網站、LINE 會員登入與免廣告會員服務前，請先閱讀以下使用原則。', icon: Shield, sections: termsSections },
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
    <section className={'border-b-4 border-slate-900 ' + colors.hero}><div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5"><ArrowLeft className="h-4 w-4" />回到首頁</a>
      <div className="py-10"><div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0_#0f172a]"><div className={'flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 ' + colors.iconBg}><Icon className={'h-6 w-6 ' + colors.iconText} /></div><div><p className="text-xs font-black tracking-widest text-slate-500">{page.eyebrow}</p><p className="text-sm font-black text-slate-700">最後更新：{updatedAt}</p></div></div><h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{page.title}</h1><p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">{page.description}</p></div>
    </div></section>
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
      <aside className={pageNavigationAsideClassName}><PageNavigation navClassName="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0_#0f172a]" itemLayoutClassName="space-y-2" items={page.sections.map((section, index) => ({ id: 'section-' + String(index + 1), label: section.title, className: 'block rounded-xl' }))} /></aside>
      <div className="space-y-5">{page.sections.map((section, index) => <article key={section.title} id={'section-' + String(index + 1)} className="scroll-mt-8 rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#0f172a] sm:p-8"><h2 className="text-2xl font-black tracking-tight">{section.title}</h2><div className="mt-4 space-y-4">{section.body.map((paragraph) => <p key={paragraph} className="text-base font-bold leading-8 text-slate-700">{paragraph}</p>)}</div></article>)}
        <section className={'rounded-2xl border-4 border-slate-900 p-5 shadow-[5px_5px_0_#0f172a] ' + colors.panel}><h2 className="text-xl font-black">有問題或想行使資料權利嗎？</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-700">請透過電子郵件聯絡本網站營運者；我們會依適用法令處理您的請求。</p><div className="mt-4 flex flex-col gap-3 sm:flex-row"><a href={alternateHref} className="inline-flex items-center justify-center rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-sm font-black shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5">{alternateText}</a><a href={'mailto:' + contactEmail} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5"><Mail className="h-4 w-4" />{contactEmail}</a></div></section>
      </div>
    </section>
  </main>;
}
