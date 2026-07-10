import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Database,
  FileText,
  LockKeyhole,
  Mail,
  Shield,
  TriangleAlert,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';

type LegalPageKind = 'privacy' | 'terms';

interface LegalPageProps {
  kind: LegalPageKind;
}

const updatedAt = '2026 年 7 月 10 日';

const pages = {
  privacy: {
    title: '隱私權政策',
    eyebrow: 'Privacy Policy',
    description:
      '我們重視使用者資料安全。本頁說明本平台如何蒐集、使用、保存與保護您在使用服務時產生或提供的資料。',
    icon: Database,
    tone: 'emerald',
    summary: [
      '不會要求您提供與升學落點分析無關的敏感個人資料。',
      '輸入資料主要用於完成查詢、分析、匯出與改善服務體驗。',
      '瀏覽器本機儲存僅用於保留操作狀態與偏好設定。',
      '若涉及第三方網站或外部資源，該網站的資料處理方式不屬於本平台控制範圍。',
    ],
    sections: [
      {
        title: '一、資料蒐集範圍',
        body: [
          '當您使用本平台時，可能會輸入會考成績、作文級分、地區、身分別、學校篩選條件、志願或比較清單等資料。這些資料用於即時產生查詢結果與分析建議。',
          '本平台不會主動要求您提供身分證字號、金融帳戶、精確住址或其他與服務目的無直接關聯的敏感資料。',
        ],
      },
      {
        title: '二、資料使用目的',
        body: [
          '您提供的資料會用於落點分析、校系比較、志願模擬、結果匯出、錯誤排查、服務維護與功能改善。',
          '若您主動透過電子郵件聯繫我們，信件內容與聯絡資訊僅用於回覆您的問題、處理回報事項或提供必要協助。',
        ],
      },
      {
        title: '三、本機儲存與 Cookie',
        body: [
          '本平台可能使用瀏覽器 Local Storage、Session Storage 或必要 Cookie 保存操作狀態、介面偏好與暫存資料，讓您在同一裝置上使用服務時更順暢。',
          '您可以透過瀏覽器設定清除這些資料；清除後，部分偏好設定、暫存結果或登入狀態可能需要重新建立。',
        ],
      },
      {
        title: '四、資料保存與安全',
        body: [
          '我們會以合理技術與管理措施保護服務運作過程中的資料，降低未授權存取、竄改、揭露或毀損的風險。',
          '網路傳輸與系統保存無法保證絕對安全。建議您避免在平台輸入與升學分析無關的私人敏感資訊。',
        ],
      },
      {
        title: '五、第三方連結',
        body: [
          '本平台可能包含外部合作夥伴、官方教育單位或資料來源網站連結。當您離開本平台後，相關網站的資料蒐集、使用與保護方式，應依該第三方網站的隱私權政策為準。',
        ],
      },
      {
        title: '六、政策更新',
        body: [
          '我們可能依服務調整、法規變更或安全需求更新本政策。更新後版本發布於本頁即生效，建議您定期查看最新內容。',
        ],
      },
    ],
  },
  terms: {
    title: '服務條款',
    eyebrow: 'Terms of Service',
    description:
      '使用本平台前，請先閱讀本服務條款。當您繼續使用本服務，即表示您理解並同意遵守以下規範。',
    icon: Shield,
    tone: 'indigo',
    summary: [
      '本平台提供升學資料整理、查詢與輔助分析，不保證錄取結果。',
      '落點、分數、學校資訊與建議內容僅供參考，最終仍以官方公告為準。',
      '請勿以自動化、大量抓取、攻擊或干擾方式使用本服務。',
      '本平台得因維護、資料修正或安全因素調整、暫停或終止部分功能。',
    ],
    sections: [
      {
        title: '一、服務定位',
        body: [
          '本平台提供會考升學相關資料查詢、落點分析、志願模擬、學校比較與匯出工具，目的為協助使用者整理資訊與做出參考判斷。',
          '平台產生的分析結果、推薦排序或說明內容不構成錄取保證、正式升學建議或任何形式的承諾。',
        ],
      },
      {
        title: '二、資料準確性',
        body: [
          '我們會盡力維持資料合理、完整與即時，但資料可能因官方公告、招生簡章、名額異動、計分方式或系統更新而改變。',
          '所有招生資訊、分發規則、錄取標準與重要日期，請以主管機關、招生委員會、學校或官方簡章公告為最終依據。',
        ],
      },
      {
        title: '三、使用者責任',
        body: [
          '您應自行確認輸入資料的正確性，並依自身狀況、學校輔導資源、家長或專業人員建議，綜合判斷升學選擇。',
          '請勿使用本服務從事違法、侵權、干擾系統、破解驗證、逆向工程、大量自動化查詢或其他影響平台穩定性的行為。',
        ],
      },
      {
        title: '四、服務變更與中斷',
        body: [
          '本平台可能因維護、功能調整、資料修正、資安風險、第三方服務異常或不可抗力因素，調整、暫停或終止部分服務。',
          '我們會盡合理努力維持服務可用性，但不保證服務永不中斷或完全無錯誤。',
        ],
      },
      {
        title: '五、智慧財產權',
        body: [
          '本平台介面、程式、設計、整理內容與分析呈現方式，除依法屬於第三方或公開資料者外，其相關權利由本平台或合法權利人保留。',
          '未經授權，請勿大量複製、重製、散布、改作、商業利用或以其他方式侵害相關權利。',
        ],
      },
      {
        title: '六、條款更新與準據法',
        body: [
          '我們可能依服務需求、法規調整或營運狀況修訂本條款。修訂後版本發布於本頁即生效；您繼續使用本服務，視為同意更新後內容。',
          '本條款之解釋與適用，若未特別約定者，悉依中華民國相關法律辦理。',
        ],
      },
    ],
  },
} satisfies Record<LegalPageKind, {
  title: string;
  eyebrow: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: 'emerald' | 'indigo';
  summary: string[];
  sections: { title: string; body: string[] }[];
}>;

