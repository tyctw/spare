import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, Building2, ExternalLink, FilterX, Loader2, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import './search-page.css';

interface SchoolItem {
  id: string;
  county: string;
  code: string;
  name: string;
  levelInfo: string;
  shift: string;
  groupCode: string;
  groupName: string;
  deptCode: string;
  deptName: string;
}

const PAGE_SIZE = 24;

export default function SearchPage() {
  const initialParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [query, setQuery] = useState(initialParams.get('q') || '');
  const [county, setCounty] = useState(initialParams.get('county') || 'all');
  const [type, setType] = useState(initialParams.get('type') || 'all');
  const [group, setGroup] = useState(initialParams.get('group') || 'all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    async function loadSchools() {
      try {
        const response = await fetch(withBasePath('/data/volunteer_schools.json'));
        if (!response.ok) throw new Error(`Unable to load school data (${response.status})`);
        const nextSchools: unknown = await response.json();
        if (!ignore) setSchools(Array.isArray(nextSchools) ? nextSchools : []);
      } catch (err) {
        console.error('Search school JSON load failed:', err);
        if (!ignore) setError('搜尋資料載入失敗，請稍後再試。');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    loadSchools();
    return () => { ignore = true; };
  }, []);

  const counties = useMemo(() => Array.from(new Set(schools.map((school) => school.county).filter(Boolean))).sort(), [schools]);
  const types = useMemo(() => Array.from(new Set(schools.map((school) => school.levelInfo).filter(Boolean))).sort(), [schools]);
  const groups = useMemo(() => Array.from(new Set(schools.map((school) => school.groupName).filter(Boolean))).sort(), [schools]);

  const filteredSchools = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase('zh-TW');
    return schools.filter((school) => {
      if (county !== 'all' && school.county !== county) return false;
      if (type !== 'all' && school.levelInfo !== type) return false;
      if (group !== 'all' && school.groupName !== group) return false;
      if (!keyword) return true;
      return [school.name, school.deptName, school.county, school.groupName, school.levelInfo, school.code, school.deptCode]
        .filter(Boolean).some((value) => value.toLocaleLowerCase('zh-TW').includes(keyword));
    });
  }, [schools, query, county, type, group]);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [query, county, type, group]);
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (county !== 'all') params.set('county', county);
    if (type !== 'all') params.set('type', type);
    if (group !== 'all') params.set('group', group);
    const search = params.toString();
    window.history.replaceState(null, '', `${withBasePath('/search')}${search ? `?${search}` : ''}`);
  }, [query, county, type, group]);

  const hasFilters = query.trim() !== '' || county !== 'all' || type !== 'all' || group !== 'all';
  const visibleSchools = filteredSchools.slice(0, visibleCount);
  const clearFilters = () => { setQuery(''); setCounty('all'); setType('all'); setGroup('all'); };
  const submitSearch = (event: FormEvent) => { event.preventDefault(); document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  return <main className="school-search-page">
    <div className="school-search-shell">
      <a className="school-search-back" href={withBasePath('/')}><ArrowLeft size={17} aria-hidden="true" />返回首頁</a>
      <header className="school-search-hero"><div><span className="school-search-eyebrow"><Search size={16} aria-hidden="true" />校科資料查詢</span><h1>搜尋學校與科別</h1><p>從校名、科別、群別或地區開始，找到想進一步了解的高中職校科。</p></div><div className="school-search-hero-stat"><span>目前收錄</span><strong>{isLoading ? '—' : schools.length.toLocaleString('zh-TW')}</strong><span>筆校科資料</span></div></header>

      <form className="school-search-form" role="search" onSubmit={submitSearch}>
        <label htmlFor="school-search-keyword">想找哪間學校或科別？</label>
        <div className="school-search-input-row"><div className="school-search-input-wrap"><Search size={20} aria-hidden="true" /><input id="school-search-keyword" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="輸入校名、科別、群別或代碼" autoComplete="off" /></div><button type="submit">查看結果 <ArrowRight size={17} aria-hidden="true" /></button></div>
        <p>可輸入部分名稱，例如「平鎮」「資訊科」或「餐旅群」。</p>
        <div className="school-search-filter-heading"><span><SlidersHorizontal size={18} aria-hidden="true" />進一步篩選</span>{hasFilters && <button type="button" onClick={clearFilters}><FilterX size={16} aria-hidden="true" />清除條件</button>}</div>
        <div className="school-search-filters"><label>縣市<select value={county} onChange={(event) => setCounty(event.target.value)}><option value="all">全部縣市</option>{counties.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label>學校類型<select value={type} onChange={(event) => setType(event.target.value)}><option value="all">全部類型</option>{types.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label>群別<select value={group} onChange={(event) => setGroup(event.target.value)}><option value="all">全部群別</option>{groups.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div>
      </form>

      <section className="school-search-results" id="search-results" aria-labelledby="school-search-results-heading"><div className="school-search-results-top"><div><span>查詢結果</span><h2 id="school-search-results-heading">{isLoading ? '正在準備資料' : error ? '暫時無法搜尋' : hasFilters ? '符合條件的校科' : '瀏覽全部校科'}</h2><p aria-live="polite">{isLoading ? '正在載入校科資料…' : error || `找到 ${filteredSchools.length.toLocaleString('zh-TW')} 筆校科資料${filteredSchools.length ? `，目前顯示前 ${visibleSchools.length.toLocaleString('zh-TW')} 筆` : ''}`}</p></div>{hasFilters && !isLoading && !error && <button className="school-search-reset" type="button" onClick={clearFilters}>清除全部條件</button>}</div>
        {isLoading ? <div className="school-search-state" role="status"><Loader2 className="school-search-spin" size={28} aria-hidden="true" /><strong>正在載入校科資料</strong><p>請稍候，搜尋結果即將顯示。</p></div>
          : error ? <div className="school-search-state school-search-error" role="alert"><AlertCircle size={29} aria-hidden="true" /><strong>{error}</strong><button type="button" onClick={() => window.location.reload()}>重新整理頁面</button></div>
          : filteredSchools.length === 0 ? <div className="school-search-state"><Search size={29} aria-hidden="true" /><strong>沒有找到符合條件的校科</strong><p>試著縮短關鍵字，或減少一項篩選條件。</p><button type="button" onClick={clearFilters}>清除所有條件</button></div>
          : <><div className="school-search-grid">{visibleSchools.map((school, index) => <article className="school-search-card" key={`${school.code}-${school.deptCode}-${index}`}><div className="school-search-card-top"><span>{school.county || '未提供縣市'}</span><span>{school.levelInfo || '高中職'}</span></div><h3>{school.name}</h3><p className="school-search-dept"><Building2 size={18} aria-hidden="true" />{school.deptName || '未提供科別'}{school.shift && <small>・{school.shift}</small>}</p><div className="school-search-card-meta"><span>{school.groupName || '未分類群別'}</span><span>校碼 {school.code}・科碼 {school.deptCode || '—'}</span></div><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.name)}`} target="_blank" rel="noopener noreferrer" aria-label={`在地圖搜尋 ${school.name}`}><MapPin size={17} aria-hidden="true" />查看學校位置<ExternalLink size={15} aria-hidden="true" /></a></article>)}</div>{visibleCount < filteredSchools.length && <div className="school-search-more"><button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>顯示更多校科 <ArrowRight size={17} aria-hidden="true" /></button><p>已顯示 {visibleSchools.length.toLocaleString('zh-TW')} / {filteredSchools.length.toLocaleString('zh-TW')} 筆</p></div>}</>}
      </section>
      <p className="school-search-footnote">校科資料供查詢參考；招生名額、條件與實際科別，以當年度招生簡章為準。</p>
    </div>
  </main>;
}
