import { useEffect, useState, type ReactNode } from 'react';
import { AlertCircle, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
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
    return <Layout title={text.volunteer} createdAt={createdAt} expiresAt={report.expiresAt}><div className="space-y-2">{choices.map((choice: any, index: number) => <article key={String(choice.code || '') + '-' + String(choice.deptCode || '') + '-' + String(index)} className="relative rounded-xl border-2 border-slate-900 bg-white p-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"><div className="flex items-start gap-2.5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-slate-900 bg-amber-300 text-base font-black">{index + 1}</div><div className="min-w-0 flex-1"><h2 className="truncate text-sm font-black leading-5 text-slate-950">{choice.name}</h2><p className="truncate text-sm font-bold text-sky-700">{choice.deptName}{choice.shift ? ' (' + choice.shift + ')' : ''}</p><div className="mt-1.5 space-y-0.5 border-t border-slate-100 pt-1.5 text-[11px] font-black leading-4 text-[#4f76a4]"><div><span className="inline-flex max-w-full rounded-md border border-amber-200 bg-amber-100 px-1.5 py-0.5 text-amber-900"><span className="truncate">{choice.levelInfo || '--'}</span></span></div><div className="flex min-w-0 items-center justify-between gap-2"><span className="inline-flex min-w-0 max-w-[58%] rounded-md border border-sky-200 bg-sky-100 px-1.5 py-0.5 text-sky-800"><span className="truncate">{choice.groupName || '--'}</span></span>{choice.preferenceScore !== null && choice.preferenceScore !== undefined && <span className="shrink-0 rounded-md border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-indigo-800">{text.preference} {choice.preferenceScore} {text.points}{choice.sharesPreferenceRank ? '*' : ''}</span>}{choice.county && <span className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-slate-600">{choice.county}</span>}</div></div></div></div></article>)}</div>{choices.length === 0 && <p className="text-center font-bold text-slate-500">{text.noChoices}</p>}</Layout>;
  }
  const payload = report.payload || {};
  const schools = payload.results?.eligibleSchools || [];
  return <Layout title={text.analysis} createdAt={createdAt} expiresAt={report.expiresAt}><section className="rounded-2xl border-2 border-slate-900 bg-slate-900 p-5 text-white"><p className="text-sm font-black text-amber-300">{text.summary}</p><p className="mt-2 font-bold leading-7">{payload.results?.analysisReport?.analysisSummary || text.noSummary}</p><p className="mt-3 text-sm font-bold text-slate-300">{text.total}{payload.results?.totalPoints ?? '--'}　{text.matches}{schools.length}</p></section><div className="mt-5 space-y-3">{schools.map((school: any, index: number) => <article key={String(school.name || '') + '-' + String(index)} className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"><h2 className="font-black text-slate-950">{school.name}</h2><p className="mt-1 text-sm font-bold text-slate-600">{[school.type, school.group, school.ownership].filter(Boolean).join(' / ')}</p><p className="mt-2 text-sm font-black text-indigo-700">{text.threshold}{school.points ?? '--'}　/　{school.zone || text.recommended}</p></article>)}</div></Layout>;
}

function Layout({ title, createdAt, expiresAt, children }: { title: string; createdAt: string; expiresAt: string; children: ReactNode }) {
  return <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900"><div className="mx-auto max-w-3xl"><a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-[3px] border-slate-900 bg-white px-5 py-3 text-lg font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 hover:bg-slate-50 active:translate-y-0 active:shadow-none"><ArrowLeft className="h-5 w-5 stroke-[3]" />{text.home}</a><header className="mt-5 rounded-[2rem] border-4 border-slate-900 bg-indigo-600 p-6 text-white shadow-[7px_7px_0px_0px_rgba(15,23,42,1)]"><div className="flex items-center gap-2 text-indigo-100"><ShieldCheck className="h-5 w-5" />{text.readonly}</div><h1 className="mt-2 text-3xl font-black">{title}</h1><p className="mt-3 text-sm font-bold text-indigo-100">{createdAt && text.created + createdAt + '　'}{text.until}{new Date(expiresAt).toLocaleDateString('zh-TW')}</p></header><div className="mt-6">{children}</div><p className="mt-6 text-center text-xs font-bold text-slate-500">{text.note}</p><div className="mt-8"><RelatedReading path="/strategy" /></div></div></main>;
}
function PageState({ icon, title, message }: { icon: ReactNode; title: string; message: string }) { return <main className="grid min-h-screen place-items-center bg-slate-50 p-5 text-center text-slate-900"><div><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-slate-900 bg-amber-300">{icon}</div><h1 className="text-2xl font-black">{title}</h1><p className="mt-2 font-bold text-slate-500">{message}</p></div></main>; }
