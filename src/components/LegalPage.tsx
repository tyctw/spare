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
  { title: '一、適用範圍、資料處理者與聯絡方式', body: [
    '本隱私權政策適用於「台灣會考落點分析」網站（下稱本網站）目前提供的落點分析、校科搜尋、積分換算、模擬志願、匯出、分享連結、回饋與問題回報、邀請碼、LINE 登入、免廣告會員及付款功能。資料處理者為本網站營運者；個資、付款、刪除或安全相關問題請寄至 tyctw.analyze@gmail.com。',
    '本政策說明本網站本身的資料處理方式，不取代 LINE、綠界科技（ECPay）、Google、GitHub Pages、Supabase 或外部連結服務商的條款與隱私權政策；使用第三方服務時，仍應閱讀其各自政策。',
  ] },
  { title: '二、我們可能處理的資料', body: [
    '您使用分析功能時，資料主要在瀏覽器中運算或暫存，可能包括所選就學區、會考成績、志願或群科偏好、模擬志願清單、篩選條件及匯出或分享所選內容。請勿輸入與服務無關的敏感資訊、身分證字號、准考證號、完整住址、完整卡號、密碼、OTP 或他人的個資。',
    '若您主動聯絡、回報問題或提交回饋，本網站可能處理您提供的稱呼、電子郵件、問題描述、截圖、裝置或瀏覽器資訊及必要的聯絡紀錄。若您建立分享連結，系統會建立您選定內容的唯讀快照。',
    '為維運、偵錯、資安與防止濫用，後端、代管或分析服務可能處理請求時間、IP 位址、瀏覽器或裝置資訊、頁面或功能操作、錯誤與安全紀錄、邀請碼使用狀態及必要的伺服器日誌。',
  ] },
  { title: '三、使用目的與不提供資料的影響', body: [
    '本網站僅在提供分析與分享功能、回覆客服、確認會員資格、處理付款、維護服務、偵測或防止詐欺與資安事件、遵守法令及處理爭議所必要的範圍內使用資料。分析結果只用於升學規劃輔助，不會用來代表學校、招生單位或主管機關作成錄取、分發或其他具法律效力的決定。',
    '您可以不提供非必要資料；但未提供某項功能所必須的資料時，該功能可能無法完成。例如未登入 LINE 即無法購買或確認免廣告會員，未提供可聯絡方式時本網站可能無法回覆客服案件。',
  ] },
  { title: '四、LINE 登入與會員身分資料', body: [
    '使用 LINE 登入時，本網站會使用 LINE 提供的使用者識別碼確認身分；登入流程中也可能取得顯示名稱與頭像網址，以顯示登入狀態並恢復會員資格。LINE 存取權杖不會交由瀏覽器保存，也不作為本網站的長效登入憑證。',
    'LINE 登入採一次性驗證碼交換短期工作階段。交換碼約 60 秒失效，伺服器端工作階段約 15 分鐘失效；前端只在目前頁面記憶體保存工作階段，不寫入網址查詢參數、localStorage 或 sessionStorage。您可在會員頁按「登出 LINE」結束目前網站工作階段；這不會登出您的 LINE App 或變更 LINE 帳號。',
  ] },
  { title: '五、付款與免廣告會員紀錄', body: [
    '付款由 ECPay 依其流程處理。本網站不要求或保存完整信用卡卡號、網銀密碼或 OTP；本網站會保存處理交易與會員所必要的訂單編號、方案、金額、付款狀態、ECPay 交易識別資訊、已驗證 LINE 身分的關聯及會員到期日。',
    '會員資格只依已驗證的 LINE 身分及已完成付款交易判定，不以瀏覽器可複製的舊式會員憑證判定。付款及會員紀錄會在客服、退款、爭議、帳務、資安或法令所需期間內保存；取消、退款與未授權交易的處理原則請參閱退款與取消政策。',
  ] },
  { title: '六、Cookie、瀏覽器儲存與 Google 服務', body: [
    '本網站可能使用 Cookie、瀏覽器儲存空間或相近技術保存免責聲明閱讀狀態、分析工作階段、介面偏好、回饋狀態或付款後的畫面狀態。您可在瀏覽器設定中限制或清除 Cookie 與網站資料；清除後部分暫存結果、設定或操作狀態可能無法復原。登入工作階段與會員驗證憑證不會存入 localStorage 或 sessionStorage。',
    '本網站會載入 Google Fonts、Google Analytics，並在非會員狀態下使用 Google 廣告與 Funding Choices 服務。Google 及其合作夥伴可能以 Cookie 或類似技術處理瀏覽器、裝置、IP 位址、瀏覽頁面、廣告互動及偏好等資料。您可透過瀏覽器設定控制 Cookie，並在 Google 廣告設定管理個人化廣告；實際處理方式以 Google 的政策為準。',
  ] },
  { title: '七、分享連結、委外、跨境與第三方揭露', body: [
    '建立分享連結時，本網站會建立包含您選擇分享內容的唯讀快照。持有連結或 QR Code 的人可以讀取該內容；分享快照預設在建立後 5 天到期。分享前請自行移除不應公開的個資；到期前的閱覽、截圖或轉傳不在本網站可完全控制的範圍內。',
    '本網站使用 GitHub Pages 提供網站代管、Supabase 提供後端與資料庫、LINE 提供登入、ECPay 提供付款，並使用 Google 提供字型、分析、廣告與同意管理相關服務。為提供服務、維運或安全防護，資料可能由服務商在臺灣以外地區處理。本網站不出售、出租或以交換方式提供您輸入的個資。',
  ] },
  { title: '八、保存期間與安全措施', body: [
    '本網站依資料種類、處理目的、使用者請求、客服或爭議處理、資安及法令需要決定保存期間。現行設計中，分享快照預設保存 5 天、LINE 一次性交換碼約 60 秒、LINE 登入工作階段約 15 分鐘；付款與會員紀錄的保存期間則依帳務、客服、退款、爭議及法令需要決定。',
    '本網站採取合理的存取控制、短效憑證、傳輸加密、後端權限設定與安全日誌措施，降低未經授權存取或濫用風險。但網路傳輸、裝置、第三方服務或人為錯誤無法保證絕對安全；如發現疑似未授權使用、錯誤寄送或安全問題，請立即聯絡我們。',
  ] },
  { title: '九、您的個資權利與提出方式', body: [
    '在適用法令範圍內，您得就自己的個資請求查詢或閱覽、製給複製本、補充或更正、停止蒐集、處理或利用，以及刪除。請寄信至 tyctw.analyze@gmail.com，說明請求內容、所涉功能、可供核對的必要資訊及聯絡方式；本網站可能為防止冒用而要求合理的身分核對。',
    '本網站會依適用法令與實際情況處理請求；若資料依法必須保存、涉及他人權益、無法合理核對身分、請求過度重複或有其他合法限制，可能無法立即或完全依請求辦理，並會在適當範圍內說明。刪除瀏覽器資料、撤回第三方 Cookie 同意或管理 Google 廣告偏好，亦可透過您的瀏覽器或相關第三方設定操作。',
  ] },
  { title: '十、未成年人與政策變更', body: [
    '本網站主要服務學生及家長。未成年人使用涉及付款、分享或個資的功能前，建議由法定代理人或監護人了解本政策；如您發現未經適當授權提供的未成年人資料，請立即聯絡我們。',
    '本網站可能因功能、資安、第三方服務或法令變更而更新本政策，並在本頁標示最後更新日期。重大變更會以合理方式提示使用者；更新後繼續使用服務時，應以當時公告的政策內容為準。',
  ] },
];

