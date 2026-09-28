import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BarChart3, BookOpen, ChevronDown, GraduationCap, Info, TrendingDown, TrendingUp } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import { table114, table115 } from './HistoricalStatsModal';
import './historical-stats-page.css';

type YearKey = '115' | '114';

const yearlyData: Record<YearKey, string[][]> = {
  '115': table115,
  '114': table114,
};

const toNumber = (value: string) => Number(value.replace(/,/g, '')) || 0;

const getSummary = (rows: string[][]) => {
  const total = rows.reduce((sum, row) => sum + toNumber(row[1]), 0);
  const fiveA = rows.find((row) => row[0] === '5A0B0C');
  const zeroA = rows.find((row) => row[0] === '0A5B0C');
  const threeAPlusTotal = rows
    .filter((row) => Number(row[0][0]) >= 3)
    .reduce((sum, row) => sum + toNumber(row[1]), 0);

  return {
    total,
    fiveACount: fiveA ? toNumber(fiveA[1]) : 0,
    fiveARate: fiveA?.[2] || '0%',
    zeroACount: zeroA ? toNumber(zeroA[1]) : 0,
    zeroARate: zeroA?.[2] || '0%',
    threeAPlusCount: threeAPlusTotal,
    threeAPlusRate: total ? `${((threeAPlusTotal / total) * 100).toFixed(2)}%` : '0%',
  };
};

const formatNumber = (value: number) => value.toLocaleString('zh-TW');

const tableHeaders = [
  '等級組合',
  '人數',
  '占比',
  '作文 6 級分',
  '6 級分組內占比',
  '6 級分全體占比',
  '作文 5 級分',
  '5 級分組內占比',
  '5 級分全體占比',
  '作文 4 級分',
  '4 級分組內占比',
  '4 級分全體占比',
  '作文 3 級以下',
  '3 級以下組內占比',
  '3 級以下全體占比',
];

const focusRows = ['5A0B0C', '4A1B0C', '3A2B0C', '2A3B0C', '1A4B0C', '0A5B0C'];

