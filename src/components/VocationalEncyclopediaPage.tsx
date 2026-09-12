import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Building2, BookOpen, Briefcase, GraduationCap, Search, Sparkles, Tags } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import { pageNavigationAsideClassName } from './PageNavigation';

import { groups, type VocationalGroup } from '../lib/vocationalGroups';

type Myth = { myth: string; fact: string };

const groupMyths: Record<string, Myth[]> = {
  '機械群': [
    { myth: '迷思：機械群就是一直操作車床。', fact: '正確觀念：加工實作很重要，但同時也要學製圖、材料、量測、機構原理與製造流程。' },
    { myth: '迷思：不會修東西就不能讀機械。', fact: '正確觀念：先備經驗不是必要條件；願意動手、能耐心練習與重視安全，比一開始就會修更重要。' },
  ],
  '動力機械群': [
    { myth: '迷思：動力機械群只有修汽車。', fact: '正確觀念：課程還會涉及引擎、底盤、電系、診斷、保養與其他動力或運輸工具技術。' },
    { myth: '迷思：喜歡賽車就一定適合。', fact: '正確觀念：興趣是起點，但專業學習需要接受拆裝、量測、故障診斷與安全規範。' },
  ],
  '電機與電子群': [
    { myth: '迷思：喜歡用電腦就應該選資訊科。', fact: '正確觀念：電機、電子、資訊、控制與冷凍空調的核心不同，要看自己喜歡程式、電路、配線或設備控制。' },
    { myth: '迷思：學電機電子就是一直寫程式。', fact: '正確觀念：程式只是其中一部分，還包括電學、電子電路、實驗、量測與實作安全。' },
  ],
  '化工群': [
    { myth: '迷思：化工群只是在做有趣的化學實驗。', fact: '正確觀念：也重視化學原理、製程、分析、紀錄、品質與工業安全。' },
    { myth: '迷思：只要背化學方程式就好。', fact: '正確觀念：需要理解原理、正確操作器材並根據數據判讀結果。' },
  ],
  '土木與建築群': [
    { myth: '迷思：建築科就是每天畫漂亮房子。', fact: '正確觀念：設計與繪圖之外，還有構造、材料、測量與施工等基礎。' },
    { myth: '迷思：土木群只適合想做工地的人。', fact: '正確觀念：可延伸至測量、繪圖、營建管理、建物維護與工程相關領域。' },
  ],
  '商業與管理群': [
    { myth: '迷思：商管群就是學怎麼當老闆。', fact: '正確觀念：會從會計、經濟、資訊、行銷與流通等基礎，理解企業實際運作。' },
    { myth: '迷思：不喜歡數字也沒關係。', fact: '正確觀念：不同科別比重不同，但帳務、資料整理與基本數字判讀通常是重要能力。' },
  ],
  '外語群': [
    { myth: '迷思：外語群只要英文好就夠了。', fact: '正確觀念：還需要持續練習聽說讀寫、跨文化理解與實際溝通表達。' },
    { myth: '迷思：讀外語群畢業就會當翻譯。', fact: '正確觀念：語言可應用在國際事務、觀光、服務與商務等多個方向，仍需累積專業能力。' },
  ],
  '設計群': [
    { myth: '迷思：喜歡畫圖就一定適合設計群。', fact: '正確觀念：設計還涉及觀察、問題解決、軟體操作、提案與反覆修改。' },
    { myth: '迷思：設計只要有靈感，不必練基本功。', fact: '正確觀念：色彩、構成、繪圖、製作與作品表達都需要持續練習。' },
  ],
  '農業群': [
    { myth: '迷思：農業群就是務農。', fact: '正確觀念：涵蓋園藝、畜產、森林、生物技術、保育與農業經營等多元方向。' },
    { myth: '迷思：喜歡動物就只需要讀獸醫。', fact: '正確觀念：畜產保健與保育重點在飼養、照護與產業技術；不同升學與職業路徑有不同資格要求。' },
  ],
  '食品群': [
    { myth: '迷思：食品群和餐旅群完全一樣。', fact: '正確觀念：食品群較著重加工、檢驗、衛生、品質與保存；餐旅群更著重料理、服務與旅宿實務。' },
    { myth: '迷思：食品群只會做烘焙。', fact: '正確觀念：烘焙是部分科別內容，食品化學、微生物、檢驗與安全管理同樣重要。' },
  ],
  '家政群': [
    { myth: '迷思：家政群只學做家事。', fact: '正確觀念：涵蓋服飾、美容、美髮、幼保與照顧服務等專業技術與服務能力。' },
    { myth: '迷思：喜歡小孩就適合幼兒保育。', fact: '正確觀念：幼保工作也需要學習發展知識、活動設計、安全與溝通，並非只有陪伴玩耍。' },
  ],
  '餐旅群': [
    { myth: '迷思：餐旅群就是每天做菜、吃美食。', fact: '正確觀念：課程包含衛生、成本、服務流程、服儀、顧客應對與團隊合作。' },
    { myth: '迷思：只要外向就適合餐旅群。', fact: '正確觀念：外向有幫助，但更需要在忙碌環境中維持細心、責任感與專業態度。' },
  ],
  '水產群': [
    { myth: '迷思：水產群就是出海捕魚。', fact: '正確觀念：也包含養殖、水質管理、水產生物、資源管理與水產食品。' },
    { myth: '迷思：喜歡海洋就完全不用學科學。', fact: '正確觀念：水質、生物、疾病管理與養殖技術需要自然科學基礎與細心觀察。' },
  ],
  '海事群': [
    { myth: '迷思：海事群畢業一定要上船。', fact: '正確觀念：也可延伸至船務、港埠、海運、維修與相關管理領域。' },
    { myth: '迷思：只要不怕海就能讀。', fact: '正確觀念：海事重視安全、規範、團隊生活與實務條件，部分路徑也可能有資格或健康要求。' },
  ],
  '藝術群': [
    { myth: '迷思：有天分就不需要長期練習。', fact: '正確觀念：音樂、戲劇、舞蹈與影視都需要穩定練習、作品累積與接受回饋。' },
    { myth: '迷思：藝術群只能當表演者。', fact: '正確觀念：也可探索製作、技術、教育、推廣與文化內容等多樣角色。' },
  ],
};

