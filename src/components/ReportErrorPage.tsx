import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  FileWarning,
  Home,
  Lightbulb,
  Loader2,
  Mail,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { callBackend } from '../lib/api';
import { withBasePath } from '../lib/routes';

const reportTypes = [
  { value: 'school_data', label: '學校與科別資料', description: '校名、科別、招生資訊或內容有誤' },
  { value: 'missing_school', label: '學校或科別遺漏', description: '找不到應有的學校、科別或招生資料' },
  { value: 'score_calc', label: '計分與規則', description: '積分、比序或規則和官方資料不符' },
  { value: 'schedule_data', label: '重要日期與時程', description: '會考、報名、放榜或志願選填日期有誤' },
  { value: 'system_bug', label: '功能使用異常', description: '按鈕、頁面或操作流程無法正常使用' },
  { value: 'other', label: '其他問題或建議', description: '不屬於上述類型的回報內容' },
] as const;

const inappropriateContentPatterns = [/幹/, /靠北/, /靠腰/, /三小/, /白癡/, /智障/, /低能/, /去死/, /王八/, /垃圾/, /賤/, /婊/, /操/, /肏/, /屌/, /雞巴/, /機掰/, /懶叫/, /洨/, /精液/, /陰莖/, /陰道/, /fuck/, /shit/, /bitch/, /asshole/];
const hasInappropriateContent = (value: string) => inappropriateContentPatterns.some((pattern) => pattern.test(value.toLowerCase().replace(/[\s\u200b\u200c\u200d\p{P}\p{S}_]+/gu, '')));
const fieldClass = 'mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100';

