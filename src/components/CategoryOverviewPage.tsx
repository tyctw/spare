import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { menuCategories, type MenuItem } from './layout/NavigationDrawer';
import { withBasePath } from '../lib/routes';
import type { CategoryOverviewId } from '../lib/categoryOverview';
import MissingFeatureCard from './MissingFeatureCard';

const pageContent: Record<CategoryOverviewId, { title: string; intro: string; categoryIds: string[]; steps: string[] }> = {
  find: {
    title: '我要查資料',
    intro: '從學校、科別、學制到歷年資料，先把升學選擇需要的資訊整理清楚。',
    categoryIds: ['find'],
    steps: ['先確認想查詢的學校、科別或學制。', '搭配區域與群科資料交叉比較。', '將結果作為後續選填與討論的參考。'],
  },
  choose: {
    title: '我要選志願',
    intro: '依成績、興趣與志願順序逐步整理，建立更有方向的選填清單。',
    categoryIds: ['choose'],
    steps: ['輸入成績與相關條件。', '查看推薦清單與歷年趨勢。', '透過模擬功能調整志願排序。'],
  },
  plan: {
    title: '我要規劃升學',
    intro: '把探索興趣、掌握時程與認識升學方向放在同一個規劃流程中。',
    categoryIds: ['plan'],
    steps: ['從興趣與學校類型開始探索。', '追蹤重要時程與官方資訊。', '依結果安排下一步準備。'],
  },
  member: {
    title: '會員與資源',
    intro: '管理會員資格、了解平台方案，並使用延伸的升學資源。',
    categoryIds: ['membership', 'external'],
    steps: ['查看會員方案與目前資格。', '依需求開啟延伸工具與資源。', '保存常用入口，持續完成規劃。'],
  },
  help: {
    title: '使用協助',
    intro: '快速找到操作說明、常見問題、平台規範與最新更新資訊。',
    categoryIds: ['support', 'about'],
    steps: ['先閱讀對應功能的使用說明。', '遇到問題可查看常見問答或回報。', '定期留意平台更新與使用規範。'],
  },
};

const actionHref = (item: MenuItem) => item.action.type === 'route'
  ? withBasePath(item.action.href)
  : item.action.type === 'external'
    ? item.action.href
    : withBasePath('/');

export default function CategoryOverviewPage({ categoryId }: { categoryId: CategoryOverviewId }) {
  const page = pageContent[categoryId];
  const categories = page.categoryIds.map((id) => menuCategories.find((category) => category.id === id)).filter(Boolean);
  const items = categories.flatMap((category) => category!.items.map((item) => ({ ...item, categoryLabel: category!.label })));

  return (
    <main className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-indigo-50">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0_#0f172a] transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2">
            <ArrowLeft className="h-4 w-4" />返回首頁
          </a>
          <div className="py-8 sm:py-12">
            <p className="text-sm font-black tracking-[0.16em] text-indigo-700">功能分類說明</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">{page.title}</h1>
            <p className="mt-5 max-w-3xl text-lg font-bold leading-8 text-slate-700 sm:text-xl">{page.intro}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.8fr_2fr] lg:px-8 lg:py-12">
        <aside className="h-fit rounded-3xl border-4 border-slate-900 bg-amber-100 p-5 shadow-[4px_4px_0_#0f172a] sm:p-6 lg:sticky lg:top-6">
          <h2 className="text-xl font-black">建議使用方式</h2>
          <ol className="mt-5 space-y-4">
            {page.steps.map((step, index) => <li key={step} className="flex gap-3 text-sm font-bold leading-6 text-slate-700"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-slate-900 bg-white text-xs font-black">{index + 1}</span>{step}</li>)}
          </ol>
        </aside>

        <section aria-labelledby="category-functions-heading">
          <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-sm font-black text-slate-500">完整功能</p><h2 id="category-functions-heading" className="mt-1 text-2xl font-black sm:text-3xl">從這裡開始</h2></div><span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-black text-sky-800">{items.length} 項功能</span></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => {
              const Icon = item.icon;
              const external = item.action.type === 'external';
              const modal = item.action.type === 'modal';
              return <a key={item.id} href={actionHref(item)} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="group rounded-3xl border-2 border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-[3px_3px_0_#0f172a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2">
                <div className="flex items-start justify-between gap-4"><span className={`grid h-11 w-11 place-items-center rounded-xl border-2 border-slate-900 ${item.bg} ${item.color}`}><Icon className="h-5 w-5" /></span>{external ? <ExternalLink className="h-5 w-5 text-slate-500" /> : <ArrowRight className="h-5 w-5 text-slate-500 transition-transform group-hover:translate-x-1" />}</div>
                <p className="mt-5 text-[11px] font-black text-slate-500">{item.categoryLabel}</p><h3 className="mt-1 text-xl font-black">{item.label}</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-600">{item.description}</p>
                {modal && <p className="mt-4 flex items-center gap-1.5 text-xs font-black text-indigo-700"><CheckCircle2 className="h-4 w-4" />回首頁後可開啟此功能</p>}
              </a>;
            })}
          </div>
          <div className="mt-6"><MissingFeatureCard /></div>
        </section>
      </div>
    </main>
  );
}
