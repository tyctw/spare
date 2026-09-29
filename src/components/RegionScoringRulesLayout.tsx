import PageBreadcrumb from './PageBreadcrumb';
import { ArrowLeft, ArrowRight, BookOpenCheck, Calculator, ChevronDown, ExternalLink, FileText, MapPin, Scale } from 'lucide-react';
import { ALL_REGIONS } from './RegionModal';
import { withBasePath } from '../lib/routes';
import type { RegionRule } from './RegionScoringRulesPage';
import './region-scoring-rules-page.css';

type ScoreRow = NonNullable<RegionRule['comparisonTable']>[number];

function ScoreDetails({ rows }: { rows: ScoreRow[] }) {
  return <div className="scoring-details">
    {rows.map((row, index) => <details className="scoring-detail" key={`${row.category}-${row.item}-${index}`}>
      <summary>
        <span className="scoring-detail-category">{row.category}</span>
        <strong>{row.item}</strong>
        <span className="scoring-detail-max">類別上限 {row.maximum}</span>
        <ChevronDown size={18} aria-hidden="true" />
      </summary>
      <div className="scoring-detail-body">
        {row.conversion.length > 0 && <div><h4>積分換算</h4><ul>{row.conversion.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul></div>}
        {row.description.length > 0 && <div><h4>說明與限制</h4><ul>{row.description.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</ul></div>}
      </div>
    </details>)}
  </div>;
}

function NumberedList({ items }: { items: string[] }) {
  return <ol className="scoring-order">{items.map((item, index) => <li key={`${index}-${item}`}><span>{String(index + 1).padStart(2, '0')}</span><p>{item}</p></li>)}</ol>;
}

export default function RegionScoringRulesLayout({ regionId, data }: { regionId: string; data: RegionRule }) {
  const region = ALL_REGIONS.find((item) => item.id === regionId)!;
  const regions = ALL_REGIONS.filter((item) => item.active);

  return <main className="scoring-page">
    <div className="scoring-shell">
      <PageBreadcrumb title={`${region.name}計分方式`} />
      <header className="scoring-hero">
        <div className="scoring-hero-copy">
          <span className="scoring-eyebrow"><MapPin size={16} aria-hidden="true" />115 學年度・一般免試入學</span>
          <h1>{region.name}<span>計分方式</span></h1>
          <p>{data.overview}</p>
          <span className="scoring-locality">適用地區：{region.desc}</span>
        </div>
        <div className="scoring-total"><span>超額比序總積分</span><strong>{data.total}<small>分</small></strong><p>各項採計與上限請依下方規則核對</p></div>
      </header>

      <nav className="scoring-region-nav" aria-label="切換就學區">
        <div><span>切換就學區</span><p>選擇地區，查看對應的積分與比序方式</p></div>
        <div className="scoring-region-links">{regions.map((item) => <a key={item.id} href={withBasePath(`/scoring-rules/${item.id}`)} aria-current={item.id === regionId ? 'page' : undefined}>{item.name}</a>)}</div>
      </nav>

      <div className="scoring-notice"><BookOpenCheck size={22} aria-hidden="true" /><div><strong>閱讀前先確認招生管道</strong><p>本頁整理 115 學年度一般免試入學。優先免試、完全免試、技優甄審與個別學校招生可能另有規定；報名資格與實際採計仍以官方簡章為準。</p>{data.entryNote && <p>{data.entryNote}</p>}</div></div>

      <section className="scoring-section" aria-labelledby="scoring-parts"><div className="scoring-section-heading"><span>01 / 積分架構</span><h2 id="scoring-parts">先看分數怎麼組成</h2><p>各項採計上限與主要換算方式，一次看清楚。</p></div><div className="scoring-rule-grid">{data.rules.map((rule, index) => <article className="scoring-rule" key={`${rule.title}-${index}`}><div className="scoring-rule-head"><span>{String(index + 1).padStart(2, '0')}</span><strong>{rule.maximum}</strong></div><h3>{rule.title}</h3><p>{rule.description}</p><ul>{rule.points.map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}</ul></article>)}</div></section>

      {data.comparisonTable && <section className="scoring-section" aria-labelledby="scoring-conversion"><div className="scoring-section-heading"><span>02 / 詳細換算</span><h2 id="scoring-conversion">逐項查詢積分</h2><p>點開項目查看換算標準與採計說明，手機上也能直接閱讀。</p></div><ScoreDetails rows={data.comparisonTable} /></section>}

      <div className="scoring-two-column"><section className="scoring-panel" aria-labelledby="scoring-exam"><div className="scoring-panel-title"><Calculator size={22} aria-hidden="true" /><h2 id="scoring-exam">會考成績怎麼看</h2></div><ul>{data.exam.map((item, index) => <li key={index}>{item}</li>)}</ul></section><section className="scoring-panel" aria-labelledby="scoring-reminders"><div className="scoring-panel-title"><BookOpenCheck size={22} aria-hidden="true" /><h2 id="scoring-reminders">填志願前核對</h2></div><ul>{data.reminders.map((item, index) => <li key={index}>{item}</li>)}</ul></section></div>

      {data.tieBreakOrder && <section className="scoring-section" aria-labelledby="scoring-order"><div className="scoring-section-heading"><span>03 / 同分比序</span><h2 id="scoring-order">同分時，依什麼順序比？</h2><p>依序往下比較；實際細節以各區最新簡章為準。</p></div><NumberedList items={data.tieBreakOrder} /></section>}

      {data.specialNotes && <section className="scoring-section scoring-notes" aria-labelledby="scoring-notes"><div className="scoring-section-heading"><span>補充資訊</span><h2 id="scoring-notes">其他採計與資格提醒</h2></div><ul>{data.specialNotes.map((note, index) => <li key={index}><FileText size={18} aria-hidden="true" /><span>{note}</span></li>)}</ul></section>}

      {data.futureRule && <section className="scoring-section scoring-future" aria-labelledby="scoring-future"><div className="scoring-section-heading"><span>未來學年度預告・尚未適用於 115 學年度</span><h2 id="scoring-future">{data.futureRule.title}</h2></div><ul className="scoring-future-intro">{data.futureRule.announcements.map((item, index) => <li key={index}>{item}</li>)}</ul><p className="scoring-future-total">預告總積分：<strong>{data.futureRule.total} 分</strong></p><h3>預告積分換算</h3><ScoreDetails rows={data.futureRule.table} /><h3>超額比序順序</h3><NumberedList items={data.futureRule.tieBreakOrder} /><ul className="scoring-future-notes">{data.futureRule.notes.map((note, index) => <li key={index}>{note}</li>)}</ul></section>}

      <section className="scoring-source"><div><Scale size={27} aria-hidden="true" /><h2>最後請核對官方簡章</h2><p>招生名額、校科限制、採計期間、文件及同分比序，以官方最新公告為準。</p></div><a href={data.source} target="_blank" rel="noopener noreferrer">{data.sourceLabel}<ExternalLink size={17} aria-hidden="true" /></a></section>
      <a className="scoring-end-link" href={withBasePath('/')}>返回落點分析首頁 <ArrowRight size={16} aria-hidden="true" /></a>
    </div>
  </main>;
}
