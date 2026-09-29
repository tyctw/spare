import { AREA_DATA, getAreaBySlug } from '../lib/areaData';
import PageBreadcrumb from './PageBreadcrumb';
import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Building2, Calculator, Compass, ExternalLink, GraduationCap, HelpCircle, LineChart, ListChecks, MapPin, Search, Sparkles, Target } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import { AREA_SCHOOLS } from '../lib/areaSchools';

// Links to related tools shown on every area page
const toolCards = [
  { title: '搜尋學校與科別', desc: '依學校名稱、科別、縣市快速查找校科資訊。', href: '/search', icon: Search, tone: 'bg-sky-100 text-sky-700' },
  { title: '模擬志願序', desc: '建立志願清單並調整順序，列印草稿核對。', href: '/mock-volunteer', icon: ListChecks, tone: 'bg-amber-100 text-amber-700' },
  { title: '填志願策略', desc: '了解夢幻、實際、保守志願的安排原則。', href: '/strategy', icon: Target, tone: 'bg-orange-100 text-orange-700' },
  { title: 'Holland 興趣測驗', desc: '探索個人興趣特質，找出適合的職群方向。', href: '/holland', icon: Sparkles, tone: 'bg-purple-100 text-purple-700' },
  { title: '技職群科百科', desc: '認識技職各群科的學習內容與未來進路。', href: '/vocational-encyclopedia', icon: BookOpen, tone: 'bg-emerald-100 text-emerald-700' },
  { title: '學校類型解析', desc: '比較普高、技高、綜高與五專的特色差異。', href: '/school-types', icon: GraduationCap, tone: 'bg-rose-100 text-rose-700' },
  { title: '歷年會考統計', desc: '查看歷年成績分布與等級趨勢。', href: '/historical-stats', icon: LineChart, tone: 'bg-indigo-100 text-indigo-700' },
  { title: '會考成績等級', desc: '確認 A、B、C 與標示的對照方式。', href: '/grade-level', icon: HelpCircle, tone: 'bg-fuchsia-100 text-fuchsia-700' },
];

