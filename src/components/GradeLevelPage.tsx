import PageBreadcrumb from './PageBreadcrumb';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Award, BookOpen, CheckCircle2, Info, Layers, Table2 } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import MobileContentsNav from './MobileContentsNav';
import './grade-level-page.css';

type YearKey = '115' | '114';

const levelDescriptions = [
  { mark: 'A++', level: '精熟', desc: '精熟，且答對題數前 25%', meaning: '具備深入概念與高階思考能力', tone: 'indigo' },
  { mark: 'A+', level: '精熟', desc: '精熟，且答對題數 26%~50%', meaning: '具備深入概念', tone: 'indigo' },
  { mark: 'A', level: '精熟', desc: '精熟', meaning: '具備該學科完整概念', tone: 'indigo' },
  { mark: 'B++', level: '基礎', desc: '基礎，且答對題數前 25%', meaning: '具備部分基礎', tone: 'emerald' },
  { mark: 'B+', level: '基礎', desc: '基礎，且答對題數 26%~50%', meaning: '具備部分基礎', tone: 'emerald' },
  { mark: 'B', level: '基礎', desc: '基礎', meaning: '具備基本學科知識', tone: 'emerald' },
  { mark: 'C', level: '待加強', desc: '待加強', meaning: '尚未具備基礎學科知識', tone: 'rose' },
];

const yearlyTables: Record<YearKey, Array<Record<string, string>>> = {
  '115': [
    { level: '精熟', mark: 'A++', chinese: '答對 40-42 題', social: '答對 52-54 題', science: '答對 47-50 題', english: '98.14-100.00', math: '91.60-100.00' },
    { level: '精熟', mark: 'A+', chinese: '答對 39 題', social: '答對 51 題', science: '答對 46 題', english: '96.28-98.13', math: '85.70-91.59' },
    { level: '精熟', mark: 'A', chinese: '答對 36-38 題', social: '答對 48-50 題', science: '答對 43-45 題', english: '90.70-96.27', math: '77.10-85.69' },
    { level: '基礎', mark: 'B++', chinese: '答對 32-35 題', social: '答對 41-47 題', science: '答對 36-42 題', english: '82.30-90.69', math: '68.70-77.09' },
    { level: '基礎', mark: 'B+', chinese: '答對 28-31 題', social: '答對 34-40 題', science: '答對 29-35 題', english: '69.28-82.29', math: '59.40-68.69' },
    { level: '基礎', mark: 'B', chinese: '答對 17-27 題', social: '答對 20-33 題', science: '答對 19-28 題', english: '38.43-69.27', math: '39.00-59.39' },
    { level: '待加強', mark: 'C', chinese: '答對 0-16 題', social: '答對 0-19 題', science: '答對 0-18 題', english: '00.00-38.42', math: '00.00-38.99' },
  ],
  '114': [
    { level: '精熟', mark: 'A++', chinese: '答對 40-42 題', social: '答對 52-54 題', science: '答對 48-50 題', english: '98.14-100.00', math: '93.20-100.00' },
    { level: '精熟', mark: 'A+', chinese: '答對 38-39 題', social: '答對 51 題', science: '答對 46-47 題', english: '95.33-98.13', math: '85.70-93.19' },
    { level: '精熟', mark: 'A', chinese: '答對 36-37 題', social: '答對 48-50 題', science: '答對 43-45 題', english: '90.70-95.32', math: '76.20-85.69' },
    { level: '基礎', mark: 'B++', chinese: '答對 32-35 題', social: '答對 41-47 題', science: '答對 36-42 題', english: '82.21-90.69', math: '67.10-76.19' },
    { level: '基礎', mark: 'B+', chinese: '答對 28-31 題', social: '答對 35-40 題', science: '答對 29-35 題', english: '71.05-83.20', math: '59.40-67.09' },
    { level: '基礎', mark: 'B', chinese: '答對 18-27 題', social: '答對 21-34 題', science: '答對 18-28 題', english: '38.43-71.04', math: '40.60-59.39' },
    { level: '待加強', mark: 'C', chinese: '答對 0-17 題', social: '答對 0-20 題', science: '答對 0-17 題', english: '00.00-38.42', math: '00.00-40.59' },
  ],
};

type SubjectKey = 'chinese' | 'social' | 'science' | 'english' | 'math';
const subjects: { key: SubjectKey; label: string; unit: string }[] = [
  { key: 'chinese', label: '國文', unit: '答對題數' },
  { key: 'social', label: '社會', unit: '答對題數' },
  { key: 'science', label: '自然', unit: '答對題數' },
  { key: 'english', label: '英語', unit: '加權成績' },
  { key: 'math', label: '數學', unit: '加權成績' },
];