export default function LegalPage({ kind }: LegalPageProps) {
  const page = pages[kind];
  const Icon = page.icon;
  const isPrivacy = kind === 'privacy';
  const colors = isPrivacy
    ? {
        hero: 'bg-emerald-50',
        iconBg: 'bg-emerald-100',
        iconText: 'text-emerald-600',
      }
    : {
        hero: 'bg-indigo-50',
        iconBg: 'bg-indigo-100',
        iconText: 'text-indigo-600',
      };
  const alternateHref = isPrivacy ? withBasePath('/terms') : withBasePath('/privacy');
  const alternateText = isPrivacy ? '查看服務條款' : '查看隱私權政策';

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className={`border-b-4 border-slate-900 ${colors.hero}`}>
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <a
            href={withBasePath('/')}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首頁
          </a>

          <div className="grid gap-8 py-10 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 ${colors.iconBg}`}>
                  <Icon className={`h-6 w-6 ${colors.iconText}`} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">{page.eyebrow}</p>
                  <p className="text-sm font-black text-slate-700">最後更新：{updatedAt}</p>
                </div>
              </div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">{page.title}</h1>
              <p className="mt-5 max-w-3xl text-base font-bold leading-8 text-slate-700 sm:text-lg">
                {page.description}
              </p>
            </div>

            <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center gap-3">
                {isPrivacy ? (
                  <LockKeyhole className="h-6 w-6 text-emerald-600" />
                ) : (
                  <TriangleAlert className="h-6 w-6 text-amber-500" />
                )}
                <h2 className="text-lg font-black">重點摘要</h2>
              </div>
              <ul className="mt-4 space-y-3">
                {page.summary.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-bold leading-6 text-slate-700">
                    <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${colors.iconText}`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav className="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-500">
              <FileText className="h-4 w-4" />
              章節
            </div>
            <div className="space-y-2">
              {page.sections.map((section, index) => (
                <a
                  key={section.title}
                  href={`#section-${index + 1}`}
                  className="block rounded-xl px-3 py-2 text-sm font-black text-slate-700 transition-colors hover:bg-slate-100"
                >
                  {section.title.replace(/^.+?、/, '')}
                </a>
              ))}
            </div>
          </nav>
        </aside>

        <div className="space-y-5">
          {page.sections.map((section, index) => (
            <article
              key={section.title}
              id={`section-${index + 1}`}
              className="scroll-mt-8 rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-8"
            >
              <h2 className="text-2xl font-black tracking-tight">{section.title}</h2>
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-base font-bold leading-8 text-slate-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}

          <div className="flex flex-col gap-3 rounded-2xl border-4 border-slate-900 bg-amber-300 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">需要聯絡我們？</h2>
              <p className="mt-1 text-sm font-bold text-slate-800">若對條款或資料處理有疑問，可寄信與我們聯繫。</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={alternateHref}
                className="inline-flex items-center justify-center rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
              >
                {alternateText}
              </a>
              <a
                href="mailto:tyctw.analyze@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
              >
                <Mail className="h-4 w-4" />
                tyctw.analyze@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