const selectionSteps = [
  ['先看課程', '打開目標學校的課程地圖或科別介紹，確認是否真的想學那些內容。'],
  ['再看自己', '想想自己喜歡的活動、擅長的學科、能接受的實作環境與學習方式。'],
  ['比較學校', '比較學校位置、實習設備、特色課程、升學輔導與當年度招生資訊。'],
  ['確認簡章', '填志願前，以當年度免試入學與學校招生簡章為最後依據。'],
];

const groupThemes: Record<string, { hero: string; icon: string; chip: string }> = {
  '機械群': { hero: 'from-slate-800 via-slate-700 to-cyan-700', icon: 'bg-cyan-200', chip: 'bg-cyan-100 text-cyan-950' },
  '動力機械群': { hero: 'from-orange-700 via-amber-600 to-yellow-500', icon: 'bg-amber-200', chip: 'bg-amber-100 text-amber-950' },
  '電機與電子群': { hero: 'from-blue-800 via-indigo-700 to-violet-600', icon: 'bg-indigo-200', chip: 'bg-indigo-100 text-indigo-950' },
  '化工群': { hero: 'from-fuchsia-800 via-purple-700 to-violet-600', icon: 'bg-fuchsia-200', chip: 'bg-fuchsia-100 text-fuchsia-950' },
  '土木與建築群': { hero: 'from-stone-800 via-amber-800 to-orange-700', icon: 'bg-orange-200', chip: 'bg-orange-100 text-orange-950' },
  '商業與管理群': { hero: 'from-emerald-800 via-teal-700 to-cyan-700', icon: 'bg-emerald-200', chip: 'bg-emerald-100 text-emerald-950' },
  '外語群': { hero: 'from-sky-800 via-blue-700 to-indigo-600', icon: 'bg-sky-200', chip: 'bg-sky-100 text-sky-950' },
  '設計群': { hero: 'from-rose-800 via-pink-700 to-fuchsia-600', icon: 'bg-pink-200', chip: 'bg-pink-100 text-pink-950' },
  '農業群': { hero: 'from-green-800 via-emerald-700 to-lime-600', icon: 'bg-lime-200', chip: 'bg-lime-100 text-lime-950' },
  '食品群': { hero: 'from-amber-800 via-orange-700 to-red-600', icon: 'bg-yellow-200', chip: 'bg-yellow-100 text-yellow-950' },
  '家政群': { hero: 'from-rose-800 via-pink-700 to-purple-600', icon: 'bg-rose-200', chip: 'bg-rose-100 text-rose-950' },
  '餐旅群': { hero: 'from-red-800 via-orange-700 to-amber-600', icon: 'bg-orange-200', chip: 'bg-orange-100 text-orange-950' },
  '水產群': { hero: 'from-cyan-800 via-sky-700 to-blue-600', icon: 'bg-cyan-200', chip: 'bg-cyan-100 text-cyan-950' },
  '海事群': { hero: 'from-blue-950 via-blue-800 to-cyan-700', icon: 'bg-sky-200', chip: 'bg-sky-100 text-sky-950' },
  '藝術群': { hero: 'from-violet-900 via-purple-700 to-fuchsia-600', icon: 'bg-fuchsia-200', chip: 'bg-fuchsia-100 text-fuchsia-950' },
};

