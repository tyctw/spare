import { AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, ChevronRight, ClipboardCheck, Database, ExternalLink, FileWarning, Scale, ShieldAlert, UserCheck } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import MobileContentsNav from './MobileContentsNav';
import './disclaimer-page.css';

const factors = ['當學年度招生名額、校科與招生管道', '報名人數、考生成績分布與志願序', '各就學區的超額比序、同分比序及跨區規定', '身分資格、特殊身分、加分或優先入學條件', '簡章修訂、時程異動及招生單位的最新公告'];
const checklist = ['以成績通知單核對輸入的會考成績與標示。', '確認所屬就學區、報名資格及欲使用的招生管道。', '逐項查閱目標校科當年度的簡章、名額與比序規則。', '一併評估興趣、性向、通勤、學費及學校特色。', '有疑問時，向國中輔導老師、招生委員會或目標學校確認。'];
const navigation = [
  { id: 'scope', title: '服務定位與範圍', number: '01' },
  { id: 'limits', title: '分析與資料限制', number: '02' },
  { id: 'decision', title: '選填前請確認', number: '03' },
  { id: 'privacy', title: '資料與第三方服務', number: '04' },
  { id: 'official', title: '官方資訊優先', number: '05' },
];

function SectionTitle({ number, label, title, description }: { number: string; label: string; title: string; description?: string }) {
  return <div className="disclaimer-section-heading"><p><span>{number}</span>{label}</p><h2>{title}</h2>{description && <div className="disclaimer-section-description">{description}</div>}</div>;
}

