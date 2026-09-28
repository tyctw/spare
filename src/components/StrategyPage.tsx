import React from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Compass,
  Layers,
  ListChecks,
  MapPinned,
  Route,
  ShieldCheck,
  Target,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageNavigation, { pageNavigationAsideClassName } from './PageNavigation';
import './strategy-page.css';

const reminders = [
  {
    title: '先看序位，再看分數',
    desc: '個別序位能反映同考區、同分數附近的競爭位置，比只看單一年錄取分數更適合做風險判斷。',
  },
  {
    title: '志願序積分優先保住',
    desc: '各就學區對志願序與同校同群的計分方式不同，主力志願應盡量落在不扣分或少扣分的範圍。',
  },
  {
    title: '只填願意就讀的學校',
    desc: '保守志願不是隨便填，而是要兼顧通勤、校風、學習壓力、科別興趣與家庭可接受度。',
  },
  {
    title: '用多版草稿比較',
    desc: '先建立夢幻版、穩健版與保守版，再和導師、輔導老師或家長討論，不要只靠一次排序決定。',
  },
];

const tiers = [
  {
    label: '前段志願序',
    title: '夢幻區',
    desc: '放真正想挑戰、略高於目前落點的校科。落榜也不應影響同群組或前段主力志願的積分。',
    tone: 'rose',
  },
  {
    label: '中段志願序',
    title: '實際區',
    desc: '放和序位、歷年錄取狀況、招生名額較接近的校科，通常是最需要細排順序的主戰場。',
    tone: 'sky',
  },
  {
    label: '後段志願序',
    title: '保守區',
    desc: '放錄取機率較高、自己也願意就讀的校科。不要把不想去的選項當成安全墊。',
    tone: 'emerald',
  },
];

const workflow = [
  '確認會考等級、標示、作文級分與就學區身分。',
  '查個人序位區間，搭配歷年錄取分數與招生名額判斷風險。',
  '依興趣、通勤、校風、升學或技職方向先刪掉不適合的選項。',
  '在不扣志願序積分的範圍內安排夢幻、實際、保守三段。',
  '最後檢查是否填入足夠保守志願，並以正式簡章規定為準。',
];

const pitfalls = [
  '只看去年最低錄取分數，忽略招生名額、考題難度與當年度學生分布。',
  '把所有熱門校科放在前面，卻沒有留下足夠的實際區與保守區。',
  '不知道同校多科、同群連續填寫在自己考區如何計分。',
  '為了填滿志願而加入完全不想就讀、通勤負擔過重或方向不合的校科。',
];

