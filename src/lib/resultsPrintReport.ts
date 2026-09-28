import { formatSchoolOwnership } from './schoolDisplay';

type School = {
  name?: unknown;
  group?: unknown;
  type?: unknown;
  ownership?: unknown;
  zone?: unknown;
  minScore?: unknown;
  points?: unknown;
  score?: unknown;
};

type PrintPayload = {
  identity?: string;
  vocationalGroups?: string[];
  scores: Record<string, unknown>;
  results: {
    totalPoints?: unknown;
    totalCredits?: unknown;
    eligibleSchools?: School[];
    scoringMethod?: unknown;
    analysisReport?: {
      analysisSummary?: unknown;
      suggestion?: unknown;
      scoringExplanation?: unknown;
      zoneCounts?: { reach?: unknown; target?: unknown; safe?: unknown };
    };
  };
};

const escapeHtml = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const display = (value: unknown) => value === null || value === undefined || value === '' ? '—' : escapeHtml(value);
const count = (value: unknown) => Math.max(0, Number(value) || 0);
const zoneLabel = (zone: unknown) => zone === 'reach' ? '夢幻區' : zone === 'target' ? '實際區' : zone === 'safe' ? '保守區' : '未分類';
const zoneClass = (zone: unknown) => zone === 'reach' || zone === 'target' || zone === 'safe' ? zone : 'other';