const getFiveGroupMyths = (group: VocationalGroup): Myth[] => [
  ...groupMyths[group.id],
  { myth: `迷思：同是${group.id}，每所學校的課程都完全一樣。`, fact: `正確觀念：${group.id}有共同專業核心，但實際開設科別、實習設備、特色課程與專題方向仍會因學校而不同。` },
  { myth: `迷思：只看科名，就能知道自己適不適合${group.id}。`, fact: '正確觀念：應進一步閱讀課程地圖、實作內容與學校介紹；科名相近，實際學習經驗可能差異很大。' },
  { myth: `迷思：選${group.id}後，未來只能走單一路徑。`, fact: '正確觀念：可依個人學習成果、興趣與入學管道繼續升學或探索相關產業；高中階段的選擇是起點，不是唯一限制。' },
];

export default function VocationalEncyclopediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const requestedGroup = new URLSearchParams(window.location.search).get('group');
  const [selectedId, setSelectedId] = useState(() => groups.some((group) => group.id === requestedGroup) ? requestedGroup! : groups[0].id);
  const filteredGroups = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return groups;
    return groups.filter((group) => [group.id, group.summary, group.holland, ...group.traits, ...group.learning, ...group.majors, ...group.careers].some((text) => text.toLowerCase().includes(keyword)));
  }, [searchTerm]);
  const resolvedGroup = groups.find((group) => group.id === selectedId) || filteredGroups[0] || groups[0];
  const selectedGroup = resolvedGroup;
  const selectedGroupMyths = getFiveGroupMyths(selectedGroup);
  const selectedTheme = groupThemes[selectedGroup.id] || groupThemes['機械群'];
  const chooseGroup = (id: string) => { setSelectedId(id); window.setTimeout(() => document.getElementById('group-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0); };

  return <main className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900">
    <section className="border-b-4 border-slate-900 bg-emerald-50"><div className="mx-auto max-w-[110rem] px-4 py-5 sm:px-6 lg:px-10">
      <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"><ArrowLeft className="h-4 w-4" />回首頁</a>
      <div className="py-8 sm:py-10"><div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-3 py-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"><div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-emerald-100"><BookOpen className="h-5 w-5 text-emerald-700" /></div><div><p className="text-xs font-black uppercase text-slate-500">Vocational Encyclopedia</p><p className="text-sm font-black text-slate-700">技術型高中 15 群完整導覽</p></div></div>
        <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl">職群科系百科</h1><p className="mt-4 max-w-4xl text-[15px] font-bold leading-8 text-slate-700 sm:text-lg">認識技術型高中 15 群的學習內容、常見科別與職涯方向。群別是專業領域的分類，不等於每所學校都設有該群全部科別；選填前請務必再查閱各校當年度招生簡章。</p>
      </div></div></section>
    <section className="mx-auto max-w-[110rem] px-4 pt-6 sm:px-6 lg:px-10"><div className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="text-sm font-black text-emerald-700">從興趣開始探索</p><h2 className="text-2xl font-black">先選一個想了解的職群</h2></div><p className="text-sm font-bold text-slate-600">可從左側搜尋或點選群別，查看完整學習與選科資訊。</p></div></div></section>
    <section className="mx-auto grid max-w-[110rem] gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[340px_1fr] lg:px-10">
      <aside className={pageNavigationAsideClassName}><div className="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><label className="mb-3 flex items-center gap-2 text-sm font-black text-slate-500"><Search className="h-4 w-4" />搜尋群別、科別或興趣</label><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="例如：資訊、餐飲、設計、I" className="w-full rounded-xl border-2 border-slate-900 bg-slate-50 py-3 pl-10 pr-3 text-sm font-bold outline-none focus:bg-white" /></div>
        <div className="mt-4 grid max-h-[520px] gap-2 overflow-y-auto pr-1">{filteredGroups.length === 0 ? <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm font-bold text-slate-500">找不到符合的群別，試試其他關鍵字。</div> : filteredGroups.map((group) => { const active = group.id === selectedGroup.id; return <button key={group.id} onClick={() => chooseGroup(group.id)} className={`flex items-center justify-between gap-3 rounded-xl border-2 px-3 py-3 text-left transition-all ${active ? 'border-slate-900 bg-emerald-500 text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]' : 'border-slate-200 bg-white text-slate-800 hover:border-slate-900 hover:bg-emerald-50'}`}><span className="flex items-center gap-3"><span className="text-2xl">{group.icon}</span><span><span className="block text-sm font-black">{group.id}</span><span className={`block text-xs font-bold ${active ? 'text-emerald-50' : 'text-slate-500'}`}>Holland {group.holland}</span></span></span><Tags className="h-4 w-4 shrink-0" /></button>; })}</div></div></aside>
      <div className="min-w-0 space-y-6"><section className="overflow-hidden rounded-2xl border-4 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-emerald-100 text-lg font-black text-emerald-800">15</div><div><p className="text-sm font-black text-slate-900">技術型高中 15 群</p><p className="mt-1 text-sm font-bold text-slate-500">從興趣、學習內容與科別開始探索。</p></div></div><a href={withBasePath('/holland')} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-purple-600 px-4 py-3 font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5"><Sparkles className="h-5 w-5" />還不確定方向？做荷倫碼測驗</a></div></section>
        <section id="group-detail" className="scroll-mt-6 overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-white shadow-[3px_3px_0_#0f172a]"><div className={`relative overflow-hidden bg-gradient-to-br ${selectedTheme.hero} px-5 py-6 text-white sm:px-7 sm:py-8`}><div className="pointer-events-none absolute -right-14 -top-16 h-52 w-52 rounded-full border-8 border-white/20" /><div className="pointer-events-none absolute bottom-0 right-28 h-24 w-24 rotate-12 rounded-3xl bg-white/10" /><div className="relative flex flex-col gap-5 sm:flex-row sm:items-center"><div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.4rem] border-4 border-slate-900 ${selectedTheme.icon} text-5xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]`}>{selectedGroup.icon}</div><div className="min-w-0"><div className="flex flex-wrap gap-2"><span className="rounded-full border-2 border-white/80 bg-white/15 px-3 py-1 text-xs font-black">技術型高中 15 群</span><span className="rounded-full border-2 border-white/80 bg-white/15 px-3 py-1 text-xs font-black">Holland {selectedGroup.holland}</span></div><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{selectedGroup.id}</h2><p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-white/90 sm:text-base">{selectedGroup.summary}</p></div></div></div>
          <div className="space-y-6 bg-slate-50/70 p-4 sm:p-7">
            <a href={withBasePath(`/vocational-compare?${new URLSearchParams({ group: selectedGroup.id })}`)} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-slate-900 bg-amber-100 p-4 shadow-[2px_2px_0_#0f172a] transition hover:bg-amber-200">
              <span><span className="block font-black">職群比較</span><span className="mt-1 block text-sm text-slate-700">還在猶豫？帶著{selectedGroup.id}，比較其他職群的課程與未來方向。</span></span><span className="flex items-center gap-2 text-sm font-bold">開始比較<ArrowUpRight className="h-4 w-4" /></span>
            </a>
            <InfoBlock icon={<BookOpen className="h-5 w-5" />} title="主要學習內容" description="從課程出發，看看你會接觸哪些專業。" tone="emerald" items={selectedGroup.learning} />
            <InfoBlock icon={<GraduationCap className="h-5 w-5" />} title="常見相關科別" description="點選科別查看開設學校；實際開設與招生情況請以各校當年度簡章為準。" tone="emerald" items={selectedGroup.majors} variant="tags" schoolGroup={selectedGroup.id} />
            <a href={withBasePath(`/search?${new URLSearchParams({ group: selectedGroup.id })}`)} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-slate-900 bg-sky-100 px-5 py-4 text-sm font-bold shadow-[2px_2px_0_#0f172a] transition hover:bg-sky-200 focus-visible:ring-2 focus-visible:ring-sky-600">
              <span className="flex items-center gap-2"><Building2 className="h-5 w-5" />查看開設學校 · {selectedGroup.id}</span><span className="flex items-center gap-2 text-sky-800">可依縣市篩選<ArrowUpRight className="h-4 w-4" /></span>
            </a>
            <div className="grid gap-5 xl:grid-cols-2">
              <InfoBlock icon={<GraduationCap className="h-5 w-5" />} title="升學延伸方向" tone="sky" items={selectedGroup.furtherStudy} variant="list" />
              <InfoBlock icon={<Briefcase className="h-5 w-5" />} title="可能職涯方向" tone="amber" items={selectedGroup.careers} variant="list" />
            </div>
            <InfoBlock icon={<Tags className="h-5 w-5" />} title="適合培養的特質" tone="amber" items={selectedGroup.traits} variant="tags" />
            <section className="rounded-2xl border-2 border-slate-900 bg-amber-50/70 p-5 shadow-[2px_2px_0_#0f172a] sm:p-6">
              <div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800"><Search className="h-5 w-5" /></span><h3 className="text-lg font-black text-slate-900">選擇前，先問自己</h3></div>
              <p className="mt-4 text-sm leading-7 text-slate-700">{resolvedGroup.selectionTip}</p>
              <ol className="mt-5 grid gap-4 2xl:grid-cols-3">
                {[
                  ['願意投入這些課程嗎？', `先回頭看課程：如果「${selectedGroup.learning.slice(0, 2).join('、')}」這些內容是你願意花時間練習的，而不只是覺得名稱好聽，才值得優先考慮。`],
                  ['學校與生活安排適合嗎？', `再比較目標學校是否實際設有${selectedGroup.majors.slice(0, 3).join('、')}等科別，以及實習設備、特色課程、通勤與生活安排是否可行。`],
                  ['確認過最新資訊了嗎？', '最後請以當年度招生簡章為準，必要時可參加校園參訪或向在校師生詢問真實的學習情況。'],
                ].map(([title, description], index) => <li key={title} className="flex gap-3 rounded-xl bg-white/80 p-4"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900">{index + 1}</span><div className="min-w-0"><h4 className="text-sm font-bold text-slate-900">{title}</h4><p className="mt-2 text-sm leading-7 text-slate-600">{description}</p></div></li>)}
              </ol>
            </section>
            <section className="rounded-2xl border-2 border-slate-900 bg-violet-50/70 p-5 shadow-[2px_2px_0_#0f172a] sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="flex items-center gap-2 text-lg font-black text-violet-900"><Sparkles className="h-5 w-5" />Holland 興趣提醒</h3><span className="rounded-full bg-white px-3 py-1 text-xs font-bold tracking-wider text-violet-800">{selectedGroup.holland}</span></div>
              <p className="mt-4 text-sm leading-7 text-slate-700">{selectedGroup.hollandDesc}</p>
              <p className="mt-4 border-t border-violet-200/70 pt-4 text-xs leading-6 text-slate-600">Holland 代碼只適合作為探索興趣的線索，不應作為選科的唯一依據。</p>
            </section>
          </div>
        </section>
        <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><div className="rounded-2xl border-4 border-slate-900 bg-amber-50 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><p className="text-sm font-black text-amber-800">{selectedGroup.id}專屬提醒</p><h2 className="text-2xl font-black">選 {selectedGroup.id} 前，先破解 5 個迷思</h2><div className="mt-4 grid gap-3">{selectedGroupMyths.map((item, index) => <details key={item.myth} className="group rounded-xl border-2 border-amber-200 bg-white p-4"><summary className="cursor-pointer list-none font-black text-amber-900 marker:hidden"><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-xs text-amber-950">{index + 1}</span>{item.myth}<span className="float-right text-lg transition-transform group-open:rotate-45">＋</span></summary><p className="mt-3 border-t border-amber-100 pt-3 text-sm font-bold leading-7 text-slate-700">{item.fact}</p></details>)}</div></div><div className="rounded-2xl border-4 border-slate-900 bg-sky-50 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><h2 className="text-2xl font-black">選科 4 步走</h2><ol className="mt-4 grid gap-3">{selectionSteps.map(([title, description], index) => <li key={title} className="flex gap-3 rounded-xl border-2 border-sky-200 bg-white p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">{index + 1}</span><div><h3 className="font-black text-sky-900">{title}</h3><p className="mt-1 text-sm font-bold leading-6 text-slate-700">{description}</p></div></li>)}</ol></div></section>
      </div></section></main>;
}

function InfoBlock({ icon, title, description, tone, items, variant = 'cards', schoolGroup }: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  tone: 'emerald' | 'amber' | 'sky';
  items: string[];
  variant?: 'cards' | 'tags' | 'list';
  schoolGroup?: string;
}) {
  const tones = {
    emerald: { icon: 'bg-emerald-50 text-emerald-700', item: 'bg-emerald-50/70 text-emerald-950', dot: 'bg-emerald-500' },
    amber: { icon: 'bg-amber-50 text-amber-800', item: 'bg-amber-50/70 text-amber-950', dot: 'bg-amber-500' },
    sky: { icon: 'bg-sky-50 text-sky-700', item: 'bg-sky-50/70 text-sky-950', dot: 'bg-sky-500' },
  }[tone];
  return (
    <section className="min-w-0 rounded-2xl border-2 border-slate-900 bg-white p-5 shadow-[2px_2px_0_#0f172a] sm:p-6">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones.icon}`}>{icon}</span>
        <h3 className="text-lg font-black text-slate-900">{title}</h3>
      </div>
      {description && <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>}
      <ul className={variant === 'tags' ? 'mt-5 flex flex-wrap gap-2' : variant === 'list' ? 'mt-4 divide-y divide-slate-100' : 'mt-5 grid gap-3 xl:grid-cols-3'}>
        {items.map((item) => (
          <li key={item} className={variant === 'tags'
            ? `max-w-full rounded-lg px-3 py-2 text-sm font-medium leading-6 ${tones.item}`
            : variant === 'list'
              ? 'flex items-start gap-3 py-3 text-sm font-medium leading-6 text-slate-700'
              : `flex items-start gap-3 rounded-xl p-4 text-sm font-bold leading-7 ${tones.item}`}>
            {variant !== 'tags' && <span aria-hidden="true" className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${tones.dot}`} />}
            {schoolGroup ? <a href={withBasePath(`/search?${new URLSearchParams({ group: schoolGroup, q: item })}`)} aria-label={`查看開設${item}的學校`} className="inline-flex items-center gap-2 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-700"><span>{item}</span><ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" /></a> : <span className="min-w-0">{item}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
