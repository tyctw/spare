import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  Check,
  ClipboardList,
  Copy,
  HeartHandshake,
  MapPin,
  MessageCircleHeart,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { ALL_REGIONS } from './RegionModal';
import { withBasePath } from '../lib/routes';

const RESULTS_STORAGE_KEY = 'tw-admission-analysis-results';

type Zone = 'reach' | 'target' | 'safe';

const zoneLabels: Record<Zone, string> = {
  reach: '夢幻',
  target: '落點',
  safe: '保守',
};

const zoneTones: Record<Zone, string> = {
  reach: 'bg-rose-100 text-rose-800',
  target: 'bg-indigo-100 text-indigo-800',
  safe: 'bg-emerald-100 text-emerald-800',
};

function readStoredReport() {
  try {
    const raw = sessionStorage.getItem(RESULTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function formatCreatedAt(value: unknown) {
  if (typeof value !== 'string') return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('zh-TW');
}

export default function FamilyReportPage() {
  const stored = useMemo(readStoredReport, []);
  const [copied, setCopied] = useState(false);

  if (!stored?.results) return <MissingFamilyReport />;

  const scores = stored.scores || {};
  const results = stored.results || {};
  const schools = Array.isArray(results.eligibleSchools) ? results.eligibleSchools : [];
  const zoneCounts = schools.reduce(
    (counts: Record<Zone, number>, school: any) => {
      if (school?.zone in counts) counts[school.zone as Zone] += 1;
      return counts;
    },
    { reach: 0, target: 0, safe: 0 },
  );
  const region = ALL_REGIONS.find((item) => item.id === scores.region)?.name || scores.region || '未選擇';
  const groups = Array.isArray(stored.vocationalGroups) && stored.vocationalGroups[0] !== 'all'
    ? stored.vocationalGroups.slice(0, 4)
    : [];
  const schoolType = scores.schoolType === '職業類科'
    ? '技術型高中／職業類科'
    : scores.schoolType === '普通科'
      ? '普通高中'
      : '普通高中與技術型高中皆納入';
  const createdAt = formatCreatedAt(stored.createdAt);
  const zoneSummary = (['reach', 'target', 'safe'] as Zone[])
    .map((zone) => `${zoneLabels[zone]} ${zoneCounts[zone]} 項`)
    .join('、');
  const familyMessage = `我們這次在 ${region} 進行落點分析，總積分為 ${results.totalPoints ?? '--'}，目前可比較的校科共有 ${schools.length} 項（${zoneSummary}）。想請你和我一起確認：我真正想讀的方向、通勤與生活安排，以及本年度官方招生資格與截止時間。`;

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(familyMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2_500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#fffaf0] px-4 py-5 text-slate-900 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-4xl">
        <a href={withBasePath('/results')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-black shadow-[3px_3px_0_#0f172a] transition hover:bg-amber-100"><ArrowLeft className="h-4 w-4" />回到分析結果</a>

        <section className="relative mt-6 overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-slate-900 px-6 py-8 text-white shadow-[9px_9px_0_#0f172a] sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-12 -top-14 h-52 w-52 rounded-full border-4 border-slate-900 bg-amber-300" />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black tracking-[0.14em] text-amber-100"><Users className="h-4 w-4" />FAMILY TALK · 3 MINUTES</div>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">三分鐘，和爸媽說明白</h1>
            <p className="mt-4 max-w-xl text-base font-bold leading-8 text-slate-200">不是要家人替你決定，而是用三張卡把目前狀況、探索方向和需要支持的事說清楚。</p>
          </div>
        </section>

        <section className="relative z-10 -mt-4 mx-2 grid gap-3 sm:grid-cols-3">
          <Metric icon={<Target className="h-5 w-5" />} label="本次總積分" value={String(results.totalPoints ?? '--')} tone="bg-indigo-100 text-indigo-800" />
          <Metric icon={<MapPin className="h-5 w-5" />} label="就學區" value={region} tone="bg-sky-100 text-sky-800" />
          <Metric icon={<ClipboardList className="h-5 w-5" />} label="可比較校科" value={`${schools.length} 項`} tone="bg-emerald-100 text-emerald-800" />
        </section>

        <section className="mt-9 grid gap-5 md:grid-cols-3">
          <TalkCard number="01" icon={<Target className="h-6 w-6" />} title="我現在在哪裡？" tone="bg-indigo-600 text-white">
            <p>這次是依 {region}、輸入成績與篩選條件整理的參考結果，不代表錄取保證。</p>
            <div className="mt-5 grid grid-cols-3 gap-2">{(['reach', 'target', 'safe'] as Zone[]).map((zone) => <div key={zone} className="rounded-xl border border-white/20 bg-white/10 p-2 text-center"><strong className="block text-xl">{zoneCounts[zone]}</strong><span className="text-[11px] font-black text-indigo-100">{zoneLabels[zone]}</span></div>)}</div>
            <p className="mt-4 text-xs font-bold leading-5 text-indigo-100">名額、序位區間、報名人數與資格規定，都可能讓當年度結果改變。</p>
          </TalkCard>

          <TalkCard number="02" icon={<Sparkles className="h-6 w-6" />} title="我正在探索什麼？" tone="bg-amber-300 text-slate-950">
            <p>本次把 <strong>{schoolType}</strong> 納入比較。</p>
            {groups.length > 0 ? <div className="mt-5 flex flex-wrap gap-2">{groups.map((group: string) => <span key={group} className="rounded-lg border-2 border-slate-900 bg-white px-2.5 py-1.5 text-xs font-black">{group}</span>)}</div> : <p className="mt-5 rounded-xl border-2 border-slate-900 bg-white/70 p-3 text-sm font-bold leading-6">目前沒有鎖定特定職群；可以先一起討論喜歡的課程、學習方式與未來方向。</p>}
            <p className="mt-4 text-xs font-bold leading-5 text-amber-950/80">這代表本次的比較範圍，不等於孩子已經做出最後選擇。</p>
          </TalkCard>

          <TalkCard number="03" icon={<HeartHandshake className="h-6 w-6" />} title="我希望你們幫什麼？" tone="bg-emerald-500 text-white">
            <ul className="space-y-3 text-sm font-bold leading-6"><li>1. 一起確認哪些校科是「真的願意讀」。</li><li>2. 一起評估通勤、費用、生活節奏與家庭安排。</li><li>3. 一起核對官方簡章、資格、名額與截止時間。</li></ul>
            <p className="mt-5 text-xs font-bold leading-5 text-emerald-50">討論的目標是找到可接受且適合的選擇，而不是只追求一個分數。</p>
          </TalkCard>
        </section>

        <section className="mt-6 rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0_#0f172a] sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2 text-rose-700"><MessageCircleHeart className="h-5 w-5" /><p className="text-xs font-black tracking-[0.16em]">START THE CONVERSATION</p></div><h2 className="mt-2 text-2xl font-black">可以直接傳給家人的一段話</h2><p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-slate-700">{familyMessage}</p></div><button type="button" onClick={copyMessage} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-rose-100 px-4 py-3 text-sm font-black text-rose-800 shadow-[3px_3px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-rose-200 active:translate-y-0 active:shadow-none">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? '已複製' : '複製這段話'}</button></div>
        </section>

        <section className="mt-6 rounded-[2rem] border-4 border-slate-900 bg-violet-50 p-5 shadow-[5px_5px_0_#0f172a] sm:p-6"><h2 className="text-xl font-black">討論前，先約定一件事</h2><p className="mt-2 text-sm font-bold leading-7 text-slate-700">這份頁面用於開始對話，不用來替代招生簡章或學校公告。志願送出前，請回到官方系統確認本年度各區的資格、名額、期限與作業方式。</p><div className="mt-4 flex flex-wrap gap-3"><a href={withBasePath('/important-dates')} className="rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-black shadow-[2px_2px_0_#0f172a]">查看重要日程</a><a href={withBasePath('/results')} className="rounded-xl border-2 border-slate-900 bg-indigo-600 px-4 py-2.5 text-sm font-black text-white shadow-[2px_2px_0_#0f172a]">回到完整分析</a></div></section>
        <p className="mt-7 text-center text-xs font-bold text-slate-500">{createdAt && `本次分析建立於 ${createdAt} · `}本頁資料僅保存在這台裝置的本次分析中。</p>
      </div>
    </main>
  );
}

function TalkCard({ number, icon, title, tone, children }: { number: string; icon: ReactNode; title: string; tone: string; children: ReactNode }) {
  return <article className={`min-h-[290px] rounded-[2rem] border-4 border-slate-900 p-5 shadow-[5px_5px_0_#0f172a] sm:p-6 ${tone}`}><div className="flex items-center justify-between"><span className="text-xs font-black tracking-[0.16em] opacity-75">{number}</span><span>{icon}</span></div><h2 className="mt-8 text-2xl font-black">{title}</h2><div className="mt-3 text-sm font-bold leading-7">{children}</div></article>;
}

function Metric({ icon, label, value, tone }: { icon: ReactNode; label: string; value: string; tone: string }) {
  return <article className="rounded-2xl border-3 border-slate-900 bg-white p-4 shadow-[4px_4px_0_#0f172a]"><div className={`inline-flex rounded-xl border-2 border-slate-900 p-2 ${tone}`}>{icon}</div><p className="mt-2 text-xs font-black text-slate-500">{label}</p><p className="mt-1 truncate text-lg font-black text-slate-950">{value}</p></article>;
}

function MissingFamilyReport() {
  return <main className="grid min-h-screen place-items-center bg-amber-50 px-5 text-center text-slate-900"><section className="max-w-lg rounded-[2rem] border-4 border-slate-900 bg-white p-7 shadow-[7px_7px_0_#0f172a]"><Users className="mx-auto h-12 w-12 text-indigo-700" /><h1 className="mt-5 text-3xl font-black">先完成一次落點分析</h1><p className="mt-3 text-sm font-bold leading-7 text-slate-600">這份三分鐘報告會依本機剛完成的分析結果整理。完成分析後，再從結果頁開啟即可。</p><a href={withBasePath('/')} className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-amber-300 px-5 py-3 font-black shadow-[3px_3px_0_#0f172a]"><ArrowLeft className="h-4 w-4" />開始落點分析</a></section></main>;
}
