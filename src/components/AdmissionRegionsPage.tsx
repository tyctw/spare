import React from 'react';
import { ArrowLeft, MapPin, Search, Target } from 'lucide-react';
import { withBasePath } from '../lib/routes';

const regions = [
  { name: '基北區', areas: '臺北市、新北市、基隆市', keywords: '基北區會考落點分析、基北區志願選填、高中職免試入學' },
  { name: '桃連區', areas: '桃園市、連江縣', keywords: '桃連區會考落點分析、桃園會考落點、連江會考志願選填' },
  { name: '竹苗區', areas: '新竹市、新竹縣、苗栗縣', keywords: '竹苗區會考落點分析、新竹會考落點、苗栗志願選填' },
  { name: '中投區', areas: '臺中市、南投縣', keywords: '中投區會考落點分析、臺中會考落點、南投志願選填' },
  { name: '彰化區', areas: '彰化縣', keywords: '彰化區會考落點分析、彰化志願選填' },
  { name: '雲林區', areas: '雲林縣', keywords: '雲林區會考落點分析、雲林志願選填' },
  { name: '嘉義區', areas: '嘉義市、嘉義縣', keywords: '嘉義區會考落點分析、嘉義志願選填' },
  { name: '台南區', areas: '臺南市', keywords: '台南區會考落點分析、臺南會考落點、台南志願選填' },
  { name: '高雄區', areas: '高雄市', keywords: '高雄區會考落點分析、高雄志願選填' },
  { name: '屏東區', areas: '屏東縣', keywords: '屏東區會考落點分析、屏東志願選填' },
  { name: '宜蘭區', areas: '宜蘭縣', keywords: '宜蘭區會考落點分析、宜蘭志願選填' },
  { name: '花蓮區', areas: '花蓮縣', keywords: '花蓮區會考落點分析、花蓮志願選填' },
  { name: '台東區', areas: '臺東縣', keywords: '台東區會考落點分析、臺東志願選填' },
  { name: '澎湖區', areas: '澎湖縣', keywords: '澎湖區會考落點分析、澎湖志願選填' },
  { name: '金門區', areas: '金門縣', keywords: '金門區會考落點分析、金門志願選填' },
];

export default function AdmissionRegionsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-indigo-50">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <ArrowLeft className="h-4 w-4" /> 回到落點分析
          </a>
          <div className="py-10 sm:py-14">
            <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <MapPin className="h-6 w-6 text-indigo-700" />
              <span className="text-sm font-black text-slate-700">全國會考免試入學就學區</span>
            </div>
            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">各就學區會考落點分析與志願選填</h1>
            <p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">
              整理基北、桃連、竹苗、中投、彰化、雲林、嘉義、台南、高雄、屏東、宜蘭、花蓮、台東、澎湖與金門區的會考升學查詢入口。輸入成績後，可查詢校科資料、比較志願並建立模擬志願序；實際招生規則請以各區免試入學委員會當年度公告為準。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black sm:text-3xl">15 個就學區查詢入口</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {regions.map((region) => (
            <article key={region.name} className="flex flex-col rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border-2 border-slate-900 bg-amber-100 p-2.5"><MapPin className="h-5 w-5 text-amber-700" /></div>
                <h3 className="text-2xl font-black">{region.name}</h3>
              </div>
              <p className="mt-4 text-sm font-bold text-slate-700">適用地區：{region.areas}</p>
              <p className="mt-3 text-sm font-bold leading-7 text-slate-600">可查詢：{region.keywords}</p>
              <a href={withBasePath('/')} className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-4 py-3 text-sm font-black text-white transition hover:bg-indigo-700">
                <Search className="h-4 w-4" /> 前往會考落點分析
              </a>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border-4 border-slate-900 bg-amber-100 p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-start gap-3"><Target className="mt-0.5 h-6 w-6 shrink-0 text-amber-800" /><p className="font-bold leading-8 text-slate-800">每個就學區的超額比序、積分換算與招生名額可能不同。建議先使用本工具整理志願方向，再核對當年度簡章與官方公告。</p></div>
        </div>
      </section>
    </main>
  );
}
