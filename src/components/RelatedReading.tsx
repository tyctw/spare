import React from 'react';
import { ArrowUpRight, BookOpen, CalendarDays, Compass, GraduationCap, LineChart, ListChecks, Map, Target } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import './related-reading.css';

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
    { title: '科別探索圖鑑', description: '想細看某一科？從類別與群別進入各科獨立介紹。', href: '/departments', icon: BookOpen, tone: 'bg-violet-100 text-violet-800' },
    { title: '學校類型解析', description: '先確認技高、五專與其他高中類型，哪一種學習節奏更適合你。', href: '/school-types', icon: BookOpen, tone: 'bg-sky-100 text-sky-800' },
    { title: 'Holland 興趣測驗', description: '用興趣結果交叉比對群科，少一點憑印象選科。', href: '/holland', icon: Compass, tone: 'bg-purple-100 text-purple-800' },
    { title: '搜尋學校與科別', description: '找到心動群科後，直接查看有哪些學校開設。', href: '/search', icon: Map, tone: 'bg-amber-100 text-amber-800' },
  ],
  '/departments': [
    { title: '技職群科百科', description: '先了解職群共同課程與學習方式，再比較科別。', href: '/vocational-encyclopedia', icon: GraduationCap, tone: 'bg-emerald-100 text-emerald-800' },
    { title: '搜尋學校與科別', description: '找到感興趣的科別後，確認哪些學校實際開設。', href: '/search', icon: Map, tone: 'bg-amber-100 text-amber-800' },
    { title: '學校類型解析', description: '比較技高與其他學制的學習安排。', href: '/school-types', icon: BookOpen, tone: 'bg-sky-100 text-sky-800' },
  ],
  '/holland': [
    { title: '技職群科百科', description: '把測驗結果轉成可探索的群科與學習內容。', href: '/vocational-encyclopedia', icon: GraduationCap, tone: 'bg-emerald-100 text-emerald-800' },
    { title: '學校類型解析', description: '興趣有方向後，再確認普高、技高、綜高或五專的差異。', href: '/school-types', icon: BookOpen, tone: 'bg-sky-100 text-sky-800' },
    { title: '搜尋學校與科別', description: '下一步：找出你所在區域實際能選的校科。', href: '/search', icon: Map, tone: 'bg-amber-100 text-amber-800' },
  ],
  '/strategy': [
    { title: '模擬志願序', description: '把心儀校科立刻排進清單，快速看出衝刺、穩妥與保底志願是否失衡。', href: '/mock-volunteer', icon: ListChecks, tone: 'bg-orange-100 text-orange-800' },
    { title: '歷年會考統計', description: '不只看自己的分數；先掌握整體分布，讓每一個志願多一層判斷依據。', href: '/historical-stats', icon: LineChart, tone: 'bg-indigo-100 text-indigo-800' },
    { title: '重要日期', description: '把選填、報名與放榜關鍵日先記下來，不讓一個截止日打亂整份規劃。', href: '/important-dates', icon: CalendarDays, tone: 'bg-purple-100 text-purple-800' },
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
  '/news': [
    { title: '模擬志願序', description: '讀完資訊後，立刻把心儀校科排進清單，看看你的志願是否需要補強。', href: '/mock-volunteer', icon: ListChecks, tone: 'bg-orange-100 text-orange-800' },
    { title: '學校類型解析', description: '還在猶豫普高、技高、綜高或五專？用學習方式找出適合自己的方向。', href: '/school-types', icon: GraduationCap, tone: 'bg-sky-100 text-sky-800' },
    { title: '重要日期', description: '把選填、報名與放榜日期先掌握住，重要時刻就不會手忙腳亂。', href: '/important-dates', icon: CalendarDays, tone: 'bg-purple-100 text-purple-800' },
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
  const items = path.startsWith('/scoring-rules/') ? scoringRuleRecommendations : path.startsWith('/area/') ? areaRecommendations : path.startsWith('/news/') ? recommendations['/news'] : path.startsWith('/departments/') ? recommendations['/departments'] : recommendations[path] ?? fallback;
  return <section className="related-reading" aria-labelledby="related-reading-title">
    <div className="related-reading__shell">
      <div className="related-reading__intro">
        <div className="related-reading__intro-copy">
          <div className="related-reading__eyebrow"><Compass size={17} aria-hidden="true" /><span>接著探索</span><span className="related-reading__count">{items.length} 個推薦方向</span></div>
          <h2 id="related-reading-title">下一步，<span>讓選擇更有把握。</span></h2>
          <p>挑一個現在最想釐清的問題，從下面的內容繼續看。每多了解一點，就更接近適合自己的方向。</p>
        </div>
        <div className="related-reading__spotlight" aria-hidden="true"><span>YOUR NEXT STEP</span><strong>{String(items.length).padStart(2, '0')}</strong><span>個值得繼續看的方向</span><ArrowUpRight size={27} /></div>
      </div>
      <div className={`related-reading__grid${items.length === 4 ? ' related-reading__grid--four' : ''}`}>
        {items.map((item, index) => {
          const Icon = item.icon;
          return <a key={item.href} href={withBasePath(item.href)} className="related-reading__card">
            <div className="related-reading__card-top"><span className="related-reading__number">推薦 {String(index + 1).padStart(2, '0')}</span><span className={`related-reading__icon ${item.tone}`}><Icon size={25} aria-hidden="true" /></span></div>
            <div className="related-reading__card-copy"><h3>{item.title}</h3><p>{item.description}</p></div>
            <span className="related-reading__card-link">前往了解 <span><ArrowUpRight size={18} aria-hidden="true" /></span></span>
          </a>;
        })}
      </div>
    </div>
  </section>;
}
