import { useEffect, useState, type ReactNode } from 'react';
import { AlertCircle, ArrowLeft, CalendarDays, ClipboardList, Loader2, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { callBackend } from '../lib/api';
import { withBasePath } from '../lib/routes';
import RelatedReading from './RelatedReading';

type SharedReport = { kind: 'analysis' | 'volunteer'; payload: any; expiresAt: string };
const text = {
  unavailable: '\u6b64\u5206\u4eab\u9023\u7d50\u7121\u6cd5\u4f7f\u7528',
  loadError: '\u7121\u6cd5\u8b80\u53d6\u5206\u4eab\u5167\u5bb9\u3002',
  loading: '\u6b63\u5728\u8f09\u5165\u5206\u4eab\u5831\u544a',
  waiting: '\u8acb\u7a0d\u5019\u2026',
  volunteer: '\u6a21\u64ec\u5fd7\u9858\u5e8f',
  noChoices: '\u6b64\u5831\u544a\u5c1a\u672a\u52a0\u5165\u5fd7\u9858\u3002',
  analysis: '\u843d\u9ede\u5206\u6790\u7d50\u679c',
  summary: '\u5206\u6790\u6458\u8981',
  noSummary: '\u6b64\u5831\u544a\u6c92\u6709\u53ef\u986f\u793a\u7684\u6458\u8981\u3002',
  total: '\u7e3d\u7a4d\u5206\uff1a',
  matches: '\u7b26\u5408\u689d\u4ef6\u6821\u79d1\uff1a',
  threshold: '\u53c3\u8003\u9580\u6abb\uff1a',
  recommended: '\u63a8\u85a6',
  preference: '\u5fd7\u9858\u5206\u6578',
  points: '\u5206',
  home: '\u56de\u5230\u9996\u9801',
  readonly: '\u552f\u8b80\u5206\u4eab',
  created: '\u5efa\u7acb\u65bc ',
  until: '\u6709\u6548\u81f3 ',
  note: '\u672c\u9801\u50c5\u4f9b\u6aa2\u8996\uff1b\u5be6\u969b\u9078\u586b\u8acb\u4ee5\u5b98\u65b9\u7cfb\u7d71\u8207\u7c21\u7ae0\u70ba\u6e96\u3002',
  region: '\u5c31\u5b78\u5340',
  choices: '\u5fd7\u9858\u6578',
  order: '\u5fd7\u9858\u9806\u5e8f',
  overview: '\u5b78\u751f\u5fd7\u9858\u898f\u5283',
  details: '\u4ee5\u4e0b\u4f9d\u5fd7\u9858\u9806\u5e8f\u6392\u5217\uff0c\u53ef\u4f9c\u70ba\u5bb6\u5ead\u8a0e\u8ad6\u8207\u898f\u5283\u53c3\u8003\u3002',
  valid: '\u9023\u7d50\u6709\u6548\u81f3',
};

export default function SharedReportPage({ token }: { token: string }) {
  const [report, setReport] = useState<SharedReport | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { callBackend<SharedReport>({ action: 'getSharedReport', token }).then(setReport).catch((err) => setError(err instanceof Error ? err.message : text.loadError)); }, [token]);
  if (error) return <PageState icon={<AlertCircle />} title={text.unavailable} message={error} />;
  if (!report) return <PageState icon={<Loader2 className="animate-spin" />} title={text.loading} message={text.waiting} />;
  const createdAt = report.payload?.createdAt ? new Date(report.payload.createdAt).toLocaleString('zh-TW') : '';
  if (report.kind === 'volunteer') {
    const choices = Array.isArray(report.payload?.choices) ? report.payload.choices : [];
    return <VolunteerReport choices={choices} regionName={String(report.payload?.regionName || report.payload?.region || '--')} createdAt={createdAt} expiresAt={report.expiresAt} />;
  }
  const payload = report.payload || {};
  const schools = payload.results?.eligibleSchools || [];
  return <Layout title={text.analysis} createdAt={createdAt} expiresAt={report.expiresAt}><section className="rounded-2xl border-2 border-slate-900 bg-slate-900 p-5 text-white"><p className="text-sm font-black text-amber-300">{text.summary}</p><p className="mt-2 font-bold leading-7">{payload.results?.analysisReport?.analysisSummary || text.noSummary}</p><p className="mt-3 text-sm font-bold text-slate-300">{text.total}{payload.results?.totalPoints ?? '--'}　{text.matches}{schools.length}</p></section><div className="mt-5 space-y-3">{schools.map((school: any, index: number) => <article key={String(school.name || '') + '-' + String(index)} className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"><h2 className="font-black text-slate-950">{school.name}</h2><p className="mt-1 text-sm font-bold text-slate-600">{[school.type, school.group, school.ownership].filter(Boolean).join(' / ')}</p><p className="mt-2 text-sm font-black text-indigo-700">{text.threshold}{school.points ?? '--'}　/　{school.zone || text.recommended}</p></article>)}</div></Layout>;
}

function VolunteerReport({ choices, regionName, createdAt, expiresAt }: { choices: any[]; regionName: string; createdAt: string; expiresAt: string }) {
  const expiresOn = new Date(expiresAt).toLocaleDateString('zh-TW');
  return <main className="relative min-h-screen overflow-hidden bg-[#f5f7ff] px-4 py-5 text-slate-900 sm:px-6 sm:py-8"><div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl" /><div className="pointer-events-none absolute -right-24 top-72 h-80 w-80 rounded-full bg-amber-200/60 blur-3xl" /><div className="relative mx-auto max-w-4xl"><a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-[3px] border-slate-900 bg-white px-5 py-3 text-lg font-black text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 hover:bg-slate-50 active:translate-y-0 active:shadow-none"><ArrowLeft className="h-5 w-5 stroke-[3]" />{text.home}</a><header className="relative mt-6 overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-slate-900 px-6 py-7 text-white shadow-[9px_9px_0px_0px_rgba(15,23,42,1)] sm:px-9 sm:py-9"><div className="absolute -right-12 -top-14 h-44 w-44 rounded-full border-4 border-slate-900 bg-amber-300" /><div className="absolute right-20 top-12 h-14 w-14 rounded-2xl border-4 border-slate-900 bg-sky-300 rotate-12" /><div className="relative max-w-2xl"><div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-indigo-100"><ShieldCheck className="h-4 w-4 text-emerald-300" />{text.readonly}</div><div className="mt-5 flex items-start gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-amber-300 text-slate-900 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]"><ClipboardList className="h-6 w-6" /></div><div><p className="text-sm font-black text-sky-200">{text.overview}</p><h1 className="mt-1 text-3xl font-black tracking-tight sm:text-5xl">{text.volunteer}</h1></div></div><p className="mt-5 max-w-xl text-sm font-bold leading-7 text-slate-200">{text.details}</p></div></header><section className="relative z-10 -mt-4 mx-2 grid gap-3 sm:grid-cols-3"><StatCard icon={<MapPin className="h-5 w-5" />} label={text.region} value={regionName} tone="bg-sky-100 text-sky-800" /><StatCard icon={<Sparkles className="h-5 w-5" />} label={text.choices} value={String(choices.length)} tone="bg-amber-100 text-amber-800" /><StatCard icon={<CalendarDays className="h-5 w-5" />} label={text.valid} value={expiresOn} tone="bg-violet-100 text-violet-800" /></section><section className="mt-9"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-black tracking-[0.16em] text-indigo-600">PREFERENCE LIST</p><h2 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">{text.order}</h2></div><div className="rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">{choices.length} / 30</div></div>{choices.length === 0 ? <p className="mt-5 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center font-bold text-slate-500">{text.noChoices}</p> : <ol className="relative mt-5 space-y-4 before:absolute before:bottom-6 before:left-[25px] before:top-6 before:w-1 before:rounded-full before:bg-indigo-200">{choices.map((choice: any, index: number) => <li key={String(choice.code || '') + '-' + String(choice.deptCode || '') + '-' + String(index)} className="relative"><article className="relative overflow-hidden rounded-2xl border-3 border-slate-900 bg-white p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] transition sm:p-5"><div className="absolute right-0 top-0 h-16 w-16 rounded-bl-[2rem] bg-amber-100" /><div className="relative flex gap-4"><div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-3 border-slate-900 bg-amber-300 text-lg font-black text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">{index + 1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><div className="min-w-0"><h3 className="text-lg font-black leading-tight text-slate-950 sm:text-xl">{choice.name}</h3><p className="mt-1 font-black text-sky-700">{choice.deptName}{choice.shift ? ' (' + choice.shift + ')' : ''}</p></div><div className="shrink-0 rounded-xl border-2 border-indigo-700 bg-indigo-600 px-3 py-2 text-center text-white shadow-[2px_2px_0px_0px_rgba(49,46,129,1)]"><div className="text-[10px] font-black text-indigo-100">{text.preference}</div><div className="text-lg font-black leading-none">{choice.preferenceScore ?? '--'}<span className="ml-0.5 text-xs">{choice.preferenceScore !== null && choice.preferenceScore !== undefined ? text.points : ''}</span>{choice.sharesPreferenceRank ? '*' : ''}</div></div></div><div className="mt-4 flex flex-wrap gap-2 border-t-2 border-dashed border-slate-200 pt-3"><span className="rounded-lg border border-amber-300 bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-900">{choice.levelInfo || '--'}</span><span className="rounded-lg border border-sky-300 bg-sky-100 px-2.5 py-1 text-xs font-black text-sky-800">{choice.groupName || '--'}</span>{choice.county && <span className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-600">{choice.county}</span>}</div></div></div></article></li>)}</ol>}</section><p className="mt-8 text-center text-xs font-bold leading-6 text-slate-500">{createdAt && text.created + createdAt + '　'}{text.note}</p><div className="mt-8"><RelatedReading path="/strategy" /></div></div></main>;
}

function StatCard({ icon, label, value, tone }: { icon: ReactNode; label: string; value: string; tone: string }) {
  return <article className="rounded-2xl border-3 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><div className={'inline-flex rounded-xl border-2 border-slate-900 p-2 ' + tone}>{icon}</div><p className="mt-2 text-xs font-black text-slate-500">{label}</p><p className="mt-1 truncate text-lg font-black text-slate-950">{value}</p></article>;
}

function Layout({ title, createdAt, expiresAt, children }: { title: string; createdAt: string; expiresAt: string; children: ReactNode }) {
  return <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900"><div className="mx-auto max-w-3xl"><a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-[3px] border-slate-900 bg-white px-5 py-3 text-lg font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 hover:bg-slate-50 active:translate-y-0 active:shadow-none"><ArrowLeft className="h-5 w-5 stroke-[3]" />{text.home}</a><header className="mt-5 rounded-[2rem] border-4 border-slate-900 bg-indigo-600 p-6 text-white shadow-[7px_7px_0px_0px_rgba(15,23,42,1)]"><div className="flex items-center gap-2 text-indigo-100"><ShieldCheck className="h-5 w-5" />{text.readonly}</div><h1 className="mt-2 text-3xl font-black">{title}</h1><p className="mt-3 text-sm font-bold text-indigo-100">{createdAt && text.created + createdAt + '　'}{text.until}{new Date(expiresAt).toLocaleDateString('zh-TW')}</p></header><div className="mt-6">{children}</div><p className="mt-6 text-center text-xs font-bold text-slate-500">{text.note}</p><div className="mt-8"><RelatedReading path="/strategy" /></div></div></main>;
}
function PageState({ icon, title, message }: { icon: ReactNode; title: string; message: string }) { return <main className="grid min-h-screen place-items-center bg-slate-50 p-5 text-center text-slate-900"><div><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-slate-900 bg-amber-300">{icon}</div><h1 className="text-2xl font-black">{title}</h1><p className="mt-2 font-bold text-slate-500">{message}</p></div></main>; }
