import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight, Compass, Search, X } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageBreadcrumb from './PageBreadcrumb';
import { departmentCategories, departmentPath, departments } from '../lib/vocationalDepartments';
import { groups } from '../lib/vocationalGroups';
import './vocational-departments-page.css';

export default function VocationalDepartmentsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const keyword = query.trim().toLocaleLowerCase();
  const visibleCategories = useMemo(() => departmentCategories
    .filter((item) => category === '全部' || item.name === category)
    .map((item) => ({
      ...item,
      groups: item.groups.map((group) => ({
        ...group,
        departments: group.departments.filter((department) => !keyword || [department.name, department.group, department.intro, department.practice].some((text) => text.toLocaleLowerCase().includes(keyword))),
      })).filter((group) => group.departments.length > 0),
    })).filter((item) => item.groups.length > 0), [category, keyword]);
  const visibleCount = visibleCategories.reduce((total, item) => total + item.groups.reduce((groupTotal, group) => groupTotal + group.departments.length, 0), 0);

  return <main className="departments-page">
    <div className="departments-shell">
      <PageBreadcrumb title="科別探索" />
      <header className="departments-hero">
        <div><p className="departments-eyebrow"><BookOpen size={17} />技術型高中科別指南</p><h1>從群別，找到<br /><em>想深入的科別。</em></h1><p className="departments-lead">依類別與群別整理 {departments.length} 個科別。先認識各科在學什麼、可能做哪些實作，再打開獨立介紹頁比較學校課程。</p><a href="#department-explorer" className="departments-hero-link">開始找科別<ArrowRight size={17} /></a></div>
        <div className="departments-hero-stats" aria-label="科別總覽統計"><div><strong>6</strong><span>大類別</span></div><div><strong>15</strong><span>個群別</span></div><div><strong>{departments.length}</strong><span>個科別</span></div><p>每所學校開設的科別、課程與設備不同。選填前，請以當年度簡章及學校課程資料確認。</p></div>
      </header>

      <section id="department-explorer" className="departments-explorer" aria-labelledby="departments-explorer-title">
        <div className="departments-section-heading"><div><span>01 / EXPLORE</span><h2 id="departments-explorer-title">依類別探索科別</h2></div><p>可搜尋科名、群別或感興趣的學習內容。</p></div>
        <div className="departments-tools"><label className="departments-search"><Search size={19} aria-hidden="true" /><span className="sr-only">搜尋科別</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋科別，例如：資訊、設計、餐飲" />{query && <button type="button" onClick={() => setQuery('')} aria-label="清除搜尋"><X size={17} /></button>}</label><span className="departments-result-count" role="status">顯示 {visibleCount} 個科別</span></div>
        <div className="departments-filters" role="group" aria-label="依類別篩選"><button type="button" aria-pressed={category === '全部'} onClick={() => setCategory('全部')}>全部</button>{departmentCategories.map((item) => <button type="button" key={item.name} aria-pressed={category === item.name} onClick={() => setCategory(item.name)}>{item.name}</button>)}</div>

        {visibleCount ? <div className="departments-category-list">{visibleCategories.map((item) => <section key={item.name} className="departments-category" aria-label={item.name}>
          <div className="departments-category-heading"><span>{item.name}</span><small>{item.groups.reduce((sum, group) => sum + group.departments.length, 0)} 個科別</small></div>
          <div className="departments-groups">{item.groups.map((group) => { const groupInfo = groups.find((entry) => entry.id === group.name); return <section key={group.name} className="departments-group" aria-labelledby={`group-${group.name}`}>
            <div className="departments-group-heading"><span className="departments-group-icon" aria-hidden="true">{groupInfo?.icon ?? '📚'}</span><div><h3 id={`group-${group.name}`}>{group.name}</h3><p>{groupInfo?.summary ?? '從群別開始，逐一探索相關科別。'}</p></div><span className="departments-group-count">{group.departments.length} 科</span></div>
            <div className="departments-card-grid">{group.departments.map((department) => <a key={department.name} href={withBasePath(departmentPath(department.name))} className="departments-card"><strong>{department.name}</strong><span>{department.intro}</span><span className="departments-card-more">看科別介紹<ArrowRight size={16} /></span></a>)}</div>
          </section>; })}</div>
        </section>)}</div> : <div className="departments-empty"><Search size={30} /><h3>找不到符合的科別</h3><p>可試試較短的關鍵字，或切回全部類別。</p><button type="button" onClick={() => { setQuery(''); setCategory('全部'); }}>查看全部科別</button></div>}
      </section>

      <aside className="departments-next"><div><Compass size={24} /><h2>還在比較方向？</h2><p>先看 15 個職群的共同學習內容，再回來選擇想深入的科別。</p></div><a href={withBasePath('/vocational-encyclopedia')}>探索職群百科<ArrowRight size={17} /></a></aside>
      <p className="departments-source">本頁的類別、群別與科別依本站提供的清單整理；科別介紹供探索使用。各校是否開設、實際課程、招生方式及資格，請以當年度官方簡章與學校公告為準。可參考<a href="https://career.ntnu.edu.tw/career/map.html" target="_blank" rel="noreferrer">國立臺灣師範大學生涯資訊系統</a>與<a href="https://stv.naer.edu.tw/teaching/course_outline.jsp?lvtype=B" target="_blank" rel="noreferrer">國家教育研究院課程綱要</a>。</p>
    </div>
  </main>;
}
