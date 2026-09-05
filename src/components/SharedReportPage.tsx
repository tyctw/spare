import { useEffect, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CalendarDays,
  ClipboardList,
  Copy,
  ExternalLink,
  GraduationCap,
  Loader2,
  MapPin,
  PieChart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { callBackend } from "../lib/api";
import { withBasePath } from "../lib/routes";
import RelatedReading from "./RelatedReading";

type SharedReport = {
  kind: "analysis" | "volunteer";
  payload: any;
  expiresAt: string | null;
};
const copyStorageKey = "mock-volunteer-import";

export default function SharedReportPage({ token }: { token: string }) {
  const [report, setReport] = useState<SharedReport | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    callBackend<SharedReport>({ action: "getSharedReport", token })
      .then(setReport)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "無法讀取分享內容。"),
      );
  }, [token]);
  if (error)
    return (
      <PageState
        icon={<AlertCircle />}
        title="此分享連結無法使用"
        message={error}
      />
    );
  if (!report)
    return (
      <PageState
        icon={<Loader2 className="animate-spin" />}
        title="正在載入分享報告"
        message="請稍候…"
      />
    );
  const createdAt = report.payload?.createdAt
    ? new Date(report.payload.createdAt).toLocaleString("zh-TW")
    : "";
  if (report.kind === "volunteer")
    return (
      <VolunteerReport
        choices={
          Array.isArray(report.payload?.choices) ? report.payload.choices : []
        }
        region={String(report.payload?.region || "")}
        regionName={String(
          report.payload?.regionName || report.payload?.region || "--",
        )}
        createdAt={createdAt}
        expiresAt={report.expiresAt}
      />
    );
  const schools = report.payload?.results?.eligibleSchools || [];
  return (
    <Layout
      title="落點分析結果"
      createdAt={createdAt}
      expiresAt={report.expiresAt}
    >
      <section className="rounded-2xl border-2 border-slate-900 bg-slate-900 p-5 text-white">
        <p className="text-sm font-black text-amber-300">分析摘要</p>
        <p className="mt-2 font-bold leading-7">
          {report.payload?.results?.analysisReport?.analysisSummary ||
            "此報告沒有可顯示的摘要。"}
        </p>
        <p className="mt-3 text-sm font-bold text-slate-300">
          總積分：{report.payload?.results?.totalPoints ?? "--"} ·
          符合條件校科：{schools.length}
        </p>
      </section>
      <div className="mt-5 space-y-3">
        {schools.map((school: any, index: number) => (
          <article
            key={`${school.name}-${index}`}
            className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
          >
            <h2 className="font-black text-slate-950">{school.name}</h2>
            <p className="mt-1 text-sm font-bold text-slate-600">
              {[school.type, school.group, school.ownership]
                .filter(Boolean)
                .join(" / ")}
            </p>
            <p className="mt-2 text-sm font-black text-indigo-700">
              參考門檻：{school.points ?? "--"} / {school.zone || "推薦"}
            </p>
          </article>
        ))}
      </div>
    </Layout>
  );
}

