import React from 'react';
import { ArrowLeft, Database, FileText, Mail, Shield } from 'lucide-react';
import { withBasePath } from '../lib/routes';

type LegalPageKind = 'privacy' | 'terms';

interface LegalPageProps {
  kind: LegalPageKind;
}

const updatedAt = '2026 年 7 月 10 日';

type LegalSection = {
  title: string;
  body: string[];
};

type LegalPageContent = {
  title: string;
  eyebrow: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  sections: LegalSection[];
};

const pages: Record<LegalPageKind, LegalPageContent> = {
  privacy: {
    title: '隱私權政策',
    eyebrow: 'Privacy Policy',
    description:
      '本政策完整說明本平台在提供會考落點分析、學校查詢、志願模擬與資料匯出等服務時，如何蒐集、使用、保存與保護您提供或產生的資料。',
    icon: Database,
    sections: [
      {
        title: '一、適用範圍',
        body: [
          '本隱私權政策適用於您使用本平台網站、分析工具、查詢功能、匯出功能、意見回報與相關服務時所產生的資料處理行為。',
          '本平台可能連結至官方教育單位、學校、合作夥伴或其他第三方網站。當您離開本平台後，該第三方網站如何蒐集、使用或保存資料，應依其各自的隱私權政策與服務規範辦理，本平台不對第三方網站的資料處理方式負責。',
        ],
      },
      {
        title: '二、資料蒐集範圍',
        body: [
          '當您使用本平台時，可能會輸入或產生會考成績、作文級分、就學區、身分別、學校篩選條件、志願清單、比較清單、分析結果、匯出內容與操作紀錄等資料。這些資料主要用於即時完成查詢、分析、排序、比較、匯出與頁面顯示。',
          '本平台不會主動要求您提供與升學落點分析無關的敏感個人資料，例如身分證字號、金融帳戶、精確住址、健康紀錄、私人通訊內容或其他不必要的個人識別資訊。若您自行在回報內容或聯絡信件中提供上述資料，請確認其必要性。',
          '若您透過電子郵件或錯誤回報功能與我們聯繫，我們可能會取得您的電子郵件地址、問題描述、截圖、裝置或瀏覽器資訊，以及您為了說明問題而主動提供的其他內容。',
        ],
      },
      {
        title: '三、資料使用目的',
        body: [
          '本平台使用資料的目的包括：產生落點分析結果、提供學校與科系資訊、協助志願模擬、保存操作狀態、完成資料匯出、處理錯誤回報、維持系統安全、改善服務品質與優化使用者體驗。',
          '您輸入的成績、地區與篩選條件會用於計算與顯示分析結果；志願、比較或匯出資料則用於協助您整理升學資訊。平台不會將這些資料用於與服務目的無關的行銷、銷售或個別身分追蹤。',
          '若您主動聯繫我們，我們會使用您提供的聯絡資訊與問題內容來回覆詢問、排查錯誤、確認資料來源或處理您提出的需求。',
        ],
      },
      {
        title: '四、本機儲存與 Cookie',
        body: [
          '為了讓服務更順暢，本平台可能使用瀏覽器的 Local Storage、Session Storage 或必要 Cookie 來保存介面偏好、暫存查詢條件、操作狀態、授權狀態或其他必要資料。',
          '這些資料主要保存在您的裝置或瀏覽器中，用於避免重複輸入、維持頁面狀態與提升使用便利性。您可以透過瀏覽器設定清除本機資料；清除後，部分偏好設定、暫存結果、授權狀態或操作紀錄可能需要重新建立。',
          '若本平台使用第三方分析或嵌入服務，該服務可能依其政策使用 Cookie 或類似技術。您可透過瀏覽器設定限制第三方 Cookie，但部分功能可能因此受到影響。',
        ],
      },
      {
        title: '五、資料分享與揭露',
        body: [
          '除非取得您的同意、為提供服務所必要、依法令或主管機關要求，或為保護本平台與使用者的合法權益，本平台不會任意出售、出租、交換或揭露您的個人資料。',
          '若需要委託第三方提供主機、資料庫、寄信、錯誤追蹤、分析或其他技術服務，我們會要求相關服務提供者僅在必要範圍內處理資料，並採取合理的安全保護措施。',
          '當發生違反條款、濫用服務、資安事件、法律爭議或主管機關依法要求時，本平台可能在必要範圍內保存、檢視或提供相關紀錄。',
        ],
      },
      {
        title: '六、資料保存與安全',
        body: [
          '本平台會以合理的技術與管理措施保護資料安全，降低未授權存取、竄改、洩漏、毀損或遺失的風險。相關措施可能包括權限控管、傳輸保護、紀錄檢查與系統維護。',
          '網路傳輸與電子系統無法保證絕對安全。建議您不要在本平台輸入與升學分析無關的敏感資料，並妥善保管自己的裝置、瀏覽器與帳號安全。',
          '資料保存期間會依服務目的、系統維護、法律要求與合理營運需求決定。當資料不再需要時，我們會以合理方式刪除、匿名化或停止使用。',
        ],
      },
      {
        title: '七、使用者權利',
        body: [
          '若您希望查詢、更正、刪除或停止使用您曾主動提供給本平台的資料，可透過本頁提供的聯絡方式與我們聯繫。我們會在合理範圍內確認需求並協助處理。',
          '對於保存在您瀏覽器本機的資料，您可以直接透過瀏覽器設定、網站資料管理工具或清除快取功能刪除。刪除後，部分平台功能可能需要重新設定或重新輸入資料。',
        ],
      },
      {
        title: '八、政策更新',
        body: [
          '我們可能因服務調整、法規變更、安全需求或營運狀況更新本政策。更新後版本發布於本頁即生效，頁面會標示最後更新日期。',
          '若您在政策更新後繼續使用本平台，視為您已閱讀並理解更新後內容。建議您定期查看本頁，以掌握最新資料處理方式。',
        ],
      },
    ],
  },
  terms: {
    title: '服務條款',
    eyebrow: 'Terms of Service',
    description:
      '本條款完整說明您使用本平台時的權利義務、服務限制、資料正確性聲明、使用規範與責任範圍。當您繼續使用本服務，即表示您理解並同意遵守以下內容。',
    icon: Shield,
    sections: [
      {
        title: '一、服務定位',
        body: [
          '本平台提供會考升學相關資料查詢、落點分析、志願模擬、學校比較、資料匯出與相關輔助工具，目的在於協助使用者整理資訊、理解可能選項並進行參考判斷。',
          '本平台產生的落點、排序、分數換算、建議內容、圖表或任何分析結果，均屬資訊輔助與參考用途，不構成錄取保證、正式升學建議、學校承諾或任何法律上可主張的保證。',
          '升學選擇涉及個人成績、志願序、招生名額、分發規則、同分比序、區域政策與年度變動等多項因素，使用者應搭配官方資料、學校輔導資源、家長或專業人員建議進行綜合判斷。',
        ],
      },
      {
        title: '二、資料正確性與官方依據',
        body: [
          '本平台會盡力維持資料合理、完整與即時，但資料可能因官方公告、招生簡章、名額異動、計分規則、學校資訊、年度政策或系統更新而有所差異。',
          '所有招生資訊、重要日期、分發規則、錄取標準、簡章內容、學校名額與官方說明，均應以主管機關、招生委員會、學校或官方簡章公告為最終依據。',
          '使用者在採取任何升學行動前，應自行再次確認官方資料。本平台不因資料誤差、更新延遲、使用者輸入錯誤或第三方資料來源變動而承擔錄取結果或決策損失。',
        ],
      },
      {
        title: '三、使用者責任',
        body: [
          '使用者應確保輸入資料的正確性與完整性。若因成績、地區、身分別、志願條件或其他輸入資料錯誤，導致分析結果不準確，相關風險由使用者自行承擔。',
          '使用者不得以違法、侵權、詐欺、冒用、干擾、破壞、破解、逆向工程、大量自動化查詢、爬取、攻擊、繞過授權或其他影響平台安全與穩定性的方式使用本服務。',
          '使用者不得將本平台內容用於誤導他人、冒充官方資訊、未經授權之商業利用，或以任何方式侵害本平台、其他使用者、學校、資料來源或第三方的權利。',
        ],
      },
      {
        title: '四、服務變更、中斷與限制',
        body: [
          '本平台可能因維護、資料修正、功能調整、資安風險、第三方服務異常、流量負載、法規要求或不可抗力因素，調整、暫停、限制或終止部分或全部服務。',
          '我們會盡合理努力維持服務可用性與資料品質，但不保證服務永不中斷、完全無錯誤、完全符合每位使用者期待，或在任何裝置、瀏覽器與網路環境下皆能正常運作。',
          '若發現異常使用、違反條款、疑似攻擊、濫用資源或影響其他使用者權益的行為，本平台得視情況限制存取、停用功能、保留紀錄或採取其他必要措施。',
        ],
      },
      {
        title: '五、智慧財產權',
        body: [
          '本平台的介面設計、程式碼、資料整理方式、分析呈現、圖表、文字編排、功能流程與其他原創內容，除依法屬於第三方或公開資料者外，其相關權利由本平台或合法權利人保留。',
          '未經授權，使用者不得大量複製、重製、散布、改作、公開傳輸、商業利用、建立衍生服務，或以其他方式侵害本平台與權利人的智慧財產權。',
          '官方公開資料、學校資訊或第三方資料來源仍歸其原權利人所有。本平台僅就資料整理、呈現與服務功能提供輔助，不主張擁有第三方原始資料之權利。',
        ],
      },
      {
        title: '六、免責聲明',
        body: [
          '本平台依現有資料與系統邏輯提供分析服務，但不保證結果完全準確、即時、完整或適用於所有個案。使用者應自行判斷與承擔使用結果所產生的風險。',
          '因使用或無法使用本平台、資料錯誤、網路中斷、系統故障、第三方服務異常、官方資料變更、使用者輸入錯誤或其他不可歸責於本平台之事由所造成的直接或間接損失，本平台不負擔保或賠償責任。',
          '本平台不代表任何官方教育單位、招生委員會或學校。平台內容不得取代官方公告、正式簡章或專業升學諮詢。',
        ],
      },
      {
        title: '七、條款更新與準據法',
        body: [
          '我們可能因服務需求、法規調整、安全考量或營運狀況修訂本條款。修訂後版本發布於本頁即生效，並以頁面標示的最後更新日期為準。',
          '您於條款更新後繼續使用本平台，視為您已閱讀、理解並同意更新後內容。若您不同意本條款或其更新內容，請停止使用本服務。',
          '本條款之解釋與適用，若未特別約定者，悉依中華民國相關法律辦理。',
        ],
      },
    ],
  },
};

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

          <div className="py-10">
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
            <p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">
              {page.description}
            </p>
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
