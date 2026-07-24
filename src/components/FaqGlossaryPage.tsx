import React, { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, ChevronDown, CircleHelp, Search, ShieldAlert } from 'lucide-react';
import { withBasePath } from '../lib/routes';

type Entry = { category: string; term: string; summary: string; detail: string };

const entries: Entry[] = [
  { category: '會考成績', term: '國中教育會考', summary: '國中畢業生常用的升學參考測驗。', detail: '會考成績可作為免試入學等升學管道的比序資料之一。各招生區實際採計的項目與方式不完全相同，應以當年度招生簡章為準。' },
  { category: '會考成績', term: '等級與標示', summary: '各科以 A、B、C 等級及加號標示呈現學習表現。', detail: '不同等級與標示的意義、答對題數與採計方法，應查看當年度會考官方說明及各就學區簡章。本網站的換算僅供初步參考。' },
  { category: '會考成績', term: '寫作測驗級分', summary: '會考寫作測驗的成績表現。', detail: '部分就學區會將寫作測驗納入超額比序或同分比序；是否採計及採計方式會因招生區與年度而異。' },
  { category: '會考成績', term: '免試入學超額比序', summary: '當報名人數超過招生名額時，用來排序的比較規則。', detail: '常見項目可能包含志願序、多元學習表現、會考成績、寫作測驗或其他簡章所列條件。比序順序與計分方式由各區招生委員會公告。' },
  { category: '選填志願', term: '就學區', summary: '依居住、就讀或報名資格適用的招生範圍。', detail: '不同就學區的招生名額、比序規則、志願數與時程可能不同。選填前請先確認自己的報名資格及所屬就學區。' },
  { category: '選填志願', term: '志願序', summary: '你想就讀校科的排列優先順序。', detail: '志願序不只是喜好排序，在部分就學區也可能影響超額比序積分。先填真正最想讀且符合規則的校科，再安排實際與保守選項。' },
  { category: '選填志願', term: '個別序位區間', summary: '反映考生在同一招生區、相近比序條件中的相對位置。', detail: '個別序位區間通常比單看原始分數更適合判讀競爭位置，但仍不能保證錄取。請搭配當年招生名額、歷年資料及官方公告判斷。' },
  { category: '選填志願', term: '落點分析', summary: '以輸入成績與歷年資料推估可能的校科範圍。', detail: '落點分析是協助整理選項的工具，不是錄取保證。考題難度、名額、報名人數、規則與個人條件變化，都可能使實際結果不同。' },
  { category: '選填志願', term: '夢幻、實際、保守志願', summary: '用不同風險區間安排志願清單的方法。', detail: '夢幻志願是願意挑戰的選項；實際志願與目前條件較接近；保守志願則是錄取機會相對高且自己願意就讀的選項。比例應依個人情況調整。' },
  { category: '學校與科別', term: '普通型高中（普高）', summary: '以學術課程為主，常見於準備一般大學升學。', detail: '普通型高中通常重視國文、英文、數學、自然與社會等學科基礎，但各校課程特色、校訂必修與升學輔導仍有差異。' },
  { category: '學校與科別', term: '技術型高中（技高／高職）', summary: '結合共同學科與專業群科課程的高中階段教育。', detail: '技高依群科學習專業基礎與實作，也可透過統測、技優或其他管道升學。選擇前應查看科別課程、實習內容與未來進路。' },
  { category: '學校與科別', term: '綜合型高中（綜高）', summary: '提供學術與專門學程選擇的學校類型。', detail: '綜高的學程分流時間、可選學程與課程規劃會因學校不同而不同；不要只看校名，應確認目標學程是否真的開設。' },
  { category: '學校與科別', term: '五專', summary: '國中畢業後可報讀的五年制專科教育。', detail: '五專著重專業與實務養成，畢業取得副學士學位。招生管道、名額、學費、住宿及續讀選擇應直接查閱各校與當年度簡章。' },
  { category: '學校與科別', term: '職群與科別', summary: '職群是相關專業領域的分類；科別是實際就讀的專業。', detail: '同一職群內的科別名稱與學習重點仍可能差很多，例如資訊、電子與電機都有不同的課程比例與實作方向。請以各校課程地圖為準。' },
  { category: '使用本站', term: '歷年最低錄取分數', summary: '過去年度最後錄取者的參考資料，不是今年門檻。', detail: '歷年資料會受名額、報名人數、考題難度與比序規則影響。它適合觀察趨勢，不應單獨用來判定今年一定能否錄取。' },
  { category: '使用本站', term: '資料更新日與來源', summary: '用來確認資訊適用年度與可追溯性。', detail: '招生規則與日期會變動。使用本站資料前請查看標示年度與更新時間；關鍵決策請回到招生委員會、教育主管機關或學校的正式公告核對。' },
];

