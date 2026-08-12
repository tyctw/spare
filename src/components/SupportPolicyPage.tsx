import React from "react";
import {
  ArrowLeft,
  BadgeInfo,
  CreditCard,
  ExternalLink,
  FileText,
  HeartHandshake,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { withBasePath } from "../lib/routes";
import PageNavigation, { pageNavigationAsideClassName } from "./PageNavigation";

type PolicyKind = "after-sales" | "refund-cancellation";
type PolicySection = { title: string; body: string[] };
const supportEmail = "tyctw.analyze@gmail.com";
const updatedAt = "2026-08-11";

const afterSalesSections: PolicySection[] = [
  {
    title: "一、適用範圍與服務內容",
    body: [
      "本售後服務政策適用於本網站的免廣告會員方案及相關付款、會員資格、取消、退款、交易爭議與技術協助。免廣告會員目前提供月費 NT$49（30 天）及年費 NT$399（365 天）兩種單次付款方案，均不會自動續扣。",
      "會員須以 LINE 登入後購買，資格與已驗證的 LINE 身分連結；付款確認成功後，網站將開通該身分的免廣告資格。會員服務不包含升學錄取保證、個別諮詢、人工代填志願或其他未明示的服務。",
    ],
  },
  {
    title: "二、付款、確認與會員生效",
    body: [
      "付款由綠界科技（ECPay）依其付款流程處理。是否完成扣款及交易是否成立，以 ECPay、付款工具或金融機構的最終交易紀錄為準；本網站畫面的處理中、失敗或完成訊息僅供辨識進度。",
      "本網站收到並驗證付款成功通知後才會開通會員。若您已付款但會員尚未顯示生效，請先重新登入 LINE、回到會員頁更新狀態，且不要立即重複付款；仍未恢復時請依本頁的客服方式聯絡。",
    ],
  },
  {
    title: "三、可受理的售後事項",
    body: [
      "我們受理：付款成功但未開通會員、有效期限或方案顯示錯誤、重複扣款、金額不符、付款狀態異常、疑似未授權交易、取消或退款申請、LINE 登入或會員資格無法確認，以及與付款直接相關的技術問題。",
      "招生規則、錄取結果、外部網站或金融機構本身的故障，可能需要由主管機關、學校、發卡銀行、ECPay 或其他服務商處理；本網站會在合理範圍內協助提供交易或技術資訊。",
    ],
  },
  {
    title: "四、登出、取消與會員狀態",
    body: [
      "在會員頁按「登出 LINE」只會撤銷本網站目前的登入工作階段，不會取消已付款的會員資格、不會取消 LINE 帳號登入，也不會觸發退款。再次以同一個 LINE 身分登入後，仍可在有效期間內確認會員資格。",
      "「取消會員」是指您要求終止後續使用或依規則解除本次交易；因所有方案均不自動續扣，取消不涉及停止下期扣款。取消或退款是否成立，以及會員資格何時停止，依退款與取消政策、交易情況及適用法令判定。",
    ],
  },
  {
    title: "五、客服申請方式與回覆",
    body: [
      "請寄信至 tyctw.analyze@gmail.com，主旨建議填寫「會員售後協助」、「付款異常」或「退款／取消申請」。請提供：LINE 顯示名稱或可辨識稱呼、聯絡方式、購買方案、付款日期時間、金額、本網站訂單編號或 ECPay 交易識別資訊，以及問題說明。",
      "為避免冒用或誤退款，我們可能要求補充最小必要資料以核對交易。收到資料後，將盡力於 5 個工作天內回覆受理情形或補件需求；若案件涉及 ECPay、銀行或爭議款處理，完成時間會受第三方作業影響。",
    ],
  },
  {
    title: "六、付款與帳戶安全",
    body: [
      "本網站不會要求您以電子郵件提供完整卡號、網銀密碼、OTP、LINE 密碼或身分證字號。客服只會要求核對交易所需的有限資訊；若收到可疑訊息，請勿點擊連結或提供憑證。",
      "如懷疑信用卡、帳戶或付款工具遭未授權使用，請立即聯絡發卡銀行或付款服務商以保護帳戶，並同步通知本網站保留交易核對資料。",
    ],
  },
  {
    title: "七、政策、法令與第三方服務",
    body: [
      "本政策應與服務條款、隱私權政策及退款與取消政策一併閱讀。若與強制法令、付款服務商規則或個案事實不一致，以適用法令及最終交易紀錄為準；本政策不限制消費者依法不得排除的權利。",
      "本網站可能因付款流程、功能、資安或法令更新本政策，並於本頁標示最後更新日期。已提出的售後案件原則上依申請時適用且不違反法令的規則處理。",
    ],
  },
  {
    title: "八、案件處理流程與結果通知",
    body: [
      "客服收到來信後，會先確認案件類型與可核對資料；必要時再請您補充資訊。完成基本核對後，案件可能進入會員資格修正、付款狀態查詢、取消或退款審核、第三方協查，或提供技術操作說明等流程。",
      "我們會以您提出申請時使用的電子郵件回覆處理結果、補件需求或後續步驟。若提供的聯絡資訊無法收信、未在合理期間內補齊必要資料，或無法核對交易與申請人的關聯，案件可能無法繼續處理；這不影響您依適用法令另行主張的權利。",
    ],
  },
  {
    title: "九、案件資料與隱私保護",
    body: [
      "為處理售後案件，本網站僅在必要範圍內使用您主動提供的聯絡資料、方案、付款時間與金額、訂單或交易識別資訊、LINE 身分核對結果及問題說明。相關資料會依隱私權政策及適用法令處理，不會用於與案件無關的目的。",
      "請以最小必要資訊提出申請，並遮蔽不必要的敏感資料。除非依法、為處理付款或防制詐欺所必要，本網站不會要求或以電子郵件蒐集完整卡號、網銀密碼、OTP、LINE 密碼或其他登入憑證。",
    ],
  },
  {
    title: "十、服務限制與外部救濟",
    body: [
      "本網站會在合理可行範圍內協助處理會員與付款問題，但無法直接控制 LINE、ECPay、金融機構、瀏覽器、網路服務或裝置設定。因第三方系統維護、交易審核、網路中斷或其他非本站可控制原因造成的延遲，會依實際狀況持續協查。",
      "若對處理結果仍有疑義，您可要求再次核對案件資料，並可依適用法令向 ECPay、發卡銀行、電子支付業者、消費爭議申訴管道或有關主管機關尋求協助。本政策不限制任何依法不得排除的消費者權利。",
    ],
  },
];

const refundSections: PolicySection[] = [
  {
    title: "一、政策目的與基本原則",
    body: [
      "本政策適用於免廣告會員的月費與年費單次付款，以及其他經本網站明確標示適用本政策的付款。它不排除、限制或免除消費者保護法、民法或其他強制法令賦予您的解除、退款、損害賠償或其他權利。",
      "免廣告會員在付款確認後即提供服務。現行結帳流程不以「服務已開始」或「已使用會員功能」為由，預先取得您放棄法定七日解除權的同意；因此，本政策不以該理由一概拒絕依法提出的取消或退款申請。",
    ],
  },
  {
    title: "二、付款尚未完成時的取消",
    body: [
      "在付款尚未完成、尚未獲 ECPay 或金融機構確認，或交易顯示失敗、取消、逾時、未成立時，您可直接關閉付款頁或依付款頁操作取消。是否成功取消，仍以 ECPay、銀行、信用卡或電子支付業者的最終紀錄為準。",
      "若您離開付款頁後發現交易仍成功，請不要再次付款或嘗試以其他付款交易相互抵銷；請保留交易時間、金額與識別資訊，並依本頁提出查詢。",
    ],
  },
  {
    title: "三、七日解除與取消申請",
    body: [
      "通訊交易消費者原則上得於接受服務後 7 日內，以書面通知解除契約；如您要行使此權利，請在期間內以電子郵件提出，並保留寄送紀錄。收到可核對的申請後，本網站會停止該筆會員資格並依本政策處理退款。",
      "若個案依法屬於合理例外、已另行取得符合法令的明確同意，或有其他法定事由，七日解除權是否適用仍依適用法令判斷。本網站會說明個案處理依據，且不會僅以概括條款排除法定權利。",
    ],
  },
  {
    title: "四、可退款或核對的情形",
    body: [
      "可提出退款或交易核對的常見情形包括：同一方案因系統或操作而重複扣款、實收金額與確認金額明顯不符、付款成功但因可歸責於本網站的系統問題未開通會員、已提出有效取消或解除申請、疑似未授權交易，或其他依法應退款的情形。",
      "超過法定或本政策所定可取消期間後，若會員服務已正常提供，原則上不提供按未使用天數比例的任意退款；但重複扣款、金額錯誤、服務未能提供、未授權交易及依法應退款的情形不在此限。",
    ],
  },
  {
    title: "五、退款金額、會員資格與方式",
    body: [
      "經確認應退款時，退款金額以實際收取且依法或依本政策應退的款項為限；若已就同一筆交易完成退款，不會重複退款。退款完成或取消生效後，對應的免廣告會員資格將停止，除非法律或個案處理另有要求。",
      "退款原則上以原付款工具、原交易路徑或 ECPay 可支援的方式辦理，以降低誤退款與詐騙風險。完成核對後，本網站將盡力在 7 個工作天內提交退款處理；實際入帳時間取決於 ECPay、發卡銀行、電子支付業者及帳單結算週期。",
    ],
  },
  {
    title: "六、提出申請時請提供的資料",
    body: [
      "請寄信至 tyctw.analyze@gmail.com，主旨填寫「退款／取消申請」。請提供購買方案、付款日期時間、金額、本網站訂單編號或 ECPay 交易識別資訊、可聯絡稱呼及申請原因；如為重複扣款或金額爭議，請標示各筆交易。",
      "請勿提供完整卡號、網銀密碼、OTP、LINE 密碼或其他敏感憑證。為確認申請人與原付款交易的關聯，我們可能要求補充有限的核對資料；無法核對、資料互相矛盾或疑似詐騙時，可能暫緩處理並告知可行的後續途徑。",
    ],
  },
  {
    title: "七、未授權交易與爭議款",
    body: [
      "如懷疑付款工具遭未授權使用，請立即聯絡發卡銀行、電子支付業者或 ECPay 依其爭議程序處理，並同步通知本網站。為避免重複退款，本網站可在支付服務商或金融機構的爭議結果確定前暫緩同一筆交易的退款。",
      "本網站會在合法、必要範圍內配合提供訂單、付款狀態與處理紀錄；退款申請不等同於一定獲准，最終仍依交易紀錄、適用法令、付款服務商回覆及個案事實判斷。",
    ],
  },
  {
    title: "八、政策更新與外部救濟",
    body: [
      "本網站可能因服務、付款流程或法令需要更新本政策，並在本頁公布最後更新日期。若對處理結果有疑義，請先來信要求核對；本網站會說明可提供的處理結果或下一步。",
      "若雙方無法協調，您仍可依適用法令向 ECPay、發卡銀行、電子支付業者、消費爭議申訴管道或有關主管機關尋求協助。本政策不限制您依法得行使的救濟權利。",
    ],
  },
  {
    title: "九、申請受理、審核與結果通知",
    body: [
      "收到取消、退款或交易核對申請後，本網站會先確認申請內容、付款紀錄與會員資格狀態；必要時會請您補充最小必要資料。完整資料收到後，將盡力於 5 個工作天內回覆受理情形、補件需求、初步處理方向或第三方協查進度。",
      "退款、取消或爭議處理是否成立，會依交易紀錄、適用法令、付款服務商回覆及個案事實判斷。結果與後續步驟會以申請時使用的電子郵件通知；若聯絡資訊無法收信、未在合理期間內補齊必要資料或無法核對交易，案件可能無法繼續處理。",
    ],
  },
  {
    title: "十、重複申請、濫用與詐騙防制",
    body: [
      "同一筆交易若已完成退款、正在由銀行、ECPay 或電子支付業者處理爭議，或已提出相同申請，本網站得合併案件或暫緩重複處理，以避免重複退款。退款申請本身不代表一定核准，也不會改變付款服務商或金融機構的獨立審核權限。",
      "如發現交易資料明顯不一致、疑似冒名、詐騙、惡意拒付或其他有必要保護交易安全的情況，本網站得暫緩退款或請相關付款服務商協查，並會在合法且適當的範圍內說明可行的下一步。這不影響消費者依法行使權利。",
    ],
  },
  {
    title: "十一、付款服務與法定權利說明",
    body: [
      "綠界付款頁所顯示的可用付款方式、驗證、取消機制與交易狀態，依其當下服務條件及付款工具規則為準。本網站不會要求您以電子郵件提供完整卡號、網銀密碼、OTP、LINE 密碼或其他登入憑證；如收到可疑訊息，請勿點擊連結或提供資料。",
      "通訊交易的解除、退款與損害賠償權利，仍以消費者保護法及其他適用的強制法令為準。本政策是網站的處理說明，不排除、限制或免除依法不得排除的權利；如政策內容與強制法令不一致，應以適用法令為準。",
    ],
  },
];

const labels = {
  afterSales: "售後服務",
  refund: "退款與取消政策",
  back: "回到會員免廣告",
  updated: "最後更新：",
  notice:
    "本文清楚說明會員付款、售後、取消與退款處理原則；如本政策與強制法令牴觸，以適用法令為準。",
  contact: "需要付款或會員協助嗎？",
  contactText:
    "請提供可核對的最小必要資料。客服不會要求密碼、OTP、完整卡號或 LINE 登入憑證。",
  navigation: "頁面導覽",
  navigationHint: "點選章節快速跳至內容",
  terms: "服務條款",
  privacy: "隱私權政策",
  legal:
    "付款資料與會員資格會依隱私權政策處理；請保留付款交易紀錄，直到售後或退款案件結案。",
};

export default function SupportPolicyPage({ kind }: { kind: PolicyKind }) {
  const isRefund = kind === "refund-cancellation";
  const title = isRefund ? labels.refund : labels.afterSales;
  const Icon = isRefund ? ShieldCheck : HeartHandshake;
  const sections = isRefund ? refundSections : afterSalesSections;
  const accent = isRefund
    ? {
        hero: "bg-amber-50",
        panel: "bg-amber-200",
        text: "text-amber-700",
        notice: "border-amber-400 bg-amber-50",
      }
    : {
        hero: "bg-indigo-50",
        panel: "bg-indigo-200",
        text: "text-indigo-700",
        notice: "border-sky-400 bg-sky-50",
      };
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className={"border-b-4 border-slate-900 " + accent.hero}>
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <a
            href={withBasePath("/membership")}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#0f172a]"
          >
            <ArrowLeft className="h-4 w-4" />
            {labels.back}
          </a>
          <div className="py-12">
            <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0_#0f172a]">
              <div
                className={
                  "flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 " +
                  accent.panel
                }
              >
                <Icon className={"h-6 w-6 " + accent.text} />
              </div>
              <div>
                <p className="text-xs font-black tracking-widest text-slate-500">
                  MEMBERSHIP SUPPORT
                </p>
                <p className="text-sm font-black text-slate-700">
                  {labels.updated}
                  {updatedAt}
                </p>
              </div>
            </div>
            <h1 className="mt-5 text-4xl font-black sm:text-5xl">{title}</h1>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className={pageNavigationAsideClassName}>
          <PageNavigation
            navClassName="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0_#0f172a]"
            itemLayoutClassName="space-y-2"
            items={sections.map((section, index) => ({
              id: "policy-section-" + String(index + 1),
              label: section.title,
              className: "block rounded-xl",
            }))}
          />
        </aside>
        <div className="space-y-5">
          <section
            className={
              "rounded-2xl border-2 p-5 text-sm font-bold leading-7 text-slate-700 " +
              accent.notice
            }
          >
            <div className="flex gap-2">
              <BadgeInfo className={"mt-1 h-5 w-5 shrink-0 " + accent.text} />
              <p>{labels.notice}</p>
            </div>
          </section>
          {sections.map((section, index) => (
            <article
              id={"policy-section-" + (index + 1)}
              key={section.title}
              className="policy-section-anchor rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0_#0f172a] sm:p-8"
            >
              <div className="flex gap-3">
                <span
                  className={
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 font-black " +
                    accent.panel
                  }
                >
                  {index + 1}
                </span>
                <div>
                  <h2 className="text-2xl font-black">{section.title}</h2>
                  <div className="mt-3 space-y-4">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base font-bold leading-8 text-slate-700"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
          <section className="support-contact-panel relative overflow-hidden rounded-[2rem] border-4 border-slate-900 p-6 text-white shadow-[8px_8px_0_#f59e0b] sm:p-9">
            <div className="support-contact-orb" />
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-white/80 bg-amber-300 text-slate-950 shadow-[3px_3px_0_#fff]">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black tracking-[0.24em] text-amber-200">
                    MEMBERSHIP DESK
                  </p>
                  <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                    {labels.contact}
                  </h2>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                  <p className="text-sm font-bold leading-7 text-slate-100">
                    {labels.contactText}
                  </p>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a
                  href={"mailto:" + supportEmail}
                  className="support-contact-email group sm:col-span-2"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-amber-300">
                    <Mail className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-black tracking-wider text-slate-500">
                      EMAIL SUPPORT
                    </span>
                    <span className="block truncate text-base font-black text-slate-950">
                      {supportEmail}
                    </span>
                  </span>
                  <span className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-amber-300 text-slate-950 transition-transform group-hover:translate-x-1">
                    <ExternalLink className="h-4 w-4" />
                  </span>
                </a>
                <a
                  href={withBasePath("/terms")}
                  className="support-contact-link"
                >
                  <FileText className="h-5 w-5 text-amber-300" />
                  <span>
                    <span className="block text-sm font-black">
                      {labels.terms}
                    </span>
                    <span className="block text-xs font-bold text-slate-300">
                      會員服務使用原則
                    </span>
                  </span>
                  <ArrowLeft className="ml-auto h-4 w-4 rotate-180 text-slate-400" />
                </a>
                <a
                  href={withBasePath("/privacy")}
                  className="support-contact-link"
                >
                  <ShieldCheck className="h-5 w-5 text-amber-300" />
                  <span>
                    <span className="block text-sm font-black">
                      {labels.privacy}
                    </span>
                    <span className="block text-xs font-bold text-slate-300">
                      付款與資料處理說明
                    </span>
                  </span>
                  <ArrowLeft className="ml-auto h-4 w-4 rotate-180 text-slate-400" />
                </a>
              </div>
            </div>
          </section>
          <section className="rounded-2xl border-2 border-slate-300 bg-white p-5 text-sm font-bold leading-7 text-slate-600">
            <FileText className="mb-2 h-5 w-5 text-slate-700" />
            {labels.legal}
          </section>
        </div>
      </section>
    </main>
  );
}
