import React from 'react';
import { ArrowRight, BookOpen, CalendarDays, Compass, GraduationCap, LineChart, ListChecks, Map, Target } from 'lucide-react';
import { withBasePath } from '../lib/routes';

type Recommendation = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  tone: string;
};

const recommendations: Record<string, Recommendation[]> = {
  '/school-types': [
    { title: '技職群科百科', description: '已經偏向技高或五專？從群科特色找出真正想學的專業。', href: '/vocational-encyclopedia', icon: GraduationCap, tone: 'bg-emerald-100 text-emerald-800' },
    { title: 'Holland 興趣測驗', description: '還在兩種方向之間猶豫？用興趣線索幫你縮小範圍。', href: '/holland', icon: Compass, tone: 'bg-purple-100 text-purple-800' },
    { title: '填志願策略', description: '知道要選哪種學校後，下一步把志願排得更有把握。', href: '/strategy', icon: Target, tone: 'bg-orange-100 text-orange-800' },
  ],
  '/vocational-encyclopedia': [
    { title: '學校類型解析', description: '先確認技高、五專與其他高中類型，哪一種學習節奏更適合你。', href: '/school-types', icon: BookOpen, tone: 'bg-sky-100 text-sky-800' },
    { title: 'Holland 興趣測驗', description: '用興趣結果交叉比對群科，少一點憑印象選科。', href: '/holland', icon: Compass, tone: 'bg-purple-100 text-purple-800' },
    { title: '搜尋學校與科別', description: '找到心動群科後，直接查看有哪些學校開設。', href: '/search', icon: Map, tone: 'bg-amber-100 text-amber-800' },
  ],
  '/holland': [
    { title: '技職群科百科', description: '把測驗結果轉成可探索的群科與學習內容。', href: '/vocational-encyclopedia', icon: GraduationCap, tone: 'bg-emerald-100 text-emerald-800' },
    { title: '學校類型解析', description: '興趣有方向後，再確認普高、技高、綜高或五專的差異。', href: '/school-types', icon: BookOpen, tone: 'bg-sky-100 text-sky-800' },
    { title: '搜尋學校與科別', description: '下一步：找出你所在區域實際能選的校科。', href: '/search', icon: Map, tone: 'bg-amber-100 text-amber-800' },
  ],
  '/strategy': [
    { title: '模擬志願序', description: '把策略變成清單，試著安排夢幻、實際與保守志願。', href: '/mock-volunteer', icon: ListChecks, tone: 'bg-orange-100 text-orange-800' },
    { title: '歷年會考統計', description: '先理解成績分布，再判讀自己的相對位置。', href: '/historical-stats', icon: LineChart, tone: 'bg-indigo-100 text-indigo-800' },
    { title: '重要日期', description: '別讓報名與選填時程打亂準備節奏。', href: '/important-dates', icon: CalendarDays, tone: 'bg-purple-100 text-purple-800' },
  ],
  '/grade-level': [
    { title: '歷年會考統計', description: '看完等級意義，也看看不同成績組合的整體分布。', href: '/historical-stats', icon: LineChart, tone: 'bg-indigo-100 text-indigo-800' },
    { title: '填志願策略', description: '把成績資訊轉成更穩健的志願安排。', href: '/strategy', icon: Target, tone: 'bg-orange-100 text-orange-800' },
    { title: '學校類型解析', description: '分數之外，也別忘了學習方式與未來方向。', href: '/school-types', icon: BookOpen, tone: 'bg-sky-100 text-sky-800' },
  ],
  '/historical-stats': [
    { title: '會考成績等級', description: '先釐清 A、B、C 與標示的意義，讀統計更有感。', href: '/grade-level', icon: BookOpen, tone: 'bg-rose-100 text-rose-800' },
    { title: '填志願策略', description: '歷年資料是參考，不是保證；用策略安排選項更重要。', href: '/strategy', icon: Target, tone: 'bg-orange-100 text-orange-800' },
    { title: '搜尋學校與科別', description: '帶著想比較的校科，進一步查看實際選項。', href: '/search', icon: Map, tone: 'bg-amber-100 text-amber-800' },
  ],
  '/important-dates': [
    { title: '使用說明', description: '先熟悉分析流程，重要節點來時就不會手忙腳亂。', href: '/instructions', icon: ListChecks, tone: 'bg-blue-100 text-blue-800' },
    { title: '填志願策略', description: '在選填前先想好志願排序，時程一到就能安心送出。', href: '/strategy', icon: Target, tone: 'bg-orange-100 text-orange-800' },
    { title: '模擬志願序', description: '現在就把理想清單排一次，找出還需要補查的資料。', href: '/mock-volunteer', icon: ListChecks, tone: 'bg-amber-100 text-amber-800' },
  ],
  '/instructions': [
    { title: '會考成績等級', description: '不確定成績欄位怎麼看？先掌握等級與標示。', href: '/grade-level', icon: BookOpen, tone: 'bg-rose-100 text-rose-800' },
    { title: '學校類型解析', description: '開始分析前，先知道自己想比較的是哪一條升學路。', href: '/school-types', icon: GraduationCap, tone: 'bg-sky-100 text-sky-800' },
    { title: '填志願策略', description: '看懂結果後，用這些原則安排你的下一步。', href: '/strategy', icon: Target, tone: 'bg-orange-100 text-orange-800' },
  ],
  '/faq-glossary': [
    { title: '使用說明', description: '名詞懂了，接著一步步完成落點分析。', href: '/instructions', icon: ListChecks, tone: 'bg-blue-100 text-blue-800' },
    { title: '學校類型解析', description: '把普高、技高、綜高與五專的差異一次看清楚。', href: '/school-types', icon: GraduationCap, tone: 'bg-sky-100 text-sky-800' },
    { title: '網站地圖', description: '想找特定功能？從完整入口快速前往。', href: '/site-map', icon: Map, tone: 'bg-amber-100 text-amber-800' },
  ],
  '/advantages': [
    { title: '使用說明', description: '想立刻開始？用最短路徑了解怎麼操作分析。', href: '/instructions', icon: ListChecks, tone: 'bg-blue-100 text-blue-800' },
    { title: '學校類型解析', description: '先找到適合自己的學習方向，再開始比較校科。', href: '/school-types', icon: GraduationCap, tone: 'bg-sky-100 text-sky-800' },
    { title: '網站地圖', description: '探索更多選校、成績與志願工具。', href: '/site-map', icon: Map, tone: 'bg-amber-100 text-amber-800' },
  ],
};