export default function HistoricalStatsPage() {
  const [activeYear, setActiveYear] = useState<YearKey>('115');
  const rows = yearlyData[activeYear];
  const comparisonYear: YearKey = activeYear === '115' ? '114' : '115';
  const comparisonRows = yearlyData[comparisonYear];
  const currentSummary = useMemo(() => getSummary(rows), [rows]);
  const comparisonSummary = useMemo(() => getSummary(comparisonRows), [comparisonRows]);
  const fiveADiff = currentSummary.fiveACount - comparisonSummary.fiveACount;
  const focusData = focusRows.map((mark) => ({ current: rows.find((row) => row[0] === mark)!, comparison: comparisonRows.find((row) => row[0] === mark)! }));
  const writingGroups = [
    { name: '6 級分', start: 3 }, { name: '5 級分', start: 6 },
    { name: '4 級分', start: 9 }, { name: '3 級以下', start: 12 },
  ];

  return <main className="historical-page"><div className="historical-shell">
    <a className="historical-back" href={withBasePath('/')}><ArrowLeft size={17} aria-hidden="true" />返回首頁</a>
    <header className="historical-hero"><div><span className="historical-eyebrow"><BarChart3 size={17} aria-hidden="true" />會考成績分布參考</span><h1>歷年會考統計資料</h1><p>用年度摘要與等級組合比較，掌握五科成績及寫作測驗的整體分布。</p></div><div className="historical-hero-note"><Info size={22} aria-hidden="true" /><strong>看分布，也要看招生規則</strong><p>統計顯示整體人數與占比，不能直接當作個別學校的錄取門檻。</p></div></header>
    <nav className="historical-jump" aria-label="本頁內容"><a href="#historical-overview">年度摘要</a><a href="#historical-focus">重點組合</a><a href="#historical-table">完整資料</a><a href="#historical-notes">判讀提醒</a></nav>

    <section className="historical-section" id="historical-overview"><div className="historical-section-top"><div className="historical-heading"><span>01 / 年度總覽</span><h2>{activeYear} 學年度成績分布</h2><p>切換年度後，下方摘要、比較圖與完整資料會一起更新。</p></div><div className="historical-year-switch" aria-label="選擇會考學年度">{(['115', '114'] as YearKey[]).map((year) => <button key={year} type="button" aria-pressed={activeYear === year} onClick={() => setActiveYear(year)}>{year} 學年度</button>)}</div></div>
      <div className="historical-summary"><SummaryCard title="統計總人數" value={formatNumber(currentSummary.total)} note="本年度統計樣本" tone="neutral" /><SummaryCard title="5A0B0C" value={formatNumber(currentSummary.fiveACount)} note={`全體占比 ${currentSummary.fiveARate}`} tone="purple" /><SummaryCard title="3A 以上合計" value={formatNumber(currentSummary.threeAPlusCount)} note={`全體占比 ${currentSummary.threeAPlusRate}`} tone="blue" /><SummaryCard title="0A5B0C" value={formatNumber(currentSummary.zeroACount)} note={`全體占比 ${currentSummary.zeroARate}`} tone="peach" /></div>
      <div className="historical-difference">{fiveADiff >= 0 ? <TrendingUp size={21} aria-hidden="true" /> : <TrendingDown size={21} aria-hidden="true" />}<p><strong>與 {comparisonYear} 學年度相比：</strong>5A0B0C 人數{fiveADiff >= 0 ? '增加' : '減少'} <b>{formatNumber(Math.abs(fiveADiff))} 人</b>。兩年統計總人數不同，請連同占比一起看。</p></div>
    </section>

    <section className="historical-section" id="historical-focus"><div className="historical-heading"><span>02 / 快速比較</span><h2>常見等級組合的年度變化</h2><p>每列顯示該組合在全體中的占比；橫條長度依占比繪製。</p></div><div className="historical-chart"><div className="historical-chart-legend"><span><i />{activeYear} 學年度</span><span><i />{comparisonYear} 學年度</span></div>{focusData.map(({ current, comparison }) => <div className="historical-chart-row" key={current[0]}><div className="historical-chart-name"><strong>{current[0]}</strong><span>{formatNumber(toNumber(current[1]))} 人</span></div><div className="historical-chart-bars"><div><span style={{ width: `${Math.min(100, parseFloat(current[2]) * 4)}%` }} /><b>{current[2]}</b></div><div><span style={{ width: `${Math.min(100, parseFloat(comparison[2]) * 4)}%` }} /><b>{comparison[2]}</b></div></div></div>)}</div><p className="historical-chart-note">橫條以 25% 作為圖表刻度上限，請以右側數字判讀實際占比。</p></section>

    <section className="historical-section" id="historical-table"><div className="historical-heading"><span>03 / 深入查詢</span><h2>{activeYear} 學年度完整分布</h2><p>包含全部等級組合的人數、全體占比，以及寫作測驗各級分的組內與全體占比。</p></div><div className="historical-table-wrap"><table><caption className="sr-only">{activeYear} 學年度會考等級組合與寫作測驗分布</caption><thead><tr>{tableHeaders.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={index}>{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
      <div className="historical-mobile-rows">{rows.map((row) => <details key={row[0]} className="historical-detail"><summary><span><strong>{row[0]}</strong><small>{row[2]} 全體占比</small></span><b>{formatNumber(toNumber(row[1]))} 人</b><ChevronDown size={18} aria-hidden="true" /></summary><div className="historical-detail-body">{writingGroups.map((group) => <div key={group.name}><strong>{group.name}</strong><dl><div><dt>人數</dt><dd>{formatNumber(toNumber(row[group.start]))}</dd></div><div><dt>組內占比</dt><dd>{row[group.start + 1]}</dd></div><div><dt>全體占比</dt><dd>{row[group.start + 2]}</dd></div></dl></div>)}</div></details>)}</div><p className="historical-table-note">手機版可點選等級組合，展開完整的寫作級分資料。</p></section>

    <section className="historical-section" id="historical-notes"><div className="historical-heading"><span>04 / 判讀提醒</span><h2>統計資料怎麼用，才不會看錯？</h2></div><div className="historical-notes"><article><BookOpen size={23} aria-hidden="true" /><strong>分布不等於錄取門檻</strong><p>統計資料適合觀察整體分布，無法直接推算單一學校錄取標準。</p></article><article><GraduationCap size={23} aria-hidden="true" /><strong>作文級分也要看</strong><p>部分就學區會在超額比序中使用寫作測驗，不能只看五科 A／B／C 組合。</p></article><article><Info size={23} aria-hidden="true" /><strong>依當年度簡章確認</strong><p>正式志願選填仍應以招生委員會及學校最新公告為準。</p></article></div></section>
    <div className="historical-next"><div><BarChart3 size={26} aria-hidden="true" /><strong>想把統計與自己的成績一起看？</strong><p>回首頁填寫會考成績，查看各校科的落點分析結果。</p></div><a href={withBasePath('/')}>開始落點分析 <ArrowRight size={17} aria-hidden="true" /></a></div>
  </div></main>;
}

function SummaryCard({ title, value, note, tone }: { title: string; value: string; note: string; tone: string }) {
  return <article className="historical-summary-card" data-tone={tone}><span>{title}</span><strong>{value}</strong><small>{note}</small></article>;
}
