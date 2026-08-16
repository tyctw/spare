import React, { useState } from 'react';
import { AlertCircle, ArrowLeft, Check, CheckCircle2, FileSearch, Globe2, Loader2, Mail, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { callBackend } from '../lib/api';
import { withBasePath } from '../lib/routes';

const reportTypes = [
  { value: 'school_data', label: '學校／科系資料', description: '校名、科別、招生資訊或資料內容有誤' },
  { value: 'missing_school', label: '學校／科系遺漏', description: '找不到應有的學校、科別或招生資料' },
  { value: 'score_calc', label: '計分與規則', description: '積分、比序或規則說明和官方資料不符' },
  { value: 'system_bug', label: '功能使用異常', description: '按鈕、頁面或操作流程無法正常使用' },
  { value: 'other', label: '其他建議', description: '不屬於上述類型的資料或使用問題' },
];

const inappropriateContentPatterns = [/幹/, /靠北/, /靠腰/, /三小/, /白癡/, /智障/, /低能/, /去死/, /王八/, /垃圾/, /賤/, /婊/, /操/, /肏/, /屌/, /雞巴/, /機掰/, /懶叫/, /洨/, /精液/, /陰莖/, /陰道/, /fuck/, /shit/, /bitch/, /asshole/];
const hasInappropriateContent = (value: string) => inappropriateContentPatterns.some((pattern) => pattern.test(value.toLowerCase().replace(/[\s\u200b\u200c\u200d\p{P}\p{S}_]+/gu, '')));

function Step({ number, label, complete }: { number: number; label: string; complete?: boolean }) {
  return <div className="flex items-center gap-2"><span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-black ${complete ? 'bg-emerald-400 text-emerald-950' : 'bg-slate-200 text-slate-500'}`}>{complete ? <Check className="h-4 w-4" /> : number}</span><span className={`text-xs font-black ${complete ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span></div>;
}

export default function ReportErrorPage() {
  const [type, setType] = useState('school_data');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const descriptionHasInappropriateContent = hasInappropriateContent(description);
  const descriptionReady = description.trim().length > 0 && !descriptionHasInappropriateContent;
  const selectedReportType = reportTypes.find((reportType) => reportType.value === type) ?? reportTypes[0];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!description.trim()) return setError('請先描述你發現的問題。');
    if (descriptionHasInappropriateContent) return setError('問題描述含有不適當字詞，請調整為具體、理性的回報內容。');
    setSubmitting(true);
    setError('');
    try {
      await callBackend({ action: 'reportError', payload: { type, description, email } });
      setSubmitted(true);
    } catch (submitError) {
      console.error('Report error failed:', submitError);
      setError('回報傳送失敗，請檢查網路連線或稍後再試。');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <section className="mx-auto flex min-h-[74vh] max-w-xl items-center"><div className="w-full overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[8px_8px_0_#0f172a]">
        <div className="relative overflow-hidden bg-emerald-400 px-7 py-9 sm:px-10 sm:py-11"><div className="absolute -right-8 -top-10 h-40 w-40 rounded-full border-[18px] border-white/45" /><div className="relative grid h-16 w-16 place-items-center rounded-2xl border-3 border-slate-900 bg-white shadow-[3px_3px_0_#0f172a]"><CheckCircle2 className="h-9 w-9 text-emerald-600" /></div><p className="relative mt-7 text-xs font-black tracking-[0.18em] text-emerald-950">REPORT RECEIVED</p><h1 className="relative mt-2 text-3xl font-black tracking-tight sm:text-4xl">已收到你的回報</h1></div>
        <div className="p-7 sm:p-10"><p className="font-bold leading-8 text-slate-600">謝謝你幫忙守護資料品質。我們會查證內容；若需要補充資訊，才會透過你提供的 Email 聯繫。</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><a href={withBasePath('/')} className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-black text-white shadow-[3px_3px_0_#fbbf24] transition hover:-translate-y-0.5"><ArrowLeft className="h-4 w-4" />回首頁</a><button type="button" onClick={() => { setSubmitted(false); setDescription(''); setEmail(''); setType('school_data'); }} className="rounded-2xl border-2 border-slate-900 bg-white px-5 py-3.5 text-sm font-black transition hover:bg-slate-100">再回報一項</button></div></div>
      </div></section>
    </main>
  );

  return <main className="min-h-screen overflow-x-hidden bg-[#f8fafc] text-slate-900">
    <section className="relative overflow-hidden border-b-4 border-slate-900 bg-[#fff1f2]"><div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[38px] border-rose-200/70" /><div aria-hidden="true" className="absolute right-[18%] top-12 h-5 w-5 rounded-full bg-amber-300" />
      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-5 sm:px-6 sm:pb-16 lg:px-8"><a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0_#0f172a] transition hover:-translate-y-0.5"><ArrowLeft className="h-4 w-4" />返回首頁</a>
        <div className="mt-10 max-w-3xl"><div className="flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-slate-900 bg-rose-500 text-white shadow-[4px_4px_0_#0f172a]"><AlertCircle className="h-7 w-7" /></div><p className="mt-7 text-xs font-black tracking-[0.2em] text-rose-700">DATA QUALITY CENTER</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">一起把資料做得更準</h1><p className="mt-5 max-w-2xl text-base font-bold leading-8 text-slate-700 sm:text-lg">發現資料或功能問題時，留下可核對的線索。我們會依官方資訊查證、更新，讓後來的使用者少走一點彎路。</p></div>
      </div>
    </section>

    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12"><div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      <section className="order-2 overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[7px_7px_0_#0f172a] lg:order-1"><div className="border-b-2 border-slate-200 bg-slate-50 px-5 py-5 sm:px-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black tracking-[0.16em] text-rose-600">REPORT A PROBLEM</p><h2 className="mt-1 text-2xl font-black">告訴我們問題在哪裡</h2></div><div className="flex items-center gap-3" aria-label="回報步驟"><Step number={1} label="選類型" complete /><span className="h-px w-5 bg-slate-300" /><Step number={2} label="寫內容" complete={descriptionReady} /><span className="h-px w-5 bg-slate-300" /><Step number={3} label="送出" complete={Boolean(email)} /></div></div></div>
        <form onSubmit={handleSubmit} className="space-y-8 p-5 sm:p-8">
          <div><label htmlFor="report-type" className="flex items-center gap-2 text-sm font-black"><span className="grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-xs text-white">1</span>選擇問題類型</label><select id="report-type" value={type} onChange={(event) => setType(event.target.value)} className="mt-4 w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-black text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-100">{reportTypes.map((reportType) => <option key={reportType.value} value={reportType.value}>{reportType.label}</option>)}</select><p className="mt-2 flex items-start gap-2 text-xs font-bold leading-5 text-slate-500"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />{selectedReportType.description}</p></div>
          <div><label htmlFor="report-description" className="flex items-center gap-2 text-sm font-black"><span className="grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-xs text-white">2</span>描述你發現的問題 <span className="text-rose-600">*</span></label><div className="mt-3 rounded-2xl border-2 border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-900"><Sparkles className="mr-1.5 inline h-4 w-4 text-sky-600" />包含「問題頁面／項目」、「目前內容」與「建議或官方來源」，會更容易協助查證。</div><textarea id="report-description" value={description} onChange={(event) => { setDescription(event.target.value); if (error) setError(''); }} placeholder="例如：○○高中資訊科的招生資訊和 115 學年度簡章不同；官方簡章連結為……" aria-invalid={descriptionHasInappropriateContent} className={`mt-3 min-h-48 w-full resize-y rounded-2xl border-2 bg-slate-50 px-4 py-4 text-sm font-bold leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white ${descriptionHasInappropriateContent ? 'border-rose-500 focus:ring-4 focus:ring-rose-100' : 'border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-100'}`} />{descriptionHasInappropriateContent && <p className="mt-2 text-sm font-bold text-rose-600">請避免不雅、攻擊或色情字詞，改用具體資料與修正建議描述問題。</p>}</div>
          <div className="grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-[1fr_auto] sm:items-end"><div><label htmlFor="report-email" className="flex items-center gap-2 text-sm font-black"><span className="grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-xs text-white">3</span>聯絡 Email <span className="text-rose-600">*</span></label><p className="mt-1 text-xs font-bold text-slate-500">僅在需要補充資料時聯繫你。</p><input id="report-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" required className="mt-3 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100" /></div><div className="hidden rounded-xl bg-white p-3 text-slate-500 sm:block"><Mail className="h-6 w-6" /></div></div>
          {error && <div role="alert" className="rounded-2xl border-2 border-rose-300 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</div>}
          <button type="submit" disabled={submitting || descriptionHasInappropriateContent} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-900 bg-rose-500 px-5 py-4 text-base font-black text-white shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-0.5 hover:bg-rose-600 hover:shadow-[5px_5px_0_#0f172a] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">{submitting ? <><Loader2 className="h-5 w-5 animate-spin" />傳送中…</> : <><Send className="h-5 w-5" />送出資料回報</>}</button>
        </form>
      </section>
      <aside className="order-1 space-y-4 lg:order-2 lg:sticky lg:top-6"><section className="overflow-hidden rounded-[1.75rem] border-4 border-slate-900 bg-slate-900 p-6 text-white shadow-[5px_5px_0_#fb7185]"><FileSearch className="h-7 w-7 text-amber-300" /><p className="mt-5 text-xs font-black tracking-[0.16em] text-amber-300">QUICK CHECKLIST</p><h2 className="mt-2 text-2xl font-black">一份好回報，三個線索</h2><ol className="mt-6 space-y-5">{[['位置', '哪個學校、科別、頁面或功能？'], ['現況', '目前看到的內容是什麼？'], ['依據', '正確資訊或官方來源在哪裡？']].map(([title, detail], index) => <li key={title} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-amber-300 text-xs font-black text-slate-900">{index + 1}</span><span><strong className="block text-sm font-black">{title}</strong><span className="mt-0.5 block text-sm font-bold leading-5 text-slate-300">{detail}</span></span></li>)}</ol></section><section className="rounded-[1.5rem] border-2 border-emerald-300 bg-emerald-50 p-5"><div className="flex gap-3"><ShieldCheck className="h-6 w-6 shrink-0 text-emerald-700" /><div><h2 className="font-black text-emerald-950">保護你的個資</h2><p className="mt-2 text-sm font-bold leading-6 text-emerald-900/75">不用填寫身分證字號、住址或電話。Email 只會用於需要補件時聯繫。</p></div></div></section><section className="rounded-[1.5rem] border-2 border-slate-200 bg-white p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sky-700"><Globe2 className="h-5 w-5" /></span><div><h2 className="font-black">有官方連結嗎？</h2><p className="mt-1 text-sm font-bold leading-5 text-slate-500">直接貼在描述欄位即可。</p></div></div></section></aside>
    </div></section>
  </main>;
}
