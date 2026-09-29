import { ArrowRight, ArrowUpRight, BookOpen, ChevronDown, ExternalLink, ShieldCheck } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageBreadcrumb from './PageBreadcrumb';
import './score-inquiry-page.css';

const officialUrl = 'https://cap.rcpet.edu.tw/';
const mirrorLinks = [
  { label: '分流網站 1', host: 'score_n.rcpet.edu.tw', href: 'https://score_n.rcpet.edu.tw/Login.aspx' },
  { label: '分流網站 2', host: 'score_s.rcpet.edu.tw', href: 'https://score_s.rcpet.edu.tw/Login.aspx' },
];

export default function ScoreInquiryPage() {
  return <main className="score-inquiry-page"><div className="score-inquiry-shell">
    <PageBreadcrumb title="會考成績查詢" />

    <header className="score-inquiry-header">
      <p className="score-inquiry-eyebrow">成績查詢 · 升學規劃</p>
      <h1>查完成績，<span>下一步就從這裡開始。</span></h1>
      <p>先在官方網站確認成績，再回本站看看有哪些校科值得探索。</p>
    </header>

    <div className="score-inquiry-journey" aria-label="查詢成績與落點分析步驟">
      <section className="score-inquiry-step-card score-inquiry-step-card--official" aria-labelledby="score-inquiry-official-heading">
        <span className="score-inquiry-step-number" aria-label="第一步">01</span>
        <div className="score-inquiry-step-copy"><p>第一步 · 官方查詢</p><h2 id="score-inquiry-official-heading">到官方網站查成績</h2><span>依當年度公告登入，確認五科等級、標示與寫作級分。</span><small><ShieldCheck size={15} aria-hidden="true" />國中教育會考官方網站 · cap.rcpet.edu.tw</small></div>
        <a href={officialUrl} target="_blank" rel="noopener noreferrer">開啟官方網站<ArrowUpRight size={18} aria-hidden="true" /></a>
      </section>

      <div className="score-inquiry-connector" aria-hidden="true"><span>查完後回到本站</span><ArrowRight size={17} /></div>

      <section className="score-inquiry-step-card score-inquiry-step-card--analysis" aria-labelledby="score-inquiry-analysis-heading">
        <span className="score-inquiry-step-number" aria-label="第二步">02</span>
        <div className="score-inquiry-step-copy"><p>第二步 · 使用本站</p><h2 id="score-inquiry-analysis-heading">開始落點分析</h2><span>手動填入成績與就學區，探索並比較感興趣的校科。</span><small>分析供規劃參考；正式選填仍以官方簡章為準。</small></div>
        <a href={withBasePath('/')}>前往落點分析<ArrowRight size={18} aria-hidden="true" /></a>
      </section>
    </div>

    <p className="score-inquiry-privacy"><ShieldCheck size={17} aria-hidden="true" />本站不代查成績；准考證號、身分證字號等查詢資料，請只在官方網站輸入。</p>

    <details className="score-inquiry-more"><summary><span>需要分流網址或成績等級說明？</span><ChevronDown size={18} aria-hidden="true" /></summary><div><p>分流網址可能只在官方開放期間可用；連不上時，請回到官方首頁查看最新入口。</p><div className="score-inquiry-mirror-links">{mirrorLinks.map((link) => <a key={link.host} href={link.href} target="_blank" rel="noopener noreferrer"><strong>{link.label}</strong><span>{link.host}</span><ExternalLink size={16} aria-hidden="true" /></a>)}</div><a className="score-inquiry-level-link" href={withBasePath('/grade-level')}><BookOpen size={17} aria-hidden="true" />看懂 A、B、C 與加號標示<ArrowRight size={16} aria-hidden="true" /></a></div></details>
  </div></main>;
}
