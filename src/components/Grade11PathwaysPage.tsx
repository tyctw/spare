import { ArrowLeft, ArrowRight, BookOpen, Check, ClipboardList, Compass, ExternalLink, GraduationCap, Route, SearchCheck } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import MobileContentsNav from './MobileContentsNav';
import './grade-11-pathways-page.css';

const pathTypes = [
  { number: '01', title: '人文社會取向', subtitle: '適合想深入理解人與社會的你', description: '常見歷史、地理、公民與社會等加深加廣選修，也可能搭配語文、外語及跨領域專題。', topics: ['人文、社科、法律', '商管、外語與傳播'], tone: 'peach' },
  { number: '02', title: '自然科學取向', subtitle: '適合喜歡探究科學與數理的你', description: '常見數學、物理、化學、生物及地球科學相關課程；也要確認實驗、探究與實作的安排。', topics: ['理工與資訊', '生命科學、醫藥衛生'], tone: 'blue' },
  { number: '03', title: '跨域與特色班群', subtitle: '從學校實際課表認識特色', description: '可能以數理、語文、資訊、醫農或設計等命名。名稱與課程組合由學校規劃，不能只看名稱判斷。', topics: ['依校本課程安排', '可跨領域探索'], tone: 'lavender' },
];

const chooseSteps = [
  { title: '看興趣', text: '找出願意長期投入的學科與議題。' },
  { title: '看能力', text: '回顧高一的學習狀況與待補強科目。' },
  { title: '看課程', text: '比較課名、學分、開課年級及選修限制。' },
  { title: '看進路', text: '核對感興趣校系的最新採計與審查要求。' },
  { title: '確認彈性', text: '問清楚轉群、跨班選修和補修的可行性。' },
];

const schoolQuestions = [
  '這個班群高二、高三各學期實際開哪些課？',
  '加深加廣選修能選到幾門？可以跨班群修課嗎？',
  '分發依志願、成績、名額或其他條件嗎？',
  '能轉群嗎？最晚何時？已修課程如何銜接？',
  '近年是否因人數不足停開過課程？',
];

