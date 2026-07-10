import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  GraduationCap,
  Search,
  Sparkles,
  Tags,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';

type VocationalGroup = {
  id: string;
  icon: string;
  summary: string;
  holland: string;
  hollandDesc: string;
  traits: string[];
  majors: string[];
  careers: string[];
};

const groups: VocationalGroup[] = [
  {
    id: '機械群',
    icon: '⚙️',
    summary: '以機械設計、加工製造、精密量測與設備維護為核心，重視結構概念、圖面判讀、製程規劃與實作安全。',
    holland: 'R / I',
    hollandDesc: '適合喜歡動手操作、理解機械原理、分析問題並把設計轉成實體作品的學生。',
    traits: ['空間概念', '耐心精準', '喜歡實作'],
    majors: ['機械科', '模具科', '製圖科', '鑄造科', '板金科', '配管科', '機電科', '生物產業機電科'],
    careers: ['機械工程助理', 'CNC 技術員', '製圖設計人員', '設備維護人員', '品管檢測人員'],
  },
  {
    id: '動力機械群',
    icon: '🚗',
    summary: '聚焦汽機車、動力系統、引擎、電動車與相關檢修技術，課程常結合拆裝、檢測、保養與故障排除。',
    holland: 'R / I',
    hollandDesc: '適合對交通工具、引擎運作、機電整合與維修診斷有興趣，並能接受實作訓練的學生。',
    traits: ['機件理解', '故障判斷', '安全意識'],
    majors: ['汽車科', '重機科', '飛機修護科', '動力機械科', '農業機械科'],
    careers: ['汽車修護技術員', '機車維修技術員', '車輛檢測人員', '電動車維修助理', '航空修護助理'],
  },
  {
    id: '電機與電子群',
    icon: '⚡',
    summary: '涵蓋電路、控制、電子、資訊硬體、通訊與自動化，重視邏輯判斷、儀表量測與系統整合。',
    holland: 'R / I / C',
    hollandDesc: '適合喜歡研究電路、程式控制、精密量測，並能依步驟完成測試與除錯的學生。',
    traits: ['邏輯推理', '細心檢測', '系統思考'],
    majors: ['電機科', '電子科', '資訊科', '控制科', '冷凍空調科', '航空電子科'],
    careers: ['電機技術員', '電子工程助理', '自動控制助理', '網路設備技術員', '維修測試人員'],
  },
  {
    id: '化工群',
    icon: '🧪',
    summary: '學習化學原理、實驗操作、材料與製程控制，重視實驗安全、數據紀錄與品質管理。',
    holland: 'I / R',
    hollandDesc: '適合喜歡實驗、觀察變化、分析數據，並能遵守流程與安全規範的學生。',
    traits: ['實驗精神', '數據紀錄', '安全規範'],
    majors: ['化工科', '紡織科', '染整科'],
    careers: ['化工製程助理', '實驗室技術員', '品管檢驗員', '材料測試人員', '環境檢測助理'],
  },
  {
    id: '土木與建築群',
    icon: '🏗️',
    summary: '從建築製圖、營造施工、測量到室內空間，培養理解結構、材料、環境與工程流程的能力。',
    holland: 'R / I / A',
    hollandDesc: '適合對建築空間、工程現場、圖面繪製與環境規劃有興趣的學生。',
    traits: ['空間想像', '圖面判讀', '工程觀念'],
    majors: ['土木科', '建築科', '消防工程科', '空間測繪科'],
    careers: ['建築製圖助理', '營造工程助理', '測量助理', '室內設計助理', '工地品管人員'],
  },
  {
    id: '商業與管理群',
    icon: '💼',
    summary: '涵蓋會計、商業經營、資料處理、行銷與國際貿易，重視數字概念、文書能力與溝通協調。',
    holland: 'E / C',
    hollandDesc: '適合喜歡組織資料、處理帳務、規劃活動、溝通銷售或理解市場運作的學生。',
    traits: ['數字敏感', '資料整理', '溝通協調'],
    majors: ['商業經營科', '會計事務科', '資料處理科', '國際貿易科', '電子商務科', '流通管理科'],
    careers: ['行政助理', '會計助理', '門市管理人員', '行銷企劃助理', '電商營運助理'],
  },
  {
    id: '外語群',
    icon: '🌍',
    summary: '以英文、日文等語言能力為基礎，延伸到商務溝通、觀光服務、翻譯與跨文化理解。',
    holland: 'S / A / E',
    hollandDesc: '適合喜歡語言、表達、服務互動，並願意長期累積聽說讀寫能力的學生。',
    traits: ['語言表達', '跨文化理解', '服務互動'],
    majors: ['應用英語科', '應用日語科'],
    careers: ['外語行政助理', '接待服務人員', '翻譯助理', '國貿業務助理', '旅遊服務人員'],
  },
  {
    id: '設計群',
    icon: '🎨',
    summary: '學習視覺傳達、產品設計、室內設計、影音多媒體與創意表現，重視美感、作品集與設計思考。',
    holland: 'A / R',
    hollandDesc: '適合喜歡創作、觀察生活、使用設計工具，並願意透過作品反覆修正的學生。',
    traits: ['美感敏銳', '創意思考', '作品表達'],
    majors: ['廣告設計科', '多媒體設計科', '室內空間設計科', '圖文傳播科', '家具木工科', '金屬工藝科'],
    careers: ['平面設計助理', 'UI/UX 助理', '影音剪輯助理', '展場設計助理', '產品設計助理'],
  },
  {
    id: '農業群',
    icon: '🌱',
    summary: '結合作物、園藝、畜產、森林與農業科技，重視自然觀察、栽培管理與生產技術。',
    holland: 'R / I',
    hollandDesc: '適合喜歡自然、生物、戶外實作，並願意理解生命科學與農業管理的學生。',
    traits: ['自然觀察', '生命科學', '實地操作'],
    majors: ['農場經營科', '園藝科', '森林科', '畜產保健科', '造園科'],
    careers: ['農業技術員', '園藝栽培人員', '景觀施工助理', '畜牧管理助理', '農產行銷助理'],
  },
  {
    id: '食品群',
    icon: '🍔',
    summary: '聚焦食品加工、烘焙、檢驗、衛生安全與產品開發，課程常結合理論、實作與品質控管。',
    holland: 'R / I / A',
    hollandDesc: '適合喜歡食品製作、實驗分析、流程控管，也願意重視衛生與安全規範的學生。',
    traits: ['衛生觀念', '流程控管', '創意製作'],
    majors: ['食品加工科', '食品科', '烘焙科', '水產食品科'],
    careers: ['食品製造技術員', '烘焙助理', '食品檢驗助理', '品管人員', '產品開發助理'],
  },
  {
    id: '家政群',
    icon: '🏠',
    summary: '涵蓋服裝、幼保、美容、照護與生活應用，重視服務、設計、照顧能力與生活美學。',
    holland: 'S / A / R',
    hollandDesc: '適合喜歡照顧他人、手作設計、生活美學或與人互動服務的學生。',
    traits: ['服務關懷', '手作能力', '生活美感'],
    majors: ['家政科', '服裝科', '幼兒保育科', '美容科', '時尚造型科', '照顧服務科'],
    careers: ['幼保助理', '美容美髮助理', '服裝設計助理', '照顧服務員', '整體造型助理'],
  },
  {
    id: '餐旅群',
    icon: '🏨',
    summary: '培養餐飲製備、旅館服務、觀光導覽與接待管理能力，重視服務細節、團隊合作與現場應變。',
    holland: 'S / E',
    hollandDesc: '適合喜歡服務人群、餐飲製作、旅遊接待，並能在忙碌現場維持穩定表現的學生。',
    traits: ['服務熱忱', '現場應變', '團隊合作'],
    majors: ['餐飲管理科', '觀光事業科'],
    careers: ['餐飲服務人員', '廚務助理', '旅館接待人員', '旅遊服務人員', '活動接待助理'],
  },
  {
    id: '水產群',
    icon: '🐟',
    summary: '學習水產養殖、漁業生產、海洋資源與相關設備管理，兼具自然科學與實地操作。',
    holland: 'R / I',
    hollandDesc: '適合對海洋、水域生態、養殖技術與生物觀察有興趣的學生。',
    traits: ['生態觀察', '養殖管理', '實地操作'],
    majors: ['水產養殖科', '漁業科'],
    careers: ['水產養殖技術員', '漁業生產助理', '水質檢測助理', '海洋資源調查助理'],
  },
  {
    id: '海事群',
    icon: '🚢',
    summary: '以航海、輪機、船舶機電與海事安全為主，重視紀律、設備操作、海上作業與團隊協調。',
    holland: 'R / E / C',
    hollandDesc: '適合對船舶、海運、機械設備與規律作業有興趣，能接受紀律訓練的學生。',
    traits: ['紀律責任', '設備操作', '團隊協調'],
    majors: ['航海科', '輪機科'],
    careers: ['航運從業助理', '船舶機電助理', '港務作業人員', '海事安全助理'],
  },
  {
    id: '藝術群',
    icon: '🎭',
    summary: '培養音樂、舞蹈、美術、戲劇與表演等藝術專長，重視長期訓練、舞台經驗與作品呈現。',
    holland: 'A',
    hollandDesc: '適合已具備明確藝術興趣或基礎，願意投入練習、創作與公開展演的學生。',
    traits: ['藝術表現', '持續練習', '舞台呈現'],
    majors: ['音樂科', '舞蹈科', '美術科', '戲劇科', '表演藝術科', '影劇科'],
    careers: ['表演藝術工作者', '藝術行政助理', '展演活動助理', '美術設計助理', '音樂教學助理'],
  },
];

