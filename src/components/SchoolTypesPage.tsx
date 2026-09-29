import PageBreadcrumb from './PageBreadcrumb';
import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Compass,
  ExternalLink,
  GraduationCap,
  Layers,
  ArrowRight,
  Target,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageNavigation, { pageNavigationAsideClassName } from './PageNavigation';
import './school-types-page.css';

type Tone = 'emerald' | 'sky' | 'amber' | 'rose' | 'purple';

const schoolTypes: Array<{
  title: string;
  alias: string;
  years: string;
  highlight: string;
  tone: Tone;
  icon: React.ElementType;
  definition: string;
  learning: string;
  suited: string;
  nextStep: string;
  reminder: string;
}> = [
  {
    title: '普通型高級中等學校',
    alias: '普高／高中',
    years: '3 年制',
    highlight: '以學科探索為核心',
    tone: 'emerald',
    icon: BookOpen,
    definition: '依法以基本學科為主，著重強化通識能力。課程以國文、英文、數學、社會、自然等一般科目為核心，並有校訂必修與多元選修。',
    learning: '適合在學科基礎上加深加廣、透過選修探索領域；各校的班群、特色課程與選修差異很大，應逐校查看課程計畫。',
    suited: '喜歡或不排斥學科學習，想保留較多大學科系選擇，或尚在探索學術方向的學生。',
    nextStep: '畢業後可依資格與當年度簡章，透過繁星推薦、申請入學、分發入學、特殊選才等進入一般大學；也可報考科技校院或其他進路。',
    reminder: '不是每所「高中」的選修與班群都相同；不要只看校名，請比較課程地圖、加深加廣選修與通勤條件。',
  },
  {
    title: '技術型高級中等學校',
    alias: '技高／高職',
    years: '3 年制',
    highlight: '從專業與實作累積能力',
    tone: 'sky',
    icon: Compass,
    definition: '依法以專業及實習科目為主，培養專門技術與職業能力。依群、科規劃課程，包含一般科目、專業科目、實習及專題實作。',
    learning: '會較早進入特定專業領域，例如機械、電機與電子、商管、設計、餐旅、家政、外語、農業等；實際科別與實習設備依學校而異。',
    suited: '對某類職群已有初步興趣，喜歡實作、專題、操作或作品累積，也願意在三年內持續深化同一專業方向的學生。',
    nextStep: '可就業或依資格與當年度簡章，透過統測、技優保送／甄審、甄選入學、技職繁星等管道升讀科技校院；亦有其他大學進路。',
    reminder: '「有證照」不等於一定適合。先看該科課表、實習內容、專題、校外實習安排與畢業生進路，再決定。',
  },
  {
    title: '綜合型高級中等學校',
    alias: '綜高／綜中',
    years: '3 年制',
    highlight: '先探索，再選擇學程',
    tone: 'amber',
    icon: Target,
    definition: '依法提供基本學科、專業及實習課程，輔導學生選修適性課程。其精神是先探索、再依性向選擇學術或專門學程。',
    learning: '一般在前期安排共同與探索課程，後續依校內實際開設的學程選修。分流年級、可選學程及名額並非每校一致。',
    suited: '尚未確定要走學術或技職，但希望在高中階段保有試探與轉向空間，且願意主動了解學程規則的學生。',
    nextStep: '依所修學程、採計科目與當年度簡章，可規劃一般大學或科技校院的相關升學管道。',
    reminder: '務必確認「目標學程是否真的開設、何時分流、是否有人數門檻、能否選到想要的課」。校名有綜高不代表所有方向都能選。',
  },
  {
    title: '單科型高級中等學校',
    alias: '單科型高中',
    years: '3 年制',
    highlight: '集中發展明確專長',
    tone: 'rose',
    icon: GraduationCap,
    definition: '依法以特定學科領域為核心課程，讓學習性向明顯的學生持續發展潛能。常見發展方向可能與藝術、體育、科學或其他專長領域相關。',
    learning: '專長領域的課程與訓練比重較集中；入學、修課與成果要求須依個別學校或班別規定判斷。',
    suited: '已有明確興趣、能力或訓練目標，並能投入長期練習、作品、競賽或術科準備的學生。',
    nextStep: '可依專長及當年度招生規定，準備術科、作品集、競賽成果、學習歷程或相關升學考試，銜接大專校院。',
    reminder: '「單科型」是法定學校類型；一般高中裡的藝才班、體育班或特色班不必然等同於單科型高中，請以招生簡章與校方公告為準。',
  },
  {
    title: '五年制專科學校',
    alias: '五專',
    years: '5 年制',
    highlight: '較早進入專科教育',
    tone: 'purple',
    icon: Layers,
    definition: '五專招收國中畢業生，修業五年；畢業後取得副學士學位。它與前三類高中不同，屬專科教育體系，會較早、較長時間地培養專業能力。',
    learning: '課程結合一般教育、專業課程與實習；各校科可能安排證照、校外實習或專題。科別內容、實習時數與住宿條件應逐校確認。',
    suited: '對特定專業已有相當明確的興趣，希望在五年中循序累積專業與實務能力，且能接受較早選定領域的學生。',
    nextStep: '取得副學士後可就業，也可依資格與當年度規定報考二技、插班／轉學等進修管道。',
    reminder: '五專有完全免試、優先免試、聯合免試等招生方式；採計項目、時程與名額會變動，必須看當學年度簡章。',
  },
];

