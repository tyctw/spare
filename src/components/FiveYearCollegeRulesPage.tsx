import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ExternalLink, FileText, GraduationCap, Info, ListOrdered, ShieldCheck } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageNavigation, { pageNavigationAsideClassName } from './PageNavigation';
import './strategy-page.css';
import './five-year-college-rules-page.css';

const officialSite = 'https://www.jctv.ntut.edu.tw/u5/';
const officialGuide = 'https://www.jctv.ntut.edu.tw/u5/contents.php?academicYear=115&subId=261';
const officialFaq = 'https://www.jctv.ntut.edu.tw/u5/contents.php?academicYear=115&subId=260';

const scoreGroups = [
  { id: 'choices', title: '志願序', score: 26, summary: '依志願排序給分', details: ['第 1–5 志願為 26 分，每往後一組（5 個志願）遞減 1 分。', '最多可填 30 個志願。'] },
  { id: 'activities', title: '多元學習表現', score: 15, summary: '競賽與服務學習合計', details: ['競賽最高 7 分，依賽事層級與名次採計。', '服務學習最高 15 分；幹部任滿一學期 2 分，服務每滿一小時 0.25 分。', '兩者合計仍以 15 分為上限。'] },
  { id: 'skills', title: '技藝優良', score: 3, summary: '依技藝教育課程成績換算', details: ['90 分以上 3 分；80–未滿 90 分 2.5 分。', '70–未滿 80 分 1.5 分；60–未滿 70 分 1 分。'] },
  { id: 'support', title: '弱勢身分', score: 3, summary: '依符合的身分資格採計', details: ['低收入戶 3 分。', '中低收入戶、支領失業給付或特殊境遇家庭 1.5 分。'] },
  { id: 'balance', title: '均衡學習', score: 21, summary: '檢視國中五學期學習表現', details: ['符合條件的領域每個 7 分，最高 21 分。', '108 學年度起入學國中者，依健康與體育、藝術、綜合活動及科技四領域規定採計；更早入學者適用領域不同。'] },
  { id: 'exam', title: '會考與寫作', score: 33, summary: '五科最高 32 分、寫作最高 1 分', details: ['國文、數學、英語、自然、社會五科按等級與標示換算。', '寫作測驗按級分換算，最高 1 分。'] },
] as const;

const choiceScores = [
  { range: '1–5', score: 26 }, { range: '6–10', score: 25 }, { range: '11–15', score: 24 },
  { range: '16–20', score: 23 }, { range: '21–25', score: 22 }, { range: '26–30', score: 21 },
];
const examScores = [
  { grade: 'A++', score: '6.4' }, { grade: 'A+', score: '6' }, { grade: 'A', score: '5' },
  { grade: 'B++', score: '4' }, { grade: 'B+', score: '3' }, { grade: 'B', score: '2' }, { grade: 'C', score: '1' },
];
const writingScores = [
  { grade: '6', score: '1' }, { grade: '5', score: '0.8' }, { grade: '4', score: '0.6' },
  { grade: '3', score: '0.4' }, { grade: '2', score: '0.2' }, { grade: '1', score: '0.1' },
];
const priorities = [
  { title: '先比主項目', start: 1, items: ['均衡學習', '技藝優良', '志願序', '弱勢身分', '多元學習表現', '國中教育會考（含寫作測驗）'] },
  { title: '仍同分，再比分項目', start: 7, items: ['服務學習', '競賽'] },
  { title: '最後依序比會考科目', start: 9, items: ['國文', '數學', '英語', '自然', '社會', '寫作測驗級分'] },
];