const categories = ['全部', ...Array.from(new Set(entries.map((entry) => entry.category)))];

export default function FaqGlossaryPage() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('全部');
  const [openTerm, setOpenTerm] = useState<string | null>(entries[0].term);
  const filtered = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    return entries.filter((entry) => (category === '全部' || entry.category === category) && (!query || [entry.category, entry.term, entry.summary, entry.detail].join(' ').toLowerCase().includes(query)));
  }, [category, keyword]);

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <section className="border-b-4 border-slate-900 bg-sky-50"><div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"><ArrowLeft className="h-4 w-4" />返回首頁</a>
      <div className="py-10"><div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 bg-sky-100"><BookOpen className="h-6 w-6 text-sky-700" /></div><div><p className="text-xs font-black uppercase tracking-widest text-slate-500">FAQ & Glossary</p><p className="text-sm font-black text-slate-700">升學名詞一次看懂</p></div></div>
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">常見問答與名詞百科</h1><p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">把會考、免試入學、志願選填與學校類型的常見名詞整理成易懂說明，幫助你閱讀資料、和家人討論志願。</p></div>
    </div></section>
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8"><div className="rounded-2xl border-4 border-slate-900 bg-amber-100 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><div className="flex gap-3"><ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-amber-800" /><p className="text-sm font-bold leading-7 text-slate-800">本頁用語為學習與規劃參考；招生資格、計分、比序、名額與時程可能每年或各就學區不同，請以當年度招生簡章與官方公告為準。</p></div></div>
      <div className="mt-7 rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]"><div className="relative"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜尋名詞，例如：序位、五專、超額比序..." className="w-full rounded-xl border-2 border-slate-900 bg-slate-50 py-3 pl-12 pr-4 text-base font-bold outline-none focus:bg-white focus:ring-4 focus:ring-sky-300/40" /></div><div className="mt-4 flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-xl border-2 border-slate-900 px-3 py-2 text-sm font-black transition-colors ${category === item ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-sky-50'}`}>{item}</button>)}</div></div>
      <p className="mt-6 text-sm font-black text-slate-600">找到 {filtered.length} 個名詞</p><div className="mt-3 space-y-4">{filtered.map((entry) => { const isOpen = openTerm === entry.term; return <article key={entry.term} className="overflow-hidden rounded-2xl border-4 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><button type="button" onClick={() => setOpenTerm(isOpen ? null : entry.term)} className="flex w-full items-center gap-4 p-5 text-left hover:bg-sky-50"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-sky-100"><CircleHelp className="h-5 w-5 text-sky-700" /></div><div className="min-w-0 flex-1"><span className="text-xs font-black text-sky-700">{entry.category}</span><h2 className="text-xl font-black text-slate-900">{entry.term}</h2><p className="mt-1 text-sm font-bold leading-6 text-slate-600">{entry.summary}</p></div><ChevronDown className={`h-6 w-6 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>{isOpen && <div className="border-t-2 border-slate-200 bg-slate-50 px-5 py-5 pl-[4.75rem]"><p className="max-w-3xl text-base font-bold leading-8 text-slate-700">{entry.detail}</p></div>}</article>; })}</div>
      {filtered.length === 0 && <div className="mt-4 rounded-2xl border-4 border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="text-xl font-black text-slate-700">找不到相關名詞</h2><p className="mt-2 text-sm font-bold text-slate-500">試試較短的關鍵字，或改選「全部」。</p></div>}
    </section>
  </main>;
}