export default function GradeLevelPage() {
  const [activeYear, setActiveYear] = useState<YearKey>('115');
  const [activeSubject, setActiveSubject] = useState<SubjectKey>('chinese');
  const rows = yearlyTables[activeYear];
  const subject = subjects.find((item) => item.key === activeSubject)!;

  return <main className="grade-level-page"><div className="grade-level-shell">
    <PageBreadcrumb title="會考成績等級" />
    <header className="grade-level-hero"><div><span className="grade-level-eyebrow"><Award size={17} aria-hidden="true" />國中教育會考・成績參考</span><h1>等級對照表</h1><p>先認識 A、B、C 與加號標示，再查不同年度各科的答對題數與加權成績區間。</p></div><div className="grade-level-hero-aside"><Info size={22} aria-hidden="true" /><strong>等級和標示，分開看更清楚</strong><p>A++、A+、B++、B+ 是同一等級內的細分標示；招生積分仍須依就學區規則換算。</p></div></header>
    <nav className="grade-level-jump" aria-label="本頁內容"><a href="#grade-level-overview">成績等級</a><a href="#grade-level-marks">加號標示</a><a href="#grade-level-table">年度對照</a><a href="#grade-level-notes">使用提醒</a></nav><MobileContentsNav items={[{ id: 'grade-level-overview', label: '成績等級' }, { id: 'grade-level-marks', label: '加號標示' }, { id: 'grade-level-table', label: '年度對照' }, { id: 'grade-level-notes', label: '使用提醒' }]} />

    <section className="grade-level-section" id="grade-level-overview"><div className="grade-level-heading"><span>01 / 先看大方向</span><h2>會考成績分成三個等級</h2><p>五科以精熟、基礎、待加強呈現；加號標示再細分同一等級內的表現。</p></div><div className="grade-level-summary"><article data-tone="a"><span>精熟</span><strong>A</strong><p>A++・A+・A</p></article><article data-tone="b"><span>基礎</span><strong>B</strong><p>B++・B+・B</p></article><article data-tone="c"><span>待加強</span><strong>C</strong><p>C</p></article></div></section>

    <section className="grade-level-section" id="grade-level-marks"><div className="grade-level-heading"><span>02 / 讀懂標示</span><h2>同一等級裡，加號代表什麼？</h2><p>依標示由高到低排列；下方文字幫助理解標示意義，實際題數要看當年度對照。</p></div><div className="grade-level-mark-list">{levelDescriptions.map((item) => <article className="grade-level-mark" data-tone={item.tone} key={item.mark}><span className="grade-level-mark-label">{item.mark}</span><div><strong>{item.desc}</strong><p>{item.meaning}</p></div><span className="grade-level-mark-group">{item.level}</span></article>)}</div></section>

    <section className="grade-level-section grade-level-table-section" id="grade-level-table"><div className="grade-level-table-head"><div className="grade-level-heading"><span>03 / 依年度查詢</span><h2>{activeYear} 年各科等級對照</h2><p>國文、社會、自然看答對題數；英語、數學看加權成績。</p></div><div className="grade-level-year-switch" aria-label="選擇會考年度">{(['115', '114'] as YearKey[]).map((year) => <button key={year} type="button" aria-pressed={activeYear === year} onClick={() => setActiveYear(year)}>{year} 年</button>)}</div></div>
      <div className="grade-level-desktop-table"><table><caption className="sr-only">{activeYear} 年各科成績等級對照表</caption><thead><tr><th scope="col">等級</th><th scope="col">標示</th><th scope="col">國文<br /><small>答對題數</small></th><th scope="col">社會<br /><small>答對題數</small></th><th scope="col">自然<br /><small>答對題數</small></th><th scope="col">英語<br /><small>加權成績</small></th><th scope="col">數學<br /><small>加權成績</small></th></tr></thead><tbody>{rows.map((row) => <tr key={row.mark} data-tone={row.mark[0].toLowerCase()}><td>{row.level}</td><th scope="row"><span>{row.mark}</span></th><td>{row.chinese}</td><td>{row.social}</td><td>{row.science}</td><td>{row.english}</td><td>{row.math}</td></tr>)}</tbody></table></div>
      <div className="grade-level-mobile-table"><div className="grade-level-subject-switch" aria-label="選擇科目">{subjects.map((item) => <button key={item.key} type="button" aria-pressed={activeSubject === item.key} onClick={() => setActiveSubject(item.key)}>{item.label}</button>)}</div><p className="grade-level-subject-caption">{subject.label}・{subject.unit}</p><div className="grade-level-mobile-rows">{rows.map((row) => <div key={row.mark} className="grade-level-mobile-row" data-tone={row.mark[0].toLowerCase()}><span>{row.mark}<small>{row.level}</small></span><strong>{row[activeSubject]}</strong></div>)}</div></div>
      <p className="grade-level-table-footnote">以上區間僅適用所選年度；每年試題與等級標示區間可能不同。</p>
    </section>

    <section className="grade-level-section" id="grade-level-notes"><div className="grade-level-heading"><span>04 / 使用提醒</span><h2>查完對照表，再確認這三件事</h2></div><div className="grade-level-notes"><article><BookOpen size={23} aria-hidden="true" /><strong>年度不能混用</strong><p>答對題數區間可能逐年調整，請以你參加會考的年度公告為準。</p></article><article><Layers size={23} aria-hidden="true" /><strong>英數看加權成績</strong><p>英語與數學欄位是加權成績區間，不能直接當成答對題數。</p></article><article><CheckCircle2 size={23} aria-hidden="true" /><strong>落點還要看考區</strong><p>想試算落點，請選擇就學區並輸入五科與寫作測驗成績。</p></article></div></section>
    <div className="grade-level-next"><div><Table2 size={25} aria-hidden="true" /><strong>準備用成績找學校嗎？</strong><p>回到首頁選擇就學區，查看適合的校科與志願方向。</p></div><a href={withBasePath('/')}>開始落點分析 <ArrowRight size={17} aria-hidden="true" /></a></div>
  </div></main>;
}
