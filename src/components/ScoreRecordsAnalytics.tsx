import { useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, CalendarDays, ChartNoAxesCombined, CircleHelp, Target } from 'lucide-react';
import './score-records-page.css';

type SubjectKey = 'chinese' | 'english' | 'math' | 'science' | 'social';
type Scores = Record<SubjectKey, string> & { composition: number | '' };
export type AnalyticsRecord = {
  id: string;
  record_type: 'mock' | 'official';
  title: string;
  exam_date: string | null;
  created_at: string;
  scores: Scores;
};

const subjects: { key: SubjectKey; label: string }[] = [
  { key: 'chinese', label: '國文' },
  { key: 'english', label: '英文' },
  { key: 'math', label: '數學' },
  { key: 'science', label: '自然' },
  { key: 'social', label: '社會' },
];
const gradeOrder = ['C', 'B', 'B+', 'B++', 'A', 'A+', 'A++'];
const gradeRank = (grade: string) => gradeOrder.indexOf(grade);
const examKey = (record: AnalyticsRecord) => record.exam_date || record.created_at.slice(0, 10);
const chronological = (records: AnalyticsRecord[]) => [...records].sort((a, b) =>
  examKey(a).localeCompare(examKey(b)) || a.created_at.localeCompare(b.created_at),
);
const shortDate = (record: AnalyticsRecord) => {
  const value = examKey(record);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value.slice(5).replace('-', '/') : value;
};
const gradeBand = (grade: string) => grade.startsWith('A') ? 'A' : grade.startsWith('B') ? 'B' : 'C';

