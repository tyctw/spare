import {
  ArrowLeft,
  Award,
  BookOpen,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Download,
  ChevronRight,
  KeyRound,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import { withBasePath } from "../lib/routes";
import PageBreadcrumb from './PageBreadcrumb';
import MobileContentsNav from "./MobileContentsNav";
import "./instructions-page.css";

const steps = [
  {
    title: "輸入或掃描邀請碼",
    icon: KeyRound,
    tone: "bg-amber-50 text-amber-700 border-amber-300",
    desc: "首頁最上方先輸入主辦單位提供的邀請碼；也可以使用 QR Code 掃描功能。邀請碼用於啟用分析，請勿把含個人資料的截圖公開分享。",
  },
  {
    title: "設定分析條件",
    icon: SlidersHorizontal,
    tone: "bg-emerald-50 text-emerald-700 border-emerald-300",
    desc: "選擇使用身分、學校公私立偏好與學校類型。若選擇職業類科，還可以再設定想優先查看的職群；不確定時可先選不拘，再用結果篩選。",
  },
  {
    title: "選擇就學區",
    icon: MapPin,
    tone: "bg-rose-50 text-rose-700 border-rose-300",
    desc: "依你的報名資格選擇適用就學區。不同區域的比序與計分方式可能不同；點選頁面上的計分說明，可先閱讀本站整理的規則摘要。",
  },
  {
    title: "填入會考成績",
    icon: Calculator,
    tone: "bg-sky-50 text-sky-700 border-sky-300",
    desc: "依成績通知單填入國文、英文、數學、自然、社會的等級與標示，並選擇寫作測驗級分。不要自行把 A、B、C 換算成百分制或總分。",
  },
  {
    title: "送出前確認資料",
    icon: CheckCircle2,
    tone: "bg-teal-50 text-teal-700 border-teal-300",
    desc: "再次核對邀請碼、就學區、學校偏好、五科等級與寫作級分。尤其就學區與成績一旦填錯，分析結果就沒有參考價值。",
  },
  {
    title: "開始分析並檢視結果",
    icon: Award,
    tone: "bg-violet-50 text-violet-700 border-violet-300",
    desc: "確認無誤後按「開始落點分析」。系統會產生獨立結果頁，提供條件摘要、推薦校科與分析說明；這是規劃輔助，不是錄取保證。",
  },
];

const scoreNotes = [
  "五科請依成績通知單的等級與標示選取，例如 A++、A+、A、B++、B+、B、C；實際下拉選項以首頁顯示為準。",
  "寫作測驗請填 0 至 6 級分。是否採計、採計方式及同分比序，會因就學區與年度而不同。",
  "若還沒有正式成績，可先用預估成績做情境比較；結果應視為方向參考，正式選填前請重新以成績通知單核對。",
  "本站顯示的區域計分摘要與換算結果方便初步比較；最終仍以當學年度、所屬就學區的招生簡章與公告為準。",
];

const resultTips = [
  {
    title: "先看條件摘要",
    desc: "先確認就學區、學校類型、公私立偏好、職群與各科成績是否正確。條件錯了，後面的推薦都不應直接採用。",
  },
  {
    title: "再看推薦校科與區間",
    desc: "依落點區間比較校科，並使用搜尋與篩選縮小範圍。歷年資料只能看趨勢，招生名額、報名人數與比序改變都會影響結果。",
  },
  {
    title: "加入比較，不要只看一間",
    desc: "結果頁可將有興趣的校科加入比較清單，最多 4 所。一起比對類型、地區、群科、分數與歷年資料，較容易看出取捨。",
  },
];

const planningTips = [
  { title: '查看校科內容', desc: '點進校科前，先看它屬於哪一種學制、群科或學程；再回到學校公告確認實際課程、特色課程與招生名額。' },
  { title: '比較候選校科', desc: '把有興趣的校科加入比較清單，從學制、科別、地點、歷年資料與個人需求一起看，不要只依單一分數做決定。' },
  { title: '建立模擬志願序', desc: '將想填的校科加入「模擬志願序」，依想讀程度、落點參考與生活條件排列；先求排序符合意願，再檢查風險配置。' },
  { title: '分享或列印討論', desc: '可分享唯讀清單給家長、老師檢視，或列印目前排序與空白討論表。分享頁的副本可自行修改，不會更動原清單。' },
];

const finalChecks = [
  '以成績通知單再次核對五科等級、標示與寫作測驗級分，並確認選擇的是正確就學區。',
  '逐一確認志願的學校、科別或學程、招生名額與報名資格；名稱相近的校科尤其要核對代碼。',
  '依當年度招生簡章確認超額比序、志願選填時間、繳件或報到規定；本工具與歷年資料不能取代官方系統。',
  '和家人討論通勤、住宿、學費、課程方向與就讀意願；志願序應由最想就讀且符合資格的選項開始排列。',
];

const sections = [
  { id: "flow", label: "操作流程", number: "01" },
  { id: "scores", label: "填寫成績", number: "02" },
  { id: "results", label: "閱讀結果", number: "03" },
  { id: "planning", label: "規劃志願", number: "04" },
  { id: "actions", label: "選填前確認", number: "05" },
];

export default function InstructionsPage() {
  return <main className="guide-page">
    <div className="guide-shell">
      <PageBreadcrumb title="使用說明" />
      <header className="guide-hero">
        <div className="guide-hero-copy"><span className="guide-kicker"><BookOpen size={15} /> USER GUIDE / 使用指南</span><h1>從開始分析，<br /><em>到選出適合的方向。</em></h1><p>第一次使用也能跟著步驟完成落點分析。了解怎麼填入條件、閱讀結果，再把有興趣的校科整理成志願清單。</p><div className="guide-hero-actions"><a className="guide-primary-button" href={withBasePath("/")}>開始落點分析<ArrowRight size={17} /></a><a className="guide-text-link" href="#flow">先看操作步驟<ArrowRight size={16} /></a></div></div>
        <div className="guide-hero-panel" aria-label="使用流程摘要"><div className="guide-panel-header"><span>YOUR JOURNEY</span><span>01 — 04</span></div><div className="guide-journey"><div><span><SlidersHorizontal size={20} /></span><p>設定條件<small>就學區與會考成績</small></p></div><div><span><Search size={20} /></span><p>閱讀結果<small>核對推薦與資料</small></p></div><div><span><Target size={20} /></span><p>規劃志願<small>比較、排序與討論</small></p></div><div><span><ShieldCheck size={20} /></span><p>正式確認<small>回到當年度官方簡章</small></p></div></div></div>
      </header>
      <div className="guide-caution"><ShieldCheck size={20} /><p><strong>使用前先知道</strong>落點分析用於整理可能方向與校科選項，不保證錄取。招生資格、計分、名額與時程，請以當年度官方公告為準。</p></div>
      <div className="guide-layout">
        <aside className="guide-aside"><nav aria-label="頁面導覽"><p>本頁內容</p>{sections.map((section) => <a href={`#${section.id}`} key={section.id}><span>{section.number}</span>{section.label}<ArrowRight size={14} /></a>)}</nav><MobileContentsNav items={sections} /><div className="guide-aside-help"><p>準備好開始了嗎？</p><a href={withBasePath("/")}>前往分析頁<ArrowUpRightIcon /></a></div></aside>
        <div className="guide-content">
          <section id="flow" className="guide-section"><SectionHeading number="01" eyebrow="GET STARTED" title="六步完成落點分析" description="先依序填妥資料，再核對送出。每個條件都以實際報名資料與成績通知單為準。" /><ol className="guide-steps">{steps.map((step, index) => { const Icon = step.icon; return <li key={step.title}><div className="guide-step-marker"><span>{String(index + 1).padStart(2, "0")}</span></div><div className="guide-step-body"><div className="guide-step-icon"><Icon size={22} /></div><div><h3>{step.title}</h3><p>{step.desc}</p></div></div></li>; })}</ol><a className="guide-inline-link" href={withBasePath("/")}>現在就開始分析<ArrowRight size={16} /></a></section>
          <section id="scores" className="guide-section"><SectionHeading number="02" eyebrow="ENTER YOUR SCORES" title="成績怎麼填？" description="選擇成績通知單上的等級、標示與寫作級分，不需要換算原始答對題數。" /><div className="guide-score-panel"><div className="guide-score-example"><Calculator size={25} /><p>五科成績</p><strong>A++ · A+ · A<br />B++ · B+ · B · C</strong><span>依首頁實際選項填入</span></div><ul>{scoreNotes.map((note) => <li key={note}><CheckCircle2 size={18} /><span>{note}</span></li>)}</ul></div></section>
          <section id="results" className="guide-section"><SectionHeading number="03" eyebrow="READ YOUR RESULTS" title="結果怎麼看？" description="先確認輸入條件，再理解推薦範圍，最後把感興趣的校科放在一起比較。" /><div className="guide-tips-grid">{resultTips.map((tip, index) => <article key={tip.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{tip.title}</h3><p>{tip.desc}</p></article>)}</div></section>
          <section id="planning" className="guide-section"><SectionHeading number="04" eyebrow="MAKE YOUR PLAN" title="從結果到志願清單" description="依序探索、比較、排序與討論，讓清單同時符合興趣和實際生活條件。" /><div className="guide-planning-grid">{planningTips.map((tip, index) => <article key={tip.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{tip.title}</h3><p>{tip.desc}</p></div></article>)}</div><a className="guide-inline-link" href={withBasePath("/mock-volunteer")}>前往模擬志願序<ArrowRight size={16} /></a></section>
          <section id="actions" className="guide-section guide-final-section"><SectionHeading number="05" eyebrow="FINAL CHECK" title="正式選填前，再確認一次" description="用這份清單檢查資料與選擇，再依官方流程完成正式選填。" /><ul className="guide-checklist">{finalChecks.map((check) => <li key={check}><CheckCircle2 size={20} /><span>{check}</span></li>)}</ul><div className="guide-download-note"><Download size={20} /><p>保留分析結果時，匯出後請再次核對就學區與成績。含邀請碼或個人資訊的檔案，請妥善保管。</p></div><a className="guide-primary-button" href={withBasePath("/")}>開始落點分析<ArrowRight size={17} /></a></section>
        </div>
      </div>
    </div>
  </main>;
}

function ArrowUpRightIcon() { return <ArrowRight size={15} />; }

function SectionHeading({ number, eyebrow, title, description }: { number: string; eyebrow: string; title: string; description: string }) {
  return <div className="guide-section-heading"><div className="guide-section-label"><span>{number}</span>{eyebrow}</div><h2>{title}</h2><p>{description}</p></div>;
}
