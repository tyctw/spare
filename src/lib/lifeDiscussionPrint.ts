type Candidate = {
  name: string;
  commute: number;
  transfers: number;
  cost: number;
  stay: 'home' | 'dorm' | 'undecided';
  lateReturn: boolean;
  familySupport: boolean;
  notes: string;
};

type PrintData = {
  student: { name: string; className: string; date: string };
  budget: number;
  candidates: Candidate[];
  results: { label: string; warnings: string[] }[];
  decision: string;
  discussion: string;
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character] || character);

const content = (value: string, fallback = '尚未填寫') => value.trim()
  ? escapeHtml(value.trim())
  : `<span class="empty">${fallback}</span>`;

const money = (value: number) => new Intl.NumberFormat('zh-TW').format(value);

export function buildLifeDiscussionHtml(data: PrintData): string {
  const decisionText = data.decision === 'candidate-0'
    ? data.candidates[0].name || '選項 A'
    : data.decision === 'candidate-1'
      ? data.candidates[1].name || '選項 B'
      : data.decision === 'more' ? '再找其他選項' : '';

  const candidateCards = data.candidates.map((candidate, index) => {
    const result = data.results[index];
    const warnings = result.warnings.length
      ? `<ul>${result.warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join('')}</ul>`
      : '<p class="okay">目前沒有明顯生活負擔警訊。</p>';
    const stay = candidate.stay === 'home' ? '每天回家' : candidate.stay === 'dorm' ? '住宿／租屋' : '尚未決定';

    return `<article class="candidate">
      <div class="card-heading"><span class="eyebrow">選項 ${index === 0 ? 'A' : 'B'}</span><span class="status">${escapeHtml(result.label)}</span></div>
      <h3>${content(candidate.name, '候選學校／科別尚未填寫')}</h3>
      <div class="metrics">
        <div><span>單程通勤</span><strong>${money(candidate.commute)} 分鐘</strong></div>
        <div><span>轉乘</span><strong>${money(candidate.transfers)} 次</strong></div>
        <div><span>每月費用</span><strong>NT$ ${money(candidate.cost)}</strong></div>
      </div>
      <dl class="details"><div><dt>生活安排</dt><dd>${stay}</dd></div><div><dt>可能晚歸</dt><dd>${candidate.lateReturn ? '是' : '否'}</dd></div><div><dt>已和家人討論</dt><dd>${candidate.familySupport ? '是' : '尚未'}</dd></div></dl>
      <div class="note"><strong>需要先處理的條件</strong>${warnings}</div>
      <div class="note"><strong>還要確認什麼？</strong><p>${content(candidate.notes, '討論時補充')}</p></div>
    </article>`;
  }).join('');

  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>生活條件討論單</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #edf0f7; color: #172139; font-family: "Noto Sans TC", "Microsoft JhengHei", sans-serif; }
    .sheet { width: min(210mm, calc(100% - 24px)); min-height: 270mm; margin: 12px auto; padding: 14mm; background: white; box-shadow: 0 10px 28px #1e293b1c; }
    header { border-bottom: 2px solid #43318c; padding-bottom: 14px; }
    .eyebrow { color: #513d9e; font-size: 11px; font-weight: 800; letter-spacing: .12em; }
    h1 { margin: 5px 0 7px; font-size: 28px; line-height: 1.25; }
    header p, .caption { margin: 0; color: #475569; font-size: 12px; line-height: 1.65; }
    section { margin-top: 20px; }
    h2 { margin: 0 0 10px; font-size: 16px; }
    .basics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .basics div, .metrics div { border: 1px solid #d5dceb; border-radius: 9px; padding: 9px 10px; }
    .basics span, .metrics span { display: block; color: #64748b; font-size: 10px; }
    .basics strong, .metrics strong { display: block; margin-top: 3px; font-size: 12px; overflow-wrap: anywhere; }
    .cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    .candidate { border: 1px solid #c9d2e6; border-radius: 12px; padding: 13px; break-inside: avoid; }
    .card-heading { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
    .status { border-radius: 99px; background: #eef0fc; color: #3b3178; padding: 4px 8px; font-size: 10px; font-weight: 700; }
    h3 { min-height: 30px; margin: 8px 0; font-size: 16px; overflow-wrap: anywhere; }
    .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
    .metrics div { padding: 7px; }
    .metrics strong { font-size: 11px; }
    .details { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; margin: 10px 0; font-size: 10px; }
    .details dt { color: #64748b; }
    .details dd { margin: 3px 0 0; font-weight: 700; }
    .note { border-top: 1px solid #e1e6f0; padding-top: 8px; margin-top: 8px; font-size: 11px; line-height: 1.55; }
    .note strong { display: block; }
    .note p { margin: 4px 0 0; white-space: pre-wrap; overflow-wrap: anywhere; }
    .note ul { margin: 5px 0 0; padding-left: 18px; }
    .okay { color: #047857; }
    .decision { border: 1px solid #c9d2e6; border-radius: 10px; padding: 12px; }
    .decision p { margin: 5px 0 0; font-size: 12px; line-height: 1.6; white-space: pre-wrap; overflow-wrap: anywhere; }
    .empty { color: #94a3b8; font-weight: 400; }
    footer { margin-top: 14px; border-top: 1px solid #d5dceb; padding-top: 8px; color: #64748b; font-size: 10px; line-height: 1.5; }
    @media (max-width: 680px) { .basics { grid-template-columns: repeat(2, 1fr); } .cards { grid-template-columns: 1fr; } .sheet { padding: 18px; } }
    @page { size: A4; margin: 10mm; }
    @media print { body { background: white; } .sheet { width: auto; min-height: 0; margin: 0; padding: 0; box-shadow: none; } .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  </style></head><body>
    <main class="sheet"><header><span class="eyebrow">STUDENT DECISION WORKSHEET</span><h1>生活條件討論單</h1><p>把通勤、費用與生活安排放在一起，和家人或老師討論下一步。</p></header>
      <section><h2>基本資料</h2><div class="basics"><div><span>學生姓名</span><strong>${content(data.student.name)}</strong></div><div><span>班級／座號</span><strong>${content(data.student.className)}</strong></div><div><span>填寫日期</span><strong>${content(data.student.date)}</strong></div><div><span>每月預算</span><strong>NT$ ${money(data.budget)}</strong></div></div></section>
      <section><h2>兩個選項的生活條件</h2><div class="cards">${candidateCards}</div></section>
      <section><h2>討論結論</h2><div class="decision"><span class="eyebrow">目前優先保留</span><p>${content(decisionText, '尚未決定')}</p><div class="note"><strong>和家人／老師討論後</strong><p>${content(data.discussion, '討論時補充')}</p></div></div></section>
      <footer>本表供討論與規劃使用；交通、住宿及招生資訊請再向相關單位確認。</footer>
    </main></body></html>`;
}