export default function DisclaimerPage() {
  return <main className="disclaimer-page-new"><div className="disclaimer-shell">
    <nav className="disclaimer-breadcrumb" aria-label="麵包屑"><a href={withBasePath('/')}><ArrowLeft size={15} />返回首頁</a><ChevronRight size={14} /><span aria-current="page">免責聲明</span></nav>
    <header className="disclaimer-hero"><div className="disclaimer-hero-copy"><p className="disclaimer-kicker"><Scale size={17} />IMPORTANT NOTICE</p><h1>免責聲明<span>使用前，請了解資訊的適用範圍。</span></h1><p>本網站是民間開發的升學資訊與規劃工具，協助整理會考成績、校科資料與志願選項；不是政府機關、招生委員會、學校或正式報名、分發系統。</p><time dateTime="2026-08-26">最後更新：2026 年 8 月 26 日</time></div><div className="disclaimer-hero-mark" aria-hidden="true"><ShieldAlert size={67} strokeWidth={1.2} /><span>READ BEFORE USE</span></div></header>
    <div className="disclaimer-principle"><div className="disclaimer-principle-icon"><ShieldAlert size={24} /></div><div><p>最重要的原則</p><strong>資格、名額、比序、時程與錄取結果，一律以當學年度官方簡章及公告為準。</strong></div><a href="#official">查看官方資訊提醒<ArrowRight size={16} /></a></div>
    <div className="disclaimer-layout"><aside className="disclaimer-aside"><nav aria-label="頁面導覽"><p>本頁內容</p>{navigation.map((item) => <a href={`#${item.id}`} key={item.id}><span>{item.number}</span>{item.title}</a>)}</nav><MobileContentsNav items={navigation.map(({ id, title, number }) => ({ id, label: title, number }))} /><div className="disclaimer-aside-note"><BookOpenCheck size={21} /><p>送出正式志願前，請再次查閱當年度官方簡章。</p></div></aside>
      <div className="disclaimer-content-new">
        <section id="scope" className="disclaimer-section"><SectionTitle number="01" label="ABOUT THIS SERVICE" title="服務定位與範圍" /><div className="disclaimer-prose"><p>本站依使用者輸入的成績、就學區與偏好，提供會考積分換算、校科搜尋與比較、落點參考、志願規劃、結果匯出與分享等功能；亦提供 LINE 會員登入與免廣告服務。本站不代為報名、不驗證考生資格、不審核證明文件、不代填正式志願，也不執行錄取或分發。</p><p>所有結果僅用於協助整理資訊及與家長、輔導老師討論，不取代招生單位、學校輔導人員或其他專業意見。使用者仍須自行判斷是否適合特定學校、科別、學制或招生管道，並對送出的正式志願與報名資料負責。</p><p>本網站可能提供試算、篩選、排序與視覺化結果，但畫面上的推薦、符合、挑戰或安全等文字只是依目前資料與設定產生的輔助標示，不代表本站替任何學校或招生單位作成錄取判定。</p></div></section>
        <section id="limits" className="disclaimer-section"><SectionTitle number="02" label="DATA & ANALYSIS" title="分析結果與資料限制" description="結果是依輸入條件與本站當下資料產生的參考，不是錄取預測或保證。" /><div className="disclaimer-limit-list"><article><ShieldAlert size={23} /><div><h3>不保證錄取或資格</h3><p>推薦清單、歷年成績、分數區間、排序、落點標示與分析文字，不構成錄取保證、招生資格認定、報名資格確認或任何招生結果承諾。</p></div></article><article><AlertTriangle size={23} /><div><h3>實際結果會受多項因素影響</h3><ul>{factors.map((factor) => <li key={factor}>{factor}</li>)}</ul></div></article><article><FileWarning size={23} /><div><h3>資料與功能可能調整</h3><p>本站資料、功能與外部連結可能因更新、修正、維護或第三方服務狀態而變動或暫時無法使用。若本站內容與官方公告不同，請以官方公告為準；發現疑似錯誤時，請使用本站的問題回報功能告知我們。</p></div></article></div></section>
        <section id="decision" className="disclaimer-section"><SectionTitle number="03" label="BEFORE YOU DECIDE" title="志願選填前請自行確認" description="選校與填志願的最終決定由使用者自行作成。送出正式志願前，建議至少完成以下核對：" /><ol className="disclaimer-checklist">{checklist.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p><CheckCircle2 size={18} /></li>)}</ol></section>
        <section id="privacy" className="disclaimer-section"><SectionTitle number="04" label="YOUR DATA" title="資料、裝置與第三方服務" /><div className="disclaimer-data-grid"><div><Database size={24} /><h3>僅輸入所需資料</h3><p>請只輸入分析所需資料，例如成績、就學區與偏好；不要輸入姓名、身分證字號、准考證號、住址、電話或其他非必要個人資料。分析結果與部分偏好會使用瀏覽器儲存技術，清除瀏覽資料或更換裝置後，暫存內容可能消失。</p></div><div><ExternalLink size={24} /><h3>第三方服務與政策</h3><p>如使用 LINE 登入、綠界付款、Google 服務或外部連結，相關資料處理及服務可用性亦受該服務提供者的規範影響。會員、付款、Cookie 與資料處理的詳細說明，請以隱私權政策及服務條款為準。</p></div></div><div className="disclaimer-policy-links"><a href={withBasePath('/privacy')}>閱讀隱私權政策<ArrowRight size={16} /></a><a href={withBasePath('/terms')}>閱讀服務條款<ArrowRight size={16} /></a></div></section>
        <section id="official" className="disclaimer-section disclaimer-official"><SectionTitle number="05" label="OFFICIAL SOURCES" title="官方資訊優先" /><p>高中職及五專的招生簡章、實際名額、日程與作業規則，會依學年度、招生區、學制與招生管道而不同。請在填志願或報名前，至所屬招生區與目標學校的官方網站逐項核對。</p><div className="disclaimer-official-links"><a href="https://www.moe.gov.tw/News_Content.aspx?n=9E7AC85F1954DDA8&s=257B0F248023A5A5&sms=169B8E91BB75571F" target="_blank" rel="noreferrer">教育部：115 學年度免試入學資訊<ExternalLink size={17} /></a><a href="https://www.techadmi.edu.tw/bbs-detail.php?gid=480&nid=1139" target="_blank" rel="noreferrer">招策會：115 學年度五專簡章<ExternalLink size={17} /></a></div><div className="disclaimer-last-note"><UserCheck size={20} /><p>本頁為使用提醒與資訊導覽，不構成法律、教育、升學、財務或其他專業意見。若不同意本頁、隱私權政策或服務條款所述原則，請停止使用本站服務。</p></div></section>
      </div>
    </div>
  </div></main>;
}