export default function FiveYearCollegeRulesPage() {
  return <main className="strategy-page college-page">
    <section className="strategy-hero">
      <div className="strategy-shell">
        <a href={withBasePath('/')} className="strategy-back"><ArrowLeft size={16} />返回首頁</a>
        <div className="strategy-hero-grid">
          <div>
            <p className="strategy-kicker"><GraduationCap size={17} />五專升學・計分指南</p>
            <h1>五專優先免試入學<br />計分規則</h1>
            <p className="strategy-lead">從總積分、志願序到同分比序，依照查閱順序整理。先看懂分數怎麼組成，再逐項核對採計條件。</p>
            <div className="strategy-hero-actions">
              <a href="#score-overview" className="strategy-primary">查看積分項目<ArrowRight size={17} /></a>
              <a href="#tie-break" className="strategy-secondary">查看同分比序</a>
            </div>
          </div>
          <aside className="strategy-hero-note" aria-label="計分資料適用年度">
            <span className="strategy-note-icon"><ShieldCheck size={23} /></span>
            <p>115 學年度資料參考</p>
            <h2>最高 101 分</h2>
            <span>本頁依 115 學年度規則整理。116 學年度日期、文件與採計細節，請以招生委員會公布的正式簡章為準。</span>
            <a href={officialSite} target="_blank" rel="noopener noreferrer" className="strategy-inline-link">查詢 116 學年度官網<ExternalLink size={15} /></a>
          </aside>
        </div>
      </div>
    </section>

    <div className="strategy-layout strategy-shell">
      <aside className={pageNavigationAsideClassName}>
        <PageNavigation title="本頁導覽" navClassName="strategy-nav" itemLayoutClassName="strategy-nav-list" items={[
          { id: 'score-overview', label: '101 分怎麼組成' },
          { id: 'score-details', label: '六項採計細節' },
          { id: 'conversion', label: '志願序與會考換算' },
          { id: 'tie-break', label: '同分比序' },
          { id: 'verify', label: '報名前確認' },
        ]} />
      </aside>

      <div className="strategy-content">
        <section id="score-overview" className="strategy-section">
          <div className="strategy-heading"><p>先掌握總分</p><h2>101 分由哪些項目組成？</h2><span>六個主項目加總；下方顯示的是各項最高分，實際得分仍要依成績與資格認定。</span></div>
          <div className="college-score-overview">
            <div className="college-score-total"><strong>101</strong><span>分／總積分上限</span></div>
            <div className="college-score-breakdown" aria-label="六個積分項目">
              {scoreGroups.map((group, index) => <a key={group.id} href={`#${group.id}`}><span className="college-score-index">{String(index + 1).padStart(2, '0')}</span><span>{group.title}</span><strong>{group.score} 分</strong></a>)}
            </div>
          </div>
          <div className="strategy-rule-note"><Info size={21} /><p><strong>分項上限不能直接相加。</strong>競賽最高 7 分、服務學習最高 15 分，但「多元學習表現」兩項合計仍以 15 分為上限。</p></div>
        </section>

        <section id="score-details" className="strategy-section">
          <div className="strategy-heading"><p>逐項核對</p><h2>六項採計細節</h2><span>先看主項目的採計範圍，再核對自己的成績與證明文件。</span></div>
          <div className="college-detail-list">
            {scoreGroups.map((group, index) => <article id={group.id} key={group.id}>
              <div className="college-detail-top"><span className="college-detail-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{group.title}</h3><p>{group.summary}</p></div><strong>{group.score}<small>分上限</small></strong></div>
              <ul>{group.details.map((detail) => <li key={detail}><CheckCircle2 size={16} aria-hidden="true" />{detail}</li>)}</ul>
            </article>)}
          </div>
        </section>

        <section id="conversion" className="strategy-section">
          <div className="strategy-heading"><p>快速對照</p><h2>志願序與會考怎麼換算？</h2><span>用下方對照分數；其餘積分仍須依簡章與證明文件認定。</span></div>
          <div className="college-conversion-grid">
            <div className="college-conversion-card"><h3>志願序積分</h3><p>每五個志願為一組，越前面分數越高。</p><div className="college-choice-grid">{choiceScores.map((item) => <div key={item.range}><span>第 {item.range} 志願</span><strong>{item.score} 分</strong></div>)}</div></div>
            <div className="college-conversion-card"><h3>國中教育會考</h3><p>五科各自換算，合計最高 32 分。</p><div className="college-exam-grid">{examScores.map((item) => <div key={item.grade}><span>{item.grade}</span><strong>{item.score} 分</strong></div>)}</div><div className="college-writing"><strong>寫作測驗</strong><p>{writingScores.map((item, index) => <span key={item.grade}>{index ? '　' : ''}{item.grade} 級＝{item.score} 分</span>)}</p></div></div>
          </div>
        </section>

        <section id="tie-break" className="strategy-section">
          <div className="strategy-heading"><p>總積分相同時</p><h2>同分比序怎麼進行？</h2><span>先依總積分排定順位；若相同，再照 1 至 14 的順序逐項比較。</span></div>
          <div className="college-priority">
            {priorities.map((group) => <div key={group.title} className="college-priority-group"><h3><ListOrdered size={18} />{group.title}</h3><ol start={group.start}>{group.items.map((item, index) => <li key={item}><span>{String(group.start + index).padStart(2, '0')}</span><p>{item}</p></li>)}</ol></div>)}
          </div>
          <div className="strategy-rule-note"><Info size={21} /><p><strong>招生管道要分開看。</strong>這裡是五專優先免試入學的比序；五專聯合免試入學另有規定。</p></div>
        </section>

        <section id="verify" className="strategy-section strategy-final-check">
          <div className="strategy-heading"><p>報名之前</p><h2>最後再確認三件事</h2><span>參考規則算完分數後，還要回到當年度官方資訊核對。</span></div>
          <div className="strategy-checks">
            <div><span>01</span><p><strong>採計期限：</strong>競賽、服務等資料有年度截止日期，不沿用去年的日期。</p><CheckCircle2 size={20} aria-hidden="true" /></div>
            <div><span>02</span><p><strong>證明文件：</strong>技藝、弱勢身分及多元學習表現須依簡章備妥文件。</p><CheckCircle2 size={20} aria-hidden="true" /></div>
            <div><span>03</span><p><strong>校科採計：</strong>不同校科的會考採計規定可能不同，填志願前逐一核對。</p><CheckCircle2 size={20} aria-hidden="true" /></div>
          </div>
          <p className="strategy-final-note"><FileText size={18} />以下連結提供當年度公告與本頁參考資料的原始來源。</p>
          <div className="college-source-links"><a href={officialSite} target="_blank" rel="noopener noreferrer">116 學年度官方網站<ExternalLink size={15} /></a><a href={officialGuide} target="_blank" rel="noopener noreferrer">115 學年度簡章<ExternalLink size={15} /></a><a href={officialFaq} target="_blank" rel="noopener noreferrer">115 學年度常見問題<ExternalLink size={15} /></a></div>
        </section>

        <div className="college-next-links"><a href={withBasePath('/important-dates')}><BookOpen size={20} />查看重要日程<ArrowRight size={16} /></a><a href="https://www.jctv.ntut.edu.tw/nenter5/" target="_blank" rel="noopener noreferrer"><FileText size={20} />查看五專聯合免試資訊<ExternalLink size={16} /></a></div>
      </div>
    </div>
  </main>;
}