export default function AreaPage({ slug }: { slug: string }) {
  const area = getAreaBySlug(slug);

  if (!area) {
    return <main className="grid min-h-screen place-items-center bg-slate-50 p-6"><section className="max-w-lg rounded-3xl border-4 border-slate-900 bg-white p-8 text-center shadow-[8px_8px_0_0_#0f172a]"><h1 className="text-2xl font-black">找不到此就學區</h1><a className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-amber-300 px-4 py-3 font-black" href={withBasePath('/')}>返回首頁 <ArrowRight className="h-4 w-4" /></a></section></main>;
  }

  const otherAreas = AREA_DATA.filter((a) => a.slug !== slug);

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    {/* Hero */}
    <section className="border-b-4 border-slate-900 bg-indigo-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <PageBreadcrumb title={`${area.name}會考落點分析`} />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-sm font-black"><MapPin className="h-4 w-4 text-rose-600" />{area.cities}</div>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">{area.name}會考落點分析</h1>
            <p className="mt-2 text-base font-bold text-indigo-700">{area.cities}免試入學志願選填</p>
            <p className="mt-4 max-w-3xl text-lg font-bold leading-8 text-slate-700">{area.description}</p>
          </div>
          <div className="w-full lg:w-auto shrink-0">
            {area.active
              ? <a href={withBasePath('/')} className="flex w-full justify-center lg:inline-flex lg:w-auto items-center gap-3 rounded-2xl border-4 border-slate-900 bg-indigo-600 px-6 py-4 text-lg font-black text-white shadow-[5px_5px_0_0_#0f172a] transition hover:bg-indigo-700"><Compass className="h-6 w-6" />開始落點分析</a>
              : <div className="w-full sm:w-auto rounded-2xl border-4 border-slate-900 bg-slate-200 px-6 py-4 text-center shadow-[5px_5px_0_0_#0f172a]"><p className="text-lg font-black text-slate-600">落點分析籌備中</p><p className="mt-1 text-sm font-bold text-slate-500">資料整理完成後將開放查詢</p></div>
            }
          </div>
        </div>
      </div>
    </section>

    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Scoring rules link */}
      {area.scoringRulesId && <section className="mb-8">
        <a href={withBasePath(`/scoring-rules/${area.scoringRulesId}`)} className="flex items-center gap-4 rounded-2xl border-4 border-slate-900 bg-amber-50 p-5 shadow-[4px_4px_0_0_#0f172a] transition hover:bg-amber-100">
          <div className="rounded-xl border-2 border-slate-900 bg-amber-300 p-3"><Calculator className="h-6 w-6" /></div>
          <div className="flex-1"><h2 className="text-xl font-black">{area.name}超額比序計分規則</h2><p className="mt-1 text-sm font-bold text-slate-600">查看一般免試入學的超額比序項目、會考換算與官方簡章入口。</p></div>
          <ArrowRight className="h-5 w-5 shrink-0" />
        </a>
      </section>}

      {/* Tools grid */}
      <section className="mb-10">
        <h2 className="text-2xl font-black">升學規劃工具</h2>
        <p className="mt-2 text-sm font-bold text-slate-600">搭配落點結果，使用這些工具完成{area.name}的志願選填規劃。</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {toolCards.map((card) => <a key={card.href} href={withBasePath(card.href)} className="flex flex-col rounded-2xl border-3 border-slate-900 bg-white p-4 shadow-[3px_3px_0_0_#0f172a] transition hover:shadow-[5px_5px_0_0_#0f172a]">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 ${card.tone}`}><card.icon className="h-5 w-5" /></div>
            <h3 className="mt-3 font-black">{card.title}</h3>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-600">{card.desc}</p>
          </a>)}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-2xl font-black">{area.name}常見問題</h2>
        <div className="mt-5 space-y-4">
          {area.faqs.map((faq) => <details key={faq.q} className="group rounded-2xl border-3 border-slate-900 bg-white shadow-[3px_3px_0_0_#0f172a]">
            <summary className="cursor-pointer list-none px-5 py-4 font-black [&::-webkit-details-marker]:hidden">
              <div className="flex items-center justify-between gap-3">
                <span>{faq.q}</span>
                <span className="shrink-0 text-xl leading-none transition group-open:rotate-45">+</span>
              </div>
            </summary>
            <div className="border-t-2 border-slate-200 px-5 py-4 text-sm font-bold leading-7 text-slate-700">{faq.a}</div>
          </details>)}
        </div>
      </section>

      {/* Other regions navigation */}
      <section>
        <h2 className="text-2xl font-black">其他就學區</h2>
        <p className="mt-2 text-sm font-bold text-slate-600">查看全國其他就學區的會考落點分析入口。</p>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {otherAreas.map((a) => <a key={a.slug} href={withBasePath(`/area/${a.slug}`)} title={`${a.name}會考落點分析（${a.cities}）${a.active ? '' : '｜籌備中'}`} className="flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 text-sm font-black shadow-[2px_2px_0_0_#0f172a] transition hover:bg-slate-50 hover:shadow-[3px_3px_0_0_#0f172a]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-600" />{a.name}
            {!a.active && <span className="ml-auto rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-black text-slate-500">籌備中</span>}
          </a>)}
        </div>
      </section>

      {/* SEO Schools List */}
      <section className="mb-10 mt-16">
        <details className="group rounded-2xl border-3 border-slate-900 bg-slate-100 shadow-[3px_3px_0_0_#0f172a] transition-colors hover:bg-amber-50">
          <summary className="cursor-pointer list-none px-5 py-4 font-black [&::-webkit-details-marker]:hidden">
            <div className="flex items-center justify-between gap-3 text-slate-700 group-hover:text-slate-900">
              <span className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                {area.name}涵蓋高中職與五專學校列表
              </span>
              <span className="shrink-0 text-xl leading-none transition duration-300 group-open:rotate-45">+</span>
            </div>
          </summary>
          <div className="border-t-3 border-slate-900 bg-white px-5 py-6 rounded-b-[14px]">
            <div className="flex flex-wrap gap-2">
              {AREA_SCHOOLS[slug]?.map(school => (
                <span key={school} className="inline-block rounded-lg border-2 border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
                  {school}
                </span>
              ))}
            </div>
            <p className="mt-5 text-[11px] font-bold text-slate-400">
              * 上述清單包含{area.name}免試入學與共同就學區之相關學校，供會考落點分析與志願選填參考。
            </p>
          </div>
        </details>
      </section>
    </div>
  </main>;
}
