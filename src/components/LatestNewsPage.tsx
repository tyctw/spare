import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, CalendarDays, ChevronDown, Megaphone, Search, X } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageBreadcrumb from './PageBreadcrumb';
import { newsArticles } from '../lib/news';
import './latest-news-page.css';

const PAGE_SIZE = 8;
const categoryGroups = [
  { label: '公告與日程', categories: ['系統公告', '重要日程公告', '升學政策預告', '重要日程指南'] },
  { label: '會考與成績', categories: ['會考準備指南', '成績判讀指南', '落點分析指南'] },
  { label: '探索與選擇', categories: ['升學方向指南', '升學管道指南', '家庭溝通指南'] },
  { label: '選填與規則', categories: ['志願選填指南', '升學程序指南', '升學規則指南', '升學規則整理'] },
];

export default function LatestNewsPage() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [sort, setSort] = useState('newest');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const categoryCounts = useMemo(() => newsArticles.reduce((counts, article) => {
    counts.set(article.category, (counts.get(article.category) ?? 0) + 1);
    return counts;
  }, new Map<string, number>()), []);
  const groups = useMemo(() => {
    const listed = new Set(categoryGroups.flatMap((group) => group.categories));
    const known = categoryGroups.map((group) => ({ ...group, categories: group.categories.filter((category) => categoryCounts.has(category)) }));
    const remaining = [...categoryCounts.keys()].filter((category) => !listed.has(category));
    return remaining.length ? [...known, { label: '其他消息', categories: remaining }] : known;
  }, [categoryCounts]);
  const orderedArticles = useMemo(() => [...newsArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || Number(b.id) - Number(a.id)), []);
  const visibleArticles = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase();
    const articles = orderedArticles.filter((article) =>
      (selectedCategory === '全部' || article.category === selectedCategory) &&
      (!keyword || [article.title, article.summary, article.category].some((value) => value.toLocaleLowerCase().includes(keyword)))
    );
    return sort === 'oldest' ? articles.reverse() : articles;
  }, [orderedArticles, query, selectedCategory, sort]);
  const hasFilters = query.trim().length > 0 || selectedCategory !== '全部';
  const latest = orderedArticles[0];
  const clearFilters = () => { setQuery(''); setSelectedCategory('全部'); setLimit(PAGE_SIZE); };

  return <main className="news-page">
    <div className="news-shell">
      <PageBreadcrumb title="最新消息" />
      <header className="news-hero">
        <div><p className="news-eyebrow"><span /> LATEST NEWS</p><h1>掌握網站<br /><span>最新動態。</span></h1><p className="news-intro">升學路上的重要消息，一次整理給你。<br />從會考準備、志願選填到功能更新，讓每一步更有把握。</p></div>
        <div className="news-hero-note"><span className="news-icon"><Megaphone size={28} strokeWidth={1.5} /></span><p>每個階段，都有值得留意的事。</p><span>留意更新，安心準備下一步</span><div className="news-stats"><div><strong>{newsArticles.length.toString().padStart(2, '0')}</strong><span>則消息</span></div><div><strong>{categoryCounts.size}</strong><span>個主題分類</span></div></div></div>
      </header>
      {latest && !hasFilters && <section className="news-feature" aria-labelledby="news-feature-title"><div className="news-feature-side"><span className="news-eyebrow">LATEST UPDATE</span><span className="news-feature-label">最新公告</span><span className="news-feature-symbol" aria-hidden="true">↗</span></div><div className="news-feature-body"><div className="news-meta"><span className="news-tag">{latest.category}</span><time dateTime={latest.publishedAt}><CalendarDays size={14} />{latest.publishedLabel}</time></div><h2 id="news-feature-title"><a href={withBasePath(`/news/${latest.id}`)}>{latest.title}</a></h2><p>{latest.summary}</p><a className="news-feature-link" href={withBasePath(`/news/${latest.id}`)}>閱讀完整公告<ArrowUpRight size={18} /></a></div></section>}
      <section className="news-library" aria-labelledby="news-library-title">
        <div className="news-library-heading"><div><p className="news-eyebrow">EXPLORE UPDATES</p><h2 id="news-library-title">消息一覽<span>{newsArticles.length}</span></h2></div><p>找到你現在需要的資訊</p></div>
        <div className="news-library-layout">
          <aside className="news-filter-panel" aria-label="消息分類">
            <button className="news-filter-toggle" type="button" aria-expanded={isCategoryPickerOpen} aria-controls="news-filter-list" onClick={() => setIsCategoryPickerOpen((open) => !open)}>
              <span><small>依主題瀏覽</small><strong>{selectedCategory === '全部' ? '全部消息' : selectedCategory}</strong></span>
              <ChevronDown size={20} aria-hidden="true" />
            </button>
            <div id="news-filter-list" className={`news-filter-list${isCategoryPickerOpen ? ' is-open' : ''}`}>
              <p className="news-filter-title">依主題瀏覽</p>
              <button className="news-category-button news-category-all" type="button" aria-pressed={selectedCategory === '全部'} onClick={() => { setSelectedCategory('全部'); setLimit(PAGE_SIZE); setIsCategoryPickerOpen(false); }}><span>全部消息</span><span className="news-category-count">{newsArticles.length}</span></button>
              {groups.map((group) => <div className="news-filter-group" key={group.label}>
                <h3>{group.label}</h3>
                {group.categories.map((category) => <button className="news-category-button" key={category} type="button" aria-pressed={selectedCategory === category} onClick={() => { setSelectedCategory(category); setLimit(PAGE_SIZE); setIsCategoryPickerOpen(false); }}><span>{category}</span><span className="news-category-count">{categoryCounts.get(category)}</span></button>)}
              </div>)}
            </div>
          </aside>
          <div className="news-library-content">
            <div className="news-toolbar"><label className="news-search"><Search size={19} /><span className="sr-only">搜尋消息</span><input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setLimit(PAGE_SIZE); }} placeholder="搜尋標題、摘要或分類…" />{query && <button type="button" onClick={() => { setQuery(''); setLimit(PAGE_SIZE); }} aria-label="清除搜尋"><X size={17} /></button>}</label><label className="news-sort"><span>排序</span><select value={sort} onChange={(event) => { setSort(event.target.value); setLimit(PAGE_SIZE); }}><option value="newest">最新發布優先</option><option value="oldest">最早發布優先</option></select></label></div>
            <div className="news-result-bar"><p role="status">{hasFilters ? '符合條件' : '全部消息'} <strong>{visibleArticles.length}</strong> 則</p>{hasFilters ? <button type="button" onClick={clearFilters}>清除篩選<X size={14} /></button> : <span>依發布日期排列</span>}</div>
            <div className="news-list">{visibleArticles.slice(0, limit).map((article) => <article className="news-row" key={article.id}><div className="news-row-date"><time dateTime={article.publishedAt}>{article.publishedAt.replaceAll('-', '.')}</time><span className="news-tag">{article.category}</span></div><div className="news-row-content"><h3><a href={withBasePath(`/news/${article.id}`)}>{article.title}<ArrowUpRight size={21} /></a></h3><p>{article.summary}</p></div></article>)}</div>
            {visibleArticles.length === 0 && <div className="news-empty"><Search size={32} /><h3>還沒有找到相符的消息</h3><p>換個關鍵字試試，或清除篩選查看所有消息。</p><button type="button" onClick={clearFilters}>查看全部消息<ArrowRight size={16} /></button></div>}
            {visibleArticles.length > 0 && <div className="news-list-footer"><span>已顯示 {Math.min(limit, visibleArticles.length)} / {visibleArticles.length} 則消息</span>{limit < visibleArticles.length && <button type="button" onClick={() => setLimit((value) => value + PAGE_SIZE)}>載入更多消息<ArrowRight size={16} /></button>}</div>}
          </div>
        </div>
      </section>
      <aside className="news-bottom-note"><Megaphone size={20} /><p>準備升學，也別忘了確認官方公告。<span>招生時程、名額與規則，請以當年度招生委員會及學校公告為準。</span></p><a href={withBasePath('/')}>回首頁探索<ArrowRight size={16} /></a></aside>
    </div>
  </main>;
}