const comparisons = [
  ['修業與定位', '3 年，以基本學科與通識能力為主。', '3 年，以專業、實習與職業能力為主。', '3 年，結合學科與專業／實習，重點在適性選課。', '3 年，以特定領域為核心，發展明確專長。', '5 年，國中畢業後直接進入專科教育。'],
  ['學習重心', '學科加深加廣、校訂與多元選修。', '群科專業、實習、專題實作與技能養成。', '先探索，再依校內學程安排分流。', '專長領域課程、訓練與成果累積。', '一般教育加專業課程、實習與職能養成。'],
  ['較適合的狀況', '想保留大學科系探索空間，或偏好學科學習。', '已對某職群有興趣，喜歡實作或作品導向學習。', '尚未決定普高或技高，希望有探索期。', '興趣與能力已有明確方向，願長期投入。', '已大致確定專業方向，願意較早選定領域。'],
  ['畢業後常見規劃', '一般大學為主，也可規劃科技校院等進路。', '科技校院與就業為常見方向，也有其他進路。', '依修讀學程規劃一般大學或科技校院。', '依專長準備相關校系、術科或成果資料。', '取得副學士後就業，或續讀二技、插班／轉學等。'],
];

const decisionQuestions = [
  { title: '我喜歡怎麼學？', text: '比較閱讀、解題、探究、操作與實作在課表中的比重，想想哪種學習方式能讓你持續投入。' },
  { title: '方向有多明確？', text: '還想多方嘗試，就留意探索課程與選修；已有興趣，則深入看科別、設備與專題成果。' },
  { title: '畢業後想保留哪些選擇？', text: '從想去的校系或工作方向回推，確認需要準備的學科、專業、術科或作品。' },
  { title: '生活條件能配合嗎？', text: '把通勤、住宿、費用、實習地點與家庭支持一起放進選擇，避免只看校名。' },
];

function Detail({ label, text }: { label: string; text: string }) {
  return <div className="school-type-detail"><h4>{label}</h4><p>{text}</p></div>;
}