const termsSections: LegalSection[] = [
  { title: '一、同意條款、服務對象與定義', body: [
    '本服務條款適用於「台灣會考落點分析」網站（下稱本網站）提供的所有功能，包括落點分析、校科搜尋、積分換算、模擬志願、報告或清單匯出、分享連結、回饋與問題回報、邀請碼、LINE 登入及免廣告會員。開始瀏覽、使用功能或完成付款，即表示您已閱讀並同意本條款及隱私權政策；若不同意，請勿使用本網站或購買會員。',
    '本網站是提供升學規劃輔助資訊的民間工具，不是政府機關、招生委員會、學校、補習班或正式報名、分發與志願選填系統。本條款中的「會員」是指完成 LINE 身分驗證且付款成功、仍在有效期間內的免廣告使用者。',
  ] },
  { title: '二、未成年人、裝置與使用者責任', body: [
    '本網站主要服務國中學生與其家長、師長。未成年人使用付款、分享、匯出或涉及個人資料的功能前，應先由法定代理人或監護人了解並同意；如法令要求同意或授權，應由有權者完成。',
    '您應自行準備可正常使用的裝置、網路、瀏覽器與 LINE 帳號，並對從自己裝置進行的操作負責。請輸入與功能所需相符、盡可能正確的資料，並確認您有權使用或分享該資料；清除瀏覽器資料、變更裝置、網路中斷或第三方服務異常，可能使暫存內容無法復原。',
  ] },
  { title: '三、分析結果、招生資訊與正式決定', body: [
    '會考積分換算、落點區間、排序、校科資訊、歷年資料、推薦文字及模擬志願，均只作初步規劃參考，不構成錄取保證、資格審查、名額承諾、教育、法律或其他專業意見。不同就學區、學校、身分、年度、報名人數、名額及比序規則都可能影響結果。',
    '招生簡章、主管機關公告、各就學區免試入學委員會資訊與正式志願選填系統為最終依據。使用者應在報名、選校、填志願或付款前自行核對當年度正式規定；最終決定與其結果由使用者及其法定代理人自行承擔。',
  ] },
  { title: '四、分享、匯出與使用限制', body: [
    '分享連結與 QR Code 所對應的是唯讀內容快照；持有連結或 QR Code 的人可能讀取該內容。分享快照預設於建立後 5 天到期，但在到期前仍可能被他人閱覽、截圖或轉傳。建立、下載或傳送前，請移除姓名、身分證字號、准考證號、聯絡方式、金融資料及其他不應公開的個資。',
    '不得冒用身分、輸入或散布他人敏感個資、上傳惡意內容、繞過登入或付款驗證、猜測或濫用邀請碼、以機器人或其他方式未經授權大量擷取資料、干擾服務、反向工程、規避安全措施，或以本網站從事違法、侵權、詐欺或損害他人權益的行為。',
  ] },
  { title: '五、LINE 登入與免廣告會員', body: [
    '免廣告會員須先完成 LINE 登入。網站以已驗證的 LINE 身分及付款成功交易確認資格；LINE 登入工作階段為短期驗證用途，您可在會員頁登出。登出本網站只會結束本網站工作階段，不會登出您的 LINE App 或變更您的 LINE 帳號。',
    '月費方案為 NT$49、有效 30 天；年費方案為 NT$399、有效 365 天。方案為一次性付款，不會自動續扣。有效期間與顯示狀態以本網站依已完成付款交易所作的會員紀錄為準；會員資格不得轉讓、出售、出租、共享或兌換現金。',
    '免廣告服務是盡力在會員有效期間內停止本網站所控制的廣告載入或顯示；因瀏覽器快取、網路延遲、第三方廣告服務、裝置設定或您已開啟的其他頁面而出現的短暫或非本站控制內容，不當然表示會員資格失效。',
  ] },
  { title: '六、付款、取消與退款', body: [
    '付款由綠界科技（ECPay）依其付款流程處理。送出付款前請確認方案、金額與付款資訊；本網站不會要求您以電子郵件提供密碼、OTP、完整卡號或網銀憑證。付款頁面、金融機構及 ECPay 所示的最終交易狀態，是確認款項的重要依據。',
    '付款成功後，網站會在接獲並完成付款確認後啟用會員。若已扣款但會員未顯示生效，請勿立即重複付款；請保留交易時間、金額、訂單編號或 ECPay 識別資訊並聯絡客服。取消、退款、重複扣款、未授權交易及法定解除權，依「退款與取消政策」及適用法令處理；本條款不排除法律不得排除的消費者權利。',
  ] },
  { title: '七、廣告、第三方服務與外部連結', body: [
    '非會員狀態下，本網站可能載入 Google 廣告、分析、Cookie 同意或相關第三方服務；會員狀態則依前述免廣告服務範圍處理。Google、LINE、ECPay、GitHub Pages、Supabase 與其他外部網站或服務由各自營運者負責，其內容、可用性、Cookie、付款、帳號與資料處理，仍適用各服務商自己的條款與政策。',
    '本網站提供外部連結僅為資訊便利，並不代表對外部內容、商品、服務、招生資訊或安全性的保證、背書或控制。您使用第三方服務前應自行閱讀其條款與隱私權政策。',
  ] },
  { title: '八、智慧財產、回饋與資料來源', body: [
    '除另有標示外，本網站的程式、版面、商標、文字、圖像、資料整理方式及功能設計，受著作權、商標或其他法律保護。您可為個人、家庭或教育輔導的非商業升學規劃目的使用網站內容；未經同意不得重製、改作、公開傳輸、販售、建立競爭性服務、批量再利用資料或移除權利標示。',
    '公開招生資料、學校資訊、統計數據與外部連結可能分別受原資料來源的授權條件或權利保護。若您主動提供回饋、錯誤回報或非機密改善建議，您同意本網站得為維運、修正與改善服務而使用該等內容；請勿在回饋中提供不必要的個資或機密資訊。',
  ] },
  { title: '九、服務調整、暫停與終止', body: [
    '本網站會以合理努力維持服務，但網路、裝置、瀏覽器、資料更新、第三方服務、維護、資安事件、不可抗力或法令要求，都可能造成延遲、中斷、資料暫時不可用、介面差異或部分功能停止。本網站得基於維護、安全、防止濫用、資料修正或法令需要調整、限制、暫停或終止全部或部分功能。',
    '若合理認為有違反本條款、詐欺、濫用、資安風險或侵害他人權利的情形，本網站得在必要範圍內限制使用、使分享內容失效、撤銷工作階段或採取其他保護措施；涉及已付款會員的處理，仍依適用法令及退款與取消政策辦理。',
  ] },
  { title: '十、責任限制、條款變更與聯絡', body: [
    '在適用法令允許的範圍內，本網站不保證服務永不中斷、資料永遠完整、即時或無誤，也不保證分析結果符合任何個別期待。因使用或無法使用網站所生的爭議或損失，應依具體事實、已揭露風險及適用法令判斷；本條款不排除或限制法律不得排除或限制的消費者、個資或其他法定權利。若任一條款無效或不可執行，其餘條款仍在法律允許範圍內有效。',
    '本網站可能因功能、資安、付款流程、第三方服務或法令變更更新本條款，並在本頁標示最後更新日期。已提出的付款、客服、取消或退款案件，原則上依提出時適用且不違反法令的規則處理。服務、付款、隱私或安全疑問請來信 tyctw.analyze@gmail.com；請勿寄送密碼、OTP、完整卡號或其他敏感金融憑證。',
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