export default function ReportErrorPage() {
  const [type, setType] = useState<string>('school_data');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const descriptionHasInappropriateContent = hasInappropriateContent(description);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!description.trim()) {
      setError('請先描述你發現的問題。');
      return;
    }
    if (descriptionHasInappropriateContent) {
      setError('請改用具體、理性的文字描述問題。');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await callBackend({ action: 'reportError', payload: { type, description: description.trim(), email: email.trim() } });
      setSubmitted(true);
    } catch (submitError) {
      console.error('Report error failed:', submitError);
      setError('回報傳送失敗，請檢查網路連線或稍後再試。');
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setType('school_data');
    setDescription('');
    setEmail('');
    setError('');
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#f5f7fc] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <a href={withBasePath('/')} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-600 underline-offset-4 hover:text-indigo-700 hover:underline">
            <ArrowLeft size={17} aria-hidden="true" />返回首頁
          </a>
          <section className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(41,53,92,0.08)]">
            <div className="border-b border-slate-100 bg-gradient-to-br from-emerald-50 via-white to-indigo-50 px-6 py-9 sm:px-10 sm:py-12">
              <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><CheckCircle2 size={30} aria-hidden="true" /></span>
              <p className="mt-6 text-sm font-extrabold tracking-wide text-emerald-700">回報已送出</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">謝謝你告訴我們</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">我們已收到你的回報，會依提供的內容查核。若需要補充細節，會透過你留下的 Email 聯繫。</p>
            </div>
            <div className="px-6 py-8 sm:px-10">
              <h2 className="text-lg font-black">接下來會怎麼處理？</h2>
              <ol className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ['01', '確認內容', '先查看問題位置與描述。'],
                  ['02', '查核來源', '需要時比對官方公告或簡章。'],
                  ['03', '必要時聯繫', '資訊不足時再請你補充。'],
                ].map(([number, title, detail]) => (
                  <li key={number} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <span className="text-xs font-black text-indigo-600">{number}</span>
                    <strong className="mt-2 block text-sm font-black text-slate-900">{title}</strong>
                    <span className="mt-1 block text-sm leading-6 text-slate-600">{detail}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={withBasePath('/')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-indigo-700"><Home size={17} aria-hidden="true" />回到首頁</a>
                <button type="button" onClick={reset} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-extrabold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700">再回報一項<ArrowRight size={17} aria-hidden="true" /></button>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fc] pb-16 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
        <a href={withBasePath('/')} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-600 underline-offset-4 hover:text-indigo-700 hover:underline">
          <ArrowLeft size={17} aria-hidden="true" />返回首頁
        </a>

        <header className="relative mt-5 overflow-hidden rounded-[28px] border border-indigo-100 bg-gradient-to-br from-[#eef1ff] via-white to-[#fff9eb] px-6 py-9 sm:px-10 sm:py-12">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3.5 py-1.5 text-xs font-extrabold text-indigo-700"><FileWarning size={15} aria-hidden="true" />協助改善網站</span>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">問題回報</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">發現資料有誤，或某個功能沒有照預期運作？告訴我們發生在哪裡、看到了什麼，我們會依線索查核。</p>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full border-[36px] border-indigo-100/60" />
        </header>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <section className="min-w-0 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(41,53,92,0.06)] sm:p-8" aria-labelledby="report-form-heading">
            <div className="border-b border-slate-100 pb-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700"><ClipboardList size={22} aria-hidden="true" /></span>
              <h2 id="report-form-heading" className="mt-4 text-2xl font-black tracking-tight sm:text-[28px]">告訴我們發生什麼事</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">依序選擇類型、描述問題並留下聯絡方式。標示「必填」的欄位需要完成。</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-8">
              <fieldset>
                <legend className="text-base font-black text-slate-900">問題類型 <span className="ml-1 text-sm font-bold text-indigo-600">必填</span></legend>
                <p className="mt-1 text-sm text-slate-500">選擇最接近的類型，方便我們整理與查核。</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {reportTypes.map((reportType) => (
                    <label key={reportType.value} className="relative cursor-pointer">
                      <input type="radio" name="report-type" value={reportType.value} checked={type === reportType.value} onChange={() => setType(reportType.value)} className="peer sr-only" />
                      <span className="flex h-full min-h-[88px] items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:bg-indigo-50/40 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-600">
                        <span><strong className="block text-sm font-black text-slate-900">{reportType.label}</strong><span className="mt-1 block text-xs leading-5 text-slate-600">{reportType.description}</span></span>
                        <Check size={17} aria-hidden="true" className={type === reportType.value ? 'shrink-0 text-indigo-600' : 'shrink-0 text-transparent'} />
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <label htmlFor="report-description" className="text-base font-black text-slate-900">問題描述 <span className="ml-1 text-sm font-bold text-indigo-600">必填</span></label>
                <p id="report-description-hint" className="mt-1 text-sm leading-6 text-slate-500">寫下問題頁面或項目、目前看到的內容，以及你預期的結果；資料錯誤可附上官方來源網址。</p>
                <textarea
                  id="report-description"
                  value={description}
                  onChange={(event) => { setDescription(event.target.value); if (error) setError(''); }}
                  placeholder="例如：○○高中資訊科的招生名額和官方簡章不同，官方公告連結是……"
                  maxLength={5000}
                  required
                  aria-describedby="report-description-hint report-description-count"
                  aria-invalid={descriptionHasInappropriateContent}
                  className={`${fieldClass} min-h-44 resize-y leading-7 ${descriptionHasInappropriateContent ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-100' : ''}`}
                />
                <div className="mt-2 flex items-start justify-between gap-3">
                  <span className={descriptionHasInappropriateContent ? 'text-sm font-semibold text-rose-700' : 'text-sm text-slate-500'}>{descriptionHasInappropriateContent ? '請改用具體、理性的文字描述問題。' : '請勿填寫准考證號、身分證字號等不必要個資。'}</span>
                  <span id="report-description-count" className="shrink-0 text-xs font-semibold text-slate-400">{description.length} / 5000</span>
                </div>
              </div>

              <div>
                <label htmlFor="report-email" className="flex items-center gap-2 text-base font-black text-slate-900"><Mail size={18} aria-hidden="true" className="text-indigo-600" />聯絡 Email <span className="text-sm font-bold text-indigo-600">必填</span></label>
                <p id="report-email-hint" className="mt-1 text-sm text-slate-500">僅在需要釐清問題時，用這個信箱與你聯繫。</p>
                <input id="report-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" maxLength={320} required autoComplete="email" aria-describedby="report-email-hint" className={fieldClass} />
              </div>

              <div className="flex flex-col items-end border-t border-slate-100 pt-6">
                {error && <div role="alert" className="mb-4 flex w-full items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"><AlertCircle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />{error}</div>}
                <button type="submit" disabled={submitting || descriptionHasInappropriateContent} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-extrabold text-white shadow-[0_8px_20px_rgba(79,70,229,0.18)] transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting ? <><Loader2 size={19} aria-hidden="true" className="animate-spin" />傳送中…</> : <><Send size={19} aria-hidden="true" />送出問題回報</>}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-4">
            <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(41,53,92,0.05)]">
              <span className="inline-grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-700"><Lightbulb size={21} aria-hidden="true" /></span>
              <h2 className="mt-4 text-lg font-black">讓回報更容易查核</h2>
              <ol className="mt-5 space-y-4">
                {[
                  ['位置', '哪個頁面、學校、科別或功能？'],
                  ['現況', '目前看到的內容或錯誤訊息？'],
                  ['依據', '預期結果或可參考的官方來源？'],
                ].map(([title, detail], index) => (
                  <li key={title} className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-50 text-xs font-black text-indigo-700">{index + 1}</span>
                    <span><strong className="block text-sm font-black">{title}</strong><span className="mt-0.5 block text-sm leading-6 text-slate-600">{detail}</span></span>
                  </li>
                ))}
              </ol>
            </section>
            <div className="flex items-start gap-3 rounded-[20px] border border-indigo-100 bg-indigo-50 p-5 text-sm leading-6 text-indigo-900">
              <ShieldCheck size={20} aria-hidden="true" className="mt-0.5 shrink-0" />
              <p>提供足夠線索即可，不需要上傳個人證件或成績單。了解資料使用方式可閱讀<a href={withBasePath('/privacy')} className="font-bold underline underline-offset-4 hover:text-indigo-700">隱私權政策</a>。</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