export default function SchoolTypesPage() {
  const [comparisonIndex, setComparisonIndex] = useState(1);
  const [comparisonTopic, ...comparisonValues] = comparisons[comparisonIndex];

  return (
    <main className="school-types-page">
      <section className="school-types-hero">
        <div className="school-types-shell">
          <PageBreadcrumb title="學校類型解析" />
          <div className="school-types-hero-grid">
            <div>
              <p className="school-types-kicker"><Building2 size={16} />升學路線指南</p>
              <h1>學校類型解析</h1>
              <p className="school-types-lead">普高、技高、綜高、單科型高中與五專，課程重心各不相同。先看清楚怎麼學、何時選方向，再找到適合自己的升學路線。</p>
              <div className="school-types-hero-actions">
                <a href="#overview" className="school-types-primary">先看五種類型<ArrowRight size={17} /></a>
                <a href="#choose" className="school-types-text-link">從選校問題開始<ArrowRight size={17} aria-hidden="true" /></a>
              </div>
            </div>
            <div className="school-types-hero-note" aria-label="閱讀重點">
              <span>閱讀這頁時，先想三件事</span>
              <strong>學習方式</strong><strong>探索空間</strong><strong>生活條件</strong>
              <p>不同類型沒有絕對高低；最後仍要比較個別學校的課程與當年度簡章。</p>
            </div>
          </div>
        </div>
      </section>

      <div className="school-types-layout school-types-shell">
        <aside className={pageNavigationAsideClassName}>
          <PageNavigation
            title="本頁導覽"
            navClassName="school-types-nav"
            itemLayoutClassName="school-types-nav-list"
            items={[
              { id: 'overview', label: '五種類型一眼看懂' },
              { id: 'details', label: '逐一認識學校類型' },
              { id: 'comparison', label: '依項目快速比較' },
              { id: 'choose', label: '選校前想清楚' },
              { id: 'sources', label: '官方資料與提醒' },
            ]}
          />
        </aside>

        <div className="school-types-content">
          <section id="overview" className="school-types-section">
            <div className="school-types-section-heading"><p>先看全貌</p><h2>五種類型，一眼看懂</h2><span>先用學習重心縮小方向，再往下看課程與畢業後的規劃。</span></div>
            <div className="school-types-overview-grid">
              {schoolTypes.map((type, index) => {
                const Icon = type.icon;
                return <a key={type.title} href={`#type-${index}`} data-tone={type.tone} className="school-types-overview-card">
                  <div className="school-types-overview-top"><span className="school-types-icon"><Icon size={21} /></span><span className="school-types-years">{type.years}</span></div>
                  <p className="school-types-overview-index">0{index + 1} / {type.alias}</p>
                  <h3>{type.title}</h3><p className="school-types-overview-highlight">{type.highlight}</p>
                  <span className="school-types-overview-link">了解這種類型<ArrowRight size={15} /></span>
                </a>;
              })}
            </div>
          </section>

          <section id="details" className="school-types-section">
            <div className="school-types-section-heading"><p>深入了解</p><h2>逐一認識每條路線</h2><span>同一類型內，各校課程、選修與設備仍可能差很多。</span></div>
            <div className="school-types-detail-list">
              {schoolTypes.map((type, index) => {
                const Icon = type.icon;
                return <article id={`type-${index}`} key={type.title} data-tone={type.tone} className="school-types-detail-card">
                  <div className="school-types-detail-header">
                    <span className="school-types-icon"><Icon size={23} /></span>
                    <div><p>0{index + 1} / {type.alias}</p><h3>{type.title}</h3><span>{type.highlight}</span></div>
                    <strong>{type.years}</strong>
                  </div>
                  <div className="school-types-detail-grid">
                    <Detail label="課程定位" text={type.definition} />
                    <Detail label="實際怎麼學" text={type.learning} />
                    <Detail label="適合誰考慮" text={type.suited} />
                    <Detail label="畢業後方向" text={type.nextStep} />
                  </div>
                  <div className="school-types-reminder"><strong>選擇前留意</strong><p>{type.reminder}</p></div>
                </article>;
              })}
            </div>
          </section>

          <section id="comparison" className="school-types-section school-types-comparison">
            <div className="school-types-section-heading"><p>放在一起看</p><h2>依項目快速比較</h2><span>選一個你在意的問題，就能對照五種類型。</span></div>
            <div className="school-types-comparison-tabs" role="group" aria-label="比較項目">
              {comparisons.map(([topic], index) => <button key={topic} type="button" aria-pressed={comparisonIndex === index} onClick={() => setComparisonIndex(index)}>{topic}</button>)}
            </div>
            <div className="school-types-comparison-panel" aria-live="polite">
              <h3>{comparisonTopic}</h3>
              <div className="school-types-comparison-grid">
                {schoolTypes.map((type, index) => <div key={type.title} data-tone={type.tone} className="school-types-comparison-item"><span>{type.alias}</span><p>{comparisonValues[index]}</p></div>)}
              </div>
            </div>
            <p className="school-types-comparison-note">這裡是規劃方向，實際課程與招生方式請以個別學校及當年度簡章為準。</p>
          </section>

          <section id="choose" className="school-types-section school-types-choose">
            <div className="school-types-section-heading"><p>做決定之前</p><h2>先回答這四件事</h2><span>把「喜不喜歡」與「能不能持續」一起納入選擇。</span></div>
            <div className="school-types-questions">
              {decisionQuestions.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}
            </div>
            <a className="school-types-life-link" href={withBasePath('/life-feasibility')}><div><strong>通勤、費用與住宿也要比較</strong><span>用生活條件比較單，整理候選校科的現實條件。</span></div><span>開啟比較單<ArrowRight size={17} /></span></a>
          </section>

          <section id="sources" className="school-types-section school-types-sources">
            <div className="school-types-section-heading"><p>最後確認</p><h2>回到官方資料核對</h2><span>招生名額、科別、採計方式與課程安排，可能因年度和學校而變動。</span></div>
            <div className="school-types-source-links">
              <a href="https://www.tntcsh.tn.edu.tw/ischool/publish_page/13/?cid=246" target="_blank" rel="noopener noreferrer"><BookOpen size={19} /><span><strong>高級中等教育法</strong><small>了解四類高中的法定定位</small></span><ExternalLink size={16} /></a>
              <a href="https://www.techadmi.edu.tw/guide-page.php?gid=567" target="_blank" rel="noopener noreferrer"><GraduationCap size={19} /><span><strong>五專多元入學資訊</strong><small>查看招生管道與最新公告</small></span><ExternalLink size={16} /></a>
            </div>
            <p className="school-types-final-note"><strong>填志願前：</strong>請下載當學年度、所屬招生區的正式簡章，並查閱目標學校的招生科別與課程計畫。本頁供比較方向參考。</p>
          </section>
        </div>
      </div>
    </main>
  );
}
