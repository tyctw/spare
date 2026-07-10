import React from 'react';
import {
  ArrowLeft,
  Award,
  Bell,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  Info,
  MapPin,
  Megaphone,
  PenLine,
  ShieldCheck,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';

const dateGroups = [
  {
    title: '考前準備',
    desc: '先確認報名、准考證與考場資訊，避免考前才發現資料需要補正。',
    tone: 'amber',
    items: [
      {
        date: '03/05 - 03/07',
        title: '國中教育會考報名',
        desc: '確認報名資料、應考身分與相關文件。若資料有誤，盡早向學校或承辦單位確認。',
        icon: PenLine,
      },
      {
        date: '04/10',
        title: '寄發准考證',
        desc: '收到後檢查姓名、考區、考場與應試資訊，並妥善保存。',
        icon: FileCheck2,
      },
    ],
  },
  {
    title: '會考與成績',
    desc: '考試、成績公布與序位區間是後續落點判斷的核心節點。',
    tone: 'purple',
    items: [
      {
        date: '05/16 - 05/17',
        title: '國中教育會考',
        desc: '依准考證與官方試場規則應試。考前先確認交通時間、文具與證件。',
        icon: Award,
        featured: true,
      },
      {
        date: '06/05',
        title: '會考成績公布',
        desc: '取得五科等級、加號標示與作文級分後，可回到本站進行落點試算。',
        icon: Megaphone,
      },
    ],
  },
  {
    title: '志願選填',
    desc: '序位區間與志願選填期間，需要把成績、興趣、交通與家庭討論一起納入。',
    tone: 'sky',
    items: [
      {
        date: '06/18',
        title: '個人序位區間公布',
        desc: '序位區間是判斷志願風險的重要參考，仍須搭配歷年資料與當年度招生名額。',
        icon: ClipboardList,
      },
      {
        date: '06/18 起',
        title: '開放志願選填與試選填',
        desc: '建議先建立多版志願草稿，再與導師、輔導老師或家長討論排序。',
        icon: BookOpenCheck,
      },
    ],
  },
  {
    title: '分發與報到',
    desc: '放榜後留意報到期限、報到方式與後續補件規定。',
    tone: 'emerald',
    items: [
      {
        date: '07/07',
        title: '免試入學放榜',
        desc: '查看錄取結果，並立即確認報到時間、地點與需要攜帶的資料。',
        icon: GraduationCap,
      },
      {
        date: '07/09',
        title: '免試入學報到',
        desc: '依錄取學校公告完成報到。若有放棄、轉銜或其他選擇，務必確認官方流程。',
        icon: MapPin,
      },
    ],
  },
];

const toneClasses: Record<string, { soft: string; strong: string; text: string; border: string }> = {
  amber: { soft: 'bg-amber-50', strong: 'bg-amber-300', text: 'text-amber-800', border: 'border-amber-300' },
  purple: { soft: 'bg-purple-50', strong: 'bg-purple-500', text: 'text-purple-800', border: 'border-purple-300' },
  sky: { soft: 'bg-sky-50', strong: 'bg-sky-300', text: 'text-sky-800', border: 'border-sky-300' },
  emerald: { soft: 'bg-emerald-50', strong: 'bg-emerald-300', text: 'text-emerald-800', border: 'border-emerald-300' },
};

const checklist = [
  '成績公布後先確認五科等級、加號與作文級分是否正確。',
  '用序位區間搭配歷年錄取資料，不要只看單一年最低分。',
  '志願排序以「真正願意就讀」為原則，再評估夢幻、實際與保守配置。',
  '所有日期、名額與報到規定仍以官方簡章和招生委員會公告為準。',
];

export default function ImportantDatesPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-purple-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <a
            href={withBasePath('/')}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
          >
            <ArrowLeft className="h-4 w-4" />
            回首頁
          </a>

          <div className="grid gap-8 py-10 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 bg-purple-100">
                  <CalendarDays className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">Important Dates</p>
                  <p className="text-sm font-black text-slate-700">115 學年度升學時程整理</p>
                </div>
              </div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">重要日程</h1>
              <p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">
                將會考、成績公布、序位區間、志願選填、放榜與報到整理成完整時間線，方便學生與家長安排準備節奏。
              </p>
            </div>

            <div className="rounded-2xl border-4 border-slate-900 bg-slate-900 p-5 text-white shadow-[6px_6px_0px_0px_rgba(168,85,247,1)]">
              <Bell className="h-8 w-8 text-purple-200" />
              <h2 className="mt-4 text-2xl font-black">先記住三個節點</h2>
              <div className="mt-4 grid gap-3 text-sm font-bold text-slate-200">
                <div className="rounded-xl border border-white/15 bg-white/10 p-3">05/16 - 05/17 會考</div>
                <div className="rounded-xl border border-white/15 bg-white/10 p-3">06/05 成績公布</div>
                <div className="rounded-xl border border-white/15 bg-white/10 p-3">07/07 放榜</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <div className="space-y-6">
          {dateGroups.map((group) => {
            const tone = toneClasses[group.tone];
            return (
              <section key={group.title} className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-7">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className={`mb-3 inline-flex rounded-lg border-2 border-slate-900 px-3 py-1 text-xs font-black ${tone.soft} ${tone.text}`}>
                      {group.title}
                    </div>
                    <p className="max-w-3xl text-sm font-bold leading-7 text-slate-600">{group.desc}</p>
                  </div>
                </div>

                <div className="relative grid gap-4 lg:grid-cols-2">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <article
                        key={`${group.title}-${item.date}`}
                        className={`rounded-2xl border-2 border-slate-900 p-5 ${item.featured ? 'bg-purple-50 shadow-[4px_4px_0px_0px_rgba(126,34,206,1)]' : 'bg-slate-50 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 ${item.featured ? 'bg-purple-500 text-white' : `${tone.strong} text-slate-900`}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="min-w-0">
                            <div className={`mb-2 inline-flex rounded-lg border-2 border-slate-900 px-3 py-1 text-sm font-black ${item.featured ? 'bg-purple-500 text-white' : 'bg-white text-slate-900'}`}>
                              {item.date}
                            </div>
                            <h3 className="text-xl font-black leading-tight text-slate-900">{item.title}</h3>
                            <p className="mt-2 text-sm font-bold leading-7 text-slate-600">{item.desc}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-700" />
              <h2 className="text-xl font-black">準備提醒</h2>
            </div>
            <div className="mt-5 grid gap-3">
              {checklist.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border-2 border-slate-200 bg-slate-50 p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <p className="text-sm font-bold leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border-4 border-slate-900 bg-amber-300 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex items-center gap-3">
              <Info className="h-6 w-6 text-slate-900" />
              <h2 className="text-xl font-black">官方公告優先</h2>
            </div>
            <p className="mt-3 text-sm font-bold leading-7 text-slate-800">
              本頁為整理提醒用途，實際日期、簡章、報到方式、分發規定與異動公告，仍應以教育主管機關、招生委員會與各校公告為準。
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
