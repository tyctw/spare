import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, ChevronDown, Compass, ExternalLink, ShieldCheck } from 'lucide-react';
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

    <header className="score-inquiry-hero">
      <div className="score-inquiry-hero-copy">
        <p className="score-inquiry-eyebrow">會考成績查詢</p>
        <h1>先查成績，<span>再找適合自己的升學方向。</span></h1>
        <p className="score-inquiry-lead">到國中教育會考官方網站確認成績；查完後，回本站看懂等級並探索校科。</p>
      </div>
      <div className="score-inquiry-official">
        <div className="score-inquiry-official-top"><span className="score-inquiry-official-step">步驟 01</span><span className="score-inquiry-official-badge"><ShieldCheck size={16} aria-hidden="true" />官方網站</span></div>
        <h2>查詢你的會考成績</h2>
        <p>依當年度公告登入，查看五科等級、標示與寫作級分。</p>
        <a href={officialUrl} target="_blank" rel="noopener noreferrer"><span>開啟官方成績查詢<small>另開新分頁</small></span><ArrowUpRight size={23} aria-hidden="true" /></a>
        <span className="score-inquiry-domain"><ShieldCheck size={15} aria-hidden="true" />官方網址 <strong>cap.rcpet.edu.tw</strong></span>
      </div>
    </header>

    <section className="score-inquiry-date" aria-label="會考成績查詢日期">
      <span className="score-inquiry-date-icon"><CalendarDays size={24} aria-hidden="true" /></span>
      <div className="score-inquiry-date-copy"><span>116 學年度 · 成績公布日</span><strong>2027 年 6 月 4 日（五）</strong><p>寄發成績通知單並開放網路查詢；實際開放時間請以官方公告為準。</p></div>
      <a href={withBasePath('/important-dates')}>查看完整日程<ArrowRight size={18} aria-hidden="true" /></a>
    </section>

    <p className="score-inquiry-privacy"><ShieldCheck size={18} aria-hidden="true" />本站不代查成績。准考證號與身分證字號，請只在官方網站輸入。</p>

    <section className="score-inquiry-next" aria-labelledby="score-inquiry-next-title">
      <div className="score-inquiry-next-heading"><div><p className="score-inquiry-eyebrow">查完之後</p><h2 id="score-inquiry-next-title">把成績用在下一步。</h2></div><p>選一個現在需要的入口，繼續整理升學方向。</p></div>
      <div className="score-inquiry-next-grid">
        <a className="score-inquiry-next-card" href={withBasePath('/grade-level')}>
          <span className="score-inquiry-next-icon"><BookOpen size={25} aria-hidden="true" /></span>
          <span className="score-inquiry-next-copy"><small>先看懂成績</small><strong>A、B、C 與標示怎麼看？</strong><span>釐清會考等級、加號標示與寫作級分的意義。</span></span>
          <span className="score-inquiry-next-link">閱讀等級說明<ArrowRight size={17} aria-hidden="true" /></span>
        </a>
        <a className="score-inquiry-next-card score-inquiry-next-card--featured" href={withBasePath('/')}>
          <span className="score-inquiry-next-icon"><Compass size={25} aria-hidden="true" /></span>
          <span className="score-inquiry-next-copy"><small>再探索校科</small><strong>開始使用落點分析</strong><span>手動填入成績與就學區，查看值得進一步了解的校科。</span></span>
          <span className="score-inquiry-next-link">前往落點分析<ArrowRight size={17} aria-hidden="true" /></span>
        </a>
      </div>
      <p className="score-inquiry-reminder">落點分析供規劃參考；招生名額與正式選填規則，請以當年度官方簡章為準。</p>
    </section>

    <details className="score-inquiry-more"><summary><span>官方網站連不上？查看分流網址</span><ChevronDown size={19} aria-hidden="true" /></summary><div><p>分流網址可能只在官方開放期間可用；連不上時，請回到官方首頁查看最新入口。</p><div className="score-inquiry-mirror-links">{mirrorLinks.map((link) => <a key={link.host} href={link.href} target="_blank" rel="noopener noreferrer"><strong>{link.label}</strong><span>{link.host}</span><ExternalLink size={16} aria-hidden="true" /></a>)}</div></div></details>
  </div></main>;
}