function VolunteerReport({
  choices,
  region,
  regionName,
  createdAt,
  expiresAt,
}: {
  choices: any[];
  region: string;
  regionName: string;
  createdAt: string;
  expiresAt: string | null;
}) {
  const summaryChoices = choices.slice(0, 10);
  const groupCounts = countBy(
    summaryChoices,
    (choice) => choice.groupName || "其他",
  );
  const typeCounts = countBy(summaryChoices, schoolCategory);
  const createCopy = () => {
    window.localStorage.setItem(
      copyStorageKey,
      JSON.stringify({ region, regionName, choices }),
    );
    window.location.href = withBasePath("/mock-volunteer?import=shared");
  };
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f7ff] px-4 py-5 text-slate-900 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-72 h-80 w-80 rounded-full bg-amber-200/60 blur-3xl" />
      <div className="relative mx-auto max-w-4xl">
        <a
          href={withBasePath("/")}
          className="inline-flex items-center gap-2 rounded-xl border-[3px] border-slate-900 bg-white px-5 py-3 text-lg font-black text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
        >
          <ArrowLeft className="h-5 w-5 stroke-[3]" />
          回到首頁
        </a>
        <header className="relative mt-6 overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-slate-900 px-6 py-7 text-white shadow-[9px_9px_0px_0px_rgba(15,23,42,1)] sm:px-9 sm:py-9">
          <div className="absolute -right-12 -top-14 h-44 w-44 rounded-full border-4 border-slate-900 bg-amber-300" />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-indigo-100">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              唯讀分享
            </div>
            <div className="mt-5 flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-amber-300 text-slate-900">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-black text-sky-200">學生志願規劃</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-5xl">
                  模擬志願序
                </h1>
              </div>
            </div>
            <p className="mt-5 max-w-xl text-sm font-bold leading-7 text-slate-200">
              依志願順序整理，讓家庭可以快速討論孩子的探索方向。
            </p>
          </div>
        </header>
        <section className="relative z-10 -mt-4 mx-2 grid gap-3 sm:grid-cols-3">
          <StatCard
            icon={<MapPin className="h-5 w-5" />}
            label="就學區"
            value={regionName}
            tone="bg-sky-100 text-sky-800"
          />
          <StatCard
            icon={<Sparkles className="h-5 w-5" />}
            label="志願數"
            value={String(choices.length)}
            tone="bg-amber-100 text-amber-800"
          />
          <StatCard
            icon={<CalendarDays className="h-5 w-5" />}
            label={expiresAt ? "連結有效至" : "分享狀態"}
            value={expiresAt ? new Date(expiresAt).toLocaleDateString("zh-TW") : "會員專屬長期連結"}
            tone="bg-violet-100 text-violet-800"
          />
        </section>
        {choices.length > 0 && (
          <section className="mt-9 rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-700">
                  <BarChart3 className="h-5 w-5" />
                  <p className="text-xs font-black tracking-[0.16em]">
                    DIRECTION SNAPSHOT
                  </p>
                </div>
                <h2 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
                  志願方向總覽
                </h2>
                <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-600">
                  從前幾個志願看出目前的探索方向；群科與類型標籤可點擊查看介紹。
                </p>
              </div>
              <span className="shrink-0 rounded-xl border-2 border-slate-900 bg-amber-100 px-3 py-2 text-xs font-black">
                以前 10 個志願統計
              </span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <DistributionCard
                icon={<GraduationCap className="h-5 w-5" />}
                title="前幾志願的群科分布"
                entries={groupCounts}
                linkFor={(name) =>
                  name === "學術群"
                    ? withBasePath("/general-comprehensive-high-school")
                    : withBasePath("/vocational-encyclopedia") +
                      "?group=" +
                      encodeURIComponent(name)
                }
              />
              <DistributionCard
                icon={<PieChart className="h-5 w-5" />}
                title="普通高中／技高比例"
                entries={typeCounts}
                linkFor={() => withBasePath("/school-types")}
              />
            </div>
            <div className="mt-5 rounded-2xl border-2 border-slate-900 bg-indigo-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-white">
                  <Copy className="h-5 w-5 text-indigo-700" />
                </div>
                <p className="text-sm font-bold leading-6 text-slate-700">
                  <span className="block font-black text-slate-950">
                    建立我的模擬副本
                  </span>
                  將這份清單帶到自己的模擬頁繼續調整；原分享內容不會被修改。
                </p>
              </div>
              <button
                onClick={createCopy}
                className="mt-4 inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none sm:mt-0 sm:w-auto"
              >
                <Copy className="h-4 w-4" />
                建立我的副本
              </button>
            </div>
          </section>
        )}
        <section className="mt-9">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black tracking-[0.16em] text-indigo-600">
                PREFERENCE LIST
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
                志願順序
              </h2>
            </div>
            <div className="rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              {choices.length} / 30
            </div>
          </div>
          {choices.length === 0 ? (
            <p className="mt-5 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center font-bold text-slate-500">
              此報告尚未加入志願。
            </p>
          ) : (
            <ol className="relative mt-5 space-y-4 before:absolute before:bottom-6 before:left-[25px] before:top-6 before:w-1 before:rounded-full before:bg-indigo-200">
              {choices.map((choice: any, index: number) => (
                <li
                  key={`${choice.code}-${choice.deptCode}-${index}`}
                  className="relative"
                >
                  <article className="relative overflow-hidden rounded-2xl border-3 border-slate-900 bg-white p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-5">
                    <div className="relative flex gap-4">
                      <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-3 border-slate-900 bg-amber-300 text-lg font-black text-slate-950">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-black leading-tight text-slate-950 sm:text-xl">
                          {choice.name}
                        </h3>
                        <p className="mt-1 font-black text-sky-700">
                          {choice.deptName}
                          {choice.shift ? `（${choice.shift}）` : ""}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 border-t-2 border-dashed border-slate-200 pt-3">
                          <a
                            href={withBasePath("/school-types")}
                            className="rounded-lg border border-amber-300 bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-900 underline decoration-amber-400 underline-offset-2"
                          >
                            {choice.levelInfo || "--"}
                          </a>
                          {choice.groupName && (
                            <a
                              href={
                                choice.groupName === "學術群"
                                  ? withBasePath("/general-comprehensive-high-school")
                                  : withBasePath("/vocational-encyclopedia") +
                                    "?group=" +
                                    encodeURIComponent(choice.groupName)
                              }
                              className="rounded-lg border border-sky-300 bg-sky-100 px-2.5 py-1 text-xs font-black text-sky-800 underline decoration-sky-400 underline-offset-2"
                            >
                              {choice.groupName}
                            </a>
                          )}
                          {choice.county && (
                            <span className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-600">
                              {choice.county}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </section>
        <DecisionFooter createdAt={createdAt} />
      </div>
    </main>
  );
}

function DecisionFooter({ createdAt }: { createdAt?: string }) {
  return (
    <footer className="mt-8 overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
      <div className="bg-amber-300 px-5 py-5 sm:px-6">
        <p className="text-xs font-black tracking-[0.16em] text-amber-950">
          TAKE YOUR TIME
        </p>
        <h2 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
          別急著離開，這幾頁能幫你更快做決定
        </h2>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
          多看一點學制、職群與選填策略，再和家人一起確認方向。
        </p>
      </div>
      <div className="p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={withBasePath("/strategy")}
            className="rounded-xl border-2 border-slate-900 bg-sky-50 p-4 font-black text-sky-950 transition hover:-translate-y-0.5"
          >
            志願選填策略{" "}
            <span className="block mt-1 text-xs font-bold text-slate-600">
              掌握排序與風險配置
            </span>
          </a>
          <a
            href={withBasePath("/vocational-encyclopedia")}
            className="rounded-xl border-2 border-slate-900 bg-emerald-50 p-4 font-black text-emerald-950 transition hover:-translate-y-0.5"
          >
            職群介紹百科{" "}
            <span className="block mt-1 text-xs font-bold text-slate-600">
              認識學習內容與發展方向
            </span>
          </a>
        </div>
        <a
          href={withBasePath("/support")}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-rose-500 px-5 py-3.5 font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
        >
          <Sparkles className="h-5 w-5" />
          加入小額贊助
        </a>
      </div>
      <p className="border-t-2 border-slate-200 bg-slate-50 px-5 py-3 text-center text-xs font-bold leading-6 text-slate-500 sm:px-6">
        {createdAt && `建立於 ${createdAt} · `}
        本頁僅供檢視；實際選填請以官方系統與簡章為準。
      </p>
    </footer>
  );
}
function countBy(
  choices: any[],
  getKey: (choice: any) => string,
): [string, number][] {
  const counts = new Map<string, number>();
  choices.forEach((choice) => {
    const key = getKey(choice);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}
function schoolCategory(choice: any) {
  if (choice.levelInfo === "普通科" || choice.groupName === "學術群")
    return "普通高中";
  if (
    ["專業群科", "實用技能學程"].includes(choice.levelInfo) ||
    (choice.groupName && choice.groupName !== "學術群")
  )
    return "技術型高中";
  return "其他類型";
}
function DistributionCard({
  icon,
  title,
  entries,
  linkFor,
}: {
  icon: ReactNode;
  title: string;
  entries: [string, number][];
  linkFor?: (name: string) => string;
}) {
  const total = entries.reduce((sum, [, count]) => sum + count, 0) || 1;
  return (
    <section className="rounded-2xl border-2 border-slate-900 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <span className="rounded-lg border-2 border-slate-900 bg-white p-2 text-indigo-700">
          {icon}
        </span>
        <h3 className="font-black text-slate-950">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        {entries.map(([name, count]) => {
          const href = linkFor?.(name);
          return (
            <div key={name}>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate font-bold text-slate-700">
                  {href ? (
                    <a
                      href={href}
                      className="inline-flex items-center gap-1 text-indigo-700 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-950"
                    >
                      {name}
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  ) : (
                    name
                  )}
                </span>
                <span className="shrink-0 font-black text-slate-950">
                  {count}{" "}
                  <small className="text-slate-500">
                    ({Math.round((count / total) * 100)}%)
                  </small>
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <article className="rounded-2xl border-3 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
      <div
        className={`inline-flex rounded-xl border-2 border-slate-900 p-2 ${tone}`}
      >
        {icon}
      </div>
      <p className="mt-2 text-xs font-black text-slate-500">{label}</p>
      <p className="mt-1 truncate text-lg font-black text-slate-950">{value}</p>
    </article>
  );
}
function Layout({
  title,
  createdAt,
  expiresAt,
  children,
}: {
  title: string;
  createdAt: string;
  expiresAt: string | null;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <a
          href={withBasePath("/")}
          className="inline-flex items-center gap-2 rounded-xl border-[3px] border-slate-900 bg-white px-5 py-3 text-lg font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
        >
          <ArrowLeft className="h-5 w-5 stroke-[3]" />
          回到首頁
        </a>
        <header className="mt-5 rounded-[2rem] border-4 border-slate-900 bg-indigo-600 p-6 text-white shadow-[7px_7px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center gap-2 text-indigo-100">
            <ShieldCheck className="h-5 w-5" />
            唯讀分享
          </div>
          <h1 className="mt-2 text-3xl font-black">{title}</h1>
          <p className="mt-3 text-sm font-bold text-indigo-100">
            {createdAt && `建立於 ${createdAt} · `}{expiresAt ? `有效至 ${new Date(expiresAt).toLocaleDateString("zh-TW")}` : "會員專屬長期連結"}
          </p>
        </header>
        <div className="mt-6">{children}</div>
        <p className="mt-6 text-center text-xs font-bold text-slate-500">
          本頁僅供檢視；實際選填請以官方系統與簡章為準。
        </p>
        <div className="mt-8">
          <RelatedReading path="/strategy" />
        </div>
      </div>
    </main>
  );
}
function PageState({
  icon,
  title,
  message,
}: {
  icon: ReactNode;
  title: string;
  message: string;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-5 text-center text-slate-900">
      <div>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-slate-900 bg-amber-300">
          {icon}
        </div>
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="mt-2 font-bold text-slate-500">{message}</p>
      </div>
    </main>
  );
}