export default function StrategyPage() {
  return (
    <main className="strategy-page">
      <section className="strategy-hero">
        <div className="strategy-shell">
          <a href={withBasePath('/')} className="strategy-back"><ArrowLeft size={16} />返回首頁</a>
          <div className="strategy-hero-grid">
            <div>
              <p className="strategy-kicker"><Target size={17} />選填志願指南</p>
              <h1>志願選填攻略</h1>
              <p className="strategy-lead">從序位與就學區規則出發，把想去的學校與科別整理成有層次、願意就讀的志願清單。</p>
              <div className="strategy-hero-actions">
                <a href="#reminders" className="strategy-primary">開始整理志願<ArrowRight size={17} /></a>
                <a href={withBasePath('/mock-volunteer')} className="strategy-secondary">開啟模擬志願選填</a>
              </div>
            </div>
            <aside className="strategy-hero-note" aria-label="選填前的重要提醒">
              <span className="strategy-note-icon"><ShieldCheck size={23} /></span>
              <p>選填前先確認</p>
              <h2>志願序怎麼計分？</h2>
              <span>各就學區的志願序、同校同群及超額比序規則不同。請先核對當年度正式簡章，再安排志願順序。</span>
            </aside>
          </div>
        </div>
      </section>

      <div className="strategy-layout strategy-shell">
        <aside className={pageNavigationAsideClassName}>
          <PageNavigation
            title="本頁導覽"
            navClassName="strategy-nav"
            itemLayoutClassName="strategy-nav-list"
            items={[
              { id: 'reminders', label: '選填四大原則' },
              { id: 'ranking', label: '看懂個別序位' },
              { id: 'tiers', label: '夢幻、實際、保守' },
              { id: 'workflow', label: '五步完成志願表' },
              { id: 'pitfalls', label: '送出前檢查' },
            ]}
          />
        </aside>

        <div className="strategy-content">
          <section id="reminders" className="strategy-section">
            <div className="strategy-heading"><p>先建立判斷順序</p><h2>選填四大原則</h2><span>先知道哪些資訊該優先看，排志願時才不會只被分數或熱門程度帶著走。</span></div>
            <div className="strategy-principles">
              {reminders.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.desc}</p></div></article>)}
            </div>
          </section>

          <section id="ranking" className="strategy-section strategy-ranking">
            <div className="strategy-ranking-header">
              <span className="strategy-heading-icon"><TrendingUp size={23} /></span>
              <div className="strategy-heading"><p>判斷競爭位置</p><h2>個別序位怎麼看？</h2><span>序位區間能協助評估同考區、相近成績的競爭位置；仍須搭配簡章與其他資料判讀。</span></div>
            </div>
            <p className="strategy-ranking-explainer">個別序位是在自己考區內，扣除已錄取報到的學生後，再依本區超額比序順序排列得到的序位區間。它有助於判斷同分或相近分數時的相對風險。</p>
            <div className="strategy-ranking-points">
              <div><Compass size={21} /><strong>看相對位置</strong><span>同考區的競爭位置，比只看單一年的最低錄取分數更有參考價值。</span></div>
              <div><MapPinned size={21} /><strong>看區域規則</strong><span>不同就學區的比序項目與順序不同，應依所在地區解讀。</span></div>
              <div><AlertCircle size={21} /><strong>保留變動空間</strong><span>招生名額與當年度志願分布都會影響結果，序位不是錄取保證。</span></div>
            </div>
            <a className="strategy-inline-link" href="https://tyctw.github.io/score/" target="_blank" rel="noopener noreferrer">查看序位分享<ExternalLink size={15} /></a>
          </section>

          <section id="tiers" className="strategy-section">
            <div className="strategy-heading"><p>安排清單層次</p><h2>夢幻、實際、保守怎麼排？</h2><span>把想挑戰的選項、主要落點與願意就讀的保守選項都放進清單。</span></div>
            <div className="strategy-tiers">
              {tiers.map((tier, index) => <article key={tier.title} data-tone={tier.tone}><div className="strategy-tier-top"><span>0{index + 1}</span><small>{tier.label}</small></div><h3>{tier.title}</h3><p>{tier.desc}</p></article>)}
            </div>
            <div className="strategy-rule-note"><Layers size={21} /><p><strong>同校多科要核對計分方式。</strong>技高或高中附設職業類科連續填寫時，部分考區可能視為同一志願或同群計分；請以所屬考區簡章為準。</p></div>
          </section>

          <section id="workflow" className="strategy-section strategy-workflow">
            <div className="strategy-heading"><p>實際開始排序</p><h2>五步完成志願表</h2><span>先整理資料，再試排與討論；送出前做最後確認。</span></div>
            <ol className="strategy-steps">
              {workflow.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></li>)}
            </ol>
            <a href={withBasePath('/mock-volunteer')} className="strategy-workflow-cta"><span className="strategy-heading-icon"><Route size={24} /></span><span><strong>把想法變成志願草稿</strong><small>到模擬志願選填頁，實際調整順序並檢查清單。</small></span><span className="strategy-workflow-cta-action">開始試排<ArrowRight size={17} /></span></a>
          </section>

          <section id="pitfalls" className="strategy-section strategy-final-check">
            <div className="strategy-heading"><p>送出之前</p><h2>再檢查這四件事</h2><span>下面任何一項還沒確認，都值得回頭調整草稿。</span></div>
            <div className="strategy-checks">
              {pitfalls.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p><CheckCircle2 size={20} aria-hidden="true" /></div>)}
            </div>
            <p className="strategy-final-note"><ListChecks size={18} />送出前請再次核對所屬就學區的正式簡章、報名系統顯示內容與學校確認期限。</p>
          </section>
        </div>
      </div>
    </main>
  );
}