function LevelChart({ records, subject }: { records: AnalyticsRecord[]; subject: SubjectKey }) {
  const width = Math.max(610, 114 + Math.max(records.length - 1, 1) * 88);
  const left = 55;
  const right = 30;
  const top = 22;
  const bottom = 65;
  const height = 300;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const x = (index: number) => records.length === 1 ? left + plotWidth / 2 : left + (index / (records.length - 1)) * plotWidth;
  const y = (rank: number) => top + ((6 - rank) / 6) * plotHeight;
  const points = records.map((record, index) => ({
    x: x(index),
    y: y(Math.max(gradeRank(record.scores[subject]), 0)),
    record,
  }));
  return (
    <div className="score-chart-scroll" tabIndex={0} aria-label="科目等級趨勢圖，可水平捲動">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${subjects.find((item) => item.key === subject)?.label}模擬考等級趨勢；詳細數值列於圖表下方`}>
        {gradeOrder.map((grade, index) => {
          const lineY = y(index);
          return <g key={grade}>
            <line x1={left} x2={width - right} y1={lineY} y2={lineY} stroke="#e4e9f3" strokeDasharray={index === 0 ? undefined : '4 5'} />
            <text x={left - 12} y={lineY + 4} textAnchor="end" className="score-chart-axis">{grade}</text>
          </g>;
        })}
        {points.length > 1 && <polyline points={points.map((point) => `${point.x},${point.y}`).join(' ')} fill="none" stroke="#4b5fb5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
        {points.map(({ x: pointX, y: pointY, record }) => <g key={record.id}>
          <circle cx={pointX} cy={pointY} r="6.5" fill="#4b5fb5" stroke="#fff" strokeWidth="3"><title>{record.title}：{record.scores[subject]}</title></circle>
          <text x={pointX} y={height - 34} textAnchor="middle" className="score-chart-date">{shortDate(record)}</text>
          <text x={pointX} y={height - 16} textAnchor="middle" className="score-chart-record">{record.title.length > 8 ? `${record.title.slice(0, 7)}…` : record.title}</text>
        </g>)}
      </svg>
    </div>
  );
}

function WritingChart({ records }: { records: AnalyticsRecord[] }) {
  const width = Math.max(610, 114 + Math.max(records.length - 1, 1) * 88);
  const left = 55;
  const right = 30;
  const top = 20;
  const bottom = 65;
  const height = 230;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const x = (index: number) => records.length === 1 ? left + plotWidth / 2 : left + (index / (records.length - 1)) * plotWidth;
  return <div className="score-chart-scroll" tabIndex={0} aria-label="寫作級分圖，可水平捲動">
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="歷次模擬考寫作級分；詳細數值列於圖表下方">
      {[0, 2, 4, 6].map((level) => {
        const lineY = top + ((6 - level) / 6) * plotHeight;
        return <g key={level}><line x1={left} x2={width - right} y1={lineY} y2={lineY} stroke="#e4e9f3" strokeDasharray={level ? '4 5' : undefined} /><text x={left - 12} y={lineY + 4} textAnchor="end" className="score-chart-axis">{level}</text></g>;
      })}
      {records.map((record, index) => {
        const value = Number(record.scores.composition);
        const barHeight = (Math.max(0, Math.min(value, 6)) / 6) * plotHeight;
        const centerX = x(index);
        return <g key={record.id}>
          <rect x={centerX - 17} y={top + plotHeight - barHeight} width="34" height={Math.max(barHeight, 2)} rx="7" fill="#8a79c8"><title>{record.title}：寫作 {value} 級分</title></rect>
          <text x={centerX} y={height - 34} textAnchor="middle" className="score-chart-date">{shortDate(record)}</text>
          <text x={centerX} y={height - 16} textAnchor="middle" className="score-chart-record">{record.title.length > 8 ? `${record.title.slice(0, 7)}…` : record.title}</text>
        </g>;
      })}
    </svg>
  </div>;
}

export default function ScoreRecordsAnalytics({ records }: { records: AnalyticsRecord[] }) {
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey>('chinese');
  const all = chronological(records);
  const mock = all.filter((record) => record.record_type === 'mock');
  const official = all.filter((record) => record.record_type === 'official');
  const latest = mock.at(-1);
  const previous = mock.at(-2);
  const latestOfficial = official.at(-1);
  const changes = latest && previous ? subjects.map((subject) => ({
    ...subject,
    before: previous.scores[subject.key],
    after: latest.scores[subject.key],
    direction: gradeRank(latest.scores[subject.key]) - gradeRank(previous.scores[subject.key]),
  })) : [];
  const rising = changes.filter((item) => item.direction > 0).length;
  const falling = changes.filter((item) => item.direction < 0).length;
  const distribution = latest ? subjects.reduce((counts, subject) => {
    counts[gradeBand(latest.scores[subject.key])] += 1;
    return counts;
  }, { A: 0, B: 0, C: 0 }) : { A: 0, B: 0, C: 0 };
  return <section id="score-analytics" className="score-analytics" aria-labelledby="score-analytics-title">
    <div className="score-section-heading">
      <div><span className="score-eyebrow"><ChartNoAxesCombined size={16} /> 學習表現分析</span><h2 id="score-analytics-title">看見每一次的變化</h2><p>以已儲存的紀錄整理趨勢，協助找出值得持續練習的科目。</p></div>
      <a href="#score-new-record" className="score-heading-link">新增成績 <ArrowRight size={16} /></a>
    </div>
    <div className="score-stat-grid">
      <div className="score-stat"><span>模擬考紀錄</span><strong>{mock.length}<small> 筆</small></strong><em>趨勢圖使用此類紀錄</em></div>
      <div className="score-stat"><span>正式會考紀錄</span><strong>{official.length}<small> 筆</small></strong><em>{latestOfficial ? `最近：${latestOfficial.title}` : '尚未儲存正式成績'}</em></div>
      <div className="score-stat"><span>較前次等級上升</span><strong>{previous ? rising : '—'}<small>{previous ? ' / 5 科' : ''}</small></strong><em>{previous ? `${falling} 科下降，其餘持平` : '至少兩筆模擬考可比較'}</em></div>
    </div>
    {latest ? <>
      <div className="score-analysis-grid">
        <section className="score-chart-card score-chart-card--wide" aria-labelledby="score-subject-chart-title">
          <div className="score-chart-heading"><div><span className="score-card-kicker">模擬考 · 五科</span><h3 id="score-subject-chart-title">科目等級趨勢</h3><p>選擇科目，查看每次模擬考的原始等級。</p></div><BarChart3 size={22} aria-hidden="true" /></div>
          <div className="score-subject-tabs" role="group" aria-label="切換趨勢科目">{subjects.map((subject) => <button key={subject.key} type="button" aria-pressed={selectedSubject === subject.key} onClick={() => setSelectedSubject(subject.key)}>{subject.label}</button>)}</div>
          <LevelChart records={mock} subject={selectedSubject} />
          <div className="score-chart-data" aria-label="科目原始等級資料">{mock.map((record) => <span key={record.id}><strong>{record.title}</strong>{record.scores[selectedSubject]}</span>)}</div>
        </section>
        <section className="score-chart-card" aria-labelledby="score-profile-title">
          <div className="score-chart-heading"><div><span className="score-card-kicker">最新模擬考</span><h3 id="score-profile-title">五科等級分布</h3><p>{latest.title}</p></div><Target size={22} aria-hidden="true" /></div>
          <div className="score-band-bar" role="img" aria-label={`A 類 ${distribution.A} 科、B 類 ${distribution.B} 科、C 類 ${distribution.C} 科`}>
            {(['A', 'B', 'C'] as const).map((band) => distribution[band] > 0 && <span key={band} className={`score-band-${band.toLowerCase()}`} style={{ width: `${distribution[band] * 20}%` }} />)}
          </div>
          <div className="score-band-legend">{(['A', 'B', 'C'] as const).map((band) => <div key={band}><span className={`score-band-dot score-band-${band.toLowerCase()}`} /><strong>{band} 類</strong><b>{distribution[band]} 科</b></div>)}</div>
          <p className="score-profile-note">{distribution.C ? '可先回顧 C 類科目的基礎題與常錯單元。' : distribution.A >= 3 ? 'A 類科目已形成優勢，也可挑一科 B 類科目加強。' : '從一個常錯單元開始調整，比一次增加所有科目的練習更容易追蹤。'}</p>
        </section>
        <section className="score-chart-card score-chart-card--wide" aria-labelledby="score-writing-title">
          <div className="score-chart-heading"><div><span className="score-card-kicker">模擬考 · 寫作</span><h3 id="score-writing-title">寫作級分變化</h3><p>逐次對照級分，搭配老師回饋檢查文章結構與內容。</p></div><BarChart3 size={22} aria-hidden="true" /></div>
          <WritingChart records={mock} />
          <div className="score-chart-data" aria-label="寫作原始級分資料">{mock.map((record) => <span key={record.id}><strong>{record.title}</strong>{record.scores.composition} 級</span>)}</div>
        </section>
        <section className="score-chart-card" aria-labelledby="score-comparison-title">
          <div className="score-chart-heading"><div><span className="score-card-kicker">最近兩次模擬考</span><h3 id="score-comparison-title">各科變化</h3><p>{previous ? `${previous.title} → ${latest.title}` : '再儲存一筆模擬考即可比較'}</p></div><CircleHelp size={22} aria-hidden="true" /></div>
          {previous ? <div className="score-change-list">{changes.map((item) => <div key={item.key}><strong>{item.label}</strong><span>{item.before} → {item.after}</span><em className={item.direction > 0 ? 'score-change-up' : item.direction < 0 ? 'score-change-down' : ''}>{item.direction > 0 ? <ArrowUpRight size={16} /> : item.direction < 0 ? <ArrowDownRight size={16} /> : <ArrowRight size={16} />}{item.direction > 0 ? '上升' : item.direction < 0 ? '下降' : '持平'}</em></div>)}<div><strong>寫作</strong><span>{previous.scores.composition} → {latest.scores.composition} 級</span><em className={Number(latest.scores.composition) > Number(previous.scores.composition) ? 'score-change-up' : Number(latest.scores.composition) < Number(previous.scores.composition) ? 'score-change-down' : ''}>{Number(latest.scores.composition) > Number(previous.scores.composition) ? '上升' : Number(latest.scores.composition) < Number(previous.scores.composition) ? '下降' : '持平'}</em></div></div> : <div className="score-chart-empty">目前只有一筆模擬考。儲存下一筆後，這裡會顯示各科等級的變動。</div>}
        </section>
      </div>
      <div className={`score-detail-grid ${latestOfficial ? '' : 'score-detail-grid--single'}`}>
        <section className="score-chart-card" aria-labelledby="score-subject-summary-title">
          <div className="score-chart-heading"><div><span className="score-card-kicker">五科 · 全部模擬考</span><h3 id="score-subject-summary-title">逐科等級摘要</h3><p>整理每科最近、歷次最高與最低的原始等級。</p></div><BarChart3 size={22} aria-hidden="true" /></div>
          <div className="score-summary-table-scroll"><table className="score-summary-table"><thead><tr><th scope="col">科目</th><th scope="col">最近</th><th scope="col">歷次最高</th><th scope="col">歷次最低</th><th scope="col">較前次</th></tr></thead><tbody>{subjects.map((subject) => {
            const ranks = mock.map((record) => gradeRank(record.scores[subject.key])).filter((rank) => rank >= 0);
            const change = changes.find((item) => item.key === subject.key);
            return <tr key={subject.key}><th scope="row">{subject.label}</th><td>{latest.scores[subject.key]}</td><td>{gradeOrder[Math.max(...ranks)] || '—'}</td><td>{gradeOrder[Math.min(...ranks)] || '—'}</td><td className={change?.direction && change.direction > 0 ? 'score-change-up' : change?.direction && change.direction < 0 ? 'score-change-down' : ''}>{!change ? '—' : change.direction > 0 ? '上升' : change.direction < 0 ? '下降' : '持平'}</td></tr>;
          })}</tbody></table></div>
        </section>
        {latestOfficial && <section className="score-chart-card score-official-card" aria-labelledby="score-official-title">
          <div className="score-chart-heading"><div><span className="score-card-kicker">正式會考 · 獨立呈現</span><h3 id="score-official-title">最新正式成績</h3><p>{latestOfficial.title} · {examKey(latestOfficial)}</p></div><Target size={22} aria-hidden="true" /></div>
          <div className="score-official-grades">{subjects.map((subject) => <div key={subject.key}><span>{subject.label}</span><strong>{latestOfficial.scores[subject.key]}</strong></div>)}<div><span>寫作</span><strong>{latestOfficial.scores.composition} 級</strong></div></div>
          <p>正式會考另列於此，不與模擬考合併計算趨勢。</p>
        </section>}
      </div>
      <p className="score-analysis-disclaimer"><CalendarDays size={16} aria-hidden="true" />圖表依考試日期排序；未填日期時使用儲存日期。等級是順序資料，圖線只顯示升降方向，不代表分數差距或錄取機率。不同模擬考的範圍與難度也可能不同。</p>
    </> : <div className="score-analysis-empty"><ChartNoAxesCombined size={34} aria-hidden="true" /><strong>先保存一筆模擬考，開始建立趨勢</strong><p>有兩筆以上就能比較五科與寫作的變化；正式會考會獨立保留在紀錄中。</p><a href="#score-new-record">新增第一筆成績 <ArrowRight size={16} /></a></div>}
  </section>;
}
