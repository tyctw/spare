import PageBreadcrumb from './PageBreadcrumb';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Compass, GraduationCap, HelpCircle, Route } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import './general-comprehensive-high-school-page.css';

const comparisons = [
  { label: '主要學習方向', general: '以一般學科為核心，透過選修逐步探索領域。', comprehensive: '先接觸共同與探索課程，再依校內學程選擇方向。' },
  { label: '何時決定方向', general: '入學後可依學校班群、選修安排逐步縮小範圍。', comprehensive: '通常先試探，再選學術或專門學程；分流時間依學校而異。' },
  { label: '課程要看什麼', general: '高二、高三選修、班群及加深加廣課程。', comprehensive: '實際開設學程、選課規則、名額、專業與實習課程。' },
  { label: '適合先考慮', general: '想以學科學習為主，並保留多元校系探索空間。', comprehensive: '想比較學術與技職方向，且目標學程確實有開設。' },
];

const questions = [
  { title: '我喜歡哪種學習方式？', text: '比較三年的課表：學科探究、選修、專題與實作各占多少，而不是只看學制名稱。' },
  { title: '我需要多少探索時間？', text: '若方向尚未明確，留意探索課程與轉向空間；若已有目標，就核對相關課程是否足夠。' },
  { title: '想讀的課真的選得到嗎？', text: '綜高尤其要確認學程近年是否開設、分流時間、名額及選課規則；普通科也要看班群與選修供給。' },
  { title: '未來想準備什麼？', text: '從感興趣的校系或專業回推需要的科目、學習歷程與考試，再確認學校有哪些支持。' },
];

const facts = [
  { title: '綜高是普高與技高各上一半嗎？', text: '不是把兩套課表直接相加。綜高重視前期試探與後續學程選擇，實際修課內容依學校課程計畫而異。' },
  { title: '讀綜高就一定能選到想要的學程嗎？', text: '不一定。學程開設會受師資、設備、班級數、名額與選課規則影響，應向目標學校確認。' },
  { title: '普通科只能走單一升學路線嗎？', text: '不是。普通科也有校訂選修、彈性學習與多元課程；可選方向取決於實際開課與個人準備。' },
];

const checklist = [
  '三年課程計畫，以及高二、高三實際選修清單',
  '普通科班群或綜高學程的選擇時間、名額與規則',
  '想選的課程或學程，近年是否實際開設',
  '升學輔導、學習歷程與生涯探索資源',
];

