import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, ChevronRight, Compass, GraduationCap, Search, Sparkles } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import { departmentPath, departmentCategories, type Department } from '../lib/vocationalDepartments';
import { departmentProfiles } from '../lib/departmentProfiles';
import { departmentDeepDives } from '../lib/departmentDeepDives';
import { groups } from '../lib/vocationalGroups';
import MobileContentsNav from './MobileContentsNav';
import PageBreadcrumb from './PageBreadcrumb';
import './vocational-departments-page.css';

export default function VocationalDepartmentDetailPage({ department }: { department?: Department }) {
  if (!department) return <main className="departments-page"><div className="departments-shell departments-not-found"><BookOpen size={38} /><h1>找不到這個科別</h1><p>科別名稱可能已調整，請回總覽重新查找。</p><a href={withBasePath('/departments')}>返回科別總覽<ArrowRight size={17} /></a></div></main>;

  const group = groups.find((item) => item.id === department.group);
  const siblings = departmentCategories.flatMap((category) => category.groups).find((item) => item.name === department.group)?.departments.filter((item) => item.name !== department.name).slice(0, 5) ?? [];
  const searchHref = withBasePath(`/search?${new URLSearchParams({ group: department.group, q: department.name })}`);
  const profile = departmentProfiles[department.name] ?? {
    focus: [department.intro, department.practice],
    scenario: department.practice,
    question: department.check,
  };
  const deepDive = departmentDeepDives[department.name] ?? {
    learning: department.intro,
    process: department.practice,
    distinction: `比較${department.group}內不同科別的課程地圖，找出學習重點的差異。`,
    pathway: `可從${department.name}的課程與實作出發，探索相關升學和產業方向。`,
  };

  return <main className="departments-page department-detail-page"><div className="departments-shell">
    <PageBreadcrumb title={`${department.group} · ${department.name}`} parent={{ label: '科別總覽', href: '/departments' }} />
    <header className="department-detail-hero"><div><p className="departments-eyebrow"><BookOpen size={17} />{department.category} · {department.group}</p><h1>{department.name}</h1><p className="department-detail-lead">{department.intro}</p><div className="department-detail-actions"><a href={searchHref} className="department-detail-primary">查詢開設學校<ArrowUpRight size={17} /></a><a href={withBasePath('/departments')} className="department-detail-secondary">瀏覽全部科別<ArrowRight size={17} /></a></div></div><div className="department-detail-hero-note"><span>先抓住重點</span><strong>{department.practice}</strong><p>同名科別在不同學校，實際課程與設備仍可能不同。</p></div></header>

    <div className="department-detail-layout"><div className="department-detail-main">
      <section className="department-detail-section" id="learning"><div className="department-detail-section-title"><span>01 / LEARNING</span><h2>這個科別在學什麼？</h2></div><p className="department-detail-intro">{department.intro}</p><div className="department-detail-focus"><h3>{department.name}的學習焦點</h3><div>{profile.focus.map((item, index) => <p key={item}><span>{String(index + 1).padStart(2, '0')}</span>{item}</p>)}</div></div><div className="department-detail-explainer"><span>把知識串起來</span><p>{deepDive.learning}</p></div><small>這些是科別探索方向；各校實際科目、設備和實習主題請以課程地圖為準。</small></section>
      <section className="department-detail-section" id="practice"><div className="department-detail-section-title"><span>02 / PRACTICE</span><h2>可以留意哪些實作？</h2></div><div className="department-detail-practice"><Sparkles size={24} /><p>{department.practice}</p></div><div className="department-detail-scenario"><span>想像一個實作任務</span><p>{profile.scenario}</p></div><div className="department-detail-explainer"><span>從開始到完成，可能怎麼做</span><p>{deepDive.process}</p></div><p className="department-detail-note">這是幫助想像學習過程的例子，並非每所學校都會安排相同專題。查看課程地圖、設備和學生作品，會比只看科名更容易理解每天可能怎麼學。</p></section>
      <section className="department-detail-section department-detail-fit" id="fit">
        <div className="department-detail-section-title"><span>03 / YOUR FIT</span><h2>從自己的興趣出發</h2></div>
        <div className="department-detail-fit-intro"><span className="department-detail-fit-icon"><Compass size={24} aria-hidden="true" /></span><div><strong>先想像每天的學習，而不只看科名</strong><p>探索{department.name}時，可先想一個具體問題：{profile.question}</p></div></div>
        <div className="department-detail-explainer department-detail-comparison"><span>和相近科別怎麼分？</span><p>{deepDive.distinction}</p></div>
        <h3 className="department-detail-traits-heading">這個職群常見的學習特質</h3><div className="department-detail-traits">{(group?.traits ?? []).map((trait, index) => <div className="department-detail-trait" key={trait}><span>{String(index + 1).padStart(2, '0')}</span><h3>{trait}</h3><CheckCircle2 size={19} aria-hidden="true" /></div>)}</div>
        <p className="department-detail-fit-note">這些是探索與討論的線索，無須全部符合，也不是入學條件。實際課程請再向目標學校確認。</p>
        <div className="department-detail-fit-actions"><a href={withBasePath('/holland')}>試試興趣測驗<ArrowUpRight size={17} aria-hidden="true" /></a><a href={withBasePath(`/vocational-compare?${new URLSearchParams({ group: department.group })}`)}>比較其他職群<ArrowRight size={17} aria-hidden="true" /></a></div>
      </section>
      <section className="department-detail-section" id="next"><div className="department-detail-section-title"><span>04 / NEXT STEPS</span><h2>可以延伸哪些方向？</h2></div><div className="department-detail-pathway"><GraduationCap size={23} aria-hidden="true" /><div><h3>{department.name}的延伸探索</h3><p>{deepDive.pathway}</p></div></div><details className="department-detail-group-more"><summary>展開查看{department.group}的其他相關領域</summary><p>以下整理的是整個職群的參考方向，不代表{department.name}一定涵蓋。</p><div className="department-detail-next-grid"><div><GraduationCap size={22} /><h3>同群升學領域</h3><ul>{(group?.furtherStudy ?? []).map((item) => <li key={item}>{item}</li>)}</ul></div><div><Compass size={22} /><h3>同群產業領域</h3><ul>{(group?.careers ?? []).map((item) => <li key={item}>{item}</li>)}</ul></div></div></details><p className="department-detail-note">實際銜接路徑要依學校課程和升學簡章確認；特定職務或資格另有規定。</p></section>
      <section className="department-detail-section department-detail-check" id="check"><div className="department-detail-section-title"><span>05 / BEFORE YOU CHOOSE</span><h2>選校前，請確認</h2></div><div className="department-detail-check-list"><p><span>01</span>{department.check}</p><p><span>02</span>比較目標學校的課程地圖、師資、設備與學生作品，確認是否符合你期待的學習方向。</p><p><span>03</span>核對當年度招生簡章、名額、學校位置、通勤與費用。</p></div><a href={searchHref}>查詢開設{department.name}的學校<ArrowUpRight size={17} /></a></section>
    </div><aside className="department-detail-aside"><div className="department-detail-aside-card"><span>所屬分類</span><strong>{department.category}</strong><strong>{department.group}</strong><a href={withBasePath(`/vocational-encyclopedia?group=${encodeURIComponent(department.group)}`)}>了解{department.group}<ArrowRight size={16} /></a></div><nav className="department-detail-desktop-nav" aria-label="本頁內容"><a href="#learning">學習內容</a><a href="#practice">實作方向</a><a href="#fit">興趣探索</a><a href="#next">延伸方向</a><a href="#check">選校核對</a></nav><MobileContentsNav items={[{ id: 'learning', label: '學習內容' }, { id: 'practice', label: '實作方向' }, { id: 'fit', label: '興趣探索' }, { id: 'next', label: '延伸方向' }, { id: 'check', label: '選校核對' }]} /></aside></div>

    {siblings.length > 0 && <section className="department-detail-related"><div className="departments-section-heading"><div><span>KEEP EXPLORING</span><h2>同群也可以看看</h2></div><a href={withBasePath('/departments')}>所有科別<ArrowRight size={16} /></a></div><div>{siblings.map((item) => <a key={item.name} href={withBasePath(departmentPath(item.name))}><strong>{item.name}</strong><span>{item.intro}</span><ArrowRight size={17} /></a>)}</div></section>}
    <p className="departments-source">本頁依科別名稱與{department.group}共同方向整理，供初步探索。實際招生、課程、設備、實習與資格，請以當年度官方簡章和目標學校公告為準。可參考<a href="https://career.ntnu.edu.tw/career/map.html" target="_blank" rel="noreferrer">國立臺灣師範大學生涯資訊系統</a>與<a href="https://stv.naer.edu.tw/teaching/course_outline.jsp?lvtype=B" target="_blank" rel="noreferrer">國家教育研究院課程綱要</a>。</p>
  </div></main>;
}