export function buildResultsPrintHtml(data: PrintPayload, regionName: string): string {
  const schools = Array.isArray(data.results.eligibleSchools) ? data.results.eligibleSchools : [];
  const report = data.results.analysisReport;
  const zones = {
    reach: count(report?.zoneCounts?.reach ?? schools.filter((school) => school.zone === 'reach').length),
    target: count(report?.zoneCounts?.target ?? schools.filter((school) => school.zone === 'target').length),
    safe: count(report?.zoneCounts?.safe ?? schools.filter((school) => school.zone === 'safe').length),
  };
  const zoneTotal = zones.reach + zones.target + zones.safe;
  const identity = data.identity === 'teacher' ? '老師' : data.identity === 'parent' ? '家長' : '學生';
  const ownership = data.scores.schoolOwnership === 'public' ? '公立' : data.scores.schoolOwnership === 'private' ? '私立' : '公私立不拘';
  const schoolType = data.scores.schoolType === 'all' ? '普通與職業類科' : display(data.scores.schoolType);
  const groups = data.scores.schoolType === '職業類科' && data.vocationalGroups?.length
    ? data.vocationalGroups.includes('all') ? '全群別不拘' : data.vocationalGroups.map(escapeHtml).join('、')
    : '';
  const generatedAt = new Date().toLocaleString('zh-TW', { hour12: false });

  const scores = [
    ['國文', data.scores.chinese], ['英文', data.scores.english], ['數學', data.scores.math],
    ['自然', data.scores.science], ['社會', data.scores.social], ['寫作測驗', data.scores.composition],
  ].map(([label, value]) => `<div class="score"><span>${label}</span><strong>${display(value)}${label === '寫作測驗' ? '<small>級分</small>' : ''}</strong></div>`).join('');

  const schoolRows = schools.map((school, index) => {
    const group = school.group ?? school.type;
    const threshold = school.minScore ?? school.points ?? school.score;
    return `<tr><td class="index">${index + 1}</td><td class="school">${display(school.name)}</td><td>${display(group)}<span class="ownership">${escapeHtml(formatSchoolOwnership(school.ownership))}</span></td><td><span class="zone-tag ${zoneClass(school.zone)}">${zoneLabel(school.zone)}</span></td><td class="threshold">${display(threshold)}</td></tr>`;
  }).join('');

  const scoringExplanation = data.results.scoringMethod ?? report?.scoringExplanation;
  const zoneBar = zoneTotal > 0 ? `<div class="zone-bar" aria-label="落點區間比例"><span class="reach" style="width:${(zones.reach / zoneTotal) * 100}%"></span><span class="target" style="width:${(zones.target / zoneTotal) * 100}%"></span><span class="safe" style="width:${(zones.safe / zoneTotal) * 100}%"></span></div>` : '';

  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>116 學年度會考落點分析報告｜${escapeHtml(regionName)}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #eef1f7; color: #192238; font-family: "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif; line-height: 1.5; }
    .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; max-width: 210mm; margin: 16px auto 10px; padding: 0 8px; }
    .toolbar p { margin: 0; color: #56627b; font-size: 12px; }
    .btn-print { flex: none; border: 0; border-radius: 10px; background: #473493; color: #fff; padding: 11px 18px; font: inherit; font-size: 13px; font-weight: 800; cursor: pointer; }
    .btn-print:hover { background: #382775; }
    .btn-print:focus-visible { outline: 3px solid #f59e0b; outline-offset: 3px; }
    .report { width: min(210mm, calc(100% - 24px)); margin: 0 auto 24px; padding: 13mm 14mm; background: #fff; box-shadow: 0 14px 42px #24325b1a; }
    .masthead { display: flex; justify-content: space-between; gap: 18px; padding-bottom: 15px; border-bottom: 2px solid #4f3d9b; }
    .eyebrow { color: #5c45aa; font-size: 10px; font-weight: 850; letter-spacing: .13em; }
    h1 { margin: 5px 0 7px; font-size: 27px; letter-spacing: -.02em; line-height: 1.22; }
    .masthead p { margin: 0; color: #64718a; font-size: 11px; }
    .issue { align-self: start; min-width: 90px; border: 1px solid #d8d2ed; border-radius: 8px; padding: 8px 10px; color: #403075; text-align: right; }
    .issue span { display: block; color: #7c719a; font-size: 9px; }
    .issue strong { font-size: 13px; }
    section { margin-top: 19px; }
    h2 { display: flex; align-items: center; gap: 7px; margin: 0 0 9px; font-size: 15px; line-height: 1.35; }
    h2::before { width: 4px; height: 17px; border-radius: 4px; background: #7058c2; content: ""; }
    .meta { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 7px; }
    .meta div, .score, .stat, .zone, .text-panel { border: 1px solid #dce2ee; border-radius: 9px; background: #fbfcff; }
    .meta div { min-height: 48px; padding: 8px 9px; }
    .meta span, .score span, .stat span { display: block; color: #68758d; font-size: 10px; }
    .meta strong { display: block; margin-top: 3px; font-size: 12px; overflow-wrap: anywhere; }
    .scores-summary { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(165px, 1fr); gap: 8px; }
    .scores { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; }
    .score { padding: 9px; }
    .score strong { display: block; margin-top: 2px; color: #30246c; font-size: 19px; line-height: 1.2; }
    .score small { margin-left: 3px; color: #68758d; font-size: 9px; }
    .stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
    .stat { padding: 9px; }
    .stat strong { display: block; margin-top: 5px; color: #30246c; font-size: 22px; line-height: 1.1; }
    .stat.wide { grid-column: 1 / -1; background: #f2effc; border-color: #d4c9ee; }
    .zones { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 7px; }
    .zone { display: flex; align-items: baseline; justify-content: space-between; gap: 5px; padding: 8px 10px; }
    .zone span { color: #5b6982; font-size: 11px; }
    .zone strong { font-size: 17px; white-space: nowrap; }
    .zone.reach strong { color: #a44263; } .zone.target strong { color: #285ca6; } .zone.safe strong { color: #24725c; }
    .zone-bar { display: flex; height: 5px; overflow: hidden; margin-top: 7px; border-radius: 99px; background: #e7eaf1; }
    .zone-bar .reach { background: #d6869d; } .zone-bar .target { background: #7da8e4; } .zone-bar .safe { background: #78bca5; }
    .text-panel { padding: 11px 13px; color: #344158; font-size: 11px; line-height: 1.7; white-space: pre-wrap; overflow-wrap: anywhere; }
    .text-panel p { margin: 0; }
    .text-panel p + p { margin-top: 8px; }
    .note { margin: 7px 0 0; color: #65718a; font-size: 10px; line-height: 1.6; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    th { background: #ece9f8; color: #35286d; text-align: left; font-weight: 800; }
    th, td { border-bottom: 1px solid #dfe4ee; padding: 7px 6px; vertical-align: top; }
    tbody tr:nth-child(even) { background: #fafbfe; }
    .index { width: 32px; color: #69758b; text-align: center; }
    .school { width: 36%; font-weight: 750; overflow-wrap: anywhere; }
    .ownership { display: block; margin-top: 2px; color: #78839a; font-size: 9px; }
    .zone-tag { display: inline-block; border-radius: 5px; padding: 2px 5px; font-size: 9px; font-weight: 800; white-space: nowrap; }
    .zone-tag.reach { background: #f9e9ef; color: #983b5b; } .zone-tag.target { background: #e7f0fb; color: #285ca6; } .zone-tag.safe { background: #e8f5ef; color: #24725c; } .zone-tag.other { background: #eef0f4; color: #526078; }
    .threshold { width: 70px; font-weight: 750; text-align: right; }
    .empty-list { border: 1px dashed #cdd5e4; border-radius: 9px; padding: 20px; color: #65718a; text-align: center; font-size: 12px; }
    .disclaimer { margin-top: 20px; border-top: 1px solid #cdd5e4; padding-top: 10px; color: #65718a; font-size: 9px; line-height: 1.65; }
    .disclaimer strong { color: #344158; }
    @media (max-width: 680px) { .toolbar { margin: 12px; align-items: flex-start; } .report { padding: 20px; } .issue { display: none; } .meta { grid-template-columns: repeat(2, minmax(0, 1fr)); } .scores-summary { grid-template-columns: 1fr; } .zone { padding: 8px 6px; } .zone span { font-size: 10px; } .zone strong { font-size: 14px; } .table-wrap table { min-width: 580px; } }
    @page { size: A4 portrait; margin: 10mm; }
    @media print { body { background: #fff; print-color-adjust: exact; -webkit-print-color-adjust: exact; } .toolbar { display: none; } .report { width: auto; margin: 0; padding: 0; box-shadow: none; } .table-wrap { overflow: visible; } .table-wrap table { min-width: 0; } thead { display: table-header-group; } tr, .meta div, .score, .stat, .zone, .text-panel { break-inside: avoid; } .school-list { break-before: page; } }
  </style></head><body>
    <div class="toolbar"><p>請先確認報告內容，再列印或另存 PDF。</p><button class="btn-print" type="button">列印／另存 PDF</button></div>
    <main class="report">
      <header class="masthead"><div><span class="eyebrow">TW ADMISSION REPORT · 116 學年度</span><h1>會考落點分析報告</h1><p>報告產生時間：${escapeHtml(generatedAt)}</p></div><div class="issue"><span>分析區域</span><strong>${escapeHtml(regionName)}</strong></div></header>
      <section><h2>本次分析條件</h2><div class="meta"><div><span>就學區</span><strong>${escapeHtml(regionName)}</strong></div><div><span>使用者身份</span><strong>${identity}</strong></div><div><span>學校屬性</span><strong>${ownership}</strong></div><div><span>學校類型</span><strong>${schoolType}</strong></div>${groups ? `<div><span>職業群別</span><strong>${groups}</strong></div>` : ''}</div></section>
      <section><h2>會考成績與分析摘要</h2><div class="scores-summary"><div class="scores">${scores}</div><div class="stats"><div class="stat"><span>總積分</span><strong>${display(data.results.totalPoints)}</strong></div><div class="stat"><span>總積點</span><strong>${display(data.results.totalCredits)}</strong></div><div class="stat wide"><span>符合條件的校科</span><strong>${schools.length} 所</strong></div></div></div></section>
      <section><h2>落點區間</h2><div class="zones"><div class="zone reach"><span>夢幻區</span><strong>${zones.reach} 所</strong></div><div class="zone target"><span>實際區</span><strong>${zones.target} 所</strong></div><div class="zone safe"><span>保守區</span><strong>${zones.safe} 所</strong></div></div>${zoneBar}</section>
      ${(report?.analysisSummary || report?.suggestion) ? `<section><h2>完整落點判讀</h2><div class="text-panel">${report.analysisSummary ? `<p>${display(report.analysisSummary)}</p>` : ''}${report.suggestion ? `<p><strong>策略建議：</strong>${display(report.suggestion)}</p>` : ''}</div></section>` : ''}
      ${scoringExplanation ? `<section><h2>計分方式說明</h2><div class="text-panel"><p>${display(scoringExplanation)}</p></div></section>` : ''}
      <section class="school-list"><h2>推薦校科清單 <span class="note">共 ${schools.length} 所，依本次分析順序列示</span></h2>${schools.length ? `<div class="table-wrap"><table><thead><tr><th class="index">#</th><th>學校／科別</th><th>群別與屬性</th><th>落點</th><th class="threshold">參考門檻</th></tr></thead><tbody>${schoolRows}</tbody></table></div>` : '<div class="empty-list">目前沒有符合條件的推薦校科。</div>'}<p class="note">落點區間和門檻為規劃參考；實際志願排序請再核對通勤、校風與招生簡章。</p></section>
      <footer class="disclaimer"><strong>資料使用提醒</strong><br>分析結果僅供升學規劃參考，無法保證錄取。招生名額、計分及比序規則請以各就學區當年度官方招生簡章與公告為準。<br>TW 全國會考落點分析 · 非政府官方機構</footer>
    </main></body></html>`;
}