export default function GeneralComprehensiveHighSchoolPage() {
  return (
    <main className="school-path-page">
      <section className="school-path-hero">
        <div className="school-path-shell">
          <PageBreadcrumb title="普通科與綜合高中" />
          <div className="school-path-hero-grid">
            <div>
              <p className="school-path-kicker"><GraduationCap size={17} />升學路線比較</p>
              <h1>普通科與綜合高中，<br /><span>怎麼選？</span></h1>
              <p className="school-path-lead">兩者都有探索與升學空間，差別在課程重心和選擇方向的時間。先看學習方式，再比較目標學校實際開設的課。</p>
              <div className="school-path-hero-actions">
                <a href="#compare" className="school-path-primary">先看兩者差異<ArrowRight size={17} /></a>
                <a href="#checklist" className="school-path-secondary">入學前確認清單</a>
              </div>
            </div>
            <div className="school-path-hero-summary" aria-label="兩種路線摘要">
              <div><span className="school-path-summary-icon school-path-general"><BookOpen size={22} /></span><div><small>普通科</small><strong>以學科為核心，透過選修探索</strong></div></div>
              <div><span className="school-path-summary-icon school-path-comprehensive"><Compass size={22} /></span><div><small>綜合高中</small><strong>先試探，再依校內學程選方向</strong></div></div>
              <p>沒有絕對較好的選項，關鍵是課程與你的需求是否相符。</p>
            </div>
          </div>
        </div>
      </section>

      <div className="school-path-shell school-path-content">
        <section id="compare" className="school-path-section">
          <div className="school-path-heading"><p>先掌握重點</p><h2>普通科與綜高，差在哪裡？</h2><span>用同樣的四個問題比較，比只看學校名稱更容易判斷。</span></div>
          <div className="school-path-comparison" role="table" aria-label="普通科與綜合高中比較">
            <div className="school-path-comparison-head" role="row"><span role="columnheader">比較重點</span><strong role="columnheader"><BookOpen size={18} />普通科</strong><strong role="columnheader"><Compass size={18} />綜合高中</strong></div>
            {comparisons.map((row) => <div className="school-path-comparison-row" role="row" key={row.label}><strong role="rowheader">{row.label}</strong><p role="cell" data-label="普通科">{row.general}</p><p role="cell" data-label="綜合高中">{row.comprehensive}</p></div>)}
          </div>
          <p className="school-path-caption">實際分流年級、班群與學程安排，請以各校當年度課程計畫為準。</p>
        </section>

        <section id="routes" className="school-path-section">
          <div className="school-path-heading"><p>深入了解</p><h2>兩條路線各自怎麼學？</h2><span>從課程到升學準備，看看哪一種節奏更接近你的需求。</span></div>
          <div className="school-path-route-grid">
            <article className="school-path-route-card" data-tone="general"><span className="school-path-route-icon"><BookOpen size={24} /></span><small>01 / 普通型高中</small><h3>普通科</h3><p className="school-path-route-intro">以一般學科為主，透過校訂必修、選修與彈性學習延伸興趣。</p><div className="school-path-route-points"><div><strong>課程樣貌</strong><p>語文、數學、社會、自然科學等一般科目是核心；各校的班群與高二、高三選修安排不同。</p></div><div><strong>可以怎麼準備</strong><p>參考目標校系要求，規劃選修、學習歷程與考試準備，也可逐步探索不同大學科系。</p></div></div><p className="school-path-route-foot">適合想以學科學習為主，並保留多元領域探索空間的學生。</p></article>
            <article className="school-path-route-card" data-tone="comprehensive"><span className="school-path-route-icon"><Compass size={24} /></span><small>02 / 綜合型高中</small><h3>綜合高中</h3><p className="school-path-route-intro">先透過共同與探索課程試探，再依性向選擇學術或專門學程。</p><div className="school-path-route-points"><div><strong>課程樣貌</strong><p>高一通常偏向統整與試探；後續修讀學程的時間、科目與可選方向須看各校規劃。</p></div><div><strong>可以怎麼準備</strong><p>學術學程可規劃相關大學進路；專門學程結合專業與實習課程，可規劃技職進路。</p></div></div><p className="school-path-route-foot">適合還想比較學術與技職方向，且目標學校確實提供想選學程的學生。</p></article>
          </div>
        </section>

        <section id="decide" className="school-path-section school-path-decision">
          <div className="school-path-heading"><p>做決定之前</p><h2>用四個問題找到方向</h2><span>選學校時，把自己的學習方式與學校能提供的資源放在一起看。</span></div>
          <div className="school-path-question-grid">{questions.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
        </section>

        <section id="misunderstandings" className="school-path-section">
          <div className="school-path-heading"><p>釐清疑問</p><h2>三個常見誤解</h2></div>
          <div className="school-path-facts">{facts.map((fact) => <article key={fact.title}><HelpCircle size={20} /><div><h3>{fact.title}</h3><p>{fact.text}</p></div></article>)}</div>
        </section>

        <section id="checklist" className="school-path-section school-path-checklist">
          <div className="school-path-heading"><p>確認後再選</p><h2>入學前，向學校確認這四項</h2><span>尤其是綜高學程與普通科班群，請看實際開課，不只看招生文案。</span></div>
          <ul>{checklist.map((item) => <li key={item}><CheckCircle2 size={20} /><span>{item}</span></li>)}</ul>
          <p>入學與升學規定可能調整，最後請核對當年度招生簡章與學校公布的課程計畫。</p>
        </section>

        <a href={withBasePath('/grade-11-pathways')} className="school-path-next"><span className="school-path-next-icon"><Route size={25} /></span><span><small>延伸閱讀</small><strong>高二「班群」是什麼？怎麼選？</strong><span>接著了解班群課程、選群流程與後續規劃。</span></span><ArrowRight size={22} /></a>
      </div>
    </main>
  );
}
