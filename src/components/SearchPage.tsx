import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Filter,
  Loader2,
  MapPin,
  Search,
  Tags,
} from 'lucide-react';
import { callBackend } from '../lib/api';
import { withBasePath } from '../lib/routes';

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

export default function SearchPage() {
  const initialQuery = new URLSearchParams(window.location.search).get('q') || '';
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [county, setCounty] = useState('all');
  const [type, setType] = useState('all');
  const [group, setGroup] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadSchools = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await callBackend<{ schools: SchoolItem[] } | SchoolItem[]>({
          action: 'getVolunteerSchools',
        });
        const nextSchools = Array.isArray(data) ? data : data?.schools;
        if (!ignore) setSchools(Array.isArray(nextSchools) ? nextSchools : []);
      } catch (err) {
        console.error('Search school fetch failed:', err);
        if (!ignore) {
          setError('搜尋資料載入失敗，請稍後再試。');
          setSchools([]);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    loadSchools();

    return () => {
      ignore = true;
    };
  }, []);

  const counties = useMemo(
    () => Array.from(new Set(schools.map((school) => school.county).filter(Boolean))).sort(),
    [schools],
  );

  const types = useMemo(
    () => Array.from(new Set(schools.map((school) => school.levelInfo).filter(Boolean))).sort(),
    [schools],
  );

  const groups = useMemo(
    () => Array.from(new Set(schools.map((school) => school.groupName).filter(Boolean))).sort(),
    [schools],
  );

  const filteredSchools = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return schools.filter((school) => {
      if (county !== 'all' && school.county !== county) return false;
      if (type !== 'all' && school.levelInfo !== type) return false;
      if (group !== 'all' && school.groupName !== group) return false;
      if (!keyword) return true;

      return [
        school.name,
        school.deptName,
        school.county,
        school.groupName,
        school.levelInfo,
        school.code,
        school.deptCode,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(keyword));
    });
  }, [schools, county, type, group, query]);

  const updateUrl = (nextQuery: string) => {
    const params = new URLSearchParams(window.location.search);
    if (nextQuery.trim()) params.set('q', nextQuery.trim());
    else params.delete('q');
    const search = params.toString();
    window.history.replaceState(null, '', `${withBasePath('/search')}${search ? `?${search}` : ''}`);
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    updateUrl(query);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-sky-50">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <a
            href={withBasePath('/')}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            回首頁
          </a>

          <div className="grid gap-6 py-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 bg-sky-100">
                  <Search className="h-6 w-6 text-sky-700" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase text-slate-500">School Search</p>
                  <p className="text-sm font-black text-slate-700">校名、科別、群別快速查詢</p>
                </div>
              </div>
              <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl">搜尋學校與科別</h1>
              <p className="mt-4 max-w-3xl text-[15px] font-bold leading-8 text-slate-700 sm:text-lg">
                輸入學校名稱、科別、群別、縣市或代碼，快速找到可加入志願序參考的校科資料。
              </p>
            </div>

            <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
              <div className="text-sm font-black text-slate-500">搜尋結果</div>
              <div className="mt-2 text-4xl font-black text-slate-900">
                {isLoading ? '--' : filteredSchools.length.toLocaleString('zh-TW')}
              </div>
              <div className="mt-1 text-sm font-bold text-slate-500">共 {schools.length.toLocaleString('zh-TW')} 筆校科資料</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <form onSubmit={submitSearch} className="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜尋學校、科別、群別、縣市或代碼..."
                className="w-full rounded-xl border-2 border-slate-900 bg-slate-50 py-3 pl-12 pr-4 text-base font-bold outline-none focus:bg-white focus:ring-4 focus:ring-sky-300/40"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-sky-300 px-5 py-3 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none">
              <Search className="h-4 w-4" />
              搜尋
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <select value={county} onChange={(event) => setCounty(event.target.value)} className="rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:bg-white">
              <option value="all">全部縣市</option>
              {counties.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <select value={type} onChange={(event) => setType(event.target.value)} className="rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:bg-white">
              <option value="all">全部類型</option>
              {types.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <select value={group} onChange={(event) => setGroup(event.target.value)} className="rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2.5 text-sm font-bold outline-none focus:bg-white">
              <option value="all">全部群別</option>
              {groups.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </form>

        <div className="mt-6">
          {isLoading ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-2xl border-4 border-dashed border-slate-300 bg-white text-slate-500">
              <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
              <div className="font-black">正在載入搜尋資料...</div>
            </div>
          ) : error ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border-4 border-rose-300 bg-rose-50 p-6 text-center text-rose-700">
              <AlertCircle className="h-10 w-10" />
              <div className="font-black">{error}</div>
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border-4 border-dashed border-slate-300 bg-white p-6 text-center text-slate-500">
              <Filter className="h-10 w-10" />
              <div className="text-xl font-black">找不到符合條件的校科</div>
              <p className="text-sm font-bold">試著縮短關鍵字，或清除部分篩選條件。</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredSchools.map((school, index) => (
                <article key={`${school.code}-${school.deptCode}-${index}`} className="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {school.county && <span className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-black text-slate-600">{school.county}</span>}
                    {(school.groupName || school.levelInfo) && <span className="rounded-lg border border-sky-200 bg-sky-100 px-2 py-1 text-xs font-black text-sky-800">{school.groupName || school.levelInfo}</span>}
                  </div>
                  <h2 className="text-xl font-black leading-tight text-slate-950">{school.name}</h2>
                  <div className="mt-3 flex items-start gap-2 text-sm font-bold leading-6 text-slate-600">
                    <Building2 className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                    <span>{school.deptName || '未提供科別'}{school.shift ? ` (${school.shift})` : ''}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Tags className="h-4 w-4" />
                    <span>學校代碼 {school.code} / 科別代碼 {school.deptCode || '-'}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-emerald-50 px-4 py-2.5 text-sm font-black text-emerald-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                  >
                    <MapPin className="h-4 w-4" />
                    在地圖查看
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