const changePlan = [
  '先確認目標課程仍有開設、是否衝堂，以及是否需要先修。',
  '及早找導師、輔導室與教務處討論轉群和補修期限。',
  '即使無法轉群，也可評估跨班選修、多元選修與自主學習。',
  '申請大學仍依當年度校系規定準備，班群名稱不是審查標準。',
];

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="grade11-section-heading"><span>{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

function CheckList({ items }: { items: string[] }) {
  return <ul className="grade11-check-list">{items.map((item) => <li key={item}><Check size={16} aria-hidden="true" /><span>{item}</span></li>)}</ul>;
}

export default function Grade11PathwaysPage() {
  return <main className="grade11-page">
    <div className="grade11-shell">
      <a className="grade11-back" href={withBasePath('/general-comprehensive-high-school')}><ArrowLeft size={17} aria-hidden="true" />普通科與綜合高中</a>

      <header className="grade11-hero">
        <div className="grade11-hero-copy"><span className="grade11-eyebrow"><GraduationCap size={17} aria-hidden="true" />高一升高二・選課指南</span><h1>高二「班群」<br /><em>是什麼？怎麼選？</em></h1><p>從感興趣的校系回頭看課程，再比較學校的班群安排。掌握選課、分流與轉群規則，讓高二的選擇更有方向。</p><a href="#grade11-steps" className="grade11-primary">從五步選群開始 <ArrowRight size={17} aria-hidden="true" /></a></div>
        <div className="grade11-hero-note"><span>選群前記住</span><strong>看課程，<br />不只看名稱。</strong><p>班群是校內課程安排；各校名稱與實際開課不一定相同。</p><div className="grade11-hero-note-line"><BookOpen size={18} aria-hidden="true" />課程計畫是最重要的參考</div></div>
      </header>

      <nav className="grade11-jump" aria-label="本頁內容"><a href="#grade11-basics">認識班群</a><a href="#grade11-directions">比較方向</a><a href="#grade11-steps">選群步驟</a><a href="#grade11-check">選前核對</a></nav><MobileContentsNav items={[{ id: 'grade11-basics', label: '認識班群' }, { id: 'grade11-directions', label: '比較方向' }, { id: 'grade11-steps', label: '選群步驟' }, { id: 'grade11-check', label: '選前核對' }]} />

      <section className="grade11-section" id="grade11-basics"><SectionHeading eyebrow="01 / 先釐清觀念" title="班群是學校安排課程的方式" description="不是全國統一的類組，也不會單靠班群名稱決定你能申請哪些校系。" /><div className="grade11-basics"><article><span>班群的功能</span><h3>讓選修與共同課程更容易安排</h3><p>學校可依生涯進路與興趣安排部分加深加廣課程，並規劃分班與跨班選課。</p></article><article><span>各校不相同</span><h3>名稱相似，課表可能不同</h3><p>班群名稱、課程組合、分班時間、名額、選課和轉群方式，都應逐校確認。</p></article><article><span>真正要比較</span><h3>高二、高三實際修得到什麼</h3><p>查看課程地圖、學分、開課年級，以及能否跨班群選修，再對照目標校系要求。</p></article></div></section>

      <section className="grade11-section" id="grade11-directions"><SectionHeading eyebrow="02 / 看見不同方向" title="常見班群，可以從課程理解" description="以下是常見取向，僅用來幫助探索；實際分類與課程仍以學校公告為準。" /><div className="grade11-path-grid">{pathTypes.map((path) => <article className="grade11-path" data-tone={path.tone} key={path.title}><span className="grade11-path-number">{path.number} / 課程方向</span><h3>{path.title}</h3><strong>{path.subtitle}</strong><p>{path.description}</p><div>{path.topics.map((topic) => <span key={topic}>{topic}</span>)}</div></article>)}</div><div className="grade11-ab-note"><strong>數學 A／B 要另外核對</strong><p>學測數學 A、數學 B 是不同考科，範圍分別包含高二必修 A 類或 B 類。選班群前，請對照學校提供的課程與擬報校系採計科目，不要只從「自然」或「社會」名稱推斷。</p></div></section>

      <section className="grade11-section grade11-clusters"><SectionHeading eyebrow="課程與升學探索" title="班群與 18 學群，怎麼連起來看？" description="把學群當作探索方向，再依個別校系的採計科目與審查重點核對。" /><div className="grade11-cluster-grid"><article><span>自然取向常連結</span><p>資訊、工程、數理化、醫藥衛生、生命科學、生物資源、地球與環境等學群；部分財經、管理及運動相關校系也重視數學或自然能力。</p></article><article><span>社會取向常連結</span><p>社會心理、大眾傳播、外語、文史哲、教育、法政、管理、財經等學群；藝術、設計等校系還須看作品、術科或特定採計。</p></article></div><div className="grade11-formula"><span>查核順序</span><strong>想讀的校系 <ArrowRight size={18} aria-hidden="true" /> 當年度校系要求 <ArrowRight size={18} aria-hidden="true" /> 學校實際課程</strong></div></section>

      <section className="grade11-section" id="grade11-steps"><SectionHeading eyebrow="03 / 做出選擇" title="用五步驟找到適合的班群" description="先了解自己，再核對想修的課和未來校系要求。" /><ol className="grade11-steps">{chooseSteps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol><div className="grade11-action"><SearchCheck size={23} aria-hidden="true" /><p>先列出感興趣的 3 至 5 個學系或學群，再下載自己入學年度適用的學校課程計畫，對照高二、高三的必修與選修。</p></div></section>

      <section className="grade11-section grade11-check" id="grade11-check"><SectionHeading eyebrow="04 / 選前核對" title="把關鍵問題問清楚" description="同一個班群名稱，在不同學校可能代表完全不同的修課經驗。" /><div className="grade11-check-grid"><article><div className="grade11-card-title"><ClipboardList size={22} aria-hidden="true" /><h3>選群前，向學校確認</h3></div><CheckList items={schoolQuestions} /></article><article><div className="grade11-card-title"><Route size={22} aria-hidden="true" /><h3>選群後改變目標，也有辦法</h3></div><CheckList items={changePlan} /></article></div></section>

      <section className="grade11-footer"><div><Compass size={27} aria-hidden="true" /><h2>先認識學校類型，再決定升學方向</h2><p>若還在比較普通科與綜合高中，可回到學校類型介紹，確認不同課程路線的差異。</p></div><a href={withBasePath('/general-comprehensive-high-school')}>比較學校類型 <ExternalLink size={17} aria-hidden="true" /></a></section>
    </div>
  </main>;
}