export default function VocationalEncyclopediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(groups[0].id);

  const filteredGroups = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return groups;
    return groups.filter((group) =>
      [
        group.id,
        group.summary,
        group.holland,
        ...group.traits,
        ...group.majors,
        ...group.careers,
      ].some((text) => text.toLowerCase().includes(keyword)),
    );
  }, [searchTerm]);

  const selectedGroup = groups.find((group) => group.id === selectedId) || filteredGroups[0] || groups[0];

  const chooseGroup = (id: string) => {
    setSelectedId(id);
    window.setTimeout(() => {
      document.getElementById('group-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-emerald-50">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <a
            href={withBasePath('/')}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首頁
          </a>

          <div className="py-8 sm:py-10">
            <div className="mb-5 inline-flex max-w-full items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-3 py-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:px-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-emerald-100 sm:h-11 sm:w-11">
                <BookOpen className="h-5 w-5 text-emerald-700 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase text-slate-500">Vocational Encyclopedia</p>
                <p className="text-sm font-black text-slate-700">15 大技職群別完整導覽</p>
              </div>
            </div>
            <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl">職群科系百科</h1>
            <p className="mt-4 max-w-4xl text-[15px] font-bold leading-8 text-slate-700 sm:text-lg">
              這裡把技術型高中常見的 15 大群別整理成獨立頁面。你可以用群別、科別、未來職涯或 Holland 類型快速搜尋，再看每個群別的學習重點、適合特質與可能進路。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[340px_1fr] lg:px-8">
        <aside className="min-w-0 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto">
          <div className="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <label className="mb-3 flex items-center gap-2 text-sm font-black text-slate-500">
              <Search className="h-4 w-4" />
              搜尋群別、科別或職涯
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="例如：設計、餐飲、電機、R / I"
                className="w-full rounded-xl border-2 border-slate-900 bg-slate-50 py-3 pl-10 pr-3 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-emerald-300/30"
              />
            </div>

            <div className="mt-4 grid max-h-[520px] gap-2 overflow-y-auto pr-1">
              {filteredGroups.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm font-bold text-slate-500">
                  找不到符合的群別，換個關鍵字試試。
                </div>
              ) : (
                filteredGroups.map((group) => {
                  const active = group.id === selectedGroup.id;
                  return (
                    <button
                      key={group.id}
                      onClick={() => chooseGroup(group.id)}
                      className={`flex items-center justify-between gap-3 rounded-xl border-2 px-3 py-3 text-left transition-all ${
                        active
                          ? 'border-slate-900 bg-emerald-500 text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-900 hover:bg-emerald-50'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="text-2xl">{group.icon}</span>
                        <span className="min-w-0">
                          <span className="block text-sm font-black">{group.id}</span>
                          <span className={`block text-xs font-bold ${active ? 'text-emerald-50' : 'text-slate-500'}`}>{group.holland}</span>
                        </span>
                      </span>
                      <Tags className="h-4 w-4 shrink-0" />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-6">
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <p className="text-sm font-black text-slate-500">群別數量</p>
              <p className="mt-2 text-3xl font-black text-emerald-700">15</p>
            </div>
            <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
              <p className="text-sm font-black text-slate-500">查詢方式</p>
              <p className="mt-2 text-xl font-black text-slate-900">群別 / 科別 / 職涯</p>
            </div>
            <a
              href={withBasePath('/holland')}
              className="rounded-2xl border-4 border-slate-900 bg-purple-600 p-5 text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="h-6 w-6" />
              <p className="mt-3 text-sm font-black text-purple-100">還不知道怎麼選？</p>
              <p className="mt-1 text-xl font-black">做荷倫碼測驗</p>
            </a>
          </section>

          <section id="group-detail" className="scroll-mt-6 rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-7">
            <div className="flex flex-col gap-5 border-b-2 border-dashed border-slate-200 pb-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-slate-900 bg-emerald-100 text-5xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                {selectedGroup.icon}
              </div>
              <div className="min-w-0">
                <div className="mb-2 inline-flex rounded-lg border-2 border-slate-900 bg-slate-900 px-3 py-1 text-xs font-black text-white">
                  Holland {selectedGroup.holland}
                </div>
                <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">{selectedGroup.id}</h2>
                <p className="mt-3 text-sm font-bold leading-7 text-slate-700 sm:text-base">{selectedGroup.summary}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
              <div className="space-y-5">
                <InfoBlock
                  icon={<GraduationCap className="h-5 w-5" />}
                  title="常見科別"
                  tone="emerald"
                  items={selectedGroup.majors}
                />
                <InfoBlock
                  icon={<Briefcase className="h-5 w-5" />}
                  title="未來進路"
                  tone="amber"
                  items={selectedGroup.careers}
                />
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border-2 border-slate-900 bg-slate-50 p-5">
                  <h3 className="text-lg font-black text-slate-900">適合特質</h3>
                  <div className="mt-4 grid gap-2">
                    {selectedGroup.traits.map((trait, index) => (
                      <div key={trait} className="flex items-center justify-between rounded-xl border-2 border-slate-200 bg-white px-3 py-3">
                        <span className="font-black text-slate-700">{trait}</span>
                        <span className="rounded-lg bg-slate-900 px-2 py-1 text-xs font-black text-white">#{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-slate-900 bg-purple-50 p-5">
                  <h3 className="text-lg font-black text-purple-800">Holland 類型提示</h3>
                  <p className="mt-3 text-sm font-bold leading-7 text-slate-700">{selectedGroup.hollandDesc}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function InfoBlock({
  icon,
  title,
  tone,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  tone: 'emerald' | 'amber';
  items: string[];
}) {
  const classes =
    tone === 'emerald'
      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
      : 'bg-amber-50 border-amber-200 text-amber-800';

  return (
    <div className="rounded-2xl border-2 border-slate-900 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className={`rounded-xl border-2 p-2 ${classes}`}>{icon}</div>
        <h3 className="text-lg font-black text-slate-900">{title}</h3>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className={`rounded-xl border px-3 py-2 text-sm font-black ${classes}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
