import { ArrowLeft, ArrowRight, ArrowUpRight, BarChart3, Calculator, CheckCircle2, ChevronDown, Database, FileSearch, HeartHandshake, List, Mail, Map, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageBreadcrumb from './PageBreadcrumb';
import './advantages-page.css';

const mission = [
  '我們相信升學資訊不應該只服務少數人，也不應該因為資料分散、規則複雜或查詢門檻高，而讓學生與家長在重要選擇前感到無助。',
  '因此，本服務的核心目標是免費提供大家可使用的升學輔助工具。不論是前段、中段、後段學校，或是高中、高職、五專等不同升學路徑，都應該有被整理、被看見、被比較的機會。',
  '我們也理解，升學規劃很少是一個人獨自完成的決定。學生可能在意興趣與未來生活，家長可能關心通勤、費用與學習穩定度，老師則需要協助把分散的規則與資料轉成可以討論的方向。好的資訊工具，不是替家庭做決定，而是讓每個人能站在同一份清楚的資料上開始對話。',
  '因此我們努力把複雜的就學區規則、會考成績、學校類型、群科內容、志願排序與比較結果，整理成容易搜尋、容易閱讀、也方便保存與分享的內容。使用者可以先快速掌握全貌，再回到官方簡章與學校公告逐項核對，逐步建立自己的判斷。',
];

const principles = [
  { title: '降低計算錯誤', desc: '各就學區的比序、積分、加權與換算方式不完全相同，人工試算容易漏看規則或輸入錯誤。我們希望透過工具化整理，減少重複計算與判斷失誤。', icon: Calculator },
  { title: '補足資訊落差', desc: '網路上常見資料多集中在前幾志願與明星學校，中後段學校、高中職與不同群科的錄取資訊相對不足。我們希望讓更多學校資料被納入參考。', icon: Database },
  { title: '維持免費使用', desc: '升學規劃是許多家庭共同面對的問題。我們希望盡可能把基礎查詢與分析功能免費開放，降低取得資訊的成本。', icon: HeartHandshake },
];

const problems = [
  '各區計分方式不同，學生與家長自行換算時可能發生錯誤。',
  '落點資訊常被簡化成少數熱門學校，難以看見更多適合自己的選項。',
  '高中職、群科、歷年錄取狀況與中後段學校資料分散，查找成本高。',
  '升學決策常伴隨壓力，我們希望把資料整理成更容易理解的參考。',
];

const features = [
  { title: '多區規則整理', desc: '依不同就學區整理計分、比序與輸入欄位，降低使用者自行對照規則的負擔。', icon: Map },
  { title: '志願方向參考', desc: '協助整理可能落點、學校類型、群科方向與志願討論素材，讓選擇不只看單一分數。', icon: Target },
  { title: '資料與結果匯出', desc: '提供分析結果整理與匯出，方便學生、家長與老師後續討論與保存。', icon: FileSearch },
  { title: '清楚的輔助定位', desc: '落點分析是輔助工具，不取代正式簡章、招生公告、輔導老師或專業升學諮詢。', icon: ShieldCheck },
];

const improvements = [
  { title: '資料更新', desc: '依官方簡章與公告調整規則、校系資料及說明。' },
  { title: '錯誤回報', desc: '發現資料不一致時，可提供頁面、年度與來源協助核對。' },
  { title: '透明使用', desc: '分析結果僅供參考，正式填選仍以當年度官方資訊為準。' },
];

const sections = [
  { id: 'mission', label: '我們的理念', number: '01' },
  { id: 'principles', label: '核心原則', number: '02' },
  { id: 'problems', label: '正在解決的問題', number: '03' },
  { id: 'features', label: '系統優點', number: '04' },
  { id: 'updates', label: '持續優化', number: '05' },
];

export default function AdvantagesPage() {
  return (
    <main className="about-page">
      <div className="about-shell">
        <PageBreadcrumb title="系統優點與關於我們" />

        <header className="about-hero">
          <div>
            <p className="about-kicker"><Sparkles size={16} />ABOUT TW ADMISSION HELPER</p>
            <h1>讓升學資訊，<span>更容易取得。</span></h1>
            <p className="about-intro">也讓每一位學生都能更安心地做選擇。TW 升學落點分析希望以免費、易用、清楚的方式，協助學生與家長整理會考成績、各區計分規則、學校錄取資訊與志願評估方向。</p>
            <div className="about-hero-actions">
              <a className="about-primary-action" href={withBasePath('/')}>開始使用落點分析 <ArrowRight size={17} /></a>
              <a className="about-text-action" href={withBasePath('/instructions')}>了解使用方式 <ArrowUpRight size={16} /></a>
            </div>
          </div>
          <aside className="about-hero-note">
            <span>OUR PURPOSE</span>
            <p>整理複雜資訊，<br />讓選擇更有依據。</p>
            <div><CheckCircle2 size={17} /><span>多元升學路徑，都值得被看見</span></div>
          </aside>
        </header>

        <div className="about-layout">
          <aside className="about-sidebar">
            <nav className="about-desktop-nav" aria-label="本頁導覽">
              <p>本頁內容</p>
              {sections.map((section) => <a href={`#${section.id}`} key={section.id}><span>{section.number}</span>{section.label}</a>)}
            </nav>
            <details className="about-mobile-contents">
              <summary>
                <span><List size={18} /><strong>本頁內容</strong></span>
                <span className="about-mobile-count">{sections.length} 個章節</span>
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <nav aria-label="手機版頁內導覽">
                {sections.map((section) => <a href={`#${section.id}`} key={section.id}><span>{section.number}</span>{section.label}<ArrowRight size={15} aria-hidden="true" /></a>)}
              </nav>
            </details>
            <div className="about-sidebar-note"><ShieldCheck size={17} /><p>分析結果是升學規劃參考，正式資訊仍以當年度公告為準。</p></div>
          </aside>

          <div className="about-content">
            <section id="mission" className="about-section about-mission">
              <div className="about-section-heading"><span>01 / OUR MISSION</span><h2>我們的理念</h2><p>讓資訊成為對話的起點。</p></div>
              <div className="about-mission-body">{mission.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
              <aside className="about-position">
                <BarChart3 size={24} />
                <div><h3>我們如何看待落點分析</h3><p>落點分析不是保證錄取，也不能取代正式簡章、招生單位公告、學校輔導老師或專業升學諮詢。它是一種輔助工具，幫助使用者快速整理可能方向、發現更多選項，並在填寫志願前更有依據地討論。</p></div>
              </aside>
            </section>

            <section id="principles" className="about-section">
              <div className="about-section-heading"><span>02 / PRINCIPLES</span><h2>核心原則</h2><p>我們想改善升學資訊的三件事。</p></div>
              <div className="about-principles">{principles.map((item, index) => {
                const Icon = item.icon;
                return <article key={item.title}><div className="about-principle-icon"><Icon size={23} /></div><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.desc}</p></article>;
              })}</div>
            </section>

            <section id="problems" className="about-section">
              <div className="about-section-heading"><span>03 / THE CHALLENGE</span><h2>正在解決的問題</h2><p>從使用者真正遇到的困難出發。</p></div>
              <ol className="about-problems">{problems.map((problem, index) => <li key={problem}><span>{String(index + 1).padStart(2, '0')}</span><p>{problem}</p></li>)}</ol>
            </section>

            <section id="features" className="about-section">
              <div className="about-section-heading"><span>04 / WHAT WE OFFER</span><h2>系統優點</h2><p>把資料整理成可用、可討論的工具。</p></div>
              <div className="about-features">{features.map((feature) => {
                const Icon = feature.icon;
                return <article key={feature.title}><span><Icon size={22} /></span><h3>{feature.title}</h3><p>{feature.desc}</p></article>;
              })}</div>
            </section>

            <section id="updates" className="about-section about-updates">
              <div className="about-section-heading"><span>05 / KEEP IMPROVING</span><h2>持續優化</h2><p>資訊會改變，工具也需要跟著修正。</p></div>
              <p className="about-updates-intro">我們會持續優化資料整理、計算邏輯與使用體驗，也歡迎使用者回報錯誤、提供補充資料或提出改善建議。每年度招生規則、校系名額與採計方式都可能調整，我們會依官方公告更新內容，並在有必要時補充資料來源、適用年度與使用限制。</p>
              <div className="about-improvements">{improvements.map((item, index) => <div key={item.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.desc}</p></div>)}</div>
              <div className="about-update-actions">
                <a href={withBasePath('/changelog')}>查看網站更新 <ArrowUpRight size={16} /></a>
                <a href={withBasePath('/report-error')}>回報資料問題 <ArrowUpRight size={16} /></a>
              </div>
            </section>
          </div>
        </div>

        <aside className="about-contact">
          <div><Mail size={19} /><span>有建議或需要協助？</span><p>歡迎告訴我們發現的問題，讓資訊變得更清楚。</p></div>
          <a href={withBasePath('/report-error')}>前往問題回報 <ArrowRight size={16} /></a>
        </aside>
      </div>
    </main>
  );
}