const fallback: Recommendation[] = [
  { title: '學校類型解析', description: '從學習方式與未來規劃，找出適合自己的升學方向。', href: '/school-types', icon: GraduationCap, tone: 'bg-sky-100 text-sky-800' },
  { title: '填志願策略', description: '把查到的資料整理成有層次、可執行的志願清單。', href: '/strategy', icon: Target, tone: 'bg-orange-100 text-orange-800' },
  { title: '網站地圖', description: '還想繼續探索？這裡整理了全部工具與說明入口。', href: '/site-map', icon: Map, tone: 'bg-amber-100 text-amber-800' },
];

export default function RelatedReading({ path }: { path: string }) {
  const scoringRuleRecommendations: Recommendation[] = [
    { title: '會考成績等級', description: '先釐清 A、B、C、標示與寫作級分，才能正確閱讀各區換算方式。', href: '/grade-level', icon: BookOpen, tone: 'bg-rose-100 text-rose-800' },
    { title: '填志願策略', description: '把區域規則轉成實際志願排序，避開不必要的志願序扣分。', href: '/strategy', icon: Target, tone: 'bg-orange-100 text-orange-800' },
    { title: '模擬志願序', description: '用清單試排校科與志願順序，再回頭核對你所在考區的規則。', href: '/mock-volunteer', icon: ListChecks, tone: 'bg-amber-100 text-amber-800' },
  ];
  const areaRecommendations: Recommendation[] = [
    { title: '開始落點分析', description: '輸入會考成績與就學區，查看推薦校科與落點區間。', href: '/', icon: Compass, tone: 'bg-indigo-100 text-indigo-800' },
    { title: '填志願策略', description: '把區域規則轉成實際志願排序，避開不必要的志願序扣分。', href: '/strategy', icon: Target, tone: 'bg-orange-100 text-orange-800' },
    { title: '模擬志願序', description: '用清單試排校科與志願順序，再回頭核對你所在考區的規則。', href: '/mock-volunteer', icon: ListChecks, tone: 'bg-amber-100 text-amber-800' },
  ];
  const items = path.startsWith('/scoring-rules/') ? scoringRuleRecommendations : path.startsWith('/area/') ? areaRecommendations : recommendations[path] ?? fallback;
  return <section className="mx-auto max-w-[90rem] px-4 pb-12 sm:px-6 lg:px-8 xl:px-10" aria-labelledby="related-reading-title">
    <div className="rounded-2xl border-4 border-slate-900 bg-slate-900 p-5 text-white shadow-[5px_5px_0px_0px_rgba(14,165,233,1)] sm:p-7 lg:p-9">
      <p className="text-xs font-black tracking-[0.16em] text-sky-200">KEEP EXPLORING</p>
      <h2 id="related-reading-title" className="mt-2 text-2xl font-black sm:text-3xl">別急著離開，這幾頁能幫你更快做決定</h2>
      <p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-slate-200">下一步該選哪種學校、哪個群科，或怎麼排志願？點進最相關的工具，把現在的疑問一步步變成清楚的選擇。</p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">{items.map((item) => { const Icon = item.icon; return <a key={item.href} href={withBasePath(item.href)} className="group rounded-2xl border-2 border-white bg-white p-4 text-slate-900 transition-transform hover:-translate-y-1"><div className={`inline-flex rounded-xl border-2 border-slate-900 p-2 ${item.tone}`}><Icon className="h-5 w-5" /></div><h3 className="mt-3 text-lg font-black">{item.title}</h3><p className="mt-2 text-sm font-bold leading-6 text-slate-600">{item.description}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-sky-700">繼續閱讀 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></a>; })}</div>
    </div>
  </section>;
}
